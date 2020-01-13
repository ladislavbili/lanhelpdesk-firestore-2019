import React, { Component } from 'react';
import { connect } from "react-redux";
import {storageCompaniesStart, storageHelpTasksStart, storageHelpStatusesStart, storageHelpTaskTypesStart, storageUsersStart,
	storageHelpTaskWorksStart, storageHelpTaskWorkTripsStart, storageHelpTripTypesStart} from '../../redux/actions';
import { timestampToString, sameStringForms, toSelArr } from '../../helperFunctions';
import { Link } from 'react-router-dom';
import MonthSelector from '../components/monthSelector';

class MothlyReportsAssigned extends Component {
	constructor(props){
		super(props);
		this.state={
			users:[],
			status:[],
			showUser:null,
			loading:false
		}
	}

	storageLoaded(props){
		return props.companiesLoaded &&
		props.tasksLoaded &&
		props.statusesLoaded &&
		props.taskTypesLoaded &&
		props.usersLoaded &&
		props.taskWorksLoaded &&
		props.tripTypesLoaded &&
		props.workTripsLoaded
	}

	componentWillReceiveProps(props){
		if(
			!sameStringForms(props.companies,this.props.companies)||
			!sameStringForms(props.tasks,this.props.tasks)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.taskTypes,this.props.taskTypes)||
			!sameStringForms(props.users,this.props.users)||
			!sameStringForms(props.taskWorks,this.props.taskWorks)||
			!sameStringForms(props.tripTypes,this.props.tripTypes)||
			!sameStringForms(props.workTrips,this.props.workTrips)||
			(props.year!==null && this.props.year===null)||
			(this.storageLoaded(props) && this.storageLoaded(this.props))
		){
			this.setData(props);
		}
		if(!sameStringForms(props.statuses,this.props.statuses)){
			this.setState({status:toSelArr(props.statuses.filter((status)=>status.action==='close'))})
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

		if(this.props.statusesLoaded){
			this.setState({status:toSelArr(this.props.statuses.filter((status)=>status.action==='close'))});
		}

		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}
		if(!this.props.usersActive){
			this.props.storageUsersStart();
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
		this.setData(this.props);
	}

	setData(props){
		if(!this.storageLoaded(props)){
			return;
		}
		let works = this.processWorks(props);
		let trips = this.processTrips(props);

		//let allTasks = this.processTasks(props, materials, works, trips).sort((task1,task2)=> task1.closeDate > task2.closeDate ? 1 : -1 );

		return;
		this.setState({
			users:[],
			loading:false
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
									<th>Assigned to</th>
									<th>Work hours</th>
									<th>Materials</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.users.map((user)=>
									<tr key={user.id} className="clickable" onClick={()=>this.setState({showUser:user})}>
										<td>{user.email}</td>
										<td>{user.hours}</td>
										<td>{user.numOfMaterials}</td>
									</tr>
								)}
							</tbody>
							</table>
					</div>
				}
					{this.props.month!==null && this.props.year!==null && this.state.showUser!==null &&
						<div className="p-20">
							<h2>Mesačný výkaz - {this.state.showUser.name} {this.state.showUser.surname} ({this.state.showUser.email}) {this.props.month.label} {this.props.year.value}</h2>
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
											this.state.users.find((user)=>user.id===this.state.showUser.id).works.map((item,index)=>
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
							<p className="m-0">Spolu zlava bez DPH: {(this.state.users.find((user)=>user.id===this.state.showUser.id).works.reduce((acc,item)=>{
									return acc+item.totalDiscount.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
								},0)).toFixed(2)} EUR</p>
							<p className="m-0">Spolu cena bez DPH: {(this.state.users.find((user)=>user.id===this.state.showUser.id).works.reduce((acc,item)=>{
										return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
									},0)).toFixed(2)} EUR</p>
								<p className="m-0">Spolu cena s DPH: {(this.state.users.find((user)=>user.id===this.state.showUser.id).works.reduce((acc,item)=>{
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
										this.state.users.find((user)=>user.id===this.state.showUser.id).materials.map((material, index)=>
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
							<p className="m-0">Spolu cena bez DPH: {(this.state.users.find((user)=>user.id===this.state.showUser.id).materials.reduce((acc,item)=>{
									return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
								},0)).toFixed(2)} EUR</p>
							<p className="m-0">Spolu cena s DPH: {(this.state.users.find((user)=>user.id===this.state.showUser.id).materials.reduce((acc,item)=>{
									return acc+item.totalPrice.reduce((acc,item)=>acc+=isNaN(parseFloat(item))?0:parseFloat(item),0)
								},0)*1.2).toFixed(2)} EUR</p>
						</div>
					</div>}
				 </div>
		);
	}
		//Processing tasks

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

	}

const mapStateToProps = ({ reportReducer, storageCompanies, storageHelpTasks, storageHelpStatuses, storageHelpTaskTypes, storageUsers,
	storageHelpTaskWorks, storageHelpTaskWorkTrips, storageHelpTripTypes }) => {
	const { from, to } = reportReducer;

	const { companiesActive, companies, companiesLoaded } = storageCompanies;
	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
	const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { taskTypesActive, taskTypes, taskTypesLoaded } = storageHelpTaskTypes;
	const { usersActive, users, usersLoaded } = storageUsers;
	const { taskWorksActive, taskWorks, taskWorksLoaded } = storageHelpTaskWorks;
	const { workTripsActive, workTrips, workTripsLoaded } = storageHelpTaskWorkTrips;
	const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;

	return {
		from, to,
		companiesActive, companies, companiesLoaded,
		tasksActive, tasks,tasksLoaded,
		statusesActive, statuses,statusesLoaded,
		taskTypesActive, taskTypes,taskTypesLoaded,
		usersActive, users,usersLoaded,
		taskWorksActive, taskWorks,taskWorksLoaded,
		workTripsActive, workTrips, workTripsLoaded,
		tripTypesActive, tripTypes, tripTypesLoaded,
	};
};

export default connect(mapStateToProps, { storageCompaniesStart, storageHelpTasksStart, storageHelpStatusesStart, storageHelpTaskTypesStart, storageUsersStart,
	storageHelpTaskWorksStart, storageHelpTaskWorkTripsStart, storageHelpTripTypesStart })(MothlyReportsAssigned);
