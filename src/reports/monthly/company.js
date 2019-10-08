import React, { Component } from 'react';
import { connect } from "react-redux";
import {storageCompaniesStart,storageHelpTasksStart, storageHelpStatusesStart, storageHelpWorkTypesStart, storageHelpUnitsStart, storageUsersStart, storageHelpTaskMaterialsStart, storageHelpTaskWorksStart} from '../../redux/actions';
import { timestampToString, sameStringForms} from '../../helperFunctions';
import { Link } from 'react-router-dom';
import MonthSelector from '../components/monthSelector';

class MothlyReportsCompany extends Component {
	constructor(props){
		super(props);
		this.state={
			taskMaterials:[],
			taskWorks:[],
			companies:[],
			showCompany:null,
			loading:false
		}
	}

	storageLoaded(props){
		return props.companiesLoaded &&
		props.tasksLoaded &&
		props.statusesLoaded &&
		props.workTypesLoaded &&
		props.unitsLoaded &&
		props.usersLoaded &&
		props.materialsLoaded &&
		props.taskWorksLoaded
	}

	componentWillReceiveProps(props){
		if(
			!sameStringForms(props.companies,this.props.companies)||
			!sameStringForms(props.tasks,this.props.tasks)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.workTypes,this.props.workTypes)||
			!sameStringForms(props.units,this.props.units)||
			!sameStringForms(props.users,this.props.users)||
			!sameStringForms(props.materials,this.props.materials)||
			!sameStringForms(props.taskWorks,this.props.taskWorks)||
			(props.year!==null && this.props.year===null)||
			(props.year && this.props.year && props.year.value!==this.props.year.value)||
			(props.month && this.props.month && props.month.value!==this.props.month.value)
		){
			this.setData(props);
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
		if(!this.props.workTypesActive){
			this.props.storageHelpWorkTypesStart();
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
		this.setData(this.props);
	}

	setData(props){
		if(!this.storageLoaded(props)){
			return;
		}
		let tasks=props.tasks.map((task)=>{
			return {
				...task,
				company:task.company===null?null: props.companies.find((company)=>company.id===task.company),
				requester:task.requester===null ? null:props.users.find((user)=>user.id===task.requester),
				assigned:task.assigned===null ? null:props.users.find((user)=>user.id===task.assigned),
				status:task.status===null ? null: props.statuses.find((status)=>status.id===task.status),
			}
		});
		let taskMaterials = this.processMaterials(props.materials,tasks,props.units,props);
		let taskWorks = this.processWorks(props.taskWorks,props.workTypes,tasks,props);
		let companies = this.processCompanies(taskWorks, taskMaterials);
		this.setState({
			taskMaterials,
			taskWorks,
			companies,
			loading:false
		});
	}

	processCompanies(works,materials){
		let companies = [];
		works.forEach((work)=>{
			let company = work.task.company;
			if(companies.map((company)=>company.id).includes(company.id)){
				companies.find((item)=>item.id===company.id).hours+=work.quantity.reduce((total,num)=>total+=parseInt(num),0);
			}else{
				companies.push({...company,materials:0,hours:work.quantity.reduce((total,num)=>total+=parseInt(num),0)});
			}
		})
		materials.forEach((material)=>{
			let company = material.task.company;
			if(companies.map((company)=>company.id).includes(company.id)){
				companies.find((item)=>item.id===company.id).materials+=material.quantity.reduce((total,num)=>total+=parseInt(num),0);
			}else{
				companies.push({...company,hours:0,materials:material.quantity.reduce((total,num)=>total+=parseInt(num),0)});
			}
		})
		return companies.filter((company)=>company.hours>0||company.materials>0);
	}

	processWorks(works,workTypes,tasks,props){
		let newWorks = works.map((work)=>{
			let finalUnitPrice=parseFloat(work.price);
			if(work.extraWork){
				finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
			}
			let discountPerItem = finalUnitPrice*parseFloat(work.discount)/100;
			finalUnitPrice=(finalUnitPrice*(1-parseFloat(work.discount)/100)).toFixed(2)
			let totalPrice=(finalUnitPrice*parseFloat(work.quantity)).toFixed(2);
			let workType= workTypes.find((item)=>item.id===work.workType);
			return{
				...work,
				task:tasks.find((task)=>work.task===task.id),
				workType:workType?workType:{title:'Unknown',id:Math.random()},
				finalUnitPrice,
				totalPrice,
				totalDiscount:(parseFloat(work.quantity)*discountPerItem).toFixed(2)

			}
		});
		let filter = props.filter;
		newWorks = newWorks.filter((work)=>
			(filter.status.length===0||(work.task.status && filter.status.includes(work.task.status.id))) &&
			(filter.requester===null||(work.task.requester && work.task.requester.id===filter.requester)
				||(work.task.requester && filter.requester==='cur' && work.task.requester.id === props.currentUser.id)) &&
			(filter.company===null||(work.task.company && work.task.company.id===filter.company)
				||(work.task.company && filter.company==='cur' && work.task.company.id===props.currentUser.userData.company)) &&
			(filter.assigned===null||(work.task.assignedTo && work.task.assignedTo.map((item)=>item.id).includes(filter.assigned))||
				(work.task.assignedTo && filter.requester==='cur' && work.task.assignedTo.map((item)=>item.id).includes(props.currentUser.id))) &&
			(filter.workType===null||(work.workType.id===filter.workType)) &&
			(props.project===null || (work.task.project && work.task.project===props.project)) &&
			(props.year && props.year.value === (new Date(work.task.closeDate)).getFullYear()) &&
			(props.month && props.month.value === (new Date(work.task.closeDate)).getMonth()+1) &&
			(filter.statusDateFrom===''||work.task.statusChange >= filter.statusDateFrom) &&
			(filter.statusDateTo===''||work.task.statusChange <= filter.statusDateTo) &&
			(filter.closeDateFrom===undefined || filter.closeDateFrom===''||(work.task.closeDate && work.task.closeDate >= filter.closeDateFrom)) &&
			(filter.closeDateTo===undefined || filter.closeDateTo===''||(work.task.closeDate && work.task.closeDate <= filter.closeDateTo)) &&
			(filter.pendingDateFrom===undefined || filter.pendingDateFrom===''||(work.task.pendingDate && work.task.pendingDate >= filter.pendingDateFrom)) &&
			(filter.pendingDateTo===undefined || filter.pendingDateTo===''||(work.task.pendingDate && work.task.pendingDate <= filter.pendingDateTo))
			);

		let groupedWorks = newWorks.filter((item, index)=>{
			return newWorks.findIndex((item2)=>item2.task.id===item.task.id)===index
			});
		return groupedWorks.map((item)=>{
			let works = newWorks.filter((item2)=>item.task.id===item2.task.id);
			return{
				...item,
				title: works.map((item)=>item.title),
				workType: works.map((item)=>item.workType),
				quantity: works.map((item)=>item.quantity),
				finalUnitPrice: works.map((item)=>item.finalUnitPrice),
				totalPrice: works.map((item)=>item.totalPrice),
				totalDiscount: works.map((item)=>item.totalDiscount)
			}
		});
	}

	processMaterials(materials,tasks,units,props){
		let newMaterials = materials.map((material)=>{
			let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100)).toFixed(2);
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(2);
			return{...material,
				task:tasks.find((task)=>material.task===task.id),
				unit:units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice
			}
		})
		let filter = props.filter;
		newMaterials = newMaterials.filter((material)=>
			(filter.status.length===0||(material.task.status && filter.status.includes(material.task.status.id))) &&
			(filter.requester===null||(material.task.requester && material.task.requester.id===filter.requester)
				||(material.task.requester && filter.requester==='cur' && material.task.requester.id === props.currentUser.id)) &&
			(filter.company===null||(material.task.company && material.task.company.id===filter.company)
				||(material.task.company && filter.company==='cur' && material.task.company.id===props.currentUser.userData.company)) &&
			(filter.assigned===null||(material.task.assignedTo && material.task.assignedTo.map((item)=>item.id).includes(filter.assigned))
				||(material.task.assignedTo && filter.requester==='cur' && material.task.assignedTo.map((item)=>item.id).includes(props.currentUser.id))) &&
			(props.project===null || (material.task.project && material.task.project===props.project)) &&
			(props.year!==null && props.year.value === (new Date(material.task.closeDate)).getFullYear()) &&
			(props.month!==null && props.month.value === (new Date(material.task.closeDate)).getMonth()+1) &&
			(filter.statusDateFrom===''||material.task.statusChange >= filter.statusDateFrom) &&
			(filter.statusDateTo===''||material.task.statusChange <= filter.statusDateTo) &&
			(filter.closeDateFrom===undefined || filter.closeDateFrom===''||(material.task.closeDate && material.task.closeDate >= filter.closeDateFrom)) &&
			(filter.closeDateTo===undefined || filter.closeDateTo===''||(material.task.closeDate && material.task.closeDate <= filter.closeDateTo)) &&
			(filter.pendingDateFrom===undefined || filter.pendingDateFrom===''||(material.task.pendingDate && material.task.pendingDate >= filter.pendingDateFrom)) &&
			(filter.pendingDateTo===undefined || filter.pendingDateTo===''||(material.task.pendingDate && material.task.pendingDate <= filter.pendingDateTo))
		);

