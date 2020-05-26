import React, { Component } from 'react';
import { connect } from "react-redux";
import {
	storageHelpTasksStart,
	storageHelpStatusesStart,
	storageHelpUnitsStart,
	storageUsersStart,
	storageHelpTaskMaterialsStart,
	storageHelpTaskWorksStart,
	storageHelpTaskTypesStart,
	storageHelpProjectsStart
} from 'redux/actions';
import { timestampToString, sameStringForms, applyTaskFilter } from '../../helperFunctions';
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
		props.projectsLoaded &&
		props.taskWorksLoaded
	}

	componentWillReceiveProps(props){
		if(!sameStringForms(props.tasks,this.props.tasks)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.taskTypes,this.props.taskTypes)||
			!sameStringForms(props.units,this.props.units)||
			!sameStringForms(props.users,this.props.users)||
			!sameStringForms(props.materials,this.props.materials)||
			!sameStringForms(props.projects,this.props.projects)||
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
		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
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
		const projectsIDs = props.projects.map( (project) => project.id )
		let newTasks=tasks.map((task)=>{
			return {
				...task,
				project: projectsIDs.includes(task.project) ? props.projects.find( (project) => project.id === task.project ) : null,
				requester:task.requester===null ? null:users.find((user)=>user.id===task.requester),
				assigned:task.assigned===null ? null:users.find((user)=>user.id===task.assigned),
				status:task.status===null ? null: statuses.find((status)=>status.id===task.status),
			}
		});
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
		const filter = this.props.filter;
		newWorks = newWorks.filter((work)=> work.task && applyTaskFilter( work.task, filter, this.props.currentUser, this.props.project, this.props.milestone ) );

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
		const filter = this.props.filter;
		newMaterials = newMaterials.filter((material)=> material.task && applyTaskFilter( material.task, filter, this.props.currentUser, this.props.project, this.props.milestone ) )

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
					<div className="commandbar p-l-15">
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
								<h2 className="m-b-15">Výkaz prác</h2>
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

const mapStateToProps = ({
	filterReducer,
	userReducer,
	storageHelpTaskTypes,
	storageHelpTasks,
	storageHelpStatuses,
	storageHelpUnits,
	storageUsers,
	storageHelpTaskMaterials,
	storageHelpTaskWorks,
	storageHelpProjects
}) => {
	const { filter, project, milestone } = filterReducer;

	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
	const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { unitsActive, units, unitsLoaded } = storageHelpUnits;
	const { usersActive, users, usersLoaded } = storageUsers;
	const { materialsActive, materials, materialsLoaded } = storageHelpTaskMaterials;
	const { taskWorksActive, taskWorks, taskWorksLoaded } = storageHelpTaskWorks;
	const { projectsActive, projectsLoaded, projects } = storageHelpProjects;

	return { filter, project, milestone,
		currentUser:userReducer,
		tasksActive, tasks,tasksLoaded,
		statusesActive, statuses,statusesLoaded,
		taskTypesLoaded, taskTypesActive, taskTypes,
		unitsActive, units,unitsLoaded,
		usersActive, users,usersLoaded,
		materialsActive, materials,materialsLoaded,
		taskWorksActive, taskWorks,taskWorksLoaded,
		projectsActive, projectsLoaded, projects
	};
};

export default connect(mapStateToProps, { storageHelpTasksStart, storageHelpStatusesStart, storageHelpUnitsStart, storageUsersStart, storageHelpTaskMaterialsStart, storageHelpTaskWorksStart, storageHelpTaskTypesStart, storageHelpProjectsStart })(Reports);
