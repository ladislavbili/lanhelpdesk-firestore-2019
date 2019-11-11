import React, { Component } from 'react';
import { connect } from "react-redux";
import {storageHelpTasksStart, storageHelpStatusesStart, storageHelpUnitsStart, storageUsersStart, storageHelpTaskMaterialsStart, storageHelpTaskWorksStart, storageHelpTaskTypesStart} from '../../redux/actions';
import { timestampToString, sameStringForms} from '../../helperFunctions';
import { Link } from 'react-router-dom';

class Reports extends Component {
	constructor(props){
		super(props);
		this.state={
			tasks:[],
			statuses:[],
			users:[],
			units:[],
			taskMaterials:[],
			taskWorks:[],
			loading:false
		}
	}

	storageLoaded(props){
		return props.tasksLoaded &&
		props.statusesLoaded &&
		props.taskTypesLoaded &&
		props.unitsLoaded &&
		props.usersLoaded &&
		props.materialsLoaded &&
		props.taskWorksLoaded
	}

	componentWillReceiveProps(props){
		if(!sameStringForms(props.tasks,this.props.tasks)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.taskTypes,this.props.taskTypes)||
			!sameStringForms(props.units,this.props.units)||
			!sameStringForms(props.users,this.props.users)||
			!sameStringForms(props.materials,this.props.materials)||
			!sameStringForms(props.taskWorks,this.props.taskWorks)){
			this.setData(props);
		}
		if(!this.storageLoaded(this.props)&& this.storageLoaded(props)){
			this.setData(props);
		}
	}

	componentWillMount(){
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
		this.setData(this.props);
  }

	setData(props){
		if(!this.storageLoaded(props)){
			return;
		}
		let tasks = props.tasks;
		let statuses = props.statuses;
		let users = props.users;
		let units = props.units;
		let taskMaterials = props.materials;
		let taskWorks = props.taskWorks;
		let newTasks=tasks.map((task)=>{
			return {
				...task,
				requester:task.requester===null ? null:users.find((user)=>user.id===task.requester),
				assigned:task.assigned===null ? null:users.find((user)=>user.id===task.assigned),
				status:task.status===null ? null: statuses.find((status)=>status.id===task.status),
			}
		});
		console.log(tasks);
		console.log(props.tasksLoaded);
		this.setState({
			tasks:newTasks,
			statuses,
			taskTypes:props.taskTypes,
			users,
			units,
			taskMaterials,
			taskWorks,
			loading:false
		});
	}

	processWorks(works){
		let newWorks = works.map((work)=>{
			let finalUnitPrice=parseFloat(work.price);
			if(work.extraWork){
				finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
			}
			let discountPerItem = finalUnitPrice*parseFloat(work.discount)/100;
			finalUnitPrice=(finalUnitPrice*(1-parseFloat(work.discount)/100)).toFixed(2)
			let totalPrice=(finalUnitPrice*parseFloat(work.quantity)).toFixed(2);
			let workType= this.state.taskTypes.find((item)=>item.id===work.workType);
			return{
				...work,
				task:this.state.tasks.find((task)=>work.task===task.id),
				workType:workType?workType:{title:'Unknown',id:Math.random()},
				finalUnitPrice,
				totalPrice,
				totalDiscount:(parseFloat(work.quantity)*discountPerItem).toFixed(2)

			}
		});
		let filter = this.props.filter;
		newWorks = newWorks.filter((work)=>
			(filter.status.length===0||(work.task.status && filter.status.includes(work.task.status.id))) &&
			(filter.requester===null||(work.task.requester && work.task.requester.id===filter.requester)||(work.task.requester && filter.requester==='cur' && work.task.requester.id === this.props.currentUser.id)) &&
			(filter.company===null||(work.task.company && work.task.company.id===filter.company) ||(work.task.company && filter.company==='cur' && work.task.company.id===this.props.currentUser.userData.company)) &&
			(filter.assigned===null||(work.task.assignedTo && work.task.assignedTo.map((item)=>item.id).includes(filter.assigned))||(work.task.assignedTo && filter.requester==='cur' && work.task.assignedTo.map((item)=>item.id).includes(this.props.currentUser.id))) &&
			(filter.workType===null||(work.workType.id===filter.workType)) &&
			(this.props.project===null || (work.task.project && work.task.project===this.props.project)) &&
			(filter.statusDateFrom===''||work.task.statusChange >= filter.statusDateFrom) &&
			(filter.statusDateTo===''||work.task.statusChange <= filter.statusDateTo) &&
			(filter.closeDateFrom===undefined || filter.closeDateFrom===''||(work.task.closeDate && work.task.closeDate >= filter.closeDateFrom)) &&
			(filter.closeDateTo===undefined || filter.closeDateTo===''||(work.task.closeDate && work.task.closeDate <= filter.closeDateTo)) &&
			(filter.pendingDateFrom===undefined || filter.pendingDateFrom===''||(work.task.pendingDate && work.task.pendingDate >= filter.pendingDateFrom)) &&
			(filter.pendingDateTo===undefined || filter.pendingDateTo===''||(work.task.pendingDate && work.task.pendingDate <= filter.pendingDateTo))&&
			(this.props.milestone===null||(work.task.milestone && work.task.milestone === this.props.milestone))
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

	processMaterials(materials){
		let newMaterials = materials.map((material)=>{
			let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100)).toFixed(2);
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(2);
			return{...material,
				task:this.state.tasks.find((task)=>material.task===task.id),
				unit:this.state.units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice
			}
		})
		let filter = this.props.filter;
		newMaterials = newMaterials.filter((material)=>
			(filter.status.length===0||(material.task.status && filter.status.includes(material.task.status.id))) &&
			(filter.requester===null||(material.task.requester && material.task.requester.id===filter.requester)||(material.task.requester && filter.requester==='cur' && material.task.requester.id === this.props.currentUser.id)) &&
			(filter.company===null||(material.task.company && material.task.company.id===filter.company) ||(material.task.company && filter.company==='cur' && material.task.company.id===this.props.currentUser.userData.company)) &&
			(filter.assigned===null||(material.task.assignedTo && material.task.assignedTo.map((item)=>item.id).includes(filter.assigned))||(material.task.assignedTo && filter.requester==='cur' && material.task.assignedTo.map((item)=>item.id).includes(this.props.currentUser.id))) &&
			(this.props.project===null || (material.task.project && material.task.project===this.props.project)) &&
			(filter.statusDateFrom===''||material.task.statusChange >= filter.statusDateFrom) &&
			(filter.statusDateTo===''||material.task.statusChange <= filter.statusDateTo) &&
			(filter.closeDateFrom===undefined || filter.closeDateFrom===''||(material.task.closeDate && material.task.closeDate >= filter.closeDateFrom)) &&
			(filter.closeDateTo===undefined || filter.closeDateTo===''||(material.task.closeDate && material.task.closeDate <= filter.closeDateTo)) &&
			(filter.pendingDateFrom===undefined || filter.pendingDateFrom===''||(material.task.pendingDate && material.task.pendingDate >= filter.pendingDateFrom)) &&
			(filter.pendingDateTo===undefined || filter.pendingDateTo===''||(material.task.pendingDate && material.task.pendingDate <= filter.pendingDateTo))&&
			(this.props.milestone===null||(material.task.milestone&& material.task.milestone === this.props.milestone))
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
					<div className="commandbar">
							<button type="button" className="btn-link waves-effect center-hor">
								<i
									className="fa fa-file-pdf"
									/>
								{"  "}Export
								</button>
								<button type="button" className="btn-link waves-effect center-hor">
									<i
										className="fas fa-print"
										/>
									{"  "}Print
									</button>
									<button type="button" className="btn-link waves-effect center-hor">
										<i
											className="fas fa-sync"
											/>
										{"  "}Aktualizovať ceny podla cenníka
									</button>
					</div>

							<div className="p-20">
								<h1 className="m-b-15">Výkaz prác</h1>
								<div>
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
													<th >	Cena/ks </th>
													<th>Cena spolu</th>
												</tr>
											</thead>
											<tbody>
												{
													this.processWorks(this.state.taskWorks).map((item,index)=>
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
									<p className="m-0">Spolu zlava bez DPH: {(this.processWorks(this.state.taskWorks).reduce((acc,item)=>{
											return acc+item.totalDiscount.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
										},0)).toFixed(2)} EUR</p>
										<p className="m-0">Spolu cena bez DPH: {(this.processWorks(this.state.taskWorks).reduce((acc,item)=>{
												return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
											},0)).toFixed(2)} EUR</p>
										<p className="m-0">Spolu cena s DPH: {(this.processWorks(this.state.taskWorks).reduce((acc,item)=>{
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
												this.processMaterials(this.state.taskMaterials).map((material, index)=>
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
									<p className="m-0">Spolu cena bez DPH: {(this.processMaterials(this.state.taskMaterials).reduce((acc,item)=>{
											return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
										},0)).toFixed(2)} EUR</p>
									<p className="m-0">Spolu cena s DPH: {(this.processMaterials(this.state.taskMaterials).reduce((acc,item)=>{
											return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
										},0)*1.2).toFixed(2)} EUR</p>
								</div>
							</div>
						</div>
				 </div>
			);
		}
	}

const mapStateToProps = ({ filterReducer,userReducer, storageHelpTaskTypes, storageHelpTasks, storageHelpStatuses, storageHelpUnits, storageUsers, storageHelpTaskMaterials, storageHelpTaskWorks }) => {
	const { filter, project, milestone } = filterReducer;

	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
	const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { unitsActive, units, unitsLoaded } = storageHelpUnits;
	const { usersActive, users, usersLoaded } = storageUsers;
	const { materialsActive, materials, materialsLoaded } = storageHelpTaskMaterials;
	const { taskWorksActive, taskWorks, taskWorksLoaded } = storageHelpTaskWorks;

	return { filter, project, milestone,
		currentUser:userReducer,
		tasksActive, tasks,tasksLoaded,
		statusesActive, statuses,statusesLoaded,
		taskTypesLoaded, taskTypesActive, taskTypes,
		unitsActive, units,unitsLoaded,
		usersActive, users,usersLoaded,
		materialsActive, materials,materialsLoaded,
		taskWorksActive, taskWorks,taskWorksLoaded
	};
};

export default connect(mapStateToProps, { storageHelpTasksStart, storageHelpStatusesStart, storageHelpUnitsStart, storageUsersStart, storageHelpTaskMaterialsStart, storageHelpTaskWorksStart, storageHelpTaskTypesStart })(Reports);