		let groupedMaterials = newMaterials.filter((item, index)=>{
			return newMaterials.findIndex((item2)=>item2.task.id===item.task.id)===index
		});

		return groupedMaterials.map((item)=>{
			let materials = newMaterials.filter((item2)=>item.task.id===item2.task.id);
			return{
				...item,
				title:materials.map((item)=>item.title),
				unit:materials.map((item)=>item.unit),
				quantity:materials.map((item)=>item.quantity),
				finalUnitPrice:materials.map((item)=>item.finalUnitPrice),
				totalPrice:materials.map((item)=>item.totalPrice),
			}
		});
	}

	render() {
		return (
				<div className="scrollable fit-with-header">
					<div style={{maxWidth:500}}>
						<MonthSelector />
					</div>
					{ this.props.month!==null && this.props.year!==null && <div className="p-20">
						<table className="table m-b-10">
							<thead>
								<tr>
									<th>Company name</th>
									<th>Work hours</th>
									<th>Materials</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.companies.map((company)=>
									<tr key={company.id} className="clickable" onClick={()=>this.setState({showCompany:company.id})}>
										<td>{company.title}</td>
										<td>{company.hours}</td>
										<td>{company.materials}</td>
									</tr>
								)}
							</tbody>
							</table>
					</div>
				}
					{this.props.month!==null && this.props.year!==null && this.state.showCompany!==null &&
						<div className="p-20">
							<h3>Služby</h3>
							<hr />
							<div className="m-b-30">
								<table className="table m-b-10">
									<thead>
										<tr>
											<th>ID</th>
											<th style={{ width: '20%' }}>	Name</th>
											<th>Zadal</th>
											<th>Riesi</th>
											<th>Status</th>
											<th>Status date</th>
											<th>Služby</th>
											<th>Typ práce</th>
											<th>Hodiny</th>
											<th>Cena/ks </th>
											<th>Cena spolu</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.taskWorks.filter((work)=>work.task.company.id===this.state.showCompany).map((item,index)=>
											<tr key={index}>
												<td>{item.task.id}</td>
												<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/`+item.task.id }} style={{ color: "#1976d2" }}>{item.task.title}</Link></td>
												<td>{item.task.requester?item.task.requester.email:'Nikto'}</td>
												<td>{item.task.assigned?item.task.assigned.email:'Nikto'}</td>
												<td>{item.task.status.title}</td>
												<td>{timestampToString(item.task.statusChange)}</td>
												<td>
													{item.title.map((item2,index)=>
														<p key={index}>{item2}</p>
													)}
												</td>
												<td>
													{item.workType.map((item2,index)=>
														<p key={index}>{item2.title}</p>
													)}
												</td>
												<td>
													{item.quantity.map((item2,index)=>
														<p key={index}>{item2}</p>
													)}
												</td>
												<td>
													{item.finalUnitPrice.map((item2,index)=>
														<p key={index}>{item2}</p>
													)}
												</td>
												<td>
													{item.totalPrice.map((item2,index)=>
														<p key={index}>{item2}</p>
													)}
												</td>
											</tr>
										)
									}
								 </tbody>
							</table>
							<p className="m-0">Spolu zlava bez DPH: {(this.state.taskWorks.reduce((acc,item)=>{
									return acc+item.totalDiscount.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
								},0)).toFixed(2)} EUR</p>
								<p className="m-0">Spolu cena bez DPH: {(this.state.taskWorks.reduce((acc,item)=>{
										return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
									},0)).toFixed(2)} EUR</p>
								<p className="m-0">Spolu cena s DPH: {(this.state.taskWorks.reduce((acc,item)=>{
										return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
									},0)*1.2).toFixed(2)} EUR</p>
						</div>

						<div>
							<h3>Material</h3>
							<hr />
							<table className="table p-10">
								<thead>
									<tr>
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
										this.state.taskMaterials.filter((material)=>material.task.company.id===this.state.showCompany).map((material, index)=>
										<tr key={index}>
											<td>{material.task.id}</td>
											<td><Link className="" to={{ pathname: `/helpdesk/taskList/i/all/`+material.task.id }} style={{ color: "#1976d2" }}>{material.task.title}</Link></td>
											<td>{material.task.requester?material.task.requester.email:'Nikto'}</td>
											<td>{material.task.assigned?material.task.assigned.email:'Nikto'}</td>
											<td>{material.task.status.title}</td>
											<td>{timestampToString(material.task.statusChange)}</td>
												<td>
													{material.title.map((item2,index)=>
														<p key={index}>{item2}</p>
													)}
												</td>
												<td>
													{material.quantity.map((item2,index)=>
														<p key={index}>{item2}</p>
													)}
												</td>
												<td>
													{material.unit.map((item2,index)=>
														<p key={index}>{item2.title}</p>
													)}
												</td>
												<td>
													{material.finalUnitPrice.map((item2,index)=>
														<p key={index}>{item2}</p>
													)}
												</td>
												<td>
													{material.totalPrice.map((item2,index)=>
														<p key={index}>{item2}</p>
													)}
												</td>
										</tr>
									)}
								</tbody>
							</table>
							<p className="m-0">Spolu cena bez DPH: {(this.state.taskMaterials.reduce((acc,item)=>{
									return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
								},0)).toFixed(2)} EUR</p>
							<p className="m-0">Spolu cena s DPH: {(this.state.taskMaterials.reduce((acc,item)=>{
									return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
								},0)*1.2).toFixed(2)} EUR</p>
						</div>
					</div>}
				 </div>
			);
		}
	}

const mapStateToProps = ({ filterReducer,reportReducer,userReducer, storageCompanies, storageHelpTasks, storageHelpStatuses, storageHelpWorkTypes, storageHelpUnits, storageUsers, storageHelpTaskMaterials, storageHelpTaskWorks }) => {
	const { filter, project } = filterReducer;
	const { month, year } = reportReducer;

	const { companiesActive, companies, companiesLoaded } = storageCompanies;
	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
	const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { workTypesActive, workTypes, workTypesLoaded } = storageHelpWorkTypes;
	const { unitsActive, units, unitsLoaded } = storageHelpUnits;
	const { usersActive, users, usersLoaded } = storageUsers;
	const { materialsActive, materials, materialsLoaded } = storageHelpTaskMaterials;
	const { taskWorksActive, taskWorks, taskWorksLoaded } = storageHelpTaskWorks;

	return {
		month, year,
		filter, project,
		currentUser:userReducer,
		companiesActive, companies, companiesLoaded,
		tasksActive, tasks,tasksLoaded,
		statusesActive, statuses,statusesLoaded,
		workTypesActive, workTypes,workTypesLoaded,
		unitsActive, units,unitsLoaded,
		usersActive, users,usersLoaded,
		materialsActive, materials,materialsLoaded,
		taskWorksActive, taskWorks,taskWorksLoaded
	};
};

export default connect(mapStateToProps, { storageCompaniesStart, storageHelpTasksStart, storageHelpStatusesStart, storageHelpWorkTypesStart, storageHelpUnitsStart, storageUsersStart, storageHelpTaskMaterialsStart, storageHelpTaskWorksStart })(MothlyReportsCompany);
