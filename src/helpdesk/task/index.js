import React, { Component } from 'react';
import { connect } from "react-redux";
import ShowData from '../../components/showData';
import { timestampToString, sameStringForms } from '../../helperFunctions';
import TaskEdit from './taskEdit';
import TaskEmpty from './taskEmpty';
import TaskCalendar from '../calendar';


import {setTasksOrderBy, setTasksAscending,storageCompaniesStart,storageHelpTagsStart,storageUsersStart, setUserFilterStatuses,
	storageHelpProjectsStart,storageHelpStatusesStart,storageHelpTasksStart, storageHelpFiltersStart,
	setTasklistLayout, storageHelpMilestonesStart, storageHelpCalendarEventsStart,
	setHelpSidebarProject, setHelpSidebarMilestone, setHelpSidebarFilter, setFilter, setMilestone,setProject,
} from '../../redux/actions';
const allMilestones = {id:null,title:'Any', label:'Any',value:null};

class TasksIndex extends Component {

	constructor(props){
		super(props);
		this.state={
			tasks:[],
			statuses:[],
			projects:[],
			users:[],
			tags:[],
			companies:[],
			filterName:''
		}
		this.filterTasks.bind(this);
		this.getCalendarAllDayData.bind(this);
		this.getBreadcrumsData.bind(this);
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.listID!==props.match.params.listID||!sameStringForms(props.filters,this.props.filters)){
			this.getFilterName(props);
		}

		if(!sameStringForms(props.companies,this.props.companies)){
			this.setState({companies:props.companies})
		}
		if(!sameStringForms(props.statuses,this.props.statuses)){
			this.setState({statuses:props.statuses})
		}
		if(!sameStringForms(props.projects,this.props.projects)){
			this.setState({projects:props.projects})
		}
		if(!sameStringForms(props.users,this.props.users)){
			this.setState({users:props.users})
		}
		if(!sameStringForms(props.tags,this.props.tags)){
			this.setState({tags:props.tags})
		}
		if(!sameStringForms(props.tasks,this.props.tasks)){
			this.setState({tasks:props.tasks})
		}

