import React, { Component } from 'react';
import Select from 'react-select';
import CKEditor from 'ckeditor4-react';
import {rebase} from '../../index';
import firebase from 'firebase';
import {toCentralTime } from '../../helperFunctions';
import { Label, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import WorkTrips from '../components/workTrips';
import Prace from '../components/prace';
import Materials from '../components/materials';
import MaterialsBudget from '../components/materials/rozpocet';
import MaterialsExpenditure from '../components/materials/materials';

import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';
import Attachments from '../components/attachments';
import PraceWorkTrips from '../components/praceWorkTrips';
import classnames from "classnames";
import ck4config from '../../scss/ck4config';
import {invisibleSelectStyleNoArrow, invisibleSelectStyleNoArrowColored} from '../../scss/selectStyles';

const oneDay = 24*60*60*1000;
const noMilestone = {id:null,value:null,title:'None',label:'None'};
const booleanSelects = [{value:false,label:'No'},{value:true,label:'Yes'}];

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
		let requester=this.props.users?this.props.users.find((user)=>user.id===this.props.currentUser.id):null;
		this.state={
			saving:false,
			users:[],
			companies:[],
			statuses:[],
			projects:[],
			taskWorks:[],
			subtasks:[],
			taskMaterials:[],
			workTrips:[],
			milestones:[noMilestone],
			allTags:[],
			taskTypes:[],
			tripTypes:[],
			hidden:true,
			defaults:noDef,

			title:'',
			company:this.props.companies && requester ? this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company) : null,
			workHours:'0',
			requester,
			assignedTo:[],
			description:'',
			status:this.props.statuses?this.props.statuses:null,
			statusChange:null,
			deadline:"",
			closeDate:"",
			pendingDate:"",
			reminder:null,
			project:null,
			milestone:noMilestone,
			tags:[],
			pausal:{value:true,label:'Pausal'},
			overtime:{value:false,label:'Nie'},
			type:null,
			repeat:null,
			toggleTab: "1",
			viewOnly:true,
			descriptionVisible:false,
			attachments:[]
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

		let pendingDate = null;
		if(this.state.status.action==='pending'){
			pendingDate = isNaN(new Date(this.state.pendingDate).getTime()) ? ((new Date()).getTime()+oneDay) : new Date(this.state.pendingDate).getTime()
		}

		let closeDate = null;
		if(this.state.status.action==='close'){
			closeDate = isNaN(new Date(this.state.closeDate).getTime()) ? (new Date()).getTime() : new Date(this.state.closeDate).getTime()
		}

			let newID = (parseInt(this.props.newID)+1)+"";
			let body = {
				title: this.state.title,
				company: this.state.company?this.state.company.id:null,
				workHours: this.state.workHours,
				requester: this.state.requester?this.state.requester.id:this.props.currentUser.id,
				assignedTo: this.state.assignedTo.map((item)=>item.id),
				description: this.state.description,
				status: this.state.status?this.state.status.id:null,
				deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : toCentralTime(new Date(this.state.deadline).getTime()),
				createdAt:toCentralTime(new Date().getTime()),
				createdBy:this.props.currentUser.id,
				statusChange:toCentralTime(new Date().getTime()),
				project: this.state.project?this.state.project.id:null,
				pausal: this.state.pausal.value,
				milestone: this.state.milestone.value,
				overtime: this.state.overtime.value,
				tags: this.state.tags.map((item)=>item.id),
				type: this.state.type?this.state.type.id:null,
				repeat: this.state.repeat!==null?newID:null,
				closeDate,
				pendingDate,
			}

			this.state.taskWorks.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_works',{task:newID,...item});
			})

			this.state.taskMaterials.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_materials',{task:newID,...item});
			})
			this.state.workTrips.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_work_trips',{task:newID,...item});
			})
			/*
			this.state.subtasks.forEach((item)=>{
			delete item['id'];
			rebase.addToCollection('help-task_subtasks',{task:newID,...item});
			})
			*/


			let storageRef = firebase.storage().ref();
			Promise.all([
				...this.state.attachments.map((attachment)=>{
					return storageRef.child(`help-tasks/${newID}/${attachment.time}-${attachment.size}-${attachment.name}`).put(attachment.data)
				})
			])
			.then((resp)=>{
				Promise.all([
					...this.state.attachments.map((attachment)=>{
						return storageRef.child(`help-tasks/${newID}/${attachment.time}-${attachment.size}-${attachment.name}`).getDownloadURL()
					})
				]).then((urls)=>{
						body.attachments=this.state.attachments.map((attachment,index)=>{
							return {
								title:attachment.title,
								size:attachment.size,
								path:`help-tasks/${newID}/${attachment.time}-${attachment.size}-${attachment.name}`,
								url:urls[index]
							}
						});
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
							let requester = this.props.users.find((user)=>user.id===this.props.currentUser.id);
							this.setState({
								saving:false,
								hidden:true,
								title:'',
								company:this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company),
								workHours:'0',
								requester,
								assignedTo:[],
								tags:[],
								type:null,
								description:'',
								status:this.props.statuses[0],
								statusChange:null,
								deadline:'',
								closeDate:'',
								pendingDate:'',
								project:null,
								viewOnly:true,
								milestone:noMilestone,
								pausal:{value:true,label:'Pausal'},
								overtime:{value:false,label:'Nie'},
								taskWorks:[],
								taskMaterials:[],
								workTrips:[],
								subtasks:[],
								repeat:null
							})
							this.props.closeModal();
							this.props.history.push('/helpdesk/taskList/i/all/'+newID);
						});

					})
			});
	}

	setDefaults(projectID, forced){
		if(projectID===null){
			this.setState({defaults:noDef});
			return;
		}
		let project = this.props.projects.find((proj)=>proj.id===projectID);
		let def = project.def;
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
			let permission = project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
			let requester=this.props.users?this.props.users.find((user)=>user.id===this.props.currentUser.id):null;

			this.setState({
				assignedTo: def.assignedTo&& (def.assignedTo.fixed||def.assignedTo.def)? state.users.filter((item)=> def.assignedTo.value.includes(item.id)):[],
				company: def.company&& (def.company.fixed||def.company.def)?state.companies.find((item)=> item.id===def.company.value):(this.props.companies && requester ? this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company) : null),
				requester: def.requester&& (def.requester.fixed||def.requester.def)?state.users.find((item)=> item.id===def.requester.value):requester,
				status: def.status&& (def.status.fixed||def.status.def)?state.statuses.find((item)=> item.id===def.status.value):state.statuses[0],
				tags: def.tags&& (def.tags.fixed||def.tags.def)? state.allTags.filter((item)=> def.tags.value.includes(item.id)):[],
				type: def.type && (def.type.fixed||def.type.def)?state.taskTypes.find((item)=> item.id===def.type.value):null,
				project,
				viewOnly: this.props.currentUser.userData.role.value===0 && !permission.write,
				defaults: def
			});
	}

	setData(){
			let status = this.props.statuses.find((item)=>item.title==='New');
			if(!status){
				status=this.props.statuses[0];
			}

			let permission = null;
			if(this.props.task){
				if(this.props.task.project){
					permission = this.props.task.project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
				}
			}

			let requester = this.props.task ? this.props.task.requester : this.props.users.find((user)=>user.id===this.props.currentUser.id);
			this.setState({
				statuses: this.props.statuses,
				projects: this.props.projects,
				users: this.props.users,
				companies: this.props.companies,
				taskTypes: this.props.taskTypes,
				tripTypes: this.props.tripTypes,
				milestones:this.props.milestones,
				allTags: this.props.allTags,
				units: this.props.units,
				defaultUnit: this.props.defaultUnit,

				status: this.props.task ? this.props.task.status : status,

				title: this.props.task ? this.props.task.title : '',
				description: this.props.task ? this.props.task.description : '',
				deadline: this.props.task ? this.props.task.deadline : '',
				pendingDate: this.props.task ? this.props.task.pendingDate : '',
				closeDate: this.props.task ? this.props.task.closeDate : '',
				milestone: this.props.task? this.props.task.milestone : noMilestone,
				pausal: this.props.task ? this.props.task.pausal : {value:true,label:'Pausal'},
				overtime: this.props.task ? this.props.task.overtime : {value:false,label:'Nie'},
				statusChange: this.props.task ? this.props.task.statusChange : null,
				project: this.props.task ? this.props.task.project : null,
				viewOnly: this.props.currentUser.userData.role.value===0 && (permission===null || !permission.write),
				company: this.props.task ? this.props.task.company : this.props.companies.find((company)=>company.id===this.props.currentUser.userData.company),
				workHours: this.props.task ? this.props.task.workHours : 0,
				requester,
				assignedTo: this.props.task ? this.props.task.assignedTo : [],
				repeat: this.props.task ? this.props.task.repeat : null,
				type: this.props.task ? this.props.task.type : null,
				tags: this.props.task ? this.props.task.tags : [],
				taskWorks: this.props.task ? this.props.task.taskWorks.map(w => {
						delete w['fake'];
						delete w['task'];
						return {...w, id:this.getNewID()};})
					 : [],/*
			 subtasks: this.props.task ? this.props.task.subtasks.map(s => {
						delete s['fake'];
						delete s['task'];
						return {...s, id:this.getNewID()};})
					 : [],*/
				taskMaterials: this.props.task ? this.props.task.taskMaterials.map(m => {
						delete m['fake'];
						delete m['task'];
						return {...m, id:this.getNewID()};})
					: [],
				workTrips: this.props.task ? this.props.task.workTrips.map(m => {
						delete m['fake'];
						delete m['task'];
						return {...m, id:this.getNewID()};})
					: [],
				defaults:noDef,

				hidden: false,
			},() => this.setDefaults(this.props.project, false));
		}

	render(){

		let workTrips= this.state.workTrips.map((trip)=>{
			let type= this.state.tripTypes.find((item)=>item.id===trip.type);
			let assignedTo=trip.assignedTo?this.state.users.find((item)=>item.id===trip.assignedTo):null

			return {
				...trip,
				type,
				assignedTo:assignedTo?assignedTo:null
			}
		});

		let taskWorks= this.state.taskWorks.map((work)=>{
			let finalUnitPrice=parseFloat(work.price);
			if(work.extraWork){
				finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
			}
			let totalPrice=(finalUnitPrice*parseFloat(work.quantity)*(1-parseFloat(work.discount)/100)).toFixed(2);
			finalUnitPrice=finalUnitPrice.toFixed(2);
			let workType= this.state.taskTypes.find((item)=>item.id===work.workType);
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
			<div className="scrollable">
				<div className="p-t-0">
					<div className="row m-b-15">
						<h1 className="center-hor text-extra-slim">NEW: </h1>
						<span className="center-hor flex m-r-15">
							<input type="text" value={this.state.title} className="task-title-input text-extra-slim hidden-input" onChange={(e)=>this.setState({title:e.target.value})} placeholder="Enter task name" />
						</span>
					</div>

					<hr className="m-t-15 m-b-10"/>

				<div className="row">
						{this.state.viewOnly &&
							<div className="row p-r-10 m-b-10">
							<Label className="col-3 col-form-label">Projekt</Label>
							<div className="col-9">
								<Select
									value={this.state.project}
									onChange={(project)=>{
										let newState={project,
											milestone:noMilestone,
											viewOnly:this.props.currentUser.userData.role.value===0 && !project.permissions.find((permission)=>permission.user===this.props.currentUser.id).write
										}
										if(newState.viewOnly){
											newState={
												...newState,
												repeat:null,
												taskWorks:[],
												subtasks:[],
												taskMaterials:[],
												workTrips:[],
												allTags:[],
												deadline:"",
												closeDate:"",
												pendingDate:"",
												reminder:null,
											}
										}
										this.setState(newState,()=>this.setDefaults(project.id, true))
									}}
									options={this.state.projects.filter((project)=>{
										let curr = this.props.currentUser;
										if(curr.userData.role.value===3){
											return true;
										}
										let permission = project.permissions.find((permission)=>permission.user===curr.id);
										return permission && permission.read;
									})}
									styles={invisibleSelectStyleNoArrow}
									/>
							</div>
						</div>
						}

				{!this.state.viewOnly && <div className="col-lg-12">
					<div className="col-lg-4">
						<div className="row p-r-10 m-b-10">
							<Label className="col-3 col-form-label">Projekt</Label>
							<div className="col-9">
								<Select
									value={this.state.project}
									onChange={(project)=>{
										let newState={project,
											milestone:noMilestone,
											viewOnly:this.props.currentUser.userData.role.value===0 && !project.permissions.find((permission)=>permission.user===this.props.currentUser.id).write
										}
										if(newState.viewOnly){
											newState={
												...newState,
												repeat:null,
												taskWorks:[],
												subtasks:[],
												workTrips:[],
												taskMaterials:[],
												allTags:[],
												deadline:"",
												closeDate:"",
												pendingDate:"",
												reminder:null,
											}
										}
										this.setState(newState,()=>this.setDefaults(project.id, true))
									}}
									options={this.state.projects.filter((project)=>{
										let curr = this.props.currentUser;
										if(curr.userData.role.value===3){
											return true;
										}
										let permission = project.permissions.find((permission)=>permission.user===curr.id);
										return permission && permission.read;
									})}
									styles={invisibleSelectStyleNoArrow}
									/>
							</div>
						</div>
					</div>
					<div className="col-lg-8">
						<div className="row p-r-10 m-b-10">
							<Label className="col-1-5 col-form-label">Assigned to</Label>
							<div className="col-10-5">
								<Select
									value={this.state.assignedTo}
									isDisabled={this.state.defaults.assignedTo.fixed||this.state.viewOnly}
									isMulti
									onChange={(users)=>this.setState({assignedTo:users})}
									options={this.state.users}
									styles={invisibleSelectStyleNoArrow}
									/>
								</div>
						</div>
					</div>
					<div className="col-lg-4">
						<div className="row p-r-10 m-b-10">
							<Label className="col-3 col-form-label">Status</Label>
							<div className="col-9">
								<Select
									value={this.state.status}
									isDisabled={this.state.defaults.status.fixed||this.state.viewOnly}
									styles={invisibleSelectStyleNoArrowColored}
									onChange={(status)=>{
										if(status.action==='pending'){
											this.setState({
												status,
												pendingDate:new Date((new Date()).getTime()+oneDay).toISOString().replace('Z',''),
											})
										}else if(status.action==='close'){
											this.setState({
												status,
												closeDate: (new Date()).toISOString().replace('Z',''),
											})
										}
										else{
											this.setState({status})
										}
									}}
									options={this.state.statuses.filter((status)=>status.action!=='invoiced').sort((item1,item2)=>{
										if(item1.order &&item2.order){
											return item1.order > item2.order? 1 :-1;
										}
										return -1;
									})}
									/>
							</div>
						</div>
							<div className="row p-r-10 m-b-10">
								<Label className="col-3 col-form-label">Typ</Label>
								<div className="col-9">
									<Select
										value={this.state.type}
										isDisabled={this.state.defaults.type.fixed||this.state.viewOnly}
										styles={invisibleSelectStyleNoArrow}
										onChange={(type)=>this.setState({type})}
										options={this.state.taskTypes}
										/>
								</div>
							</div>
							<div className="row p-r-10 m-t-10">
								<Label className="col-3 col-form-label m-t-3">Milestone</Label>
								<div className="col-9">
									<Select
										isDisabled={this.state.viewOnly}
										value={this.state.milestone}
										onChange={(milestone)=> {
											this.setState({milestone});
											}
										}
										options={this.state.milestones ? this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null && milestone.project===this.state.project.id)) : null}
										styles={invisibleSelectStyleNoArrow}
										/>
								</div>
							</div>
							<div className="row p-r-10 m-t-10">
								<Label className="col-3 col-form-label m-t-3">Tags</Label>
								<div className="col-9">
									<Select
										value={this.state.tags}
										isDisabled={this.state.defaults.tags.fixed||this.state.viewOnly}
										isMulti
										onChange={(tags)=>this.setState({tags})}
										options={this.state.allTags}
										styles={invisibleSelectStyleNoArrowColored}
										/>
								</div>
							</div>
							{false && <div className="row p-r-10 m-b-10">
								<Label className="col-3 col-form-label">Close date</Label>
								<div className="col-9">
									{/*className='form-control hidden-input'*/}
									<input
										className='form-control hidden-input'
										placeholder="Close date"
										type="datetime-local"
										disabled={!this.state.status||this.state.status.action!=='close'||this.state.viewOnly}
										value={this.state.closeDate}
										onChange={(e)=>{
											this.setState({closeDate:e.target.value})
										}}
										/>
								</div>
							</div>}
					</div>

					<div className="col-lg-4">
							<div className="row p-r-10 m-b-10">
								<Label className="col-3 col-form-label">Zadal*</Label>
								<div className="col-9">
									<Select
										value={this.state.requester}
										isDisabled={this.state.defaults.requester.fixed||this.state.viewOnly}
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
										isDisabled={this.state.defaults.company.fixed||this.state.viewOnly}
										onChange={(company)=>this.setState({company})}
										options={this.state.companies}
										styles={invisibleSelectStyleNoArrow}
										/>
								</div>
							</div>
							<div className="row p-r-10 m-b-10">
								<Label className="col-3 col-form-label">Paušál</Label>
								<div className="col-9">
									<Select
										value={null}
										isDisabled={false}
										styles={invisibleSelectStyleNoArrow}
										onChange={() => {}}
										options={booleanSelects}
										/>
								</div>
							</div>

							{false && <div className="row p-r-10 m-b-10">
								<Label className="col-3 col-form-label">Pending</Label>
								<div className="col-9">
									{/*className='form-control hidden-input'*/}
									<input
										className='form-control hidden-input'
										placeholder="Pending"
										disabled={!this.state.status||this.state.status.action!=='pending'||this.state.viewOnly}
										type="datetime-local"
										value={this.state.pendingDate}
										onChange={(e)=>{
											this.setState({pendingDate:e.target.value})
										}}
										/>
								</div>
							</div>}
					</div>

					<div className="col-lg-4">
						<div className="row p-r-10 m-b-10">
							<Label className="col-3 col-form-label">Deadline</Label>
							<div className="col-9">
								<input
									className='form-control hidden-input'
									placeholder="Status change date"
									type="datetime-local"
									disabled={this.state.viewOnly}
									value={this.state.deadline || ""}
									onChange={(e)=>{
										this.setState({deadline:e.target.value})}
									}
									/>
							</div>
						</div>
					<Repeat
							taskID={null}
							repeat={this.state.repeat}
							disabled={this.state.viewOnly}
							submitRepeat={(repeat)=>{
								if(this.state.viewOnly){
									return;
								}
								this.setState({repeat:repeat})
							}}
							deleteRepeat={()=>{
								this.setState({repeat:null})
							}}
							columns={true}
							/>
							<div className="row p-r-10 m-b-10">
								<Label className="col-3 col-form-label">Mimo PH</Label>
								<div className="col-9">
									<Select
										value={null}
										disabled={false}
										styles={invisibleSelectStyleNoArrow}
										onChange={() => {}}
										options={booleanSelects}
										/>
								</div>
							</div>
					</div>
				</div>}
				</div>
					<Label className="m-t-5 m-b-10 form-label">Popis úlohy</Label><br/>
					{!this.state.descriptionVisible && <span className="p-20 text-muted" onClick={()=>this.setState({descriptionVisible:true})}>Napíšte krátky popis úlohy</span>}
					{this.state.descriptionVisible && <CKEditor
						data={this.state.description}
						onChange={(e)=>{
							this.setState({description:e.editor.getData()})
						}}
						readOnly={this.state.viewOnly}
						config={{
							...ck4config
						}}
						/>
				}

				<div>
						{!this.state.viewOnly && !this.state.hidden && false && <Subtasks
							disabled={this.state.viewOnly}
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

						{!this.state.viewOnly &&
							<Nav tabs className="b-0 m-t-20 m-b-22 m-l--10 flex p-t-1 p-b-1" style={{backgroundColor: "#faf9f8"}}>
								<NavItem  className="p-t-5 p-b-5">
									<NavLink
										className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
										onClick={() => { this.setState({toggleTab:'1'}); }}
									>
										Výkaz
									</NavLink>
								</NavItem>
								<div style={{borderRight:"2px solid #BDBDBD"}} className="m-t-5 m-b-5"></div>
								<NavItem  className="p-t-5 p-b-5">
									<NavLink
										className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
										onClick={() => { this.setState({toggleTab:'2'}); }}
									>
										Rozpočet
									</NavLink>
								</NavItem>
								<div style={{borderRight:"2px solid #BDBDBD"}} className="m-t-5 m-b-5"></div>
								<NavItem  className="p-t-5 p-b-5">
									<NavLink
										className={classnames({ active: this.state.toggleTab === '3' }, "clickable", "")}
										onClick={() => { this.setState({toggleTab:'3'}); }}
									>
										Prílohy
									</NavLink>
								</NavItem>
							</Nav>}
							{!this.state.viewOnly &&
								<TabContent activeTab={this.state.toggleTab}>
								<TabPane tabId="1">
									<PraceWorkTrips
										extended={false}
										showAll={false}
										disabled={this.state.viewOnly}
										taskAssigned={this.state.assignedTo}
										subtasks={taskWorks}
										defaultType={this.state.type}
										workTypes={this.state.taskTypes}
										company={this.state.company}
										taskID={null}
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
										updateSubtask={(id,newData)=>{
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskWorks:newTaskWorks});
										}}
										removeSubtask={(id)=>{
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
											this.setState({taskWorks:newTaskWorks});
										}}
										workTrips={workTrips}
										tripTypes={this.props.tripTypes}
										submitTrip={(newTrip)=>{
											this.setState({workTrips:[...this.state.workTrips,{id:this.getNewID(),...newTrip}]});
										}}
										updateTrip={(id,newData)=>{
											let newTrips=[...this.state.workTrips];
											newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
											this.setState({workTrips:newTrips});
										}}
										removeTrip={(id)=>{
											let newTrips=[...this.state.workTrips];
											newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
											this.setState({workTrips:newTrips});
										}}
										/>
									<MaterialsExpenditure
										disabled={this.state.viewOnly}
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
									<PraceWorkTrips
										extended={true}
										showAll={true}
										disabled={this.state.viewOnly}
										taskAssigned={this.state.assignedTo}
										subtasks={taskWorks}
										defaultType={this.state.type}
										workTypes={this.state.taskTypes}
										company={this.state.company}
										taskID={null}
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
										updateSubtask={(id,newData)=>{
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
											this.setState({taskWorks:newTaskWorks});
										}}
										removeSubtask={(id)=>{
											let newTaskWorks=[...this.state.taskWorks];
											newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
											this.setState({taskWorks:newTaskWorks});
										}}
										workTrips={workTrips}
										tripTypes={this.props.tripTypes}
										submitTrip={(newTrip)=>{
											this.setState({workTrips:[...this.state.workTrips,{id:this.getNewID(),...newTrip}]});
										}}
										updateTrip={(id,newData)=>{
											let newTrips=[...this.state.workTrips];
											newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
											this.setState({workTrips:newTrips});
										}}
										removeTrip={(id)=>{
											let newTrips=[...this.state.workTrips];
											newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
											this.setState({workTrips:newTrips});
										}}
										/>
									<MaterialsBudget
										disabled={this.state.viewOnly}
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
								<TabPane tabId="3">
								<Attachments
									disabled={this.state.viewOnly}
									attachments={this.state.attachments}
									addAttachments={(newAttachments)=>{
										let time = (new Date()).getTime();
										newAttachments=newAttachments.map((attachment)=>{
											return {
												title:attachment.name,
												size:attachment.size,
												time,
												data:attachment
											}
										});
										this.setState({attachments:[...this.state.attachments,...newAttachments]});
									}}
									removeAttachment={(attachment)=>{
										let newAttachments = [...this.state.attachments];
										newAttachments.splice(newAttachments.findIndex((item)=>item.title===attachment.title && item.size===attachment.size && item.time===attachment.time),1);
										this.setState({attachments:newAttachments});
									}}
									/>
							</TabPane>
							</TabContent>}
					</div>
			</div>

						<button
							className="btn pull-right"
							disabled={this.state.title==="" || this.state.status===null || this.state.project === null || this.state.company === null || this.state.saving || this.props.loading||this.props.newID===null}
							onClick={this.submitTask.bind(this)}
							> Add
						</button>
					</div>
				</div>
			);
		}
	}
