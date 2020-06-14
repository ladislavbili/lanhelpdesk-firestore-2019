import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from "react-redux";
import { Label, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
//import CKEditor4 from 'ckeditor4-react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Attachments from '../components/attachments.js';
import Comments from '../components/comments.js';
//import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';

import VykazyTable from '../components/vykazyTable';

import UserAdd from '../settings/users/userAdd';
import CompanyAdd from '../settings/companies/companyAdd';

import TaskAdd from './taskAddContainer';
import classnames from "classnames";
import {rebase, database} from '../../index';
import firebase from 'firebase';
import ck5config from '../../scss/ck5config';
//import ck4config from '../../scss/ck4config';
import datePickerConfig from '../../scss/datePickerConfig';
import PendingPicker from '../components/pendingPicker';
import {toSelArr, snapshotToArray, timestampToString, sameStringForms} from '../../helperFunctions';
import { storageCompaniesStart, storageHelpPricelistsStart, storageHelpPricesStart,storageHelpProjectsStart, storageHelpStatusesStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageHelpTasksStart, storageHelpUnitsStart,storageHelpWorkTypesStart, storageMetadataStart, storageUsersStart, storageHelpMilestonesStart, storageHelpTripTypesStart } from '../../redux/actions';
import {invisibleSelectStyleNoArrow, invisibleSelectStyleNoArrowColored,invisibleSelectStyleNoArrowColoredRequired, invisibleSelectStyleNoArrowRequired} from '../../scss/selectStyles';
import { REST_URL } from 'config';

const noMilestone = {id:null,value:null,title:'None',label:'None',startsAt:null};
const booleanSelects = [{value:false,label:'No'},{value:true,label:'Yes'}];

const noDef={
	status:{def:false, fixed:false, value: null, show: true },
	tags:{def:false, fixed:false, value: [], show: true },
	assignedTo:{def:false, fixed:false, value: [], show: true },
	type:{def:false, fixed:false, value: null, show: true },
	requester:{def:false, fixed:false, value: null, show: true },
	company:{def:false, fixed:false, value: null, show: true },
	pausal:{def:false, fixed:false, value: booleanSelects[0], show: true },
	overtime:{def:false, fixed:false, value: booleanSelects[0], show: true },
}

class MultipleTaskEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layout: "1",

			saving:false,
			loading:true,
			addItemModal:false,
			tasks: props.tasks,

			users:[],
			companies:[],
			statuses:[],
			projects:[],
			milestones:[noMilestone],
			tags:[],
			taskTypes:[],

			defaultFields:noDef,
			history:[],

			project:null,
			status:null,
			type:null,
			milestone:noMilestone,
			assignedTo:[],
			requester:null,
			company:null,
			pausal:booleanSelects[0],
			deadline:null,
			repeat:null,
			overtime:booleanSelects[0],

			closeDate:null,
			pendingDate:null,
			pendingChangable:false,
			attachments:[],

			/////
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			openCopyModal: false,

			openUserAdd: false,
			openCompanyAdd: false,
			viewOnly:true,
		};
		this.setData.bind(this);
		this.storageLoaded.bind(this);
		this.renderTitle.bind(this);
		this.renderSelectsLayout1.bind(this);
		this.renderAttachments.bind(this);
		this.getHistoryMessage.bind(this);
		this.submit.bind(this);
//    this.fetchData(this.props.match.params.taskID);
	}

	componentWillReceiveProps(props){
		if (this.props.tasks !== props.tasks) {
			this.setState({
				tasks: props.tasks,
			})
		}
		if(!sameStringForms(props.companies,this.props.companies)||
			!sameStringForms(props.projects,this.props.projects)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.tags,this.props.tags)||
			!sameStringForms(props.taskTypes,this.props.taskTypes)||
			!sameStringForms(props.users,this.props.users)||
			!sameStringForms(props.milestones,this.props.milestones)||
			(!this.storageLoaded(this.props) && this.storageLoaded(props))
		){
			this.setData(props);
		}
	}

	componentWillMount(){
		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}
		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}
		if(!this.props.tagsActive){
			this.props.storageHelpTagsStart();
		}
		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}
		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		if(!this.props.milestonesActive){
			this.props.storageHelpMilestonesStart();
		}
		this.setData(this.props);
}

storageLoaded(props){
	return props.companiesLoaded &&
		props.projectsLoaded &&
		props.statusesLoaded &&
		props.tagsLoaded &&
		props.taskTypesLoaded &&
		props.usersLoaded &&
		props.milestonesLoaded
}

