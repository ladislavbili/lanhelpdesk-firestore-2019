import React, { Component } from 'react';
import Select from 'react-select';
import {rebase, database} from '../../index';
import {toCentralTime } from '../../helperFunctions';
import { Button, Label, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import ServicesExpenditure from '../components/services/prace';
import MaterialsExpenditure from '../components/materials/materials';
import ServicesBudget from '../components/services/rozpocet';
import MaterialsBudget from '../components/materials/rozpocet';
import Services from '../components/services';
import Materials from '../components/materials';

import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';
import classnames from "classnames";
import {invisibleSelectStyleNoArrow} from '../../scss/selectStyles';

const noDef={
	status:{def:false,fixed:false, value: null},
	tags:{def:false,fixed:false, value: []},
	assignedTo:{def:false,fixed:false, value: []},
	type:{def:false,fixed:false, value: null},
	requester:{def:false,fixed:false, value: null},
	company:{def:false,fixed:false, value: null}
}

export default class TaskAdd extends Component{
	constructor(props){
		super(props);
		this.state={
			saving:false,
			users:[],
			companies:[],
			workTypes:[],
			statuses:[],
			projects:[],
			taskWorks:[],
			subtasks:[],
			taskMaterials:[],
			allTags:[],
			taskTypes:[],
			hidden:true,
			defaults:noDef,

			title:'',
			company:null,
			workHours:'0',
			requester:null,
			assignedTo:[],
			description:'',
			status:null,
			statusChange:null,
			deadline:null,
			reminder:null,
			project:null,
			tags:[],
			pausal:{value:true,label:'Pausal'},
			overtime:{value:false,label:'Nie'},
			type:null,
			repeat:null,
		}
		this.counter = 0;
	}

	getNewID(){
		return this.counter++;
	}

	componentWillMount(){
		this.setData();
	}

	componentWillReceiveProps(props){
		if (this.props.project !== props.project || this.props.triggerDate!==props.triggerDate){
			this.setDefaults(props.project, false);
		}
	}

	submitTask(){
		this.setState({saving:true});

		database.collection('metadata').doc('0').get().then((taskMeta)=>{
			let newID = (parseInt(taskMeta.data().taskLastID)+1)+"";
			let body = {
				title: this.state.title,
				company: this.state.company?this.state.company.id:null,
				workHours: this.state.workHours,
				requester: this.state.requester?this.state.requester.id:null,
				assignedTo: this.state.assignedTo.map((item)=>item.id),
				description: this.state.description,
				status: this.state.status?this.state.status.id:null,
				deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : toCentralTime(new Date(this.state.deadline).getTime()),
				createdAt:toCentralTime(new Date().getTime()),
				statusChange:toCentralTime(new Date().getTime()),
				project: this.state.project?this.state.project.id:null,
				pausal: this.state.pausal.value,
				overtime: this.state.overtime.value,
				tags: this.state.tags.map((item)=>item.id),
				type: this.state.type?this.state.type.id:null,
				repeat: this.state.repeat!==null?newID:null
			}

			this.state.taskWorks.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_works',{task:newID,...item});
			})

			this.state.taskMaterials.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_materials',{task:newID,...item});
			})

			this.state.subtasks.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_subtasks',{task:newID,...item});
			})

			if(this.state.repeat !==null){
				rebase.addToCollection('/help-repeats', {
					...this.state.repeat,
					task:newID,
					startAt:(new Date(this.state.repeat.startAt).getTime()),
				},newID);
			}


			rebase.addToCollection('/help-tasks', body,newID)
			.then(()=>{
				rebase.updateDoc('/metadata/0',{taskLastID:newID});
				this.setState({
					saving:false,
					hidden:true,
					title:'',
					company:null,
					workHours:'0',
					requester:null,
					assignedTo:[],
					tags:[],
					type:null,
					description:'',
					status:null,
					statusChange:null,
					project:null,
					pausal:{value:true,label:'Pausal'},
					overtime:{value:false,label:'Nie'},
					taskWorks:[],
					taskMaterials:[],
					subtasks:[],
					repeat:null
				})
				this.props.closeModal();
				this.props.history.push('/helpdesk/taskList/i/all/'+newID);
			});
		})
	}



		setDefaults(projectID, forced){
			if(projectID===null){
				this.setState({defaults:noDef});
				return;
			}

			database.collection('help-projects').doc(projectID).get().then((project)=>{
				let def = project.data().def;
				if(!def){
					this.setState({defaults:noDef});
					return;
				}

				if (this.props.task && !forced) {
					this.setState({
						defaults: def,
					});
					return;
				}

				let state  = this.state;
				this.setState({
					assignedTo: def.assignedTo&& (def.assignedTo.fixed||def.assignedTo.def)? state.users.filter((item)=> def.assignedTo.value.includes(item.id)):[],
					company: def.company&& (def.company.fixed||def.company.def)?state.companies.find((item)=> item.id===def.company.value):null,
					requester: def.requester&& (def.requester.fixed||def.requester.def)?state.users.find((item)=> item.id===def.requester.value):null,
					status: def.status&& (def.status.fixed||def.status.def)?state.statuses.find((item)=> item.id===def.status.value):null,
					tags: def.tags&& (def.tags.fixed||def.tags.def)? state.allTags.filter((item)=> def.tags.value.includes(item.id)):[],
					type: def.type && (def.type.fixed||def.type.def)?state.taskTypes.find((item)=> item.id===def.type.value):null,
					project: state.projects.find((item)=>item.id===project.id),
					defaults: def
				});
			});
		}

		setData(){
			let status = this.props.statuses.find((item)=>item.title==='New');
			if(!status){
				status=null;
			}

			this.setState({
				statuses: this.props.statuses,
				projects: this.props.projects,
				users: this.props.users,
				companies: this.props.companies,
				workTypes: this.props.workTypes,
				taskTypes: this.props.taskTypes,
				allTags: this.props.allTags,
				units: this.props.units,
				defaultUnit: this.props.defaultUnit,

				status: this.props.task ? this.props.task.status : status,

				title: this.props.task ? this.props.task.title : '',
				description: this.props.task ? this.props.task.description : '',
				deadline: this.props.task ? this.props.task.deadline : null,
				pausal: this.props.task ? this.props.task.pausal : {value:true,label:'Pausal'},
				overtime: this.props.task ? this.props.task.overtime : {value:false,label:'Nie'},
				statusChange: this.props.task ? this.props.task.statusChange : null,
				project: this.props.task ? this.props.task.project : null,
				company: this.props.task ? this.props.task.company : null,
				workHours: this.props.task ? this.props.task.workHours : 0,
				requester: this.props.task ? this.props.task.requester : null,
				assignedTo: this.props.task ? this.props.task.assignedTo : [],
				repeat: this.props.task ? this.props.task.repeat : null,
				type: this.props.task ? this.props.task.type : null,
				tags: this.props.task ? this.props.task.tags : [],
				taskWorks: this.props.task ? this.props.task.taskWorks.map(w => {
						delete w['fake'];
						delete w['task'];
						return {...w, id:this.getNewID()};})
					 : [],
			 subtasks: this.props.task ? this.props.task.subtasks.map(s => {
						delete s['fake'];
						delete s['task'];
						return {...s, id:this.getNewID()};})
					 : [],
				taskMaterials: this.props.task ? this.props.task.taskMaterials.map(m => {
						delete m['fake'];
						delete m['task'];
						return {...m, id:this.getNewID()};})
					: [],

				defaults:noDef,

				hidden: false,
			},() => this.setDefaults(this.props.project, false));
		}

		render(){

			let taskWorks= this.state.taskWorks.map((work)=>{
				let finalUnitPrice=parseFloat(work.price);
				if(work.extraWork){
					finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
				}
				let totalPrice=(finalUnitPrice*parseFloat(work.quantity)*(1-parseFloat(work.discount)/100)).toFixed(2);
				finalUnitPrice=finalUnitPrice.toFixed(2);
				let workType= this.state.workTypes.find((item)=>item.id===work.workType);
				let assignedTo=work.assignedTo?this.state.users.find((item)=>item.id===work.assignedTo):null
				return {
					...work,
					workType,
					unit:this.state.units.find((unit)=>unit.id===work.unit),
					finalUnitPrice,
					totalPrice,
					assignedTo:assignedTo?assignedTo:null
				}
			});

			let taskMaterials= this.state.taskMaterials.map((material)=>{
				let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100));
				let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(2);
				finalUnitPrice=finalUnitPrice.toFixed(2);
				return {
					...material,
					unit:this.state.units.find((unit)=>unit.id===material.unit),
					finalUnitPrice,
					totalPrice
				}
			});

			return (
				<div>
					<div className="m-b-15">
						{
							this.state.statuses.sort((item1,item2)=>{
								if(item1.order &&item2.order){
									return item1.order > item2.order? 1 :-1;
								}
								return -1;
							}).map((status)=>
							<Button
								key={status.id}
								className="btn-link"
								disabled={this.state.defaults.status.fixed}
								onClick={()=>{this.setState({status})}}
								> <i className={(status.icon?status.icon:"")+" commandbar-command-icon"}/>{" "+status.title}
							</Button>
						)
					}
					</div>
				<div className="scrollable">
					<div className="p-t-0">
						<div className="row m-b-15">
							<h1 className="center-hor text-extra-slim">NEW: </h1>
							<span className="center-hor flex m-r-15">
								<input type="text" value={this.state.title} className="task-title-input text-extra-slim hidden-input" onChange={(e)=>this.setState({title:e.target.value})} placeholder="Enter task name" />
							</span>
							<div className="ml-auto center-hor">
								<span className="label label-info" style={{backgroundColor:this.state.status && this.state.status.color?this.state.status.color:'white'}}>{this.state.status?this.state.status.title:'Neznámy status'}</span>
							</div>
						</div>

						<hr className="m-t-15 m-b-10"/>

							<div className="col-lg-12 row m-b-10">
								<div className="center-hor m-r-5"><Label className="center-hor">Assigned to: </Label></div>
								<div className="f-1">
									<Select
										value={this.state.assignedTo}
										isDisabled={this.state.defaults.assignedTo.fixed}
										isMulti
										onChange={(users)=>this.setState({assignedTo:users})}
										options={this.state.users}
										styles={invisibleSelectStyleNoArrow}
										/>
								</div>
							</div>


					<div className="col-lg-12">
						<div className="col-lg-4">
								<div className="row p-r-10 m-b-10">
									<Label className="col-3 col-form-label">Typ</Label>
									<div className="col-9">
										<Select
											value={this.state.type}
											isDisabled={this.state.defaults.type.fixed}
											styles={invisibleSelectStyleNoArrow}
											onChange={(type)=>this.setState({type})}
											options={this.state.taskTypes}
											/>
									</div>
								</div>
								<div className="row p-r-10 m-b-10">
									<Label className="col-3 col-form-label">Projekt</Label>
									<div className="col-9">
										<Select
											value={this.state.project}
											onChange={(project)=>this.setState({project},()=>this.setDefaults(project.id, true))}
											options={this.state.projects}
											styles={invisibleSelectStyleNoArrow}
											/>
									</div>
								</div>
						</div>

						<div className="col-lg-4">
								<div className="row p-r-10 m-b-10">
									<Label className="col-3 col-form-label">Zadal</Label>
									<div className="col-9">
										<Select
											value={this.state.requester}
											isDisabled={this.state.defaults.requester.fixed}
											onChange={(requester)=>this.setState({requester})}
											options={this.state.users}
											styles={invisibleSelectStyleNoArrow}
											/>
									</div>
								</div>
								<div className="row p-r-10 m-b-10">
									<Label className="col-3 col-form-label">Firma</Label>
									<div className="col-9">
										<Select
											value={this.state.company}
											isDisabled={this.state.defaults.company.fixed}
											onChange={(company)=>this.setState({company})}
											options={this.state.companies}
											styles={invisibleSelectStyleNoArrow}
											/>
									</div>
								</div>
						</div>

						<div className="col-lg-4">
							<div className="row p-r-10 m-b-10">
								<Label className="col-3 col-form-label">Deadline</Label>
								<div className="col-9">
									{/*className='form-control hidden-input'*/}
									<input
										className='form-control hidden-input'
										placeholder="Status change date"
										type="datetime-local"
										value={this.state.deadline}
										onChange={(e)=>{
											this.setState({deadline:e.target.value})}
										}
										/>
								</div>
							</div>
							<Repeat
								taskID={null}
								repeat={this.state.repeat}
								submitRepeat={(repeat)=>{
									this.setState({repeat:repeat})
								}}
								deleteRepeat={()=>{
									this.setState({repeat:null})
								}}
								/>
						</div>

					</div>

						<Label className="m-t-5  m-b-10 task-detail-label">Popis</Label>
						<textarea className="form-control b-r-0 m-b-10 hidden-input" placeholder="Enter task description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />

						<div className="row">
							<div className="center-hor"><Label className="center-hor task-detail-label">Tagy: </Label></div>
							<div className="f-1 ">
								<Select
									value={this.state.tags}
									isDisabled={this.state.defaults.tags.fixed}
									isMulti
									onChange={(tags)=>this.setState({tags})}
									options={this.state.allTags}
									styles={invisibleSelectStyleNoArrow}
									/>
							</div>
						</div>

						{!this.state.hidden && false && <Subtasks
							taskAssigned={this.state.assignedTo}
							submitService={(newSubtask)=>{
								this.setState({subtasks:[...this.state.subtasks,{id:this.getNewID(),...newSubtask}]});
							}}
							subtasks={this.state.subtasks.map((subtask)=>{
								let assignedTo=subtask.assignedTo?this.state.users.find((item)=>item.id===subtask.assignedTo):null
								return {
									...subtask,
									assignedTo:assignedTo?assignedTo:null
								}
							})}
							updateSubtask={(id,newData)=>{
								let newSubtasks=[...this.state.subtasks];
								newSubtasks[newSubtasks.findIndex((subtask)=>subtask.id===id)]={...newSubtasks.find((subtask)=>subtask.id===id),...newData};
								this.setState({subtasks:newSubtasks});
							}}
							removeSubtask={(id)=>{
								let newSubtasks=[...this.state.subtasks];
								newSubtasks.splice(newSubtasks.findIndex((subtask)=>subtask.id===id),1);
								this.setState({subtasks:newSubtasks});
							}}
							match={{params:{taskID:null}}}
						/>}


						{this.state.toggleTab!=="1" && <ServicesExpenditure
							taskAssigned={this.state.assignedTo}
							submitService={(newService)=>{
								this.setState({taskWorks:[...this.state.taskWorks,{id:this.getNewID(),...newService}]});
							}}
							updatePrices={(ids)=>{
								let newTaskWorks=[...this.state.taskWorks];
								taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
									let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
									if(price === undefined){
										price = 0;
									}else{
										price = price.price;
									}
									newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
									return null;
								})
								this.setState({taskWorks:newTaskWorks});
							}}
							subtasks={taskWorks}
							workTypes={this.state.workTypes}
							updateSubtask={(id,newData)=>{
								let newTaskWorks=[...this.state.taskWorks];
								newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
								this.setState({taskWorks:newTaskWorks});
							}}
							company={this.state.company}
							removeSubtask={(id)=>{
								let newTaskWorks=[...this.state.taskWorks];
								newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
								this.setState({taskWorks:newTaskWorks});
							}}
							match={{params:{taskID:null}}}
							/>}

							{this.state.toggleTab==='1' && <ServicesBudget
								taskAssigned={this.state.assignedTo}
								submitService={(newService)=>{
									this.setState({taskWorks:[...this.state.taskWorks,{id:this.getNewID(),...newService}]});
								}}
								updatePrices={(ids)=>{
									let newTaskWorks=[...this.state.taskWorks];
									taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
										let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
										if(price === undefined){
											price = 0;
										}else{
											price = price.price;
										}
										newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
										return null;
									})
									this.setState({taskWorks:newTaskWorks});
								}}
								subtasks={taskWorks}
								workTypes={this.state.workTypes}
								updateSubtask={(id,newData)=>{
									let newTaskWorks=[...this.state.taskWorks];
									newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
									this.setState({taskWorks:newTaskWorks});
								}}
								company={this.state.company}
								removeSubtask={(id)=>{
									let newTaskWorks=[...this.state.taskWorks];
									newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
									this.setState({taskWorks:newTaskWorks});
								}}
								match={{params:{taskID:null}}}
								/>}

						<hr className="m-b-15" style={{marginLeft: "-30px", marginRight: "-30px", marginTop: "-5px"}}/>

						<Nav tabs className="b-0 m-b-22 m-l--10">
								<NavItem>
									<NavLink
										className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
										onClick={() => { this.setState({toggleTab:'1'}); }}
									>
										Materiál
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
										onClick={() => { this.setState({toggleTab:'2'}); }}
									>
										Rozpočet
									</NavLink>
								</NavItem>
							</Nav>

							<TabContent activeTab={this.state.toggleTab}>
								<TabPane tabId="1">
									<MaterialsExpenditure
										materials={taskMaterials}
										submitMaterial={(newMaterial)=>{
											this.setState({taskMaterials:[...this.state.taskMaterials,{id:this.getNewID(),...newMaterial}]});
										}}
										updateMaterial={(id,newData)=>{
											let newTaskMaterials=[...this.state.taskMaterials];
											newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskMaterials:newTaskMaterials});
										}}
										removeMaterial={(id)=>{
											let newTaskMaterials=[...this.state.taskMaterials];
											newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
											this.setState({taskMaterials:newTaskMaterials});
										}}
										units={this.state.units}
										defaultUnit={this.state.defaultUnit}
										company={this.state.company}
										match={{params:{taskID:null}}}
									/>
								</TabPane>
								<TabPane tabId="2">
									<MaterialsBudget
										materials={taskMaterials}
										submitMaterial={(newMaterial)=>{
											this.setState({taskMaterials:[...this.state.taskMaterials,{id:this.getNewID(),...newMaterial}]});
										}}
										updateMaterial={(id,newData)=>{
											let newTaskMaterials=[...this.state.taskMaterials];
											newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskMaterials:newTaskMaterials});
										}}
										removeMaterial={(id)=>{
											let newTaskMaterials=[...this.state.taskMaterials];
											newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
											this.setState({taskMaterials:newTaskMaterials});
										}}
										units={this.state.units}
										defaultUnit={this.state.defaultUnit}
										company={this.state.company}
										match={{params:{taskID:null}}}
									/>
								</TabPane>
							</TabContent>


						{!this.state.hidden && false && <Services
							taskAssigned={this.state.assignedTo}
							submitService={(newService)=>{
								this.setState({taskWorks:[...this.state.taskWorks,{id:this.getNewID(),...newService}]});
							}}
							updatePrices={(ids)=>{
								let newTaskWorks=[...this.state.taskWorks];
								taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
									let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
									if(price === undefined){
										price = 0;
									}else{
										price = price.price;
									}
									newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
									return null;
								})
								this.setState({taskWorks:newTaskWorks});
							}}
							subtasks={taskWorks}
							workTypes={this.state.workTypes}
							updateSubtask={(id,newData)=>{
								let newTaskWorks=[...this.state.taskWorks];
								newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
								this.setState({taskWorks:newTaskWorks});
							}}
							company={this.state.company}
							removeSubtask={(id)=>{
								let newTaskWorks=[...this.state.taskWorks];
								newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
								this.setState({taskWorks:newTaskWorks});
							}}
							match={{params:{taskID:null}}}
							/>}

							{!this.state.hidden && false && <Materials
								materials={taskMaterials}
								submitMaterial={(newMaterial)=>{
									this.setState({taskMaterials:[...this.state.taskMaterials,{id:this.getNewID(),...newMaterial}]});
								}}
								updateMaterial={(id,newData)=>{
									let newTaskMaterials=[...this.state.taskMaterials];
									newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
									this.setState({taskMaterials:newTaskMaterials});
								}}
								removeMaterial={(id)=>{
									let newTaskMaterials=[...this.state.taskMaterials];
									newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
									this.setState({taskMaterials:newTaskMaterials});
								}}
								units={this.state.units}
								defaultUnit={this.state.defaultUnit}
								company={this.state.company}
								match={{params:{taskID:null}}}
								/>}

							</div>


							<button
								className="btn pull-right"
								disabled={this.state.title==="" || this.state.status===null || this.state.project === null || this.state.company === null || this.state.saving || this.props.loading}
								onClick={this.submitTask.bind(this)}
								> Add
							</button>
							<div></div>
						</div>
					</div>
				);
			}
		}
