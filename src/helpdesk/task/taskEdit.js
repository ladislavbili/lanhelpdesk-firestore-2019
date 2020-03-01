import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from "react-redux";
import { Label, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalBody, ListGroup, ListGroupItem} from 'reactstrap';
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
import TaskPrint from './taskPrint';
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

class TaskEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layout: "1",

			saving:false,
			loading:true,
			addItemModal:false,
			task:null,

			taskMaterials:[],
			customItems:[],
			taskWorks:[],
			workTrips:[],
			pricelists:[],
			extraData:null,
			extraDataLoaded:false,

			users:[],
			companies:[],
			workTypes:[],
			statuses:[],
			projects:[],
			milestones:[noMilestone],
			units:[],
			allTags:[],
			taskTypes:[],
			tripTypes:[],
			defaultUnit:null,
			defaultFields:noDef,
			history:[],

			title:'',
			company:null,
			workHours:'0',
			requester:null,
			assignedTo:[],
			description:'',
			status:null,
			statusChange:null,
			deadline:null,
			closeDate:null,
			pendingDate:null,
			pendingChangable:false,
			invoicedDate:'',
			reminder:null,
			project:null,
			tags:[],
			pausal:booleanSelects[0],
			overtime:booleanSelects[0],
			type:null,
			createdAt:null,
			repeat:null,
			milestone:noMilestone,
			attachments:[],

			/////
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			openCopyModal: false,
			toggleTab:"1",
			pendingOpen:false,
			pendingStatus:null,
			important:false,

			openUserAdd: false,
			openCompanyAdd: false,
			viewOnly:true,
			print: false,
			showDescription:false,
			newHistoryEntery:null,
		};
    this.submitTask.bind(this);
    this.submitMaterial.bind(this);
    this.submitCustomItem.bind(this);
    this.submitWorkTrip.bind(this);
    this.submitService.bind(this);
		this.canSave.bind(this);
		this.deleteTask.bind(this);
		this.addToHistory.bind(this);
		this.getHistoryMessage.bind(this);

		this.renderCommandbar.bind(this);
		this.renderTitle.bind(this);
		this.renderSelectsLayout1.bind(this);
		this.renderSelectsLayout2.bind(this);
		this.renderTags.bind(this);
		this.renderPopis.bind(this);
		this.renderModalUserAdd.bind(this);
		this.renderModalCompanyAdd.bind(this);
		this.renderPendingPicker.bind(this);
		this.renderAttachments.bind(this);
		this.renderVykazyTable.bind(this);
		this.renderComments.bind(this);
		this.getPermissions.bind(this);

    this.fetchData(this.props.match.params.taskID);
	}

	canSave(){
		return this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving||this.state.viewOnly;
	}

	storageLoaded(props){
		return props.companiesLoaded &&
			props.pricelistsLoaded &&
			props.pricesLoaded &&
			props.projectsLoaded &&
			props.statusesLoaded &&
			props.tagsLoaded &&
			props.taskTypesLoaded &&
			props.tasksLoaded &&
			props.unitsLoaded &&
			props.metadataLoaded &&
			props.usersLoaded &&
			props.tripTypesLoaded &&
			props.milestonesLoaded
	}

	deleteTask(){
		if(window.confirm("Are you sure?")){
			let taskID = this.props.match.params.taskID;
			let storageRef = firebase.storage().ref();
			this.state.attachments.map((attachment)=>storageRef.child(attachment.path).delete());

			rebase.removeDoc('/help-tasks/'+taskID);
			this.state.taskMaterials.forEach((material)=>rebase.removeDoc('/help-task_materials/'+material.id))
			this.state.customItems.forEach((item)=>rebase.removeDoc('/help-task_custom_items/'+item.id))
			this.state.taskWorks.forEach((work)=>rebase.removeDoc('/help-task_works/'+work.id))
			this.state.workTrips.forEach((workTrip)=>rebase.removeDoc('/help-task_work_trips/'+workTrip.id))
			if(this.state.repeat!==null){
				rebase.removeDoc('/help-repeats/'+taskID);
			}
			database.collection('help-comments').where("task", "==", taskID).get()
			.then((data)=>{
				snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-comments/'+item.id));
			});
			database.collection('help-calendar_events').where("taskID", "==", taskID).get()
			.then((data)=>{
				snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-calendar_events/'+item.id));
			});
			if(this.props.inModal){
				this.props.closeModal();
			}else{
				this.props.history.goBack();
				this.props.history.push(this.props.match.url.substring(0,this.props.match.url.length-this.props.match.params.taskID.length));
			}
		}
	}

	submitTask(){
		if(this.canSave()){
			return;
		}
		let taskID = this.props.match.params.taskID;
    this.setState({saving:true});

		let statusAction = this.state.status.action;
		let invoicedDate = null;
		if(statusAction==='invoiced'){
			invoicedDate = isNaN(new Date(this.state.invoicedDate).getTime()) ? (new Date()).getTime() : new Date(this.state.invoicedDate).getTime()
		}


    let body = {
      title: this.state.title,
      company: this.state.company?this.state.company.id:null,
      workHours: this.state.workHours,
      requester: this.state.requester?this.state.requester.id:null,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
      description: this.state.description,
      status: this.state.status?this.state.status.id:null,
      statusChange: this.state.statusChange,
      project: this.state.project?this.state.project.id:null,
      pausal: this.state.pausal.value,
      overtime: this.state.overtime.value,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type?this.state.type.id:null,
			repeat: this.state.repeat!==null?taskID:null,
			milestone:this.state.milestone.id,
			attachments:this.state.attachments,
			deadline: this.state.deadline!==null?this.state.deadline.unix()*1000:null,
			closeDate: (this.state.closeDate!==null && (statusAction==='close'||statusAction==='invoiced'|| statusAction==='invalid'))?this.state.closeDate.unix()*1000:null,
			pendingDate: (this.state.pendingDate!==null && statusAction==='pending')?this.state.pendingDate.unix()*1000:null,
			pendingChangable: this.state.pendingChangable,
			invoicedDate,
			important:this.state.important,
    }

    rebase.updateDoc('/help-tasks/'+taskID, body).then(()=>{
			if(this.state.newHistoryEntery!==null){
				this.addToHistory(this.state.newHistoryEntery);
				this.addNotification(this.state.newHistoryEntery,false);
			}
      this.setState({saving:false, newHistoryEntery:null});
    });
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.taskID!==props.match.params.taskID){
      this.setState({loading:true, extraDataLoaded:false, showDescription:false});
      this.fetchData(props.match.params.taskID);
    }
		if(!sameStringForms(props.companies,this.props.companies)||
			!sameStringForms(props.pricelists,this.props.pricelists)||
			!sameStringForms(props.prices,this.props.prices)||
			!sameStringForms(props.projects,this.props.projects)||
			!sameStringForms(props.statuses,this.props.statuses)||
			!sameStringForms(props.tags,this.props.tags)||
			!sameStringForms(props.taskTypes,this.props.taskTypes)||
			!sameStringForms(props.tasks,this.props.tasks)||
			!sameStringForms(props.units,this.props.units)||
			!sameStringForms(props.metadata,this.props.metadata)||
			!sameStringForms(props.tripTypes,this.props.tripTypes)||
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
		if(!this.props.pricelistsActive){
			this.props.storageHelpPricelistsStart();
		}
		if(!this.props.pricesActive){
			this.props.storageHelpPricesStart();
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
		if(!this.props.tasksActive){
			this.props.storageHelpTasksStart();
		}
		if(!this.props.unitsActive){
			this.props.storageHelpUnitsStart();
		}
		if(!this.props.metadataActive){
			this.props.storageMetadataStart();
		}
		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		if(!this.props.milestonesActive){
			this.props.storageHelpMilestonesStart();
		}
		if(!this.props.tripTypesActive){
			this.props.storageHelpTripTypesStart();
		}
		this.setData(this.props);
  }

  fetchData(taskID){
    Promise.all(
      [
				database.collection('help-task_work_trips').where("task", "==", taskID).get(),
        database.collection('help-task_materials').where("task", "==", taskID).get(),
        database.collection('help-task_custom_items').where("task", "==", taskID).get(),
        database.collection('help-task_works').where("task", "==", taskID).get(),
        database.collection('help-repeats').doc(taskID).get(),
				database.collection('help-task_history').where("task", "==", taskID).get(),
    ]).then(([workTrips,taskMaterials,customItems, taskWorks,repeat,history])=>{
				this.setState({
					extraData:{
						taskWorks:snapshotToArray(taskWorks),
						workTrips:snapshotToArray(workTrips),
						taskMaterials:snapshotToArray(taskMaterials),
						customItems:snapshotToArray(customItems),
						repeat:repeat.exists ? {id:repeat.id,...repeat.data()} : null,
					},
					history:snapshotToArray(history).sort((item1,item2)=>item1.createdAt > item2.createdAt ? -1 : 1 ),
					extraDataLoaded:true
				},()=>this.setData(this.props));
    });
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
						fetch('https://api01.lansystems.sk:8080/send-notification',{ //127.0.0.1 https://api01.lansystems.sk:8080
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

	setDefaults(projectID){
		if(projectID===null){
			this.setState({defaultFields:noDef});
			return;
		}
		let project = this.props.projects.find((project)=>project.id===projectID);
		if(!project){
			this.setState({defaultFields:noDef});
			return;
		}
		this.setState({
			defaultFields:{...noDef,...project.def}
		});
	}

	setData(props){
		if(!this.state.extraDataLoaded || !this.storageLoaded(props)){
			return;
		}

		let workTrips = this.state.extraData.workTrips;
		let taskMaterials = this.state.extraData.taskMaterials;
		let customItems = this.state.extraData.customItems;
		let taskWorks = this.state.extraData.taskWorks.map((work)=>{
			return {
				id:work.id,
				done:work.done===true,
				title:work.title,
				type:work.type||work.workType,
				quantity:work.quantity,
				discount:work.discount,
				assignedTo:work.assignedTo,
			}
		});
		let repeat = this.state.extraData.repeat;

		let taskID = props.match.params.taskID;
		let task = props.tasks.find((task)=>task.id===taskID);
		let statuses = toSelArr(props.statuses);
		let projects = toSelArr(props.projects);
		let users = toSelArr(props.users,'email');
		let tags = toSelArr(props.tags);
		let units = toSelArr(props.units);
		let subtasks = props.subtasks;
		let defaultUnit = props.metadata.defaultUnit;
		let prices = props.prices;
		let taskTypes = toSelArr(props.taskTypes).map((taskType)=>{
			let newTaskType = {...taskType, prices:prices.filter((price)=>price.type===taskType.id)}
			return newTaskType;
		});
		let tripTypes = toSelArr(props.tripTypes).map((tripType)=>{
			let newTripType = {...tripType, prices:prices.filter((price)=>price.type===tripType.id)}
			return newTripType;
		});
		let pricelists = props.pricelists;
		let companies = toSelArr(props.companies).map((company)=>{
			let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
			if(newCompany.pricelist===undefined){
					 newCompany.pricelist=pricelists[0];
			 }
			return newCompany;
		});;

		this.setDefaults(task.project);

		let milestones = [noMilestone,...toSelArr(props.milestones)];
		let milestone = noMilestone;
		if(task.milestone!==undefined){
			milestone = milestones.find((item)=>item.id===task.milestone);
			if(milestone===undefined){
				milestone=noMilestone;
			}
		}
    let project = projects.find((item)=>item.id===task.project);
    let status = statuses.find((item)=>item.id===task.status);
    let company = companies.find((item)=>item.id===task.company);
		if(company===undefined){
			company=companies[0];
		}
    let requester = users.find((item)=>item.id===task.requester);
    let assignedTo = users.filter((user)=>task.assignedTo.includes(user.id));

		let type = taskTypes.find((item)=>item.id===task.type);
		let taskTags=[];
		if(task.tags){
			taskTags=tags.filter((tag)=>task.tags.includes(tag.id));
		}

		let permission = project.permissions.find((permission)=>permission.user===props.currentUser.id);
		let viewOnly = false;
		if(status && status.action==='invoiced' && props.inModal && (props.currentUser.userData.role.value===3 || permission.isAdmin)){
			viewOnly = false;
		}else{
			viewOnly = ((permission===undefined || !permission.write) && props.currentUser.userData.role.value===0)||(status && status.action==='invoiced');
		}

		let newState = {
			workTrips,
			taskMaterials,
			customItems,
			toggleTab: "1", //viewOnly?"1":"3",
			taskWorks,
			repeat,

			statuses,
			projects,
			users,
			companies,
			units,
			tripTypes,
			subtasks,
			taskTypes,
			allTags:tags,
			task,

			title:task.title,
			pausal:task.pausal?booleanSelects[1]:booleanSelects[0],
			overtime:task.overtime?booleanSelects[1]:booleanSelects[0],
			status:status?status:null,
			statusChange:task.statusChange?task.statusChange:null,
			createdAt:task.createdAt?task.createdAt:(new Date()).getTime(),
			deadline: task.deadline!==null?moment(task.deadline):null,
			closeDate: task.closeDate!==null?moment(task.closeDate):null,
			pendingDate: task.pendingDate!==null?moment(task.pendingDate):null,
			invoicedDate: task.invoicedDate!==null && task.invoicedDate!==undefined ?new Date(task.invoicedDate).toISOString().replace('Z',''):'',
			reminder: task.reminder?new Date(task.reminder).toISOString().replace('Z',''):'',
			project:project?project:null,
			company:company?company:null,
			workHours:isNaN(parseInt(task.workHours))?0:parseInt(task.workHours),
			requester:requester?requester:null,
			assignedTo,
			milestone,
			milestones,
			attachments:task.attachments?task.attachments:[],
			pendingChangable:task.pendingChangable===false? false : true,
			important:task.important===true,

			viewOnly,
			loading:false,
			defaultUnit,
			tags:taskTags,
			type:type?type:null,
			projectChangeDate:(new Date()).getTime()
		}
		if(this.state.loading){
			newState.description=task.description;
		}

    this.setState(newState);
  }

	getPermissions(id){
		let permission = null;
		if(this.state.project){
			permission = this.state.project.permissions.find((permission)=>permission.user===id);
		}
		if(permission===undefined){
			permission = {user:{id},read:false,write:false,delete:false,internal:false,isAdmin:false};
		}
		return permission;
	}

	render() {
		let permission = null;
		if(this.state.project){
			permission = this.state.project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
		}
		if(permission===undefined){
			permission = {user:{id:this.props.currentUser.id},read:false,write:false,delete:false,internal:false,isAdmin:false};
		}

		let canAdd = this.props.currentUser.userData.role.value>0;
		let canDelete = (permission && permission.delete)||this.props.currentUser.userData.role.value===3;
		let canCopy = ((!permission || !permission.write) && this.props.currentUser.userData.role.value===0)||this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving;
		let taskID = this.props.match.params.taskID;

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
			let assignedTo=work.assignedTo?this.state.users.find((item)=>item.id===work.assignedTo):null
			return {
				...work,
				type:this.state.taskTypes.find((item)=>item.id===work.type),
				assignedTo:assignedTo?assignedTo:null
			}
		});
		let taskMaterials= this.state.taskMaterials.map((material)=>{
			return {
				...material,
				unit:this.state.units.find((unit)=>unit.id===material.unit)
			}
		});

		let customItems = this.state.customItems.map((item)=>(
			{
				...item,
				unit:this.state.units.find((unit)=>unit.id===item.unit),
			}
		));

		let createdBy=null;
		if(this.state.task&& this.state.task.createdBy){
			createdBy = this.state.users.find((user)=>user.id===this.state.task.createdBy);
		}

		return (
			<div className="flex">
				{this.state.showDescription &&
					<div style={{backgroundColor: "transparent", width: "100%", height: "100%", position: "absolute"}} onClick={()=>this.setState({showDescription:false})}>
					</div>
				}

				{ this.renderCommandbar(taskID, createdBy, canCopy, canDelete, taskWorks, workTrips, taskMaterials, customItems) }

				<div className={classnames("fit-with-header-and-commandbar", "scroll-visible", "bkg-F2F1F1", { "row": this.state.layout === '2'})}>
					<div className={classnames("card-box", { "max-width-1660": this.state.layout === '1'}, { "task-edit-left": this.state.layout === '2'})}>

						{ this.renderTitle(taskID, createdBy) }

						<hr className="m-t-5 m-b-5"/>

						{ this.state.layout === "1" && this.renderSelectsLayout1(taskID, canAdd) }

						{ this.renderPopis() }

						{ this.state.layout === "1" && this.state.defaultFields.tags.show && this.renderTags() }

						{ this.renderAttachments(taskID) }

						{ this.renderModalUserAdd() }

						{ this.renderModalCompanyAdd() }

						{ this.renderPendingPicker() }

						{ this.renderVykazyTable(taskWorks, workTrips, taskMaterials, customItems) }

						{ this.renderComments(taskID) }

					</div>

					{ this.state.layout === "2" && this.renderSelectsLayout2() }

		    </div>
			</div>
		);
	}

	renderCommandbar(taskID, createdBy, canCopy, canDelete, taskWorks, workTrips, taskMaterials, customItems){
		return(
			<div className="commandbar p-l-25"> {/*Commandbar*/}
				<div className="d-flex flex-row center-hor p-2 ">
						<div className="display-inline center-hor">
						{!this.props.columns &&
							<button type="button" className="btn btn-link-reversed waves-effect" onClick={() => this.props.history.push(`/helpdesk/taskList/i/${this.props.match.params.listID}`)}>
								<i
									className="fas fa-arrow-left commandbar-command-icon"
									/>
							</button>
						}
						{this.state.project
							&&
							<TaskAdd
								history={this.props.history}
								project={this.state.project.id}
								triggerDate={this.state.projectChangeDate}
								task={this.state}
								disabled={canCopy}
								/>
						}
					</div>
					<div className="ml-auto center-hor">
						<TaskPrint
							match={this.props.match}
							taskID={taskID}
							createdBy={createdBy}
							createdAt={this.state.createdAt}
							taskWorks={taskWorks}
							workTrips={workTrips}
							taskMaterials={taskMaterials}
							customItems={customItems}
							{...this.state}
							isLoaded={this.state.extraDataLoaded && this.storageLoaded(this.props) && !this.state.loading} />
						{canDelete && <button type="button" disabled={!canDelete} className="btn btn-link-reversed waves-effect" onClick={this.deleteTask.bind(this)}>
							<i
								className="far fa-trash-alt"
								/> Delete
							</button>}
							<button type="button" style={{color:this.state.important ? '#ffc107' : '#0078D4'}} disabled={this.state.viewOnly} className="btn btn-link-reversed waves-effect" onClick={()=>this.setState({important:!this.state.important},this.submitTask.bind(this))}>
								<i
									className="far fa-star"
									/> Important
								</button>
						</div>
						<button
							type="button"
							className="btn btn-link-reversed waves-effect"
							onClick={() => this.setState({layout: this.state.layout === "1" ? "2" : "1"})}>
							Switch layout
						</button>
				</div>
			</div>
		)
	}

	renderTitle(taskID, createdBy){
		return(
			<div className="d-flex p-2">{/* Task name row */}
				<div className="row flex">
					<h2 className="center-hor text-extra-slim">{taskID}: </h2>
					<span className="center-hor flex m-r-15">
						<input type="text"
							disabled={this.state.viewOnly}
							value={this.state.title}
							className="task-title-input text-extra-slim hidden-input"
							onChange={(e)=>this.setState({title:e.target.value},this.submitTask.bind(this))}
							placeholder="Enter task name" />
					</span>

					<div className="ml-auto center-hor">
						<p className="m-b-0 task-info">
							<span className="text-muted">
								{createdBy?"Created by ":""}
							</span>
							{createdBy? (createdBy.name + " " +createdBy.surname) :''}
							<span className="text-muted">
								{createdBy?' at ':'Created at '}
								{this.state.createdAt?(timestampToString(this.state.createdAt)):''}
							</span>
						</p>
						<p className="m-b-0">
							{(()=>{
								if(this.state.status && this.state.status.action==='pending'){
									return (
										<span className="text-muted task-info m-r--40">
											<span className="center-hor">
												Pending date:
											</span>
											<DatePicker
												className="form-control hidden-input"
												selected={this.state.pendingDate}
												disabled={!this.state.status || this.state.status.action!=='pending'||this.state.viewOnly||!this.state.pendingChangable}
												onChange={date => {
													this.setState({ pendingDate: date },this.submitTask.bind(this));
												}}
												placeholderText="No pending date"
												{...datePickerConfig}
												/>
										</span>)
							}else if(this.state.status && (this.state.status.action==='close'||this.state.status.action==='invoiced'||this.state.status.action==='invalid')){
								return (
									<span className="text-muted task-info m-r--40">
										<span className="center-hor">
											Closed at:
										</span>
										<DatePicker
											className="form-control hidden-input"
											selected={this.state.closeDate}
											disabled={!this.state.status || (this.state.status.action!=='close' && this.state.status.action!=='invalid')||this.state.viewOnly}
											onChange={date => {
												this.setState({ closeDate: date },this.submitTask.bind(this));
											}}
											placeholderText="No pending date"
											{...datePickerConfig}
											/>
									</span>)
								}else{
									return (
										<span className="task-info ">
											<span className="center-hor text-muted">
												{this.state.statusChange ? ('Status changed at ' + timestampToString(this.state.statusChange) ) : ""}
											</span>
										</span>
									)

								}
							})()}
						</p>
					</div>
				</div>
			</div>
		)
	}

	renderSelectsLayout1(taskID, canAdd){
		return(
			<div>
				<div className="col-lg-12"> {/*Project, Assigned*/}
					<div className="col-lg-4"> {/*Project*/}
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Projekt</Label>
							<div className="col-9">
								<Select
									placeholder="Zadajte projekt"
									isDisabled={this.state.viewOnly}
									value={this.state.project}
									onChange={(project)=>{
										let permissionIDs = project.permissions.map((permission) => permission.user);
										let assignedTo=this.state.assignedTo.filter((user)=>permissionIDs.includes(user.id));

										this.setState({project,
											assignedTo,
											projectChangeDate:(new Date()).getTime(),
											milestone:noMilestone
										},()=>{this.submitTask();this.setDefaults(project.id)});
									}}
									options={this.state.projects.filter((project)=>{
										let curr = this.props.currentUser;
										if((curr.userData && curr.userData.role.value===3)||(project.id===-1||project.id===null)){
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
					{ this.state.defaultFields.assignedTo.show && <div className="col-lg-8"> {/*Assigned*/}
						<div className="row p-r-10">
							<Label className="col-1-5 col-form-label">Assigned</Label>
							<div className="col-10-5">
								<Select
									value={this.state.assignedTo.filter((user)=>this.state.project && this.state.project.permissions.some((permission)=>permission.user===user.id))}
									placeholder="Select"
									isMulti
									isDisabled={this.state.defaultFields.assignedTo.fixed||this.state.viewOnly}
									onChange={(users)=>this.setState({assignedTo:users},this.submitTask.bind(this))}
									options={
										(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[])
										.concat(this.state.users.filter((user)=>this.state.project && this.state.project.permissions.some((permission)=>permission.user===user.id)))
									}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>
					</div>}
				</div>

				<div className="col-lg-12"> {/*Attributes*/}
					<div className="col-lg-4">
						{ this.state.defaultFields.status.show && <div className="row p-r-10"> {/*Status*/}
							<Label className="col-3 col-form-label">Status</Label>
							<div className="col-9">
								<Select
									placeholder="Status required"
									value={this.state.status}
									isDisabled={this.state.defaultFields.status.fixed||this.state.viewOnly}
									styles={invisibleSelectStyleNoArrowColoredRequired}
									onChange={(status)=>{
										let newHistoryEntery = {
											createdAt:(new Date()).getTime(),
											message:this.getHistoryMessage('status', {newStatus:status,oldStatus:this.state.status}),
											task:this.props.match.params.taskID,
										};
										if(status.action==='pending'){
											this.setState({
												pendingStatus:status,
												pendingOpen:true,
												newHistoryEntery
											})
										}else if(status.action==='close'||status.action==='invalid'){
											this.setState({
												status,
												important:false,
												statusChange:(new Date().getTime()),
												closeDate: moment(),
												newHistoryEntery
											},this.submitTask.bind(this))
										}
										else{
											this.setState({
												status,
												statusChange:(new Date().getTime()),
												newHistoryEntery
											},this.submitTask.bind(this))
										}
									}}
									options={this.state.statuses.filter((status)=>status.action!=='invoiced')}
									/>
							</div>
						</div>}
						{ this.state.defaultFields.type.show && <div className="row p-r-10"> {/*Type*/}
							<Label className="col-3 col-form-label">Typ</Label>
							<div className="col-9">
								<Select
									placeholder="Zadajte typ"
									value={this.state.type}
									isDisabled={this.state.defaultFields.type.fixed||this.state.viewOnly}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(type)=>this.setState({type},this.submitTask.bind(this))}
									options={this.state.taskTypes}
									/>
							</div>
						</div>}
						<div className="row p-r-10"> {/*Milestone*/}
								<Label className="col-3 col-form-label">Milestone</Label>
								<div className="col-9">
									<Select
										isDisabled={this.state.viewOnly}
										value={this.state.milestone}
										onChange={(milestone)=> {
											if(this.state.status.action==='pending'){
												if(milestone.startsAt!==null){
													this.setState({milestone,pendingDate:moment(milestone.startsAt),pendingChangable:false},this.submitTask.bind(this));
												}else{
													this.setState({milestone, pendingChangable:true }, this.submitTask.bind(this));
												}
											}else{
												this.setState({milestone},this.submitTask.bind(this));
											}
										}}
										options={this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null && milestone.project===this.state.project.id))}
										styles={invisibleSelectStyleNoArrow}
										/>
								</div>
							</div>
					</div>

					<div className="col-lg-4">
						{ this.state.defaultFields.requester.show && <div className="row p-r-10"> {/*Requester*/}
							<Label className="col-3 col-form-label">Zadal</Label>
							<div className="col-9">
								<Select
									placeholder="Zadajte žiadateľa"
									value={this.state.requester}
									isDisabled={this.state.defaultFields.requester.fixed||this.state.viewOnly}
									onChange={(requester)=>
										{
											if (requester.id === -1) {
												this.setState({
													openUserAdd: true,
												})
											} else {
												this.setState({requester},this.submitTask.bind(this))
											}
										}
									}
									options={(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(this.state.users)}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div> }
						{ this.state.defaultFields.company.show && <div className="row p-r-10"> {/*Company*/}
							<Label className="col-3 col-form-label">Firma</Label>
							<div className="col-9">
								<Select
									placeholder="Zadajte firmu"
									value={this.state.company}
									isDisabled={this.state.defaultFields.company.fixed||this.state.viewOnly}
									onChange={(company)=> {
										if (company.id === -1) {
											this.setState({
												openCompanyAdd: true,
											})
										} else {
											this.setState({company, pausal:parseInt(company.workPausal)>0?booleanSelects[1]:booleanSelects[0]},this.submitTask.bind(this));
										}
									}}
									options={(canAdd?[{id:-1,title:'+ Add company',body:'add', label:'+ Add company',value:null}]:[]).concat(this.state.companies)}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>}
						{this.state.defaultFields.pausal.show && <div className="form-group row"> {/*Pausal*/}
							<label className="col-3 col-form-label">Paušál</label>
							<div className="col-9">
								<Select
									value={this.state.pausal}
									isDisabled={this.state.viewOnly||!this.state.company || parseInt(this.state.company.workPausal)===0||this.state.defaultFields.pausal.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(pausal)=>this.setState({pausal},this.submitTask.bind(this))}
									options={booleanSelects}
									/>
							</div>
						</div>}
					</div>

					<div className="col-lg-4">
						<div className="row p-r-10"> {/*Deadline*/}
							<Label className="col-3 col-form-label">Deadline</Label>
							<div className="col-9">
								<DatePicker
									className="form-control hidden-input"
									selected={this.state.deadline}
									disabled={this.state.viewOnly}
									onChange={date => {
										this.setState({ deadline: date },this.submitTask.bind(this));
									}}
									placeholderText="No deadline"
									{...datePickerConfig}
									/>
							</div>
						</div>
						<div>{/*Repeat*/}
							<Repeat
								disabled={this.state.viewOnly}
								taskID={taskID}
								repeat={this.state.repeat}
								submitRepeat={(repeat)=>{
									database.collection('help-repeats').doc(taskID).set({
										...repeat,
										task:taskID,
										startAt:(new Date(repeat.startAt).getTime()),
									});
									this.setState({repeat})
								}}
								deleteRepeat={()=>{
									rebase.removeDoc('/help-repeats/'+taskID);
									this.setState({repeat:null})
								}}
								columns={this.props.columns}
								/>
						</div>
						{this.state.defaultFields.overtime.show && <div className="form-group row"> {/*Overtime*/}
							<label className="col-3 col-form-label">Mimo PH</label>
							<div className="col-9">
								<Select
									value={this.state.overtime}
									isDisabled={this.state.viewOnly||this.state.defaultFields.overtime.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(overtime)=>this.setState({overtime},this.submitTask.bind(this))}
									options={booleanSelects}
									/>
							</div>
						</div>}
					</div>
				</div>
			</div>
		)
	}

	renderSelectsLayout2(taskID, canAdd){
		return(
			<div className="task-edit-right">
				<div className="">
					<Label className="col-form-label-2">Projekt</Label>
					<div className="col-form-value-2">
						<Select
							placeholder="Zadajte projekt"
							isDisabled={this.state.viewOnly}
							value={this.state.project}
							onChange={(project)=>{
								let permissionIDs = project.permissions.map((permission) => permission.user);
								let assignedTo=this.state.assignedTo.filter((user)=>permissionIDs.includes(user.id));

								this.setState({project,
									assignedTo,
									projectChangeDate:(new Date()).getTime(),
									milestone:noMilestone
								},()=>{this.submitTask();this.setDefaults(project.id)});
							}}
							options={this.state.projects.filter((project)=>{
								let curr = this.props.currentUser;
								if((curr.userData && curr.userData.role.value===3)||(project.id===-1||project.id===null)){
									return true;
								}
								let permission = project.permissions.find((permission)=>permission.user===curr.id);
								return permission && permission.read;
							})}
							styles={invisibleSelectStyleNoArrowRequired}
							/>
					</div>
				</div>

				{ this.state.defaultFields.assignedTo.show &&
				<div className="">
					<Label className="col-form-label-2">Assigned</Label>
					<div className="col-form-value-2" style={{marginLeft: "-5px"}}>
						<Select
							value={this.state.assignedTo.filter((user)=>this.state.project && this.state.project.permissions.some((permission)=>permission.user===user.id))}
							placeholder="Select"
							isMulti
							isDisabled={this.state.defaultFields.assignedTo.fixed||this.state.viewOnly}
							onChange={(users)=>this.setState({assignedTo:users},this.submitTask.bind(this))}
							options={
								(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[])
								.concat(this.state.users.filter((user)=>this.state.project && this.state.project.permissions.some((permission)=>permission.user===user.id)))
							}
							styles={invisibleSelectStyleNoArrowRequired}
							/>
					</div>
				</div>}


				{ this.state.defaultFields.status.show &&
					<div className="">
						<Label className="col-form-label-2">Status</Label>
						<div className="col-form-value-2">
								<Select
									placeholder="Status required"
									value={this.state.status}
									isDisabled={this.state.defaultFields.status.fixed||this.state.viewOnly}
									styles={invisibleSelectStyleNoArrowColoredRequired}
									onChange={(status)=>{
										let newHistoryEntery = {
											createdAt:(new Date()).getTime(),
											message:this.getHistoryMessage('status', status),
											task:this.props.match.params.taskID,
										};
										if(status.action==='pending'){
											this.setState({
												pendingStatus:status,
												pendingOpen:true,
												newHistoryEntery
											})
										}else if(status.action==='close'||status.action==='invalid'){
											this.setState({
												status,
												statusChange:(new Date().getTime()),
												closeDate: moment(),
												newHistoryEntery
											},this.submitTask.bind(this))
										}
										else{
											this.setState({
												status,
												statusChange:(new Date().getTime()),
												newHistoryEntery
											},this.submitTask.bind(this))
										}
									}}
									options={this.state.statuses.filter((status)=>status.action!=='invoiced')}
									/>
							</div>
						</div>}



				{ this.state.defaultFields.type.show &&
					<div className=""> {/*Type*/}
						<Label className="col-form-label-2">Typ</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte typ"
								value={this.state.type}
								isDisabled={this.state.defaultFields.type.fixed||this.state.viewOnly}
								styles={invisibleSelectStyleNoArrowRequired}
								onChange={(type)=>this.setState({type},this.submitTask.bind(this))}
								options={this.state.taskTypes}
								/>
						</div>
					</div>}

					<div className=""> {/*Milestone*/}
						<Label className="col-form-label-2">Milestone</Label>
						<div className="col-form-value-2">
							<Select
								isDisabled={this.state.viewOnly}
								value={this.state.milestone}
								onChange={(milestone)=> {
									if(this.state.status.action==='pending'){
										if(milestone.startsAt!==null){
											this.setState({milestone,pendingDate:moment(milestone.startsAt),pendingChangable:false},this.submitTask.bind(this));
										}else{
											this.setState({milestone, pendingChangable:true }, this.submitTask.bind(this));
										}
									}else{
										this.setState({milestone},this.submitTask.bind(this));
									}
								}}
								options={this.state.milestones.filter((milestone)=>milestone.id===null || (this.state.project!== null && milestone.project===this.state.project.id))}
								styles={invisibleSelectStyleNoArrow}
								/>
						</div>
					</div>

					{ this.state.defaultFields.tags.show &&
						<div style={{maxWidth:"250px"}}> {/*Tags*/}
							<Label className="col-form-label-2">Tagy: </Label>
							<div className="col-form-value-2">
								<Select
									placeholder="Zvoľte tagy"
									value={this.state.tags}
									isMulti
									onChange={(tags)=>this.setState({tags},this.submitTask.bind(this))}
									options={this.state.allTags}
									isDisabled={this.state.defaultFields.tags.fixed||this.state.viewOnly}
									styles={invisibleSelectStyleNoArrowColored}
									/>
							</div>
					</div>}


			{ this.state.defaultFields.requester.show &&
				<div className=""> {/*Requester*/}
					<Label className="col-form-label-2">Zadal</Label>
					<div className="col-form-value-2">
						<Select
							placeholder="Zadajte žiadateľa"
							value={this.state.requester}
							isDisabled={this.state.defaultFields.requester.fixed||this.state.viewOnly}
							onChange={(requester)=>
								{
									if (requester.id === -1) {
										this.setState({
											openUserAdd: true,
										})
									} else {
										this.setState({requester},this.submitTask.bind(this))
									}
								}
							}
							options={(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(this.state.users)}
							styles={invisibleSelectStyleNoArrowRequired}
							/>
					</div>
				</div> }

						{ this.state.defaultFields.company.show &&
							<div className=""> {/*Company*/}
								<Label className="col-form-label-2">Firma</Label>
								<div className="col-form-value-2">
									<Select
										placeholder="Zadajte firmu"
										value={this.state.company}
										isDisabled={this.state.defaultFields.company.fixed||this.state.viewOnly}
										onChange={(company)=> {
														if (company.id === -1) {
															this.setState({
																openCompanyAdd: true,
															})
														} else {
															this.setState({company, pausal:parseInt(company.workPausal)>0?booleanSelects[1]:booleanSelects[0]},this.submitTask.bind(this));
														}
													}}
										options={(canAdd?[{id:-1,title:'+ Add company',body:'add', label:'+ Add company',value:null}]:[]).concat(this.state.companies)}
										styles={invisibleSelectStyleNoArrowRequired}
										/>
								</div>
							</div>}

						{this.state.defaultFields.pausal.show &&
							<div className=""> {/*Pausal*/}
								<label className="col-form-label m-l-7">Paušál</label>
								<div className="col-form-value-2">
								<Select
									value={this.state.pausal}
									isDisabled={this.state.viewOnly||!this.state.company || parseInt(this.state.company.workPausal)===0||this.state.defaultFields.pausal.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(pausal)=>this.setState({pausal},this.submitTask.bind(this))}
									options={booleanSelects}
									/>
							</div>
							</div>}

						<div className=""> {/*Deadline*/}
							<Label className="col-form-label m-l-7">Deadline</Label>
							<div className="col-form-value-2" style={{marginLeft: "-1px"}}>
								<DatePicker
									className="form-control hidden-input"
									selected={this.state.deadline}
									disabled={this.state.viewOnly}
									onChange={date => {
										this.setState({ deadline: date },this.submitTask.bind(this));
									}}
									placeholderText="No deadline"
									{...datePickerConfig}
									/>
							</div>
						</div>
							<Repeat
								disabled={this.state.viewOnly}
								taskID={taskID}
								repeat={this.state.repeat}
								submitRepeat={(repeat)=>{
									database.collection('help-repeats').doc(taskID).set({
										...repeat,
										task:taskID,
										startAt:(new Date(repeat.startAt).getTime()),
									});
									this.setState({repeat})
								}}
								deleteRepeat={()=>{
									rebase.removeDoc('/help-repeats/'+taskID);
									this.setState({repeat:null})
								}}
								columns={this.props.columns}
								vertical={true}
								/>

						{this.state.defaultFields.overtime.show &&
							<div className=""> {/*Overtime*/}
								<label className="col-form-label-2">Mimo PH</label>
								<div className="col-form-value-2">
								<Select
									value={this.state.overtime}
									isDisabled={this.state.viewOnly||this.state.defaultFields.overtime.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(overtime)=>this.setState({overtime},this.submitTask.bind(this))}
									options={booleanSelects}
									/>
							</div>
							</div>}
					</div>
		)
	}

	renderTags(){
		return(
			<div className="row m-t-10"> {/*Tags*/}
				<div className="center-hor">
					<Label className="center-hor">Tagy: </Label>
				</div>
				<div className="f-1 ">
					<Select
						placeholder="Zvoľte tagy"
						value={this.state.tags}
						isMulti
						onChange={(tags)=>this.setState({tags},this.submitTask.bind(this))}
						options={this.state.allTags}
						isDisabled={this.state.defaultFields.tags.fixed||this.state.viewOnly}
						styles={invisibleSelectStyleNoArrowColored}
						/>
				</div>
			</div>
		)
	}

	renderPopis(){
		return(
			<div className="" style={{zIndex: "9999"}}>{/*Description*/}
				<Label className="col-form-label m-b-10 m-t-10">Popis úlohy</Label>
				{ this.state.viewOnly ?
					(this.state.description.length!==0 ?
						<div className="task-edit-popis" dangerouslySetInnerHTML={{__html:this.state.description }} /> :
							<div className="task-edit-popis">Úloha nemá popis</div>
					) :
					(
						this.state.showDescription ?
						(<div onClick={()=>this.setState({showDescription:true})}>
							<CKEditor
								editor={ ClassicEditor }
								data={this.state.description}
								onInit={(editor)=>{
								}}
								onChange={(e,editor)=>{
									this.setState({description: editor.getData()},this.submitTask.bind(this))
								}}
								config={ck5config}
								/>
						</div>
					) :
					(
						<div className="clickable task-edit-popis" onClick={()=>this.setState({showDescription:true})}>
							<div dangerouslySetInnerHTML={{__html:this.state.description }} />
								(edit)
						</div>
					)
					)
				}
			</div>
		)
	}

	renderAttachments(taskID){
		return(
				<Attachments
					disabled={this.state.viewOnly}
					taskID={this.props.match.params.taskID}
					attachments={this.state.attachments}
					addAttachments={(newAttachments)=>{
						let time = (new Date()).getTime();
						let storageRef = firebase.storage().ref();
						Promise.all([
							...newAttachments.map((attachment)=>{
								return storageRef.child(`help-tasks/${taskID}/${time}-${attachment.size}-${attachment.name}`).put(attachment)
							})
						]).then((resp)=>{
								Promise.all([
									...newAttachments.map((attachment)=>{
										return storageRef.child(`help-tasks/${taskID}/${time}-${attachment.size}-${attachment.name}`).getDownloadURL()
									})
								]).then((urls)=>{
										newAttachments=newAttachments.map((attachment,index)=>{
											return {
												title:attachment.name,
												size:attachment.size,
												path:`help-tasks/${taskID}/${time}-${attachment.size}-${attachment.name}`,
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
		)
	}

	renderModalUserAdd(){
		return(
				<Modal isOpen={this.state.openUserAdd}  toggle={() => this.setState({openUserAdd: !this.state.openUserAdd})} >
          <ModalBody>
						<UserAdd close={() => this.setState({openUserAdd: false,})} addUser={(user) => {
								let newUsers = this.state.users.concat([user]);
								this.setState({
									users: newUsers,
								})
							}}/>
          </ModalBody>
        </Modal>
		)
	}

	renderModalCompanyAdd(){
		return(
				<Modal isOpen={this.state.openCompanyAdd}  toggle={() => this.setState({openCompanyAdd: !this.state.openCompanyAdd})} >
					<ModalBody>
						<CompanyAdd close={() => this.setState({openCompanyAdd: false,})} addCompany={(company) => {
								let newCompanies = this.state.companies.concat([company]);
								this.setState({
									companies: newCompanies,
								})
							}}/>
					</ModalBody>
				</Modal>
		)
	}

	renderPendingPicker(){
		return(
			<PendingPicker
				open={this.state.pendingOpen}
				prefferedMilestone={this.state.milestone}
				milestones={this.state.milestones.filter((milestone)=>this.state.project!== null && milestone.project===this.state.project.id && milestone.startsAt!==null)}
				closeModal={()=>this.setState({pendingOpen:false})}
				savePending={(pending)=>{
					/*
					database.collection('help-calendar_events').where("taskID", "==", parseInt(this.props.match.params.taskID)).get()
					.then((data)=>{
						snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-calendar_events/'+item.id));
					});*/
					this.setState({
						pendingOpen:false,
						pendingStatus:null,
						status:this.state.pendingStatus,
						pendingDate:pending.milestoneActive?moment(pending.milestone.startsAt):pending.pendingDate,
						milestone:pending.milestoneActive?pending.milestone:this.state.milestone,
						pendingChangable:!pending.milestoneActive,
						statusChange:(new Date().getTime()),
					},this.submitTask.bind(this))
				}}
			/>
		)
	}

	renderVykazyTable(taskWorks, workTrips, taskMaterials, customItems){
		return(
			<VykazyTable
				showColumns={ (this.state.viewOnly ? [0,1,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7,8]) }
				showTotals={false}
				disabled={this.state.viewOnly}
				company={this.state.company}
				match={this.props.match}
				taskID={this.props.match.params.taskID}
				taskAssigned={this.state.assignedTo}

				submitService={this.submitService.bind(this)}
				subtasks={taskWorks}
				defaultType={this.state.type}
				workTypes={this.state.taskTypes}
				updateSubtask={(id,newData)=>{
					let extraData = {...this.state.extraData};
					extraData.taskWorks[extraData.taskWorks.findIndex((work)=>work.id === id)] = {...extraData.taskWorks.find((work)=>work.id === id),...newData};
					let newTaskWorks=[...this.state.taskWorks];
					newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
					rebase.updateDoc('help-task_works/'+id,newData);
					this.setState({taskWorks:newTaskWorks, extraData});
				}}
				removeSubtask={(id)=>{
					rebase.removeDoc('help-task_works/'+id).then(()=>{
						let extraData = {...this.state.extraData};
						extraData.taskWorks.splice(extraData.taskWorks.findIndex((work)=>work.id === id),1);
						let newTaskWorks=[...this.state.taskWorks];
						newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
						this.setState({ taskWorks: newTaskWorks, extraData });
					});
				}}
				workTrips={workTrips}
				tripTypes={this.state.tripTypes}
				submitTrip={this.submitWorkTrip.bind(this)}
				updateTrip={(id,newData)=>{
					let extraData = {...this.state.extraData};
					extraData.workTrips[extraData.workTrips.findIndex((trip)=>trip.id === id)] = {...extraData.workTrips.find((trip)=>trip.id === id),...newData};
					let newTrips=[...this.state.workTrips];
					newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
					rebase.updateDoc('help-task_work_trips/'+id,newData);
					this.setState({ workTrips: newTrips, extraData });
				}}
				removeTrip={(id)=>{
					rebase.removeDoc('help-task_work_trips/'+id).then(()=>{
						let extraData = {...this.state.extraData};
						extraData.workTrips.splice(extraData.workTrips.findIndex((trip)=>trip.id === id),1);
						let newTrips=[...this.state.workTrips];
						newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
						this.setState({ workTrips:newTrips, extraData });
					});
				}}

				materials={taskMaterials}
				submitMaterial={this.submitMaterial.bind(this)}
				updateMaterial={(id,newData)=>{
					let extraData = {...this.state.extraData};
					extraData.taskMaterials[extraData.taskMaterials.findIndex((material)=>material.id === id)] = {...extraData.taskMaterials.find((material)=>material.id === id),...newData};
					let newTaskMaterials=[...this.state.taskMaterials];
					newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
					rebase.updateDoc('help-task_materials/'+id,newData);
					this.setState({taskMaterials:newTaskMaterials, extraData});
				}}
				removeMaterial={(id)=>{
					rebase.removeDoc('help-task_materials/'+id).then(()=>{
						let extraData = {...this.state.extraData};
						extraData.taskMaterials.splice(extraData.taskMaterials.findIndex((material)=>material.id === id),1);
						let newTaskMaterials=[...this.state.taskMaterials];
						newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
						this.setState({taskMaterials:newTaskMaterials, extraData});
					});
				}}
				customItems={customItems}
				submitCustomItem={this.submitCustomItem.bind(this)}
				updateCustomItem={(id,newData)=>{
					let extraData = {...this.state.extraData};
					extraData.customItems[extraData.customItems.findIndex((item)=>item.id === id)] = {...extraData.customItems.find((item)=>item.id === id),...newData};
					let newCustomItems=[...this.state.customItems];
					newCustomItems[newCustomItems.findIndex((taskWork)=>taskWork.id===id)]={...newCustomItems.find((taskWork)=>taskWork.id===id),...newData};
					rebase.updateDoc('help-task_custom_items/'+id,newData);
					this.setState({customItems:newCustomItems, extraData});
				}}
				removeCustomItem={(id)=>{
					rebase.removeDoc('help-task_custom_items/'+id).then(()=>{
						let extraData = {...this.state.extraData};
						extraData.customItems.splice(extraData.customItems.findIndex((item)=>item.id === id),1);
						let newCustomItems=[...this.state.customItems];
						newCustomItems.splice(newCustomItems.findIndex((item)=>item.id===id),1);
						this.setState({customItems:newCustomItems, extraData});
					});
				}}
				units={this.state.units}
				defaultUnit={this.state.defaultUnit}
				/>
		)
	}

	renderComments(taskID){
		let permission = null;
		if(this.state.project){
			permission = this.state.project.permissions.find((permission)=>permission.user===this.props.currentUser.id);
		}
		if( !permission ){
			permission = {user:this.props.currentUser.id,read:false,write:false,delete:false,internal:false,isAdmin:false};
		}

		return(
			<div>
				<Nav tabs className="b-0 m-b-22 m-l--10 m-t-15">
					<NavItem>
						<NavLink
							className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
							onClick={() => { this.setState({toggleTab:'1'}); }}
						>
							Komentáre
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink>
							|
						</NavLink>
					</NavItem>
					{this.props.currentUser.userData.role.value > 0 &&
						<NavItem>
						<NavLink
							className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
							onClick={() => { this.setState({toggleTab:'2'}); }}
						>
							História
						</NavLink>
					</NavItem>}
				</Nav>

				<TabContent activeTab={this.state.toggleTab}>
						<TabPane tabId="1">
							<Comments
								id={taskID?taskID:null}
								showInternal={permission.internal || this.props.currentUser.userData.role.value > 1 }
								users={this.state.users}
								addToHistory={(internal)=>{
									let event = {
										message:this.getHistoryMessage('comment'),
										createdAt:(new Date()).getTime(),
										task:this.props.match.params.taskID
									}
									this.addToHistory(event);
									this.addNotification(event,internal);
								}}
								/>
						</TabPane>
						{this.props.currentUser.userData.role.value > 0 &&
							<TabPane tabId="2">
							<h3>História</h3>
								<ListGroup>
									{ this.state.history.map((event)=>
										<ListGroupItem key={event.id}>
											({timestampToString(event.createdAt)})
											{' ' + event.message}
										</ListGroupItem>
									)}
								</ListGroup>
							{this.state.history.length===0 && <div>História je prázdna.</div>}
						</TabPane>}
					</TabContent>
			</div>
		)
	}

	submitWorkTrip(body){
    rebase.addToCollection('help-task_work_trips',{task:this.props.match.params.taskID,...body}).then((result)=>{
			let extraData = {...this.state.extraData};
			extraData.workTrips = [{task:this.props.match.params.taskID,...body,id:result.id}, ...extraData.workTrips];
      this.setState({workTrips:[...this.state.workTrips, {task:this.props.match.params.taskID,...body,id:result.id}],extraData})
    });
  }

  submitMaterial(body){
    rebase.addToCollection('help-task_materials',{task:this.props.match.params.taskID,...body}).then((result)=>{
			let extraData = {...this.state.extraData};
			extraData.taskMaterials = [{task:this.props.match.params.taskID,...body,id:result.id}, ...extraData.taskMaterials];
      this.setState({taskMaterials:[...this.state.taskMaterials, {task:this.props.match.params.taskID,...body,id:result.id}],extraData})
    });
  }

	submitCustomItem(body){
		rebase.addToCollection('help-task_custom_items',{task:this.props.match.params.taskID,...body}).then((result)=>{
			let extraData = {...this.state.extraData};
			extraData.customItems = [{task:this.props.match.params.taskID,...body,id:result.id}, ...extraData.customItems];
			this.setState({customItems:[...this.state.customItems, {task:this.props.match.params.taskID,...body,id:result.id}],extraData})
		});
	}

  submitService(body){
    rebase.addToCollection('help-task_works',{task:this.props.match.params.taskID,...body}).then((result)=>{
			let extraData = {...this.state.extraData};
			extraData.taskWorks = [{task:this.props.match.params.taskID,...body,id:result.id}, ...extraData.taskWorks];
      this.setState({taskWorks:[...this.state.taskWorks, {task:this.props.match.params.taskID,...body,id:result.id}],extraData})
    });
  }

}

const mapStateToProps = ({ userReducer, storageCompanies, storageHelpPricelists, storageHelpPrices, storageHelpProjects, storageHelpStatuses, storageHelpTags, storageHelpTaskTypes, storageHelpTasks, storageHelpUnits, storageHelpWorkTypes, storageMetadata, storageUsers, storageHelpMilestones, storageHelpTripTypes }) => {
	const { companiesLoaded, companiesActive, companies } = storageCompanies;
	const { pricelistsLoaded, pricelistsActive, pricelists } = storageHelpPricelists;
	const { pricesLoaded, pricesActive, prices } = storageHelpPrices;
	const { projectsLoaded, projectsActive, projects } = storageHelpProjects;
	const { statusesLoaded, statusesActive, statuses } = storageHelpStatuses;
	const { tagsLoaded, tagsActive, tags } = storageHelpTags;
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { tasksLoaded, tasksActive, tasks } = storageHelpTasks;
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
		tasksLoaded, tasksActive, tasks,
		unitsLoaded, unitsActive, units,
		workTypesLoaded, workTypesActive, workTypes,
		metadataLoaded, metadataActive, metadata,
		usersLoaded, usersActive, users,
		milestonesLoaded, milestonesActive, milestones,
		tripTypesActive, tripTypes, tripTypesLoaded,
	 };
};

export default connect(mapStateToProps, { storageCompaniesStart, storageHelpPricelistsStart, storageHelpPricesStart,storageHelpProjectsStart, storageHelpStatusesStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageHelpTasksStart, storageHelpUnitsStart,storageHelpWorkTypesStart, storageMetadataStart, storageUsersStart, storageHelpMilestonesStart, storageHelpTripTypesStart })(TaskEdit);
