import React, { Component } from 'react';
import {database} from '../../index';
import { connect } from "react-redux";
import { snapshotToArray, timestampToString} from '../../helperFunctions';
import { Link } from 'react-router-dom';



class Reports extends Component {
	constructor(props){
		super(props);
		this.state={
			tasks:[],
			statuses:[],
			workTypes:[],
			users:[],
			units:[],
			taskMaterials:[],
			taskWorks:[],
			loading:false
		}
		this.fetchData();
	}
	//tasks, materiale a sluzby	worktype user status

	fetchData(){
		Promise.all(
			[
				database.collection('tasks').get(),
				database.collection('statuses').get(),
				database.collection('workTypes').get(),
				database.collection('units').get(),
				database.collection('users').get(),
				database.collection('taskMaterials').get(),
				database.collection('taskWorks').get()
			]).then(([tasks,statuses, workTypes, units, users,taskMaterials, taskWorks])=>{
				this.setData(snapshotToArray(tasks),snapshotToArray(statuses),snapshotToArray(users),
				snapshotToArray(workTypes), snapshotToArray(units),
				snapshotToArray(taskMaterials),snapshotToArray(taskWorks));
			});
		}

		setData(tasks,statuses, users,workTypes,units,taskMaterials,taskWorks){
			let newTasks=tasks.map((task)=>{
				return {
					...task,
					requester:task.requester===null ? null:users.find((user)=>user.id===task.requester),
					assigned:task.assigned===null ? null:users.find((user)=>user.id===task.assigned),
					status:task.status===null ? null: statuses.find((status)=>status.id===task.status),
				}
			});
			this.setState({
				tasks:newTasks,
				statuses,
				workTypes,
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
				finalUnitPrice=(finalUnitPrice*(1-parseFloat(work.discount)/100)).toFixed(2)
				let totalPrice=(finalUnitPrice*parseFloat(work.quantity)).toFixed(2);
				let workType= this.state.workTypes.find((item)=>item.id===work.workType);
				return{...work,
					task:this.state.tasks.find((task)=>work.task===task.id),
					workType,
					finalUnitPrice,
					totalPrice

				}
			});
			return newWorks.filter((work)=>
			(this.props.filter.status===null||work.task.status.id===this.props.filter.status) &&
			(this.props.filter.requester===null||work.task.requester.id===this.props.filter.requester) &&
			(this.props.filter.company===null||work.task.company===this.props.filter.company) &&
			(this.props.filter.assigned===null||work.task.assigned.id===this.props.filter.assigned) &&
			(this.props.filter.workType===null||work.workType.id===this.props.filter.workType) &&
			(this.props.filter.statusDateFrom===''||work.task.statusChange >= this.props.filter.statusDateFrom) &&
			(this.props.filter.statusDateTo===''||work.task.statusChange <= this.props.filter.statusDateTo)
		);
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
		return newMaterials.filter((material)=>
		(this.props.filter.status===null||material.task.status.id===this.props.filter.status) &&
		(this.props.filter.requester===null||material.task.requester.id===this.props.filter.requester) &&
		(this.props.filter.company===null||material.task.company===this.props.filter.company) &&
		(this.props.filter.assigned===null||material.task.assigned.id===this.props.filter.assigned) &&
		(this.props.filter.statusDateFrom===''||material.task.statusChange >= this.props.filter.statusDateFrom) &&
		(this.props.filter.statusDateTo===''||material.task.statusChange <= this.props.filter.statusDateTo)
	);
}

	render() {
		return (
			<div className="content-page scrollable fit-with-header">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="container-fluid">
						<div class="d-flex flex-row align-items-center">
							<div class="p-2">
								<button type="button" class="btn btn-link waves-effect">
									<i
										class="fa fa-file-pdf"
										style={{
											color: '#4a81d4',
											fontSize: '1.2em',
										}}
										/>
									<span style={{
											color: '#4a81d4',
											fontSize: '1.2em',
										}}> Export</span>
									</button>
								</div>
								<div class="">
									<button type="button" class="btn btn-link waves-effect">
										<i
											class="fas fa-print"
											style={{
												color: '#4a81d4',
												fontSize: '1.2em',
											}}
											/>
										<span style={{
												color: '#4a81d4',
												fontSize: '1.2em',
											}}> Print</span>
										</button>
									</div>
									<div>
										<button type="button" class="btn btn-link waves-effect">
											<i
												class="fas fa-sync"
												style={{color: '#4a81d4',fontSize: '1.2em'}}
												/>
											<span style={{color: '#4a81d4',fontSize: '1.2em'}}> Aktualizovať ceny podla cenníka</span>
										</button>
									</div>
								</div>
								<div className="row">
									<div class="col-md-12">
										<div class="card-box">
											<h1>Výkaz prác</h1>
											<hr />
											<div>
												<h3>Služby</h3>
												<div class="table-responsive">
													<table class="table table-hover mails m-0">
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
																	<td><Link className="" to={{ pathname: `/helpdesk/taskList/`+item.task.id }} style={{ color: "#1976d2" }}>{item.task.title}</Link></td>
																	<td>{item.task.requester===null?'Nikto':item.task.requester.email}</td>
																	<td>{item.task.assigned===null?'Nikto':item.task.assigned.email}</td>
																	<td>{item.task.status.title}</td>
																	<td>{timestampToString(item.task.statusChange)}</td>
																	<td>{item.title}</td>
																	<td>{item.workType.title}</td>
																	<td>{item.quantity}</td>
																	<td>{item.finalUnitPrice}</td>
																	<td>{item.totalPrice}</td>
																</tr>
															)
														}
													</tbody>
												</table>
												<p className="m-0">Spolu zlava bez DPH: 105 EUR</p>
												<p className="m-0">Spolu cena bez DPH: 105 EUR</p>
												<p className="m-0">Spolu cena s DPH: 126 EUR</p>
												<hr />
											</div>
											<div>
												<h3>Material</h3>
												<table class="table table-hover mails m-0">
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
																<td><Link className="" to={{ pathname: `/helpdesk/taskList/`+material.task.id }} style={{ color: "#1976d2" }}>{material.task.title}</Link></td>
																<td>{material.task.requester===null?'Nikto':material.task.requester.email}</td>
																<td>{material.task.assigned===null?'Nikto':material.task.assigned.email}</td>
																<td>{material.task.status.title}</td>
																<td>{timestampToString(material.task.statusChange)}</td>
																<td>{material.title}</td>
																<td>{material.unit.title}</td>
																<td>{material.quantity}</td>
																<td>{material.finalUnitPrice}</td>
																<td>{material.totalPrice}</td>
															</tr>
														)}
													</tbody>
												</table>
												<p className="m-0">Spolu cena bez DPH: 105 EUR</p>
												<p className="m-0">Spolu cena s DPH: 126 EUR</p>
											</div>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			);
		}
	}

	const mapStateToProps = ({ filterReducer }) => {
		const { filter } = filterReducer;
		return { filter };
	};

	export default connect(mapStateToProps, {  })(Reports);
