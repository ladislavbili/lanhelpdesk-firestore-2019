import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Input } from 'reactstrap';
import Select from 'react-select';
import {storageCompaniesStart,storageHelpTasksStart, storageHelpStatusesStart, storageHelpTaskTypesStart, storageHelpUnitsStart, storageUsersStart, storageHelpTaskMaterialsStart, storageHelpTaskWorksStart, storageHelpTaskWorkTripsStart, storageHelpTripTypesStart, storageHelpPricelistsStart, storageHelpPricesStart } from '../../redux/actions';
import { timestampToString, sameStringForms, toSelArr} from '../../helperFunctions';
import { Link } from 'react-router-dom';
import {rebase} from '../../index';
import TaskEdit from '../../helpdesk/task/taskEditContainer';
import MonthSelector from '../components/monthSelector';
import {selectStyleColored} from '../../scss/selectStyles';

class MothlyReportsCompany extends Component {
	constructor(props){
		super(props);
		this.state={
			tasks:[],
			allTasks:[],
			companies:[],
			status:[],
			showCompany:null,
			loading:false,
			pickedTasks:[]
		}
		this.filterTask.bind(this);
	}

	storageLoaded(props){
		return props.companiesLoaded &&
		props.tasksLoaded &&
		props.statusesLoaded &&
		props.taskTypesLoaded &&
		props.unitsLoaded &&
		props.usersLoaded &&
		props.materialsLoaded &&
		props.taskWorksLoaded &&
		props.tripTypesLoaded &&
		props.workTripsLoaded &&
		props.pricelistsLoaded &&
		props.pricesLoaded
	}