		if(!sameStringForms(props.filters,this.props.filters)){
			this.getFilterName(props);
		}
	}

	componentWillMount(){
		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}
		this.setState({companies:this.props.companies});

		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}
		this.setState({statuses:this.props.statuses});

		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		this.setState({projects:this.props.projects});

		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		this.setState({users:this.props.users});

		if(!this.props.tagsActive){
			this.props.storageHelpTagsStart();
		}
		this.setState({tags:this.props.tags});

		if(!this.props.tasksActive){
			this.props.storageHelpTasksStart();
		}
		this.setState({tasks:this.props.tasks});

		if(!this.props.filtersActive){
			this.props.storageHelpFiltersStart();
		}
		if(!this.props.milestonesActive){
			this.props.storageHelpMilestonesStart();
		}
		if(!this.props.calendarEventsActive){
			this.props.storageHelpCalendarEventsStart();
		}

		this.getFilterName(this.props);
	}

	getFilterName(props){
		let id = props.match.params.listID;
		if(!id){
			this.setState({filterName:''});
			return;
		}else if(id==='all'){
			this.setState({filterName:'All'});
			return;
		}
		let filter = props.filters.find((filter)=>filter.id===id);
		if(filter){
			this.setState({filterName:filter.title});
		}
	}

	getBreadcrumsData(){
		let project = this.props.projectState;
		let milestone = this.props.milestoneState;
		let filter = this.props.filterState;

		return [
			{
				type:'project',
				show:project!==null,
				data:project,
				label:project?project.title:'Invalid project',
				onClick:()=>{
					this.props.setHelpSidebarMilestone(allMilestones);
					this.props.setMilestone(null);
					this.props.setHelpSidebarFilter(null);
					this.props.setFilter({
						status:[],
						requester:null,
						company:null,
						assigned:null,
						workType:null,
						statusDateFrom: null,
						statusDateTo: null,
						updatedAt:(new Date()).getTime()
					});
					this.props.history.push('/helpdesk/taskList/i/all');
				}
			},
			{
				type:'milestone',
				show:project!==null && (filter!==null||milestone.id!==null),
				data:milestone,
				label:milestone?milestone.title:'Invalid milestone',
				onClick:()=>{
					this.props.setHelpSidebarFilter(null);
					this.props.setFilter({
						status:[],
						requester:null,
						company:null,
						assigned:null,
						workType:null,
						statusDateFrom: null,
						statusDateTo: null,
						closeDateFrom: null,
			      closeDateTo: null,
			      pendingDateFrom: null,
			      pendingDateTo: null,
						updatedAt:(new Date()).getTime()
					});
					this.props.history.push('/helpdesk/taskList/i/all');
				}
			},
			{
				type:'filter',
				show: filter!==null,
				data:filter,
				label:filter?filter.title:'Invalid filter',
				onClick:()=>{
				}
			}
		]
	}

	displayCol(task){
			return (<li>
				<div className="taskCol-title">
					<span className="attribute-label">#{task.id} | </span> {task.title}
				</div>
				<div className="taskCol-body">
					<p className="pull-right m-0">
						<span className="label label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
							{task.status?task.status.title:'Neznámy status'}
						</span>
					</p>
					<p>
						<span>
							<span className="attribute-label">Requested by: </span>
									{task.requester?(" " + task.requester.name+' '+task.requester.surname):' Neznámy používateľ '}
						</span>
					</p>
					<p className="pull-right">
						<span>
							<span className="attribute-label">	<i className="fa fa-star-of-life" /> </span>
							{task.createdAt?timestampToString(task.createdAt):'None'}
						</span>
					</p>
					<p>
						<span>
							<span className="attribute-label">From </span>
							{task.company ? task.company.title : " Unknown"}
						</span>
					</p>

					<p className="pull-right">
						<span>
							<img
								className="dnd-item-icon"
								src={require('../../scss/icons/excl-triangle.svg')}
								alt="Generic placeholder XX"
								/>
							{task.deadline?timestampToString(task.deadline):'None'}
						</span>
					</p>
					<p >
						<span style={{textOverflow: 'ellipsis'}}>
							<span className="attribute-label">Assigned: </span>
							{task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.name+' '+user.surname+', ','').slice(0,-2):'Neznámy používateľ'}</span>
					</p>
				</div>

					<div className="taskCol-tags">
						{task.tags.map((tag)=>
							<span key={tag.id} className="label label-info m-r-5" style={{backgroundColor: tag.color, color: "white"}}>{tag.title}</span>
						)}
					</div>

			</li>)
	}

	displayCal(task,showEvent){
			return (<div style={ showEvent ? { backgroundColor:'#eaf6ff', borderRadius:5 } : {} }>
					<p className="m-0">
						{showEvent && <span className="label label-event">
						Event
					</span>}
						<span className="label label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
							{task.status?task.status.title:'Neznámy status'}
						</span>
						<span className="attribute-label m-l-3">#{task.id} | {task.title}</span>
					</p>
					{false &&  <p className="m-0">
						<span className="m-l-3">
							<span className="attribute-label">Requested by: </span>
									{task.requester?(" " + task.requester.name+' '+task.requester.surname):' Neznámy používateľ '}
						</span>
						<span className="m-l-3">
							<span className="attribute-label">	<i className="fa fa-star-of-life" /> </span>
							{task.createdAt?timestampToString(task.createdAt):'None'}
						</span>
						<span className="m-l-3">
							<span className="attribute-label">From: </span>
							{task.company ? task.company.title : " Unknown"}
						</span>
						<span className="m-l-3">
							<span className="attribute-label">Deadline: </span>
							{task.deadline?timestampToString(task.deadline):'None'}
						</span>
						<span className="m-l-3">
							<span className="attribute-label">Assigned: </span>
							{task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.name+' '+user.surname+', ','').slice(0,-2):'Neznámy používateľ'}
						</span>
					</p>}
			</div>)
	}

	filterTasks(){
		let newTasks=this.state.tasks.map((task)=>{
			return {
				...task,
				company:this.state.companies.find((company)=>company.id===task.company),
				status:this.state.statuses.find((status)=>status.id===task.status),
				project:this.state.projects.find((project)=>project.id===task.project),
				requester:this.state.users.find((user)=>user.id===task.requester),
				tags:this.state.tags.filter((tag)=>task.tags && task.tags.includes(tag.id)),
				assignedTo:this.state.users.filter((user)=>task.assignedTo && task.assignedTo.includes(user.id)),
				id:parseInt(task.id)
			}
		});
		let filter = this.props.filter;

		return newTasks.filter((task)=>{
			let currentPermissions = null;
			if(task.project){
				currentPermissions = task.project.permissions.find((permission)=>permission.user === this.props.currentUser.id);
			}
			return (this.props.currentUser.statuses.length===0||(task.status && this.props.currentUser.statuses.includes(task.status.id))) &&
			(filter.requester===null||(task.requester && task.requester.id===filter.requester)||(task.requester && filter.requester==='cur' && task.requester.id === this.props.currentUser.id)) &&
			(filter.workType===null||(task.type===filter.workType)) &&
			(filter.company===null||(task.company && task.company.id===filter.company) ||(task.company && filter.company==='cur' && task.company.id===this.props.currentUser.userData.company)) &&
			(filter.assigned===null||(task.assignedTo && task.assignedTo.map((item)=>item.id).includes(filter.assigned))||(task.assignedTo && filter.requester==='cur' && task.assignedTo.map((item)=>item.id).includes(this.props.currentUser.id))) &&
			(filter.statusDateFrom === null || task.statusChange >= filter.statusDateFrom) &&
			(filter.statusDateTo === null || task.statusChange <= filter.statusDateTo) &&
			(filter.closeDateFrom === null || task.closeDate >= filter.closeDateFrom) &&
			(filter.closeDateTo === null || task.closeDate <= filter.closeDateTo) &&
			(filter.pendingDateFrom === null || task.pendingDate >= filter.pendingDateFrom) &&
			(filter.pendingDateTo === null || task.pendingDate <= filter.pendingDateTo) &&
			(this.props.project===null||(task.project && task.project.id===this.props.project))&&
			(this.props.currentUser.userData.role.value===3||(currentPermissions && currentPermissions.read)) &&
			(this.props.milestone===null||((task.milestone)&& task.milestone === this.props.milestone))
		})
	}

	getCalendarEventsData(tasks){
		let taskIDs = tasks.map((task)=>task.id);
		return this.props.calendarEvents.filter((event)=>taskIDs.includes(event.taskID)).map((event)=>{
			let task = tasks.find((task)=>event.taskID===task.id);
			return {
				...task,
				isTask:false,
				eventID:event.id,
				titleFunction:this.displayCal,
				start:new Date(event.start),
				end:new Date(event.end),
			}
		})
	}

	getCalendarAllDayData(tasks){
		return tasks.map((task) => {
			let newTask = {
				...task,
				isTask:true,
				titleFunction:this.displayCal,
				allDay:task.status.action!=='pendingOLD',
			}

			switch (task.status.action) {
				case 'invoiced':{
					return {
						...newTask,
						start:new Date(task.invoicedDate),
					}
				}
				case 'close':{
					return {
						...newTask,
						start:new Date(task.closeDate),
					}
				}
				case 'invalid':{
					return {
						...newTask,
						start:new Date(task.closeDate),
					}
				}
				case 'pending':{
					return {
						...newTask,
						start:new Date(task.pendingDate),
						//end:new Date(task.pendingDateTo ? task.pendingDateTo: fromMomentToUnix(moment(task.pendingDate).add(30,'minutes')) ),
					}
				}
				default:{
					return {
						...newTask,
						start:new Date(),
					}
				}
			}
		}).map((task)=>({...task,end: task.status.action !== 'pendingOLD' ? task.start : task.end }))
	}

	render() {
		let link='';
		if(this.props.match.params.hasOwnProperty('listID')){
			link = '/helpdesk/taskList/i/'+this.props.match.params.listID;
		}else{
			link = '/helpdesk/taskList'
		}
		return (
			<ShowData
				layout={this.props.tasklistLayout}
				setLayout={this.props.setTasklistLayout}
				data={this.filterTasks()}
				filterBy={[
					{value:'assignedTo',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
					//		{value:'tags',type:'list',func:((cur,item)=>cur+item.title+' ')},
					{value:'statusChange',type:'date'},
					{value:'createdAt',type:'date'},
					{value:'requester',type:'user'},
					{value:'deadline',type:'date'},
					{value:'status',type:'object'},
					{value:'title',type:'text'},
					{value:'id',type:'int'},
					{value:'company',type:'object'},
				]}
				displayCol={this.displayCol}
				filterName="help-tasks"
				displayValues={[
					{value:'important',label:'',type:'important'},
					{value:'title',label:'Title',type:'text'},
					{value:'id',label:'ID',type:'int'},
					{value:'status',label:'Status',type:'object'},
					{value:'requester',label:'Requester',type:'user'},
					{value:'company',label:'Company',type:'object'},
					{value:'assignedTo',label:'Assigned',type:'list',func:(items)=>
						(<div>
							{
								items.map((item)=><div key={item.id}>{item.name+' '+item.surname}</div>)
							}
						</div>)
					},
					{value:'createdAt',label:'Created at',type:'date'},
					/*		{value:'tags',label:'Tags',type:'list',func:(items)=>
								(<div>
								{items.map((item)=>
									<span key={item.id} className="label label-info m-r-5">{item.title}</span>)
								}
								</div>)
							},*/
					{value:'deadline',label:'Deadline',type:'date'}
				]}
				orderByValues={[
					{value:'id',label:'ID',type:'int'},
					{value:'status',label:'Status',type:'object'},
					{value:'title',label:'Title',type:'text'},
					{value:'requester',label:'Requester',type:'user'},
					{value:'assignedTo',label:'Assigned',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
					{value:'createdAt',label:'Created at',type:'date'},
					//		{value:'tags',label:'Tags',type:'list',func:((cur,item)=>cur+item.title+' ')},
					{value:'deadline',label:'Deadline',type:'date'}
				]}
				dndGroupAttribute="status"
				dndGroupData={this.props.statuses}
				calendar={TaskCalendar}
				calendarAllDayData={this.getCalendarAllDayData.bind(this)}
				calendarEventsData={this.getCalendarEventsData.bind(this)}
				link={link}
				history={this.props.history}
				orderBy={this.props.orderBy}
				setOrderBy={this.props.setTasksOrderBy}
				ascending={this.props.ascending}
				setAscending={this.props.setTasksAscending}
				itemID={this.props.match.params.taskID}
				listID={this.props.match.params.listID}
				match={this.props.match}
				isTask={true}
				listName={this.state.filterName}
				edit={TaskEdit}
				empty={TaskEmpty}
				useBreadcrums={true}
				breadcrumsData={this.getBreadcrumsData()}
				setStatuses={this.props.setUserFilterStatuses}
				statuses={this.props.currentUser.statuses}
				allStatuses={this.props.statuses}
			 />
		);
	}
}

const mapStateToProps = ({ userReducer, filterReducer, taskReducer, storageCompanies, storageHelpTags, storageUsers, storageHelpProjects, storageHelpStatuses,storageHelpTasks,storageHelpFilters, storageHelpMilestones, helpSidebarStateReducer, storageHelpCalendarEvents }) => {
	const { project, milestone, filter } = filterReducer;
	const { orderBy, ascending, tasklistLayout } = taskReducer;

	const { companiesActive, companies } = storageCompanies;
	const { tagsActive, tags } = storageHelpTags;
	const { usersActive, users } = storageUsers;
	const { projectsActive, projects } = storageHelpProjects;
	const { statusesActive, statuses } = storageHelpStatuses;
	const { tasksActive, tasks } = storageHelpTasks;
	const { filtersActive, filters } = storageHelpFilters;
	const { milestonesActive, milestones } = storageHelpMilestones;
	const { calendarEventsActive, calendarEvents } = storageHelpCalendarEvents;

	return {
		project, milestone, filter,
		orderBy,ascending,tasklistLayout, currentUser:userReducer,
		companiesActive, companies,
		tagsActive, tags,
		usersActive, users,
		projectsActive, projects,
		statusesActive, statuses,
		tasksActive, tasks,
		filtersActive, filters,
		milestonesActive, milestones,
		projectState:helpSidebarStateReducer.project,
		milestoneState:helpSidebarStateReducer.milestone,
		filterState:helpSidebarStateReducer.filter,
		calendarEventsActive, calendarEvents,
	 };
};

export default connect(mapStateToProps, { setTasksOrderBy, setTasksAscending , setUserFilterStatuses,
	storageCompaniesStart,storageHelpTagsStart,storageUsersStart,storageHelpProjectsStart,storageHelpStatusesStart,storageHelpTasksStart, storageHelpFiltersStart, setTasklistLayout, storageHelpMilestonesStart, storageHelpCalendarEventsStart,
	setHelpSidebarProject, setHelpSidebarMilestone, setHelpSidebarFilter, setFilter, setMilestone, setProject,
})(TasksIndex);
