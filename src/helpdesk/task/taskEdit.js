import React, { Component } from 'react';
import Select from 'react-select';
import {Button, Label, TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import Attachments from '../components/attachments.js';
import Comments from '../components/comments.js';
import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';

import ServicesExpenditure from '../components/services/prace';
import MaterialsExpenditure from '../components/materials/materials';
import ServicesBudget from '../components/services/rozpocet';
import MaterialsBudget from '../components/materials/rozpocet';

import TaskAdd from './taskAddContainer';
import TaskPrint from './taskPrint';
import classnames from "classnames";
import {rebase, database} from '../../index';
import firebase from 'firebase';
import {toSelArr, snapshotToArray, timestampToString, toCentralTime, fromCentralTime} from '../../helperFunctions';
import {invisibleSelectStyleNoArrow} from '../../scss/selectStyles';

const noDef={
	status:{def:false,fixed:false, value: null},
	tags:{def:false,fixed:false, value: []},
	assignedTo:{def:false,fixed:false, value: []},
	type:{def:false,fixed:false, value: null},
	requester:{def:false,fixed:false, value: null},
	company:{def:false,fixed:false, value: null}
}

export default class TaskEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saving:false,
			loading:true,
			addItemModal:false,
			users:[],
			companies:[],
			workTypes:[],
			statuses:[],
			projects:[],
			taskMaterials:[],
			taskWorks:[],
			subtasks:[],
			units:[],
			allTags:[],
			taskTypes:[],
			defaultUnit:null,
			task:null,
			openEditServiceModal:false,
			openService:null,
			openEditMaterialModal:false,
			openMaterial:null,
			defaultFields:noDef,

			title:'',
			company:null,
			workHours:'0',
			requester:null,
			assignedTo:[],
			description:'',
			status:null,
			statusChange:null,
			deadline:"",
			reminder:null,
			project:null,
			tags:[],
			pausal:{value:true,label:'Pausal'},
			overtime:{value:true,label:'Áno'},
			type:null,
			createdAt:null,
			repeat:null,
			attachments:[],

			/////
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			openCopyModal: false,
			toggleTab:"1",

			print: false,
		};
    this.submitTask.bind(this);
    this.submitMaterial.bind(this);
    this.submitService.bind(this);
		this.canSave.bind(this);
		this.deleteTask.bind(this);
    this.fetchData(this.props.match.params.taskID);
		/*
		console.log('----------------');
		let testTime = new Date();
		let centralTime = new Date(toCentralTime(testTime.getTime()));
		let normalTime = new Date(fromCentralTime(centralTime.getTime()));
		console.log(testTime);
		console.log(testTime.getTime());
		console.log('>');
		console.log(centralTime);
		console.log(centralTime.getTime());
		console.log('>');
		console.log(normalTime);
		console.log(normalTime.getTime());
		console.log('----------------');*/
	}

	canSave(){
		return this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving;
	}

	deleteTask(){
		if(window.confirm("Are you sure?")){
			rebase.removeDoc('/help-tasks/'+this.state.task.id);
			this.state.taskMaterials.forEach((material)=>rebase.removeDoc('/help-task_materials/'+material.id))
			this.state.taskWorks.forEach((work)=>rebase.removeDoc('/help-task_works/'+work.id))
			this.state.subtasks.forEach((subtask)=>rebase.removeDoc('/help-task_subtasks/'+subtask.id))
			if(this.state.repeat!==null){
				rebase.removeDoc('/help-repeats/'+this.state.task.id);
			}
			database.collection('help-comments').where("task", "==", this.state.task.id).get()
			.then((data)=>{
				snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-comments/'+item.id));
			});
		}
	}

	submitTask(){
		if(this.canSave()){
			return;
		}
    this.setState({saving:true});
		console.log(new Date(this.state.deadline));
    let body = {
      title: this.state.title,
      company: this.state.company?this.state.company.id:null,
      workHours: this.state.workHours,
      requester: this.state.requester?this.state.requester.id:null,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
      description: this.state.description,
      status: this.state.status?this.state.status.id:null,
			deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : toCentralTime(new Date(this.state.deadline).getTime()),
			//reminder: isNaN(new Date(this.state.reminder).getTime()) ? null : (new Date(this.state.reminder).getTime()),
      statusChange: this.state.statusChange,
      project: this.state.project?this.state.project.id:null,
      pausal: this.state.pausal.value,
      overtime: this.state.overtime.value,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type?this.state.type.id:null,
			repeat: this.state.repeat!==null?this.state.task.id:null,
			attachments:this.state.attachments,
    }

    rebase.updateDoc('/help-tasks/'+this.state.task.id, body)
    .then(()=>{
      this.setState({saving:false});
    });
  }

	submitSubtask(body){
		rebase.addToCollection('help-task_subtasks',{task:this.props.match.params.taskID,...body}).then((result)=>{
			this.setState({subtasks:[...this.state.subtasks, {task:this.props.match.params.taskID,...body,id:result.id}]})
		});
	}

  submitMaterial(body){
    rebase.addToCollection('help-task_materials',{task:this.props.match.params.taskID,...body}).then((result)=>{
      this.setState({taskMaterials:[...this.state.taskMaterials, {task:this.props.match.params.taskID,...body,id:result.id}]})
    });
  }

  submitService(body){
    rebase.addToCollection('help-task_works',{task:this.props.match.params.taskID,...body}).then((result)=>{
      this.setState({taskWorks:[...this.state.taskWorks, {task:this.props.match.params.taskID,...body,id:result.id}]})
    });
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.taskID!==props.match.params.taskID){
      this.setState({loading:true})
      this.fetchData(props.match.params.taskID);
    }
  }

  fetchData(taskID){
    Promise.all(
      [
        database.collection('help-tasks').doc(taskID).get(),
        database.collection('help-statuses').get(),
        database.collection('help-projects').get(),
        database.collection('companies').get(),
        database.collection('help-work_types').get(),
        database.collection('help-units').get(),
        database.collection('help-prices').get(),
        database.collection('help-pricelists').get(),
        database.collection('users').get(),
				database.collection('help-tags').get(),
				database.collection('help-task_types').get(),
        database.collection('help-task_materials').where("task", "==", taskID).get(),
        database.collection('help-task_works').where("task", "==", taskID).get(),
				database.collection('help-task_subtasks').where("task", "==", taskID).get(),
        database.collection('help-repeats').doc(taskID).get(),
				rebase.get('metadata/0', {
					context: this,
				})
    ]).then(([task,statuses,projects, companies, workTypes, units, prices, pricelists, users, tags,taskTypes, taskMaterials, taskWorks,subtasks,repeat,meta])=>{
      this.setData(
				{id:task.id,...task.data()},
				toSelArr(snapshotToArray(statuses)),
				toSelArr(snapshotToArray(projects)),
				toSelArr(snapshotToArray(users),'email'),
				toSelArr(snapshotToArray(tags)),
      	toSelArr(snapshotToArray(companies)),
				toSelArr(snapshotToArray(workTypes)),
      	toSelArr(snapshotToArray(units)),
				toSelArr(snapshotToArray(taskTypes)),
				snapshotToArray(prices),
				snapshotToArray(taskMaterials),
				snapshotToArray(taskWorks),
				snapshotToArray(subtasks),
				snapshotToArray(pricelists),
				repeat.exists ? {id:repeat.id,...repeat.data()} : null,
				meta.defaultUnit);
    });
  }

	setDefaults(projectID){
		if(projectID===null){
			this.setState({defaultFields:noDef});
			return;
		}

		database.collection('help-projects').doc(projectID).get().then((project)=>{
			let def = project.data().def;
			if(!def){
				this.setState({defaultFields:noDef});
				return;
			}
			this.setState({
				defaultFields:def
			});
		});
	}

  setData(task, statuses, projects,users,tags,companies,workTypes,units,taskTypes, prices,taskMaterials,taskWorks,subtasks,pricelists,repeat,defaultUnit){
		this.setDefaults(task.project);
    let project = projects.find((item)=>item.id===task.project);
    let status = statuses.find((item)=>item.id===task.status);
    let company = companies.find((item)=>item.id===task.company);
		if(company===undefined){
			company=companies[0];
		}
    company = {...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
    let requester = users.find((item)=>item.id===task.requester);
    let assignedTo = users.filter((user)=>task.assignedTo.includes(user.id));
    let type = taskTypes.find((item)=>item.id===task.type);

    let newCompanies=companies.map((company)=>{
      let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
      return newCompany;
    });
    let newWorkTypes=workTypes.map((workType)=>{
      let newWorkType = {...workType, prices:prices.filter((price)=>price.workType===workType.id)}
      return newWorkType;
    });
		let taskTags=[];
		if(task.tags){
			taskTags=tags.filter((tag)=>task.tags.includes(tag.id));
		}
    this.setState({
      task,
      statuses,
      projects,
      users,
      companies:newCompanies,
      workTypes:newWorkTypes,
      units,
      taskMaterials,
      taskWorks,
			subtasks,
			taskTypes,
			allTags:tags,

			description:task.description,
      title:task.title,
      pausal:task.pausal?{value:true,label:'Pausal'}:{value:false,label:'Project'},
			overtime:task.overtime?{value:true,label:'Áno'}:{value:false,label:'Nie'},
      status:status?status:null,
			statusChange:task.statusChange?task.statusChange:null,
			createdAt:task.createdAt?task.createdAt:null,
			deadline: task.deadline!==null?new Date(fromCentralTime(task.deadline)).toISOString().replace('Z',''):'',
			reminder: task.reminder?new Date(task.reminder).toISOString().replace('Z',''):'',
      project:project?project:null,
      company:company?company:null,
      workHours:isNaN(parseInt(task.workHours))?0:parseInt(task.workHours),
      requester:requester?requester:null,
      assignedTo,
			attachments:task.attachments?task.attachments:[],

      loading:false,
			defaultUnit,
			tags:taskTags,
			type:type?type:null,
			repeat,
			projectChangeDate:(new Date()).getTime(),
			toggleTab:'1'
    });
  }

	render() {
		let taskWorks= this.state.taskWorks.map((work)=>{
			let finalUnitPrice=parseFloat(work.price);
			if(work.extraWork){
				finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
			}
			let totalPrice=(finalUnitPrice*parseFloat(work.quantity)*(1-parseFloat(work.discount)/100)).toFixed(3);
			finalUnitPrice=finalUnitPrice.toFixed(3);
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
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(3);
			finalUnitPrice=finalUnitPrice.toFixed(3);
			return {
				...material,
				unit:this.state.units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice
			}
		});

		return (
			<div className="flex">
				<div className="container-fluid">
					<div className="d-flex flex-row center-hor p-2 ">
							<div className="display-inline center-hor">
							{!this.props.columns &&
								<button type="button" className="btn btn-link waves-effect" onClick={() => this.props.history.push(`/helpdesk/taskList/i/${this.props.match.params.listID}`)}>
									<i
										className="fas fa-arrow-left commandbar-command-icon"
										/>
								</button>
							}
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
									disabled={this.state.defaultFields.status.fixed}
									onClick={()=>{this.setState({status,statusChange:(new Date().getTime())},this.submitTask.bind(this))}}
									><i className={(status.icon?status.icon:"")+" commandbar-command-icon"}/>{" "+status.title}
								</Button>
								)
							}
							{this.state.project
								&&
								<TaskAdd history={this.props.history} project={this.state.project.id} triggerDate={this.state.projectChangeDate} task={this.state} disabled={this.canSave()}/>
							}
						</div>
						<div className="ml-auto center-hor">
							<TaskPrint match={this.props.match} {...this.state}/>
							<button type="button" disabled={this.canSave()} className="btn btn-link waves-effect" onClick={this.deleteTask.bind(this)}>
								<i
									className="far fa-trash-alt"
									/> Delete
								</button>
								{/*<button type="button" disabled={this.canSave()} className="btn btn-link waves-effect" onClick={this.submitTask.bind(this)}>
								<i
								className="fas fa-save icon-M mr-3"
								/>
								{this.state.saving?'Saving... ':''}
								</button>*/}
							</div>
					</div>
				</div>

						<div className="card-box fit-with-header-and-commandbar scrollable">
							<div className="d-flex p-2">
								<div className="row flex">
									<h1 className="center-hor text-extra-slim">{this.props.match.params.taskID}: </h1>
									<span className="center-hor flex m-r-15">
							    	<input type="text" value={this.state.title} className="task-title-input text-extra-slim hidden-input" onChange={(e)=>this.setState({title:e.target.value},this.submitTask.bind(this))} placeholder="Enter task name" />
									</span>
									<div className="ml-auto center-hor">
									<span className="label label-info" style={{backgroundColor:this.state.status && this.state.status.color?this.state.status.color:'white'}}>{this.state.status?this.state.status.title:'Neznámy status'}</span>
									</div>
								</div>
							</div>


							<div className="row">
								<div className="col-lg-12 d-flex">
									<p className=""><span className="text-muted">Created by</span> Branislav Šusta <span className="text-muted"> at {this.state.createdAt?(timestampToString(this.state.createdAt)):''}</span></p>
									<p className="text-muted ml-auto">{this.state.statusChange?('Status changed at ' + timestampToString(this.state.statusChange)):''}</p>
								</div>

							</div>

							<hr className="m-t-15 m-b-10"/>

								<div className="col-lg-12 row m-b-10">
									<div className="center-hor m-r-5"><Label className="center-hor">Assigned to: </Label></div>
									<div className="f-1">
										<Select
											value={this.state.assignedTo}
											placeholder="Zadajte poverených pracovníkov"
											isMulti
											isDisabled={this.state.defaultFields.assignedTo.fixed}
											onChange={(users)=>this.setState({assignedTo:users},this.submitTask.bind(this))}
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
														placeholder="Zadajte typ"
					                  value={this.state.type}
														isDisabled={this.state.defaultFields.type.fixed}
														styles={invisibleSelectStyleNoArrow}
					                  onChange={(type)=>this.setState({type},this.submitTask.bind(this))}
					                  options={this.state.taskTypes}
					                  />
												</div>
											</div>
											<div className="row p-r-10 m-b-10">
												<Label className="col-3 col-form-label">Projekt</Label>
												<div className="col-9">
													<Select
														placeholder="Zadajte projekt"
														value={this.state.project}
														onChange={(project)=>this.setState({project, projectChangeDate:(new Date()).getTime()},()=>{this.submitTask();this.setDefaults(project.id)})}
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
														placeholder="Zadajte žiadateľa"
														value={this.state.requester}
														isDisabled={this.state.defaultFields.requester.fixed}
														onChange={(requester)=>this.setState({requester},this.submitTask.bind(this))}
														options={this.state.users}
														styles={invisibleSelectStyleNoArrow}
														/>
												</div>
											</div>
											<div className="row p-r-10 m-b-10">
												<Label className="col-3 col-form-label">Firma</Label>
												<div className="col-9">
													<Select
														placeholder="Zadajte firmu"
														value={this.state.company}
														isDisabled={this.state.defaultFields.company.fixed}
														onChange={(company)=>this.setState({company},this.submitTask.bind(this))}
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
														this.setState({deadline:e.target.value},this.submitTask.bind(this))}
													}
													/>
											</div>
										</div>
											<Repeat
												taskID={this.props.match.params.taskID}
												repeat={this.state.repeat}
												submitRepeat={(repeat)=>{
													database.collection('help-repeats').doc(this.props.match.params.taskID).set({
														...repeat,
														task:this.props.match.params.taskID,
														startAt:(new Date(repeat.startAt).getTime()),
														});
													this.setState({repeat})
												}}
												deleteRepeat={()=>{
													rebase.removeDoc('/help-repeats/'+this.state.task.id);
													this.setState({repeat:null})
												}}
												columns={this.props.columns}
												/>
									</div>

								</div>


							{false && <div className="form-group m-b-0 row">
								<label className="col-5 col-form-label text-slim">Mimo pracovných hodín</label>
								<div className="col-7">
									<Select
										value={this.state.overtime}
										styles={invisibleSelectStyleNoArrow}
										onChange={(overtime)=>this.setState({overtime},this.submitTask.bind(this))}
										options={[{value:true,label:'Áno'},{value:false,label:'Nie'}]}
										/>
								</div>
							</div>}
							{false && <div className="row">
								<label className="col-5 col-form-label text-slim">Pripomienka</label>
								<div className="col-7">
									{/*className='form-control hidden-input'*/}
									<input
										className='form-control'
										placeholder="Status change date"
										type="datetime-local"
										value={this.state.reminder}
										onChange={(e)=>{
											this.setState({reminder:e.target.value},this.submitTask.bind(this))}
										}
										/>
								</div>
							</div>}

							<Label className="m-t-5  m-b-10">Popis</Label>
							<textarea className="form-control b-r-0  m-b-10 hidden-input" placeholder="Enter task description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value},this.submitTask.bind(this))} />

							<div className="row">
								<div className="center-hor"><Label className="center-hor">Tagy: </Label></div>
								<div className="f-1 ">
									<Select
										placeholder="Zvoľte tagy"
										value={this.state.tags}
										isMulti
										onChange={(tags)=>this.setState({tags},this.submitTask.bind(this))}
										options={this.state.allTags}
										isDisabled={this.state.defaultFields.tags.fixed}
										styles={invisibleSelectStyleNoArrow}
										/>
								</div>
							</div>

								<Subtasks
									taskAssigned={this.state.assignedTo}
									submitService={this.submitSubtask.bind(this)}
									subtasks={this.state.subtasks.map((subtask)=>{
										let assignedTo=subtask.assignedTo?this.state.users.find((item)=>item.id===subtask.assignedTo):null
										return {
											...subtask,
											assignedTo:assignedTo?assignedTo:null
										}
									})}
									updateSubtask={(id,newData)=>{
										rebase.updateDoc('help-task_subtasks/'+id,newData);
										let newSubtasks=[...this.state.subtasks];
										newSubtasks[newSubtasks.findIndex((subtask)=>subtask.id===id)]={...newSubtasks.find((subtask)=>subtask.id===id),...newData};
										this.setState({subtasks:newSubtasks});
									}}
									removeSubtask={(id)=>{
										rebase.removeDoc('help-task_subtasks/'+id).then(()=>{
											let newSubtasks=[...this.state.subtasks];
											newSubtasks.splice(newSubtasks.findIndex((subtask)=>subtask.id===id),1);
											this.setState({subtasks:newSubtasks});
										});
										}
									}
									match={this.props.match}
								/>

							<hr className="m-b-15" style={{marginLeft: "-30px", marginRight: "-30px", marginTop: "-5px"}}/>

							<Nav tabs className="b-0 m-b-22 m-l--10">
									<NavItem>
										<NavLink
											className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
											onClick={() => { this.setState({toggleTab:'1'}); }}
										>
											Komentáre
		            		</NavLink>
									</NavItem>
									<NavItem>
										<NavLink
											className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
											onClick={() => { this.setState({toggleTab:'2'}); }}
										>
											Výkaz
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink
											className={classnames({ active: this.state.toggleTab === '3' }, "clickable", "")}
											onClick={() => { this.setState({toggleTab:'3'}); }}
										>
											Rozpočet
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink
											className={classnames({ active: this.state.toggleTab === '4' }, "clickable", "")}
											onClick={() => { this.setState({toggleTab:'4'}); }}
										>
											Prílohy
										</NavLink>
									</NavItem>
								</Nav>

								<TabContent activeTab={this.state.toggleTab}>
									<TabPane tabId="1">
										<Comments id={this.state.task?this.state.task.id:null} users={this.state.users} />
									</TabPane>
									<TabPane tabId="2">
										<ServicesExpenditure
											taskAssigned={this.state.assignedTo}
											submitService={this.submitService.bind(this)}
											updatePrices={(ids)=>{
												taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
													let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
													if(price === undefined){
														price = 0;
													}else{
														price = price.price;
													}
													rebase.updateDoc('help-task_works/'+item.id, {price})
													.then(()=>{
														let newTaskWorks=[...this.state.taskWorks];
														newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
														this.setState({taskWorks:newTaskWorks});
													});
													return null;
												})
											}}
											subtasks={taskWorks}
											workTypes={this.state.workTypes}
											updateSubtask={(id,newData)=>{
												rebase.updateDoc('help-task_works/'+id,newData);
												let newTaskWorks=[...this.state.taskWorks];
												newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
												this.setState({taskWorks:newTaskWorks});
											}}
											company={this.state.company}
											removeSubtask={(id)=>{
												rebase.removeDoc('help-task_works/'+id).then(()=>{
													let newTaskWorks=[...this.state.taskWorks];
													newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
													this.setState({taskWorks:newTaskWorks});
												});
												}
											}
											match={this.props.match}
											/>

										<MaterialsExpenditure
											materials={taskMaterials}
							        submitMaterial={this.submitMaterial.bind(this)}
											updateMaterial={(id,newData)=>{
												rebase.updateDoc('help-task_materials/'+id,newData);
												let newTaskMaterials=[...this.state.taskMaterials];
												newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
												this.setState({taskMaterials:newTaskMaterials});
											}}
											removeMaterial={(id)=>{
												rebase.removeDoc('help-task_materials/'+id).then(()=>{
													let newTaskMaterials=[...this.state.taskMaterials];
													newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
													this.setState({taskMaterials:newTaskMaterials});
												});
											}}
							        units={this.state.units}
											defaultUnit={this.state.defaultUnit}
											company={this.state.company}
											match={this.props.match}
										/>
									</TabPane>
									<TabPane tabId="3">
										<ServicesBudget
											taskAssigned={this.state.assignedTo}
											submitService={this.submitService.bind(this)}
											updatePrices={(ids)=>{
												taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
													let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
													if(price === undefined){
														price = 0;
													}else{
														price = price.price;
													}
													rebase.updateDoc('help-task_works/'+item.id, {price})
													.then(()=>{
														let newTaskWorks=[...this.state.taskWorks];
														newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
														this.setState({taskWorks:newTaskWorks});
													});
													return null;
												})
											}}
											subtasks={taskWorks}
											workTypes={this.state.workTypes}
											updateSubtask={(id,newData)=>{
												rebase.updateDoc('help-task_works/'+id,newData);
												let newTaskWorks=[...this.state.taskWorks];
												newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
												this.setState({taskWorks:newTaskWorks});
											}}
											company={this.state.company}
											removeSubtask={(id)=>{
												rebase.removeDoc('help-task_works/'+id).then(()=>{
													let newTaskWorks=[...this.state.taskWorks];
													newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
													this.setState({taskWorks:newTaskWorks});
												});
												}
											}
											match={this.props.match}
											/>

										<MaterialsBudget
											materials={taskMaterials}
							        submitMaterial={this.submitMaterial.bind(this)}
											updateMaterial={(id,newData)=>{
												rebase.updateDoc('help-task_materials/'+id,newData);
												let newTaskMaterials=[...this.state.taskMaterials];
												newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
												this.setState({taskMaterials:newTaskMaterials});
											}}
											removeMaterial={(id)=>{
												rebase.removeDoc('help-task_materials/'+id).then(()=>{
													let newTaskMaterials=[...this.state.taskMaterials];
													newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
													this.setState({taskMaterials:newTaskMaterials});
												});
											}}
							        units={this.state.units}
											defaultUnit={this.state.defaultUnit}
											company={this.state.company}
											match={this.props.match}
										/>
									</TabPane>
									<TabPane tabId="4">
										<Attachments
											attachments={this.state.attachments}
											addAttachments={(newAttachments)=>{
												let time = (new Date()).getTime();
												let storageRef = firebase.storage().ref();
												Promise.all([
													...newAttachments.map((attachment)=>{
														return storageRef.child(`help-tasks/${this.props.match.params.taskID}/${time}-${attachment.size}-${attachment.name}`).put(attachment)
													})
												]).then((resp)=>{
														Promise.all([
															...newAttachments.map((attachment)=>{
																return storageRef.child(`help-tasks/${this.props.match.params.taskID}/${time}-${attachment.size}-${attachment.name}`).getDownloadURL()
															})
														]).then((urls)=>{
																newAttachments=newAttachments.map((attachment,index)=>{
																	return {
																		title:attachment.name,
																		size:attachment.size,
																		path:`help-tasks/${this.props.match.params.taskID}/${time}-${attachment.size}-${attachment.name}`,
																		url:urls[index]
																	}
																});
																this.setState({attachments:[...this.state.attachments,...newAttachments]},this.submitTask.bind(this));
															})
													})
											}}
											removeAttachment={(attachment)=>{
												let storageRef = firebase.storage().ref();
												let newAttachments = [...this.state.attachments];
												newAttachments.splice(newAttachments.findIndex((item)=>item.path===attachment.path),1);
												storageRef.child(attachment.path).delete();
												this.setState({attachments:newAttachments},this.submitTask.bind(this));
											}}
											/>
									</TabPane>
								</TabContent>
						</div>
			</div>
		);
	}
}