	componentWillReceiveProps(props){
		if(
			!sameStringForms(props.companies,this.props.companies)||
			!sameStringForms(props.tasks,this.props.tasks)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.taskTypes,this.props.taskTypes)||
			!sameStringForms(props.units,this.props.units)||
			!sameStringForms(props.users,this.props.users)||
			!sameStringForms(props.materials,this.props.materials)||
			!sameStringForms(props.taskWorks,this.props.taskWorks)||
			!sameStringForms(props.tripTypes,this.props.tripTypes)||
			!sameStringForms(props.workTrips,this.props.workTrips)||
			!sameStringForms(props.pricelists,this.props.pricelists)||
			!sameStringForms(props.prices,this.props.prices)||
			(this.storageLoaded(props) && this.storageLoaded(this.props))
		){
			this.setData(props);
		}
		if(
			props.from!==this.props.from||
			props.to!==this.props.to
		){
			this.setState({pickedTasks:[],showCompany:null},()=>{this.setData(props)})
		}
	}

	componentWillMount(){
		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}
		if(!this.props.tasksActive){
			this.props.storageHelpTasksStart();
		}
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}
		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}
		if(!this.props.unitsActive){
			this.props.storageHelpUnitsStart();
		}
		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		if(!this.props.materialsActive){
			this.props.storageHelpTaskMaterialsStart();
		}
		if(!this.props.taskWorksActive){
			this.props.storageHelpTaskWorksStart();
		}
		if(!this.props.workTripsActive){
			this.props.storageHelpTaskWorkTripsStart();
		}
		if(!this.props.tripTypesActive){
			this.props.storageHelpTripTypesStart();
		}
		if(!this.props.pricelistsActive){
			this.props.storageHelpPricelistsStart();
		}
		if(!this.props.pricesActive){
			this.props.storageHelpPricesStart();
		}
		this.setData(this.props);
	}

	setData(props){
		if(!this.storageLoaded(props)){
			return;
		}
		let works = this.newProcessWorks(props);
		let trips = this.newProcessTrips(props);
		let materials = this.processMaterials(props);
		let tasks = this.processTasks(props, materials, works, trips).sort((task1,task2)=> task1.closeDate > task2.closeDate ? 1 : -1 );
		let monthsTasks = this.processThisMonthTasks(props, materials, works, trips).sort((task1,task2)=> task1.closeDate > task2.closeDate ? 1 : -1 );
		let separatedTasks = this.separateTasks(tasks, monthsTasks);
		let companies = this.processCompanies(tasks,props.pricelists);

		//podla firmy, datumu
		let statusIDs= toSelArr(props.statuses.filter((status)=>status.action==='close')).map((status)=>status.id);
		let taskIDs= this.state.showCompany!==null?tasks.filter((task)=>task.company.id===this.state.showCompany.id && statusIDs.includes(task.status.id)).map((task)=>task.id):[];
		this.setState({
			tasks:separatedTasks,
			allTasks:tasks,
			pickedTasks:this.state.pickedTasks.length===0?taskIDs:this.state.pickedTasks.filter((id)=>taskIDs.includes(id)),
			companies,
			status:toSelArr(props.statuses.filter((status)=>status.action==='close')),
			loading:false
		});
	}

	processWorkTypes(props){
		return props.taskTypes.map((workType)=>{
			return {...workType,
			prices:props.prices.filter((price)=>price.type===workType.id)}
		})
	}

	processTripTypes(props){
		return props.tripTypes.map((tripType)=>{
			return {...tripType,
			prices:props.prices.filter((price)=>price.type===tripType.id)}
		})
	}

	getCompany(item,props){
		let task = props.tasks.find((task)=>item.task);
		let company = undefined;
		if(task){
			company = props.companies.find((company)=>company.id===task.company);
			if(company){
				company = {...company,pricelist:this.props.pricelists.find((pricelist)=>pricelist.id===company.pricelist)}
			}
		}
		return company;
	}

	getPrice(type,company){
		if(type===undefined||company===undefined){
			return NaN;
		}
		let price = type.prices.find((price)=>price.pricelist===company.pricelist.id);
		if(price === undefined){
			price = NaN;
		}else{
			price = price.price;
		}
		return parseFloat(parseFloat(price).toFixed(2));
	}

	newProcessWorks(props){
		let workTypes = this.processWorkTypes(props);
		return props.taskWorks.map((work)=>{
			let company = this.getCompany(work,props);
			let type = workTypes.find((item)=>item.id===work.type||item.id===work.workType);
			let price = this.getPrice(type,company);

			if(type===undefined){
				type={title:'Unknown',id:Math.random(),prices:[]}
			}
			let dph = company && company.dph && isNaN(parseInt(company.dph)) && parseInt(company.dph) > 0 ? parseInt(company.dph) : 20;
			let afterHours = company && company.pricelist ? parseInt(company.pricelist.afterHours) : 0;
			return {
				finished:work.finished===true,
				id:work.id,
				title:work.title,
				quantity:work.quantity,
				discount:work.discount,
				assignedTo:work.assignedTo,
				task:work.task,
				price:work.finished?work.price:price,
				dph: work.finished?work.dph:dph,
				afterHours: work.finished?work.afterHours:afterHours,
				type
			}
		})
	}

	newProcessTrips(props){
		let tripTypes = this.processTripTypes(props);
		return props.workTrips.map((trip)=>{
			let company = this.getCompany(trip,props);
			let type = tripTypes.find((item)=>item.id===trip.type);
			let price = this.getPrice(type,company);

			if(type===undefined){
				type={title:'Unknown',id:Math.random(),prices:[]}
			}

			let dph = company && company.dph && isNaN(parseInt(company.dph)) && parseInt(company.dph) > 0 ? parseInt(company.dph) : 20;
			let afterHours = company && company.pricelist ? parseInt(company.pricelist.afterHours) : 0;


			return {
				finished:trip.finished===true,
				id:trip.id,
				quantity:trip.quantity,
				discount:trip.discount,
				task:trip.task,
				price:trip.finished?trip.price:price,
				dph: trip.finished?trip.dph:dph,
				afterHours: trip.finished?trip.afterHours:afterHours,
				type
			}
		})
	}

	processMaterials(props){
		return props.materials.map((material)=>{
			let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100)).toFixed(2);
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(2);
			return{...material,
				unit:props.units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice
			}
		})
	}

	processTasks(props, materials, works, trips){
		let tasks=props.tasks.map((task)=>{
			let company = task.company === null ? null : props.companies.find((company)=>company.id===task.company);
			return {
				...task,
				company,
				requester: task.requester===null ? null:props.users.find((user)=>user.id===task.requester),
				assignedTo: task.assignedTo===null ? null:props.users.filter((user)=>task.assignedTo.includes(user.id)),
				status: task.status===null ? null: props.statuses.find((status)=>status.id===task.status),
				works: works.filter((work)=>work.task===task.id),
				trips: trips.filter((trip)=>trip.task===task.id),
				materials: materials.filter((material)=>material.task===task.id),
			}
		}).filter((task)=> (task.works.length > 0 || task.materials.length > 0 || task.trips.length > 0) && task.status && ['close','invoiced'].includes(task.status.action) && task.closeDate && task.closeDate >= props.from && task.closeDate <= props.to);
		return tasks;
	}

	processThisMonthTasks(props, materials, works, trips){
		let tasks=props.tasks.map((task)=>{
			let company = task.company === null ? null : props.companies.find((company)=>company.id===task.company);
			if(company===undefined){
				company=null;
			}
			return {
				...task,
				company,
				requester: task.requester===null ? null:props.users.find((user)=>user.id===task.requester),
				assignedTo: task.assignedTo===null ? null:props.users.filter((user)=>task.assignedTo.includes(user.id)),
				status: task.status===null ? null: props.statuses.find((status)=>status.id===task.status),
				works: works.filter((work)=>work.task===task.id),
				trips: trips.filter((trip)=>trip.task===task.id),
				materials: materials.filter((material)=>material.task===task.id),
			}
		}).filter((task)=>
		(task.works.length > 0 || task.materials.length > 0 || task.trips.length > 0) &&
		task.status &&
		['close','invoiced'].includes(task.status.action) &&
		task.closeDate &&
		(new Date(task.closeDate)).getFullYear() >= (new Date(props.from)).getFullYear()  &&
		(new Date(task.closeDate)).getFullYear() <= (new Date(props.to)).getFullYear()  &&
		(new Date(task.closeDate)).getMonth() >= (new Date(props.from)).getMonth()  &&
		(new Date(task.closeDate)).getMonth() <= (new Date(props.to)).getMonth()
		);
		return tasks;
	}

	processCompanies(tasks,pricelists){
		let companies = [];
		tasks.forEach((task)=>{
			let company = companies.find((company)=>company.id===task.company.id);
			if(company===undefined){
				companies.push({...task.company,materials:0,works:0,trips:0});
				company = companies.find((company)=>company.id===task.company.id);
			}
			task.works.forEach((work)=>{
				company.works+=isNaN(parseInt(work.quantity))?0:parseInt(work.quantity);
			})
			task.trips.forEach((trip)=>{
				company.trips+=isNaN(parseInt(trip.quantity))?0:parseInt(trip.quantity);
			})
			task.materials.forEach((material)=>{
				company.materials+=isNaN(parseInt(material.quantity))?0:parseInt(material.quantity);
			})
		})
		companies = companies.map((company)=>{
			return {
				...company,
				rentedCount:company.rented===undefined?0:company.rented.reduce((acc,rentedItem)=>{
				return acc+(isNaN(parseInt(rentedItem.quantity))?0:parseInt(rentedItem.quantity))
			},0),
			pricelist:pricelists.find((pricelist)=>company.pricelist===pricelist.id)
			}
		})
		return companies.filter((company)=>company.works > 0 || company.materials > 0 || company.trips > 0 || company.rentedCount);
	}

	//Unit prices
	getUnitDiscountedPrice(item){
		return parseFloat((parseFloat(item.price)*(100-parseInt(item.discount))/100).toFixed(2))
	}

	getUnitAHExtraPrice(item){
		return parseFloat((this.getUnitDiscountedPrice(item)*(parseFloat(item.afterHours)/100)).toFixed(2));
	}

	getUnitAHPrice(item){
		return parseFloat((this.getUnitDiscountedPrice(item)+this.getUnitAHExtraPrice(item)).toFixed(2));
	}

	//Total prices
	getTotalPrice(item){
		return parseFloat(parseFloat(item.price)*parseInt(item.quantity).toFixed(2))
	}

	getTotalDiscountedPrice(item){
		return parseFloat((this.getTotalPrice(item)*(100-parseInt(item.discount))/100).toFixed(2))
	}

	getTotalAHExtraPrice(item){
		return parseFloat((this.getTotalDiscountedPrice(item)*(parseFloat(item.afterHours)/100)).toFixed(2));
	}

	getTotalAHPrice(item){
		return parseFloat((this.getTotalDiscountedPrice(item)+this.getTotalAHExtraPrice(item)).toFixed(2));
	}

	getTotalWithDPH(item,ah){
		if(ah){
			return parseFloat(this.getTotalAHPrice(item)*(1+parseInt(item.dph)/100).toFixed(2));
		}
		return parseFloat(this.getTotalDiscountedPrice(item)*(1+parseInt(item.dph)/100).toFixed(2));
	}

	getMonthDiff(props){
		let from = (new Date(props.from));
		let to = (new Date(props.to));
		let yearDiff = to.getFullYear()-from.getFullYear();
		let monthDiff = to.getMonth()-from.getMonth();
		let numberOfMonths=0;
		if(monthDiff < 0){
			numberOfMonths += (yearDiff-1)*12
			numberOfMonths += 12+monthDiff
		}else{
			numberOfMonths += yearDiff*12;
			numberOfMonths += monthDiff
		}
		return numberOfMonths;
	}

	invoiceTasks(){
		let allTasks = this.state.allTasks.filter((task)=>task.company && task.company.id===this.state.showCompany.id && this.state.pickedTasks.includes(task.id));
		let invoiced = this.props.statuses.find((status)=>status.action==='invoiced')
		if(invoiced!==undefined && window.confirm("Chcete naozaj vykázať úlohy: "+ allTasks.reduce((acc,task)=>acc+task.id+',','').slice(0,-1))+" ?"){
			allTasks.forEach((task)=>{
				task.works.filter((work)=>work.finished!==true).map((work)=>rebase.updateDoc('/help-task_works/'+work.id, {price:work.price, dph:work.dph, afterHours:work.afterHours,finished:true}))
				task.trips.filter((trip)=>trip.finished!==true).map((trip)=>rebase.updateDoc('/help-task_work_trips/'+trip.id, {price:trip.price, dph:trip.dph, afterHours:trip.afterHours,finished:true}))
				rebase.updateDoc('/help-tasks/'+task.id, {status:invoiced.id})
			});
		}
	}

	filterTask(task, statusIDs){
		return task.company.id===this.state.showCompany.id && statusIDs.includes(task.status.id);
	}

	render() {
		let statusIDs= this.state.status.map((status)=>status.id);
		return (
				<div className="scrollable fit-with-header">
					<div style={{maxWidth:500}}>
						<MonthSelector />
						<div className="p-20">
							<Select
								value={this.state.status}
								placeholder="Vyberte statusy"
								isMulti
								onChange={(status)=>{
									let statusIDs = status.map((status)=>status.id);
									let taskIDs= this.state.allTasks.filter((task)=>this.state.showCompany && task.company.id===this.state.showCompany.id && statusIDs.includes(task.status.id)).map((task)=>task.id);
									let pickedTasks = this.state.pickedTasks.filter((id)=>taskIDs.includes(id));
									this.setState({status, pickedTasks: pickedTasks.length > 0 ? pickedTasks : taskIDs });
								}}
								options={toSelArr(this.props.statuses)}
								styles={selectStyleColored}
								/>
						</div>
					</div>

					<div className="p-20">
						<table className="table m-b-10">
							<thead>
								<tr>
									<th>Company name</th>
									<th>Work hours</th>
									<th>Materials</th>
									<th>Trips</th>
									<th>Rented items</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.companies.map((company)=>
									<tr key={company.id} className="clickable" onClick={()=>{
											let taskIDs= this.state.allTasks.filter((task)=>task.company.id===company.id && statusIDs.includes(task.status.id)).map((task)=>task.id);
											let pickedTasks = this.state.pickedTasks.filter((id)=>taskIDs.includes(id));
											this.setState({showCompany:company, pickedTasks: pickedTasks.length > 0 ? pickedTasks : taskIDs });
										}}>
										<td>{company.title}</td>
										<td>{company.works}</td>
										<td>{company.materials}</td>
										<td>{company.trips}</td>
										<td>{company.rentedCount}</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{this.state.showCompany!==null &&
						<div className="commandbar">
							<Button
								className="btn-primary center-hor"
								onClick={()=>{
									let taskIDs= this.state.allTasks.filter((task)=>this.state.showCompany && task.company.id===this.state.showCompany.id && statusIDs.includes(task.status.id)).map((task)=>task.id);
									if(this.state.pickedTasks.length===taskIDs.length){
										this.setState({pickedTasks:[]})
									}else{
										this.setState({pickedTasks:taskIDs})
									}
								}}
								>
								{this.state.pickedTasks.length===this.state.allTasks.filter((task)=>this.state.showCompany && task.company.id===this.state.showCompany.id && statusIDs.includes(task.status.id)).length ? "Odznačiť všetky" : "Označiť všetky"}
							</Button>
							<Button
								className="btn-danger center-hor"
								onClick={this.invoiceTasks.bind(this)}
								>
								Faktúrovať
							</Button>
						</div>
					}
					{this.state.showCompany!==null &&
						<div className="p-20">
							<h2>Fakturačný výkaz firmy</h2>
							<div className="flex-row m-b-30">
								<div>
									Firma {this.state.showCompany.title} <br/>
									Obdobie od: {timestampToString(this.props.from)} do: {timestampToString(this.props.to)}
								</div>
								<div className="m-l-10">
									Počet prác vrámci paušálu: {
										this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id)).reduce((acc,item)=>{
										return acc+item.pausalWorks.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)}
									<br/>
									Počet výjazdov vrámci paušálu: {
										this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id)).reduce((acc,item)=>{
										return acc+item.pausalTrips.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)}

								</div>
							</div>
							<div className="m-b-30">
								<h3 className="m-b-10">Práce a výjazdy vrámci paušálu</h3>
								<h4>Práce</h4>
								<hr />
								<table className="table m-b-10">
									<thead>
										<tr>
											<th width="25"></th>
											<th>ID</th>
											<th>Názov úlohy</th>
											<th>Zadal</th>
											<th>Rieši</th>
											<th>Status</th>
											<th>Close date</th>
											<th>Popis práce</th>
											<th style={{width:'150px'}}>Typ práce</th>
											<th style={{width:'50px'}}>Hodiny</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && task.pausalWorks.length!==0 ).map((task)=>
											<tr key={task.id}>
												<td className="table-checkbox">
													<label className="custom-container">
														<Input type="checkbox"
															checked={this.state.pickedTasks.includes(task.id)}
															onChange={()=>{
																if(this.state.pickedTasks.includes(task.id)){
																	this.setState({pickedTasks:this.state.pickedTasks.filter((taskID)=>taskID!==task.id)});
																}else{
																	this.setState({pickedTasks:[...this.state.pickedTasks,task.id]});
																}
																}} />
															<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
													</label>
												</td>
												<td>{task.id}</td>
												<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/` + task.id }} style={{ color: "#1976d2" }}>{task.title}</Link></td>
												<td>{task.requester?task.requester.email:'Nikto'}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo.id}>{assignedTo.email}</p>
													)}
												</td>
												<td>
													<span className="label label-info"
														style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
														{task.status?task.status.title:'Neznámy status'}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="3">
													<table className="table-borderless full-width">
														<tbody>
															{task.pausalWorks.map((work)=>
																<tr key={work.id}>
																	<td key={work.id+ '-title'} style={{paddingLeft:0}}>{work.title}</td>
																	<td key={work.id+ '-type'} style={{width:'150px', paddingLeft:0}}>{work.type.title}</td>
																	<td key={work.id+ '-time'} style={{width:'50px', paddingLeft:0}}>{work.quantity}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet hodín: {
									this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.pausalWorks.length!==0).reduce((acc,item)=>{
										return acc+item.pausalWorks.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)}
								</p>
								<p className="m-0">Spolu počet hodín mimo pracovný čas: {
									this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.pausalWorks.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.pausalWorks.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)} ( Čísla úloh:
										{this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.pausalWorks.length!==0 && task.overtime)
										.reduce((acc,task)=>{
											return acc+=task.id + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0 m-b-10">Spolu prirážka za práce mimo pracovných hodín: {
									this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.pausalWorks.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.pausalWorks.reduce((acc,work)=>{
											return acc+=isNaN(this.getTotalAHExtraPrice(work))?0:this.getTotalAHExtraPrice(work)
										},0);
									},0)} eur
								</p>

								<h4>Výjazdy</h4>
								<hr />
								<table className="table m-b-10">
									<thead>
										<tr>
											<th width="25"></th>
											<th>ID</th>
											<th>Názov úlohy</th>
											<th>Zadal</th>
											<th>Rieši</th>
											<th>Status</th>
											<th>Close date</th>
											<th style={{width:'150px'}}>Výjazd</th>
											<th style={{width:'50px'}}>Mn.</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && task.pausalTrips.length!==0).map((task)=>
											<tr key={task.id}>
												<td className="table-checkbox">
													<label className="custom-container">
														<Input type="checkbox"
															checked={this.state.pickedTasks.includes(task.id)}
															onChange={()=>{
																if(this.state.pickedTasks.includes(task.id)){
																	this.setState({pickedTasks:this.state.pickedTasks.filter((taskID)=>taskID!==task.id)});
																}else{
																	this.setState({pickedTasks:[...this.state.pickedTasks,task.id]});
																}
																}} />
															<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
													</label>
												</td>

												<td>{task.id}</td>
												<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/` + task.id }} style={{ color: "#1976d2" }}>{task.title}</Link></td>
												<td>{task.requester?task.requester.email:'Nikto'}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo.id}>{assignedTo.email}</p>
													)}
												</td>
												<td>
													<span className="label label-info"
														style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
														{task.status?task.status.title:'Neznámy status'}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="3">
													<table className="table-borderless full-width">
														<tbody>
															{task.pausalTrips.map((trip)=>
																<tr key={trip.id}>
																	<td key={trip.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{trip.type?trip.type.title:"Undefined"}</td>
																	<td key={trip.id+ '-time'} style={{width:'50px',paddingLeft:0}}>{trip.quantity}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet výjazdov: {
									this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.pausalTrips.length!==0).reduce((acc,item)=>{
										return acc+item.pausalTrips.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)}
								</p>
								<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
									this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.pausalTrips.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.pausalTrips.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)} ( Čísla úloh:
										{this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.pausalTrips.length!==0 && task.overtime)
										.reduce((acc,task)=>{
											return acc+=task.id + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0 m-b-10">Spolu prirážka za výjazdov mimo pracovných hodín: {
									this.state.tasks.pausalPaidTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.pausalTrips.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.pausalTrips.reduce((acc,trip)=>{
											return acc+=isNaN(this.getTotalAHExtraPrice(trip))?0:this.getTotalAHExtraPrice(trip)
										},0);
									},0)} eur
								</p>
							</div>

							<div className="m-b-30">
								<h3 className="m-b-10">Práce a výjazdy nad rámec paušálu</h3>
								<h4>Práce</h4>
								<hr />
								<table className="table m-b-10">
									<thead>
										<tr>
											<th width="25"></th>
											<th>ID</th>
											<th>Názov úlohy</th>
											<th>Zadal</th>
											<th>Rieši</th>
											<th>Status</th>
											<th>Close date</th>
											<th>Popis práce</th>
											<th style={{width:'150px'}}>Typ práce</th>
											<th style={{width:'50px'}}>Hodiny</th>
											<th style={{width:'70px'}}>Cena/hodna</th>
											<th style={{width:'70px'}}>Cena spolu</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && task.extraWorks.length!==0 ).map((task)=>
											<tr key={task.id}>
												<td className="table-checkbox">
													<label className="custom-container">
														<Input type="checkbox"
															checked={this.state.pickedTasks.includes(task.id)}
															onChange={()=>{
																if(this.state.pickedTasks.includes(task.id)){
																	this.setState({pickedTasks:this.state.pickedTasks.filter((taskID)=>taskID!==task.id)});
																}else{
																	this.setState({pickedTasks:[...this.state.pickedTasks,task.id]});
																}
															}}
														/>
														<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
													</label>
											</td>
												<td>{task.id}</td>
												<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/` + task.id }} style={{ color: "#1976d2" }}>{task.title}</Link></td>
												<td>{task.requester?task.requester.email:'Nikto'}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo.id}>{assignedTo.email}</p>
													)}
												</td>
												<td>
													<span className="label label-info"
														style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
														{task.status?task.status.title:'Neznámy status'}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.extraWorks.map((work)=>
																<tr key={work.id}>
																	<td key={work.id+ '-title'} style={{paddingLeft:0}}>{work.title}</td>
																	<td key={work.id+ '-type'} style={{width:'150px'}}>{work.type.title}</td>
																	<td key={work.id+ '-time'} style={{width:'50px'}}>{work.quantity}</td>
																	<td key={work.id+ '-pricePerUnit'} style={{width:'70px'}}>{task.overtime?this.getUnitAHPrice(work):this.getUnitDiscountedPrice(work)}</td>
																	<td key={work.id+ '-totalPrice'} style={{width:'70px'}}>{task.overtime?this.getTotalAHPrice(work):this.getTotalDiscountedPrice(work)}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet hodín: {
									this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraWorks.length!==0).reduce((acc,item)=>{
										return acc+item.extraWorks.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)}
								</p>
								<p className="m-0">Spolu počet hodín mimo pracovný čas: {
									this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraWorks.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.extraWorks.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)} ( Čísla úloh:
										{this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraWorks.length!==0 && task.overtime)
										.reduce((acc,task)=>{
											return acc+=task.id + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {
									this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraWorks.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.extraWorks.reduce((acc,work)=>{
											return acc+=isNaN(this.getTotalAHExtraPrice(work))?0:this.getTotalAHExtraPrice(work)
										},0);
									},0)} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {
									(this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraWorks.length!==0).reduce((acc,task)=>{
										return acc+task.extraWorks.reduce((acc,work)=>{
											if(task.overtime){
												return acc+(isNaN(this.getTotalAHPrice(work))?0:this.getTotalAHPrice(work));
											}
											return acc+(isNaN(this.getTotalDiscountedPrice(work))?0:this.getTotalDiscountedPrice(work));
										},0);
									},0)).toFixed(2)} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {
									(this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraWorks.length!==0).reduce((acc,task)=>{
										return acc+task.extraWorks.reduce((acc,work)=>{
											return acc+(isNaN(this.getTotalWithDPH(work,task.overtime))?0:this.getTotalWithDPH(work,task.overtime));
										},0);
									},0)).toFixed(2)} eur
								</p>

								<h4>Výjazdy</h4>
								<hr />
								<table className="table m-b-10">
									<thead>
										<tr>
											<th width="25"></th>
											<th>ID</th>
											<th>Názov úlohy</th>
											<th>Zadal</th>
											<th>Rieši</th>
											<th>Status</th>
											<th>Close date</th>
											<th style={{width:'150px'}}>Výjazd</th>
											<th style={{width:'50px'}}>Mn.</th>
											<th style={{width:'50px'}}>Cena/ks</th>
											<th style={{width:'50px'}}>Cena spolu</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && task.extraTrips.length!==0).map((task)=>
											<tr key={task.id}>
												<td className="table-checkbox">
													<label className="custom-container">
														<Input type="checkbox"
															checked={this.state.pickedTasks.includes(task.id)}
															onChange={()=>{
																if(this.state.pickedTasks.includes(task.id)){
																	this.setState({pickedTasks:this.state.pickedTasks.filter((taskID)=>taskID!==task.id)});
																}else{
																	this.setState({pickedTasks:[...this.state.pickedTasks,task.id]});
																}
																}} />
															<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
													</label>
												</td>

												<td>{task.id}</td>
												<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/` + task.id }} style={{ color: "#1976d2" }}>{task.title}</Link></td>
												<td>{task.requester?task.requester.email:'Nikto'}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo.id}>{assignedTo.email}</p>
													)}
												</td>
												<td>
													<span className="label label-info"
														style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
														{task.status?task.status.title:'Neznámy status'}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.extraTrips.map((trip)=>
																<tr key={trip.id}>
																	<td key={trip.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{trip.type?trip.type.title:"Undefined"}</td>
																	<td key={trip.id+ '-time'} style={{width:'50px'}}>{trip.quantity}</td>
																	<td key={trip.id+ '-unitPrice'} style={{width:'50px'}}>{task.overtime?this.getUnitAHPrice(trip):this.getUnitDiscountedPrice(trip)}</td>
																	<td key={trip.id+ '-totalPrice'} style={{width:'50px'}}>{task.overtime?this.getTotalAHPrice(trip):this.getTotalDiscountedPrice(trip)}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet výjazdov: {
									this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraTrips.length!==0).reduce((acc,item)=>{
										return acc+item.extraTrips.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)}
								</p>
								<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
									this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraTrips.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.extraTrips.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)} ( Čísla úloh:
										{this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraTrips.length!==0 && task.overtime)
										.reduce((acc,task)=>{
											return acc+=task.id + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0">Spolu prirážka za výjazdov mimo pracovných hodín: {
									this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraTrips.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.extraTrips.reduce((acc,trip)=>{
											return acc+(isNaN(this.getTotalAHExtraPrice(trip))?0:this.getTotalAHExtraPrice(trip))
										},0);
									},0)} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {
									(this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraTrips.length!==0).reduce((acc,task)=>{
										return acc+task.extraTrips.reduce((acc,trip)=>{
											if(task.overtime){
												return acc+(isNaN(this.getTotalAHPrice(trip))?0:this.getTotalAHPrice(trip));
											}
											return acc+(isNaN(this.getTotalDiscountedPrice(trip))?0:this.getTotalDiscountedPrice(trip));
										},0);
									},0)).toFixed(2)} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {
									(this.state.tasks.extraTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.extraTrips.length!==0).reduce((acc,task)=>{
										return acc+task.extraTrips.reduce((acc,trip)=>{
											return acc+(isNaN(this.getTotalWithDPH(trip,task.overtime))?0:this.getTotalWithDPH(trip,task.overtime));
										},0);
									},0)).toFixed(2)} eur
								</p>
							</div>

							<div className="m-b-30">
								<h3 className="m-b-10">Projektové práce a výjazdy</h3>
								<h4>Práce</h4>
								<hr />
								<table className="table m-b-10">
									<thead>
										<tr>
											<th width="25"></th>
											<th>ID</th>
											<th>Názov úlohy</th>
											<th>Zadal</th>
											<th>Rieši</th>
											<th>Status</th>
											<th>Close date</th>
											<th>Popis práce</th>
											<th style={{width:'150px'}}>Typ práce</th>
											<th style={{width:'50px'}}>Hodiny</th>
											<th style={{width:'70px'}}>Cena/hodna</th>
											<th style={{width:'70px'}}>Cena spolu</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && task.works.length!==0 ).map((task)=>
											<tr key={task.id}>
												<td className="table-checkbox">
													<label className="custom-container">
														<Input type="checkbox"
															checked={this.state.pickedTasks.includes(task.id)}
															onChange={()=>{
																if(this.state.pickedTasks.includes(task.id)){
																	this.setState({pickedTasks:this.state.pickedTasks.filter((taskID)=>taskID!==task.id)});
																}else{
																	this.setState({pickedTasks:[...this.state.pickedTasks,task.id]});
																}
																}} />
															<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
													</label>
												</td>

												<td>{task.id}</td>
												<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/` + task.id }} style={{ color: "#1976d2" }}>{task.title}</Link></td>
												<td>{task.requester?task.requester.email:'Nikto'}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo.id}>{assignedTo.email}</p>
													)}
												</td>
												<td>
													<span className="label label-info"
														style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
														{task.status?task.status.title:'Neznámy status'}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.works.map((work)=>
																<tr key={work.id}>
																	<td key={work.id+ '-title'} style={{paddingLeft:0}}>{work.title}</td>
																	<td key={work.id+ '-type'} style={{width:'150px'}}>{work.type.title}</td>
																	<td key={work.id+ '-time'} style={{width:'50px'}}>{work.quantity}</td>
																	<td key={work.id+ '-pricePerUnit'} style={{width:'70px'}}>{task.overtime?this.getUnitAHPrice(work):this.getUnitDiscountedPrice(work)}</td>
																	<td key={work.id+ '-totalPrice'} style={{width:'70px'}}>{task.overtime?this.getTotalAHPrice(work):this.getTotalDiscountedPrice(work)}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet hodín: {
									this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.works.length!==0).reduce((acc,item)=>{
										return acc+item.works.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)}
								</p>
								<p className="m-0">Spolu počet hodín mimo pracovný čas: {
									this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.works.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.works.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)} ( Čísla úloh:
										{this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.works.length!==0 && task.overtime)
										.reduce((acc,task)=>{
											return acc+=task.id + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {
									this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.works.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.works.reduce((acc,work)=>{
											return acc+=isNaN(this.getTotalAHExtraPrice(work))?0:this.getTotalAHExtraPrice(work)
										},0);
									},0)} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {
									(this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.works.length!==0).reduce((acc,task)=>{
										return acc+task.works.reduce((acc,work)=>{
											if(task.overtime){
												return acc+(isNaN(this.getTotalAHPrice(work))?0:this.getTotalAHPrice(work));
											}
											return acc+(isNaN(this.getTotalDiscountedPrice(work))?0:this.getTotalDiscountedPrice(work));
										},0);
									},0)).toFixed(2)} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {
									(this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.works.length!==0).reduce((acc,task)=>{
										return acc+task.works.reduce((acc,work)=>{
											return acc+(isNaN(this.getTotalWithDPH(work,task.overtime))?0:this.getTotalWithDPH(work,task.overtime));
										},0);
									},0)).toFixed(2)} eur
								</p>

								<h4>Výjazdy</h4>
								<hr />
								<table className="table m-b-10">
									<thead>
										<tr>
											<th width="25"></th>
											<th>ID</th>
											<th>Názov úlohy</th>
											<th>Zadal</th>
											<th>Rieši</th>
											<th>Status</th>
											<th>Close date</th>
											<th style={{width:'150px'}}>Výjazd</th>
											<th style={{width:'50px'}}>Mn.</th>
											<th style={{width:'50px'}}>Cena/ks</th>
											<th style={{width:'50px'}}>Cena spolu</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && task.trips.length!==0).map((task)=>
											<tr key={task.id}>
												<td className="table-checkbox">
													<label className="custom-container">
														<Input type="checkbox"
															checked={this.state.pickedTasks.includes(task.id)}
															onChange={()=>{
																if(this.state.pickedTasks.includes(task.id)){
																	this.setState({pickedTasks:this.state.pickedTasks.filter((taskID)=>taskID!==task.id)});
																}else{
																	this.setState({pickedTasks:[...this.state.pickedTasks,task.id]});
																}
																}} />
															<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
													</label>
												</td>

												<td>{task.id}</td>
												<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/` + task.id }} style={{ color: "#1976d2" }}>{task.title}</Link></td>
												<td>{task.requester?task.requester.email:'Nikto'}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo.id}>{assignedTo.email}</p>
													)}
												</td>
												<td>
													<span className="label label-info"
														style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
														{task.status?task.status.title:'Neznámy status'}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.trips.map((trip)=>
																<tr key={trip.id}>
																	<td key={trip.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{trip.type?trip.type.title:"Undefined"}</td>
																	<td key={trip.id+ '-time'} style={{width:'50px'}}>{trip.quantity}</td>
																	<td key={trip.id+ '-unitPrice'} style={{width:'50px'}}>{task.overtime?this.getUnitAHPrice(trip):this.getUnitDiscountedPrice(trip)}</td>
																	<td key={trip.id+ '-totalPrice'} style={{width:'50px'}}>{task.overtime?this.getTotalAHPrice(trip):this.getTotalDiscountedPrice(trip)}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet výjazdov: {
									this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.trips.length!==0).reduce((acc,item)=>{
										return acc+item.trips.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)}
								</p>
								<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
									this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.trips.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.trips.reduce((acc,item)=>{
											if(!isNaN(parseInt(item.quantity))){
												return acc+parseInt(item.quantity);
											}
											return acc;
										},0);
									},0)} ( Čísla úloh:
										{this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.trips.length!==0 && task.overtime)
										.reduce((acc,task)=>{
											return acc+=task.id + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0">Spolu prirážka za výjazdov mimo pracovných hodín: {
									this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.trips.length!==0 && task.overtime).reduce((acc,item)=>{
										return acc+item.trips.reduce((acc,trip)=>{
											return acc+(isNaN(this.getTotalAHExtraPrice(trip))?0:this.getTotalAHExtraPrice(trip))
										},0);
									},0)} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {
									(this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.trips.length!==0).reduce((acc,task)=>{
										return acc+task.trips.reduce((acc,trip)=>{
											if(task.overtime){
												return acc+(isNaN(this.getTotalAHPrice(trip))?0:this.getTotalAHPrice(trip));
											}
											return acc+(isNaN(this.getTotalDiscountedPrice(trip))?0:this.getTotalDiscountedPrice(trip));
										},0);
									},0)).toFixed(2)} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {
									(this.state.tasks.projectTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id) && task.trips.length!==0).reduce((acc,task)=>{
										return acc+task.trips.reduce((acc,trip)=>{
											return acc+(isNaN(this.getTotalWithDPH(trip,task.overtime))?0:this.getTotalWithDPH(trip,task.overtime));
										},0);
									},0)).toFixed(2)} eur
								</p>
							</div>

						<div className="m-b-30">
							<h3>Materiále</h3>
							<hr />
							<table className="table m-b-10">
								<thead>
									<tr>
										<th width="25"></th>
										<th>ID</th>
										<th style={{ width: '20%' }}>Name</th>
										<th>Zadal</th>
										<th>Riesi</th>
										<th>Status</th>
										<th>Status date</th>
										<th>Material</th>
										<th>Mn.</th>
										<th>Jednotka</th>
										<th >Cena/Mn.</th>
										<th>Cena spolu</th>
									</tr>
								</thead>
								<tbody>
									{
										this.state.allTasks.filter((task)=>this.filterTask(task,statusIDs) && task.materials.length > 0 ).map((task, index)=>
										<tr key={index}>
											<td className="table-checkbox">
												<label className="custom-container">
													<Input type="checkbox"
														checked={this.state.pickedTasks.includes(task.id)}
														onChange={()=>{
															if(this.state.pickedTasks.includes(task.id)){
																this.setState({pickedTasks:this.state.pickedTasks.filter((taskID)=>taskID!==task.id)});
															}else{
																this.setState({pickedTasks:[...this.state.pickedTasks,task.id]});
															}
															}} />
														<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
												</label>
											</td>

											<td>{task.id}</td>
											<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/`+task.id }} style={{ color: "#1976d2" }}>{task.title}</Link></td>
											<td>{task.requester?task.requester.email:'Nikto'}</td>
											<td>{task.assigned?task.assigned.email:'Nikto'}</td>
											<td>{task.status.title}</td>
											<td>{timestampToString(task.statusChange)}</td>
												<td>
													{task.materials.map((material)=>
														<p key={material.id}>{material.title}</p>
													)}
												</td>
												<td>
													{task.materials.map((material)=>
														<p key={material.id}>{material.quantity}</p>
													)}
												</td>
												<td>
													{task.materials.map((material)=>
														<p key={material.id}>{material.unit.title}</p>
													)}
												</td>
												<td>
													{task.materials.map((material)=>
														<p key={material.id}>{material.finalUnitPrice}</p>
													)}
												</td>
												<td>
													{task.materials.map((material)=>
														<p key={material.id}>{material.totalPrice}</p>
													)}
												</td>
										</tr>
									)}
								</tbody>
							</table>
							<p className="m-0">Spolu cena bez DPH: {
									(this.state.allTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id)).reduce((acc,task)=>{
									return acc+task.materials.reduce((acc,material)=>acc+=isNaN(parseFloat(material.totalPrice))?0:parseFloat(material.totalPrice),0)
								},0)).toFixed(2)} EUR</p>
							<p className="m-0">Spolu cena s DPH: {
									(this.state.allTasks.filter((task)=>this.filterTask(task,statusIDs) && this.state.pickedTasks.includes(task.id)).reduce((acc,task)=>{
									return acc+task.materials.reduce((acc,material)=>acc+=isNaN(parseFloat(material.totalPrice))?0:parseFloat(material.totalPrice),0)
								},0)*(1+(isNaN(parseInt(this.state.showCompany.dph))?0:parseInt(this.state.showCompany.dph))/100)).toFixed(2)} EUR</p>
						</div>
						<div className="m-b-30">
							<h3>Mesačný prenájom služieb a harware</h3>
							<hr />
							<table className="table m-b-10">
								<thead>
									<tr>
										<th>ID</th>
										<th>Názov</th>
										<th>Mn.</th>
										<th>Cena/ks/mesiac</th>
										<th>Cena spolu/mesiac</th>
									</tr>
								</thead>
								<tbody>
									{
										(this.state.showCompany.rented===undefined ? [] : this.state.showCompany.rented).map((rentedItem)=>
										<tr key={rentedItem.id}>
											<td>{rentedItem.id}</td>
											<td>{rentedItem.title}</td>
											<td>{rentedItem.quantity}</td>
											<td>{rentedItem.unitPrice}</td>
											<td>{rentedItem.totalPrice}</td>
										</tr>
									)}
								</tbody>
							</table>
							<p className="m-0">Spolu cena bez DPH: {
									((this.state.showCompany.rented===undefined ? [] : this.state.showCompany.rented).reduce((acc,rentedItem)=>{
									return acc+(isNaN(parseFloat(rentedItem.totalPrice))?0:parseFloat(rentedItem.totalPrice))
								},0)*this.getMonthDiff(this.props)).toFixed(2)} EUR</p>
							<p className="m-0">Spolu cena s DPH: {
									((this.state.showCompany.rented===undefined ? [] : this.state.showCompany.rented).reduce((acc,rentedItem)=>{
									return acc+(isNaN(parseFloat(rentedItem.totalPrice))?0:parseFloat(rentedItem.totalPrice))
								},0)*this.getMonthDiff(this.props)*(1+(isNaN(parseInt(this.state.showCompany.dph))?0:parseInt(this.state.showCompany.dph))/100)).toFixed(2)} EUR</p>
						</div>
					</div>}
				 </div>
			);
		}

	separateTasks(tasks,allTasks){
		let projectTasks = tasks.filter((task)=>!task.pausal);
		let pausalTasks = allTasks.filter((task)=>task.pausal);

		let groupedPausalTasks = this.groupTasksByCompany(this.groupTasksByMonth(pausalTasks));
		let calculatedPausalTasks = this.calculatePausalOfTasks(groupedPausalTasks);
		const { pausalPaidTasks , extraTasks } = this.getTasksFromPeriods(calculatedPausalTasks,tasks.filter((task)=>task.pausal).map((task)=>task.id));
		return{projectTasks,pausalPaidTasks, extraTasks};
	}

	groupTasksByMonth(tasks){
		let groupedTasks=[];
		tasks.forEach((task)=>{
			let closeDate = new Date(task.closeDate);
			let key = closeDate.getFullYear() + '-' + closeDate.getMonth();
			let group = groupedTasks.find((group)=>group.id===key);
			if(group!==undefined){
				group.tasks = [...group.tasks,task]
			}else{
				groupedTasks.push({id:key,tasks:[task]})
			}
		})
		return groupedTasks;
	}

	groupTasksByCompany(tasks){
		return tasks.map((group)=>{
			let companies = [];
			group.tasks.forEach((task)=>{
				let group = companies.find((group)=>group.company.id===task.company.id);
				if(group===undefined){
					companies.push({company:task.company,tasks:[task]})
				}else{
					group.tasks=[...group.tasks,task];
				}
			})

			return {id:group.id, companies}
		})
	}

	calculatePausalOfTasks(companies){
		return companies.map((period)=>{
			let newCompanies = period.companies.map((group)=>{
				//iba ponechat tasky a pridat im pausalWorks a extraWorks
				let newCompany = {company:group.company,tasks:[]};
				let pausal = parseInt(group.company.workPausal);
				let tripPausal = parseInt(group.company.drivePausal);
				group.tasks.forEach((task)=>{
					let pausalWorks = [];
					let extraWorks = [];
					let pausalTrips = [];
					let extraTrips = [];
					task.works.forEach((work)=>{
						if(work.quantity < pausal){
							pausal -= work.quantity;
							pausalWorks.push(work);
						}else if(pausal===0){
							extraWorks.push(work);
						}else{
							pausalWorks.push({...work, quantity: pausal});
							extraWorks.push({...work, quantity: work.quantity - pausal});
							pausal = 0;
						}
					})
					task.trips.forEach((trip)=>{
						if(trip.quantity < tripPausal){
							tripPausal -= trip.quantity;
							pausalTrips.push(trip);
						}else if(tripPausal===0){
							extraTrips.push(trip);
						}else{
							pausalTrips.push({...trip, quantity: tripPausal});
							extraTrips.push({...trip, quantity: trip.quantity - tripPausal});
							tripPausal = 0;
						}
					})
					newCompany.tasks.push({...task,pausalWorks,extraWorks,pausalTrips,extraTrips});
				})
				return newCompany;
			})
			return {id:period.id,companies:newCompanies};
		})
	}

	getTasksFromPeriods(periods,validIDs){
		let pausalPaidTasks = [];
		let extraTasks = [];
		periods.forEach((period)=>{
			period.companies.forEach((company)=>{
				company.tasks.forEach((task)=>{
					if(validIDs.includes(task.id)){
						if(task.extraWorks.length>0||task.extraTrips.length>0){
							extraTasks.push(task);
						}
						if(task.pausalWorks.length>0||task.pausalTrips.length>0){
							pausalPaidTasks.push(task);
						}
					}
				})
			})
		})
		return { pausalPaidTasks , extraTasks };
	}
}

const mapStateToProps = ({ filterReducer,reportReducer,userReducer, storageCompanies, storageHelpTasks, storageHelpStatuses, storageHelpTaskTypes, storageHelpUnits, storageUsers, storageHelpTaskMaterials, storageHelpTaskWorks, storageHelpTaskWorkTrips, storageHelpTripTypes, storageHelpPricelists, storageHelpPrices }) => {
	const { filter, project, milestone } = filterReducer;
	const { from, to } = reportReducer;

	const { companiesActive, companies, companiesLoaded } = storageCompanies;
	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
	const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { taskTypesActive, taskTypes, taskTypesLoaded } = storageHelpTaskTypes;
	const { unitsActive, units, unitsLoaded } = storageHelpUnits;
	const { usersActive, users, usersLoaded } = storageUsers;
	const { materialsActive, materials, materialsLoaded } = storageHelpTaskMaterials;
	const { taskWorksActive, taskWorks, taskWorksLoaded } = storageHelpTaskWorks;
	const { workTripsActive, workTrips, workTripsLoaded } = storageHelpTaskWorkTrips;
	const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;
	const { pricelistsLoaded, pricelistsActive, pricelists } = storageHelpPricelists;
	const { pricesLoaded, pricesActive, prices } = storageHelpPrices;

	return {
		from, to,
		filter, project, milestone,
		currentUser:userReducer,
		companiesActive, companies, companiesLoaded,
		tasksActive, tasks,tasksLoaded,
		statusesActive, statuses,statusesLoaded,
		taskTypesActive, taskTypes,taskTypesLoaded,
		unitsActive, units,unitsLoaded,
		usersActive, users,usersLoaded,
		materialsActive, materials,materialsLoaded,
		taskWorksActive, taskWorks,taskWorksLoaded,
		workTripsActive, workTrips, workTripsLoaded,
		tripTypesActive, tripTypes, tripTypesLoaded,
		pricelistsLoaded, pricelistsActive, pricelists,
		pricesLoaded, pricesActive, prices,
	};
};

export default connect(mapStateToProps, { storageCompaniesStart, storageHelpTasksStart, storageHelpStatusesStart, storageHelpTaskTypesStart, storageHelpUnitsStart, storageUsersStart, storageHelpTaskMaterialsStart, storageHelpTaskWorksStart, storageHelpTaskWorkTripsStart, storageHelpTripTypesStart, storageHelpPricelistsStart, storageHelpPricesStart })(MothlyReportsCompany);