setData(props){
	let prices = props.prices;
		let taskTypes = toSelArr(props.taskTypes).map((taskType)=>{
			let newTaskType = {...taskType, prices:prices.filter((price)=>price.type===taskType.id)}
			return newTaskType;
		});
		this.setState({
			statuses: toSelArr(this.props.statuses),
			projects: toSelArr(this.props.projects),
			users: toSelArr(this.props.users,'email'),
			tags: toSelArr(this.props.tags),
			companies: toSelArr(this.props.companies),
			taskTypes,
			milestones: [noMilestone,...toSelArr(props.milestones)],
		})
  }

	addToHistory(event){
		rebase.addToCollection('help-task_history',event).then((result)=>{
      this.setState({history: [ {...event, id: Math.random() } , ...this.state.history]});
    });
	}

	addNotification(originalEvent,internal){
		let event = {
			...originalEvent,
			read:false
		}
		let usersToNotify=[...this.state.assignedTo.filter((user)=>!internal || this.getPermissions(user.id).internal)];
		if( this.state.requester && (!internal || this.getPermissions(this.state.requester.id).internal) && !usersToNotify.some((user)=>user.id===this.state.requester.id)){
			usersToNotify.push(this.state.requester);
		}
		usersToNotify = usersToNotify.filter((user)=>user.id!==this.props.currentUser.id);
		usersToNotify.forEach((user)=>{
			rebase.addToCollection('user_notifications',{ ...event, user: user.id }).then((newNotification)=>{
				if(user.mailNotifications){
					firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((token)=>{
						fetch(`${REST_URL}/send-notification`,{
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'POST',
						body:JSON.stringify({
							message:`<div>
							<h4>Nové upozornenie</h4>
							<p>Zmena: ${event.message}</p>
							<p>V úlohe: ${event.task}: ${this.state.title}</p>
							<p>Odkaz: https://lanhelpdesk2019.lansystems.sk/helpdesk/notifications/${newNotification.id}/${event.task}</p>
						</div>`,
						tos:[user.email],
						subject:`Upozornenie na zmenu: ${event.message}`,
						token,
					}),
				}).then((response)=>response.json().then((response)=>{
					if(response.error){
					}
				})).catch((error)=>{
					console.log(error);
				});
			});
			//end of sending mail
		}
			});
	 })
	}

	getHistoryMessage(type, data){
		let user = "Používateľ " + this.props.currentUser.userData.name + ' ' + this.props.currentUser.userData.surname;
		switch (type) {
			case 'status':{
				return `${user} zmenil status z ${data.oldStatus?data.oldStatus.title:''} na ${data.newStatus?data.newStatus.title:''}.`;
			}
			case 'comment':{
				return user + ' komentoval úlohu.';
			}
			default:{
				return user + ' spravil nedefinovanú zmenu.';
			}
		}
	}

	submit(){
		this.state.tasks.forEach((task, i) => {
			console.log(task);
			let taskID = task.id;
			this.setState({saving:true});

			let statusAction = this.state.status ? this.state.status.action : "";

			let body = {
				company: this.state.company?this.state.company.id: task.company.id,
				requester: this.state.requester?this.state.requester.id: task.requester.id,
				assignedTo: task.assignedTo ? task.assignedTo.map(a => a.id).concat(this.state.assignedTo.map((item)=>item.id)) : this.state.assignedTo.map((item)=>item.id),
				status: this.state.status?this.state.status.id: task.status.id,
				project: this.state.project ? this.state.project.id :  task.project.id,
				pausal: this.state.pausal ? this.state.pausal.value : task.pausal,
				overtime: this.state.overtime.value,
				type: this.state.type?this.state.type.id: task.type,
				repeat: this.state.repeat!==null?taskID: task.repeat,
				milestone:this.state.milestone ? this.state.milestone.id : task.milestone.id,
				attachments: this.state.attachments,
				deadline: this.state.deadline!==null?this.state.deadline.unix()*1000: task.deadline,
				closeDate: (this.state.closeDate!==null && (statusAction==='close'||statusAction==='invoiced'|| statusAction==='invalid'))?this.state.closeDate.unix()*1000: task.closeDate,
				pendingDate: (this.state.pendingDate!==null && statusAction==='pending')?this.state.pendingDate.unix()*1000: task.pendingDate,
				pendingChangable: this.state.pendingChangable ? this.state.pendingChangable : task.pendingChangable,

				title: task.title ? task.title : "",
	      workHours: task.workHours ? task.workHours : null,
	      description: task.description ? task.description : null,
	      statusChange: task.statusChange ? task.statusChange : null,
				tags: task.tags ? task.tags : null,
				invoicedDate: task.invoicedDate ? task.invoicedDate : null,
				important: task.important ? task.important : false,
				checked: false,
			}

			rebase.updateDoc('/help-tasks/'+taskID, body).then((t)=>{
				this.setState({saving:false}, () => this.props.close());
			});
		});
	}

	//Renders
	render() {
		return (
			<div className={classnames("scrollable", { "p-20": this.state.layout === '1'}, { "row": this.state.layout === '2'})}>

				<div className={classnames({ "task-edit-left p-l-20 p-r-20 p-b-15 p-t-15": this.state.layout === '2'})}>

					{ this.renderTitle() }

					<hr className="m-t-15 m-b-10"/>

					{ this.renderSelectsLayout1() }

					{ this.renderAttachments() }

					{ this.renderComments() }

					<div className="row">
						<Button
							className="btn-link"
							onClick={()=>{this.props.close()}}
						>  Cancel
						</Button>

						<Button
							className="btn ml-auto"
							onClick={()=>{this.submit()}}
						>  Save
						</Button>
					</div>

				</div>
			</div>
		);
	}

	renderTitle(){
		return (
			<div className="row m-b-15">
				<span className="center-hor flex m-r-15">
					Edit tasks
				</span>
				<button
					type="button"
					className="btn btn-link waves-effect ml-auto asc"
					onClick={() => this.setState({layout: (this.state.layout === "1" ? "2" : "1")})}>
					Switch layout
				</button>
			</div>

		)
	}

	renderSelectsLayout1(){
		const USERS_WITH_PERMISSIONS = this.state.users.filter((user)=>this.state.project && this.state.project.permissions && this.state.project.permissions.some((permission)=>permission.user===user.id));
		const REQUESTERS =  (this.state.project && this.state.project.lockedRequester ? USERS_WITH_PERMISSIONS : this.state.users);

		return(
			<div className="row">

			 <div className="col-lg-12">
				<div className="col-lg-12">{/*NUTNE !! INAK AK NIE JE ZOBRAZENY ASSIGNED SELECT TAK SA VZHLAD POSUVA*/}
					<div className="col-lg-4">
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Projekt</Label>
							<div className="col-9">
								<Select
									placeholder="Select required"
									value={this.state.project}
									onChange={(project)=>{
										this.setState({
											project: project
										})
									}}
									options={this.state.projects.filter((project)=>{
										let curr = this.props.currentUser;
										if(curr.userData.role.value===3){
											return true;
										}
										let permission = project.permissions.find((permission)=>permission.user===curr.id);
										return permission && permission.read;
									})}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>
					</div>

					<div className="col-lg-8">
						<div className="row p-r-10">
							<Label className="col-1-5 col-form-label">Add assigned</Label>
							<div className="col-10-5">
								<Select
									placeholder="Select required"
									value={this.state.assignedTo}
									isMulti
									onChange={(users)=>this.setState({assignedTo:users})}
									options={USERS_WITH_PERMISSIONS}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
								</div>
						</div>
					</div>
				</div>

				<div className="col-lg-4">
					<div className="row p-r-10">
						<Label className="col-3 col-form-label">Status</Label>
						<div className="col-9">
							<Select
								placeholder="Select required"
								value={this.state.status}
								styles={invisibleSelectStyleNoArrowColoredRequired}
								onChange={(status)=>{
									if(status.action==='pending'){
										this.setState({
											status,
											pendingDate:  moment().add(1,'d'),
										})
									}else if(status.action==='close'||status.action==='invalid'){
										this.setState({
											status,
											closeDate: moment(),
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
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Typ</Label>
							<div className="col-9">
								<Select
									placeholder="Select required"
									value={this.state.type}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(type)=>this.setState({type})}
									options={this.state.taskTypes}
									/>
							</div>
						</div>
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Milestone</Label>
							<div className="col-9">
								<Select
									placeholder="None"
									value={this.state.milestone}
									onChange={(milestone)=> {
										if(this.state.status.action==='pending'){
											if(milestone.startsAt!==null){
												this.setState({milestone,pendingDate:moment(milestone.startsAt),pendingChangable:false});
											}else{
												this.setState({milestone, pendingChangable:true });
											}
										}else{
											this.setState({milestone});
										}
									}}
									options={this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null && milestone.project===this.state.project.id))}
									styles={invisibleSelectStyleNoArrow}
							/>
							</div>
						</div>
				</div>

				<div className="col-lg-4">
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Zadal</Label>
							<div className="col-9">
								<Select
									value={this.state.requester}
									placeholder="Select required"
									onChange={(requester)=>this.setState({requester})}
									options={REQUESTERS}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Firma</Label>
							<div className="col-9">
								<Select
									value={this.state.company}
									placeholder="Select required"
									onChange={(company)=>this.setState({company, pausal:parseInt(company.workPausal)>0?booleanSelects[1]:booleanSelects[0]})}
									options={this.state.companies}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>
						<div className="row p-r-10">
								<Label className="col-3 col-form-label">Paušál</Label>
								<div className="col-9">
									<Select
										value={this.state.pausal}
										placeholder="Select required"
										styles={invisibleSelectStyleNoArrowRequired}
										onChange={(pausal)=>this.setState({pausal})}
										options={booleanSelects}
										/>
								</div>
							</div>


				</div>

				<div className="col-lg-4">
					<div className="row p-r-10">
						<Label className="col-3 col-form-label">Deadline</Label>
							<div className="col-9">
								<DatePicker
									className="form-control hidden-input"
									selected={this.state.deadline}
									disabled={false}
									onChange={date => {
										this.setState({ deadline: date });
									}}
									placeholderText="No deadline"
									{...datePickerConfig}
									/>
							</div>
					</div>
				<Repeat
						taskID={null}
						repeat={this.state.repeat}
						disabled={false}
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
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Mimo PH</Label>
							<div className="col-9">
								<Select
									placeholder="Select required"
									value={this.state.overtime}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(overtime)=>this.setState({overtime})}
									options={booleanSelects}
									/>
							</div>
						</div>
				</div>
			</div>
		</div>
	)}

	renderAttachments(){
		return (
			<Attachments
				taskID={null}
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
			)
	}

	renderComments(){
		let permission = null;
		if(this.state.project){
			permission = this.state.project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
		}
		if( !permission ){
			permission = {user:this.props.currentUser.id,read:false,write:false,delete:false,internal:false,isAdmin:false};
		}

		return(
			<div className="comments">
				<Nav tabs className="b-0 m-b-22 m-l--10 m-t-15">
					<NavItem>
						<NavLink
							className={classnames({ active: true}, "clickable", "")}
						>
							Komentáre
						</NavLink>
					</NavItem>
				</Nav>

				<TabContent activeTab={true}>
						<TabPane tabId="1">
							<Comments
								id={this.state.tasks.map(task => task.id)}
								isMulti={true}
								showInternal={permission.internal || this.props.currentUser.userData.role.value > 1 }
								users={this.state.users}
								addToHistory={(internal)=>{
									let time = (new Date()).getTime();
									let mess = this.getHistoryMessage('comment');
									this.state.tasks.forEach((task, i) => {
										let event = {
											message: mess,
											createdAt: time,
											task: task.id
										};
										this.addToHistory(event);
										this.addNotification(event,internal);
									});
								}}
								/>
						</TabPane>
					</TabContent>
			</div>
		)
	}

}

const mapStateToProps = ({ userReducer, storageCompanies, storageHelpPricelists, storageHelpPrices, storageHelpProjects, storageHelpStatuses, storageHelpTags, storageHelpTaskTypes, storageHelpUnits, storageHelpWorkTypes, storageMetadata, storageUsers, storageHelpMilestones, storageHelpTripTypes }) => {
	const { companiesLoaded, companiesActive, companies } = storageCompanies;
	const { pricelistsLoaded, pricelistsActive, pricelists } = storageHelpPricelists;
	const { pricesLoaded, pricesActive, prices } = storageHelpPrices;
	const { projectsLoaded, projectsActive, projects } = storageHelpProjects;
	const { statusesLoaded, statusesActive, statuses } = storageHelpStatuses;
	const { tagsLoaded, tagsActive, tags } = storageHelpTags;
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { unitsLoaded, unitsActive, units } = storageHelpUnits;
	const { workTypesLoaded, workTypesActive, workTypes } = storageHelpWorkTypes;
	const { metadataLoaded, metadataActive, metadata } = storageMetadata;
	const { usersLoaded, usersActive, users } = storageUsers;
	const { milestonesLoaded, milestonesActive, milestones } = storageHelpMilestones;
  const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;

	return {
		currentUser:userReducer,
		companiesLoaded, companiesActive, companies,
		pricelistsLoaded, pricelistsActive, pricelists,
		pricesLoaded, pricesActive, prices,
		projectsLoaded, projectsActive, projects,
		statusesLoaded, statusesActive, statuses,
		tagsLoaded, tagsActive, tags,
		taskTypesLoaded, taskTypesActive, taskTypes,
		unitsLoaded, unitsActive, units,
		workTypesLoaded, workTypesActive, workTypes,
		metadataLoaded, metadataActive, metadata,
		usersLoaded, usersActive, users,
		milestonesLoaded, milestonesActive, milestones,
		tripTypesActive, tripTypes, tripTypesLoaded,
	 };
};

export default connect(mapStateToProps, { storageCompaniesStart, storageHelpPricelistsStart, storageHelpPricesStart,storageHelpProjectsStart, storageHelpStatusesStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageHelpUnitsStart,storageHelpWorkTypesStart, storageMetadataStart, storageUsersStart, storageHelpMilestonesStart, storageHelpTripTypesStart })(MultipleTaskEdit);
