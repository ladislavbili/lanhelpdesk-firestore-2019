import React, { Component } from 'react';
import { connect } from "react-redux";
import ShowData from '../../components/showData';
import {timestampToString, sameStringForms} from '../../helperFunctions';
import TaskEdit from './taskEditContainer';
import TaskEmpty from './taskEmpty';
import {setTasksOrderBy, setTasksAscending,storageCompaniesStart,storageHelpTagsStart,storageUsersStart,
	storageHelpProjectsStart,storageHelpStatusesStart,storageHelpTasksStart, storageHelpFiltersStart,
	setTasklistLayout, storageHelpMilestonesStart,
	setHelpSidebarProject, setHelpSidebarMilestone, setHelpSidebarFilter, setFilter, setMilestone,setProject,
} from '../../redux/actions';
const allMilestones = {id:null,title:'Any', label:'Any',value:null};
const dashboard = {id:null,title:'Dashboard', label:'Dashboard',value:null};

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
					this.props.setHelpSidebarProject(dashboard);
					this.props.setProject(null);
					this.props.setHelpSidebarMilestone(allMilestones);
					this.props.setMilestone(null);
					this.props.setHelpSidebarFilter(null);
					this.props.setFilter({
						status:[],
						requester:null,
						company:null,
						assigned:null,
						workType:null,
						statusDateFrom:'',
						statusDateTo:'',
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
					this.props.setHelpSidebarMilestone(allMilestones);
					this.props.setMilestone(null);
					this.props.setHelpSidebarFilter(null);
					this.props.setFilter({
						status:[],
						requester:null,
						company:null,
						assigned:null,
						workType:null,
						statusDateFrom:'',
						statusDateTo:'',
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
					this.props.setHelpSidebarFilter(null);
					this.props.setFilter({
						status:[],
						requester:null,
						company:null,
						assigned:null,
						workType:null,
						statusDateFrom:'',
						statusDateTo:'',
						updatedAt:(new Date()).getTime()
					});
					this.props.history.push('/helpdesk/taskList/i/all');
				}
			}
		]
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
			return (filter.status.length===0||(task.status && filter.status.includes(task.status.id))) &&
			(filter.requester===null||(task.requester && task.requester.id===filter.requester)||(task.requester && filter.requester==='cur' && task.requester.id === this.props.currentUser.id)) &&
			(filter.workType===null||(task.type===filter.workType)) &&
			(filter.company===null||(task.company && task.company.id===filter.company) ||(task.company && filter.company==='cur' && task.company.id===this.props.currentUser.userData.company)) &&
			(filter.assigned===null||(task.assignedTo && task.assignedTo.map((item)=>item.id).includes(filter.assigned))||(task.assignedTo && filter.requester==='cur' && task.assignedTo.map((item)=>item.id).includes(this.props.currentUser.id))) &&
			(filter.statusDateFrom===''||task.statusChange >= filter.statusDateFrom) &&
			(filter.statusDateTo===''||task.statusChange <= filter.statusDateTo) &&
			(filter.closeDateFrom===''||filter.closeDateFrom===undefined||task.closeDate >= filter.closeDateFrom) &&
			(filter.closeDateTo===''||filter.closeDateTo===undefined||task.closeDate <= filter.closeDateTo) &&
			(filter.pendingDateFrom===''||filter.pendingDateFrom===undefined||task.pendingDate >= filter.pendingDateFrom) &&
			(filter.pendingDateTo===''||filter.pendingDateTo===undefined||task.pendingDate <= filter.pendingDateTo) &&
			(this.props.project===null||(task.project && task.project.id===this.props.project))&&
			(this.props.currentUser.userData.role.value===3||(currentPermissions && currentPermissions.read)) &&
			(this.props.milestone===null||((task.milestone)&& task.milestone === this.props.milestone))
		})
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
				displayCol={(task)=>
					<li className="p-20" >
						<div className="m-b-0 font-15">
							<label><span className="text-muted font-15">#{task.id} | </span> {task.title}</label>
							<p className="pull-right m-0">
								<span className="label label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>{task.status?task.status.title:'Neznámy status'}</span>
							</p>
						</div>
						<div className="m-t-0 font-12">
							<p className="pull-right m-b-0">
									<i className="fa fa-clock-o" /> <span> <span className="text-muted">Dealine:</span> {task.deadline?timestampToString(task.deadline):'None'}</span>
							</p>
							<p className="m-b-0">
								<span>
									<span className="text-muted">Requested by: </span>
											{task.requester?(" " + task.requester.name+' '+task.requester.surname):' Neznámy používateľ '}
									<span className="text-muted">{task.company ? ` from ${task.company.title} on ` : " from Unknown on "}</span>
											{task.createdAt?timestampToString(task.createdAt):'None'}
									</span>
							</p>
							<p className="m-b-0">
								<span style={{textOverflow: 'ellipsis'}}><span className="text-muted">Assigned to: </span>{task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.name+' '+user.surname+', ','').slice(0,-2):'Neznámy používateľ'}</span>
							</p>
						</div>

							<div className="taskList-tags">
								{task.tags.map((tag)=>
									<span key={tag.id} className="label label-info m-r-5" style={{backgroundColor: tag.color, color: "white"}}>{tag.title}</span>
								)}
							</div>

					</li>
				}
				filterName="help-tasks"
				displayValues={[
					{value:'id',label:'ID',type:'int'},
					{value:'title',label:'Title',type:'text'},
					{value:'status',label:'Status',type:'object'},
					{value:'requester',label:'Requester',type:'user'},
					{value:'company',label:'Company',type:'object'},
					{value:'assignedTo',label:'Assigned to',type:'list',func:(items)=>
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
					{value:'assignedTo',label:'Assigned to',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
					{value:'createdAt',label:'Created at',type:'date'},
					//		{value:'tags',label:'Tags',type:'list',func:((cur,item)=>cur+item.title+' ')},
					{value:'deadline',label:'Deadline',type:'date'}
				]}
				dndGroupAttribute="status"
				dndGroupData={this.props.statuses}
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
				 />
		);
	}
}

const mapStateToProps = ({ userReducer, filterReducer, taskReducer, storageCompanies, storageHelpTags, storageUsers, storageHelpProjects, storageHelpStatuses,storageHelpTasks,storageHelpFilters, storageHelpMilestones, helpSidebarStateReducer }) => {
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
	 };
};

export default connect(mapStateToProps, { setTasksOrderBy, setTasksAscending ,
	storageCompaniesStart,storageHelpTagsStart,storageUsersStart,storageHelpProjectsStart,storageHelpStatusesStart,storageHelpTasksStart, storageHelpFiltersStart, setTasklistLayout, storageHelpMilestonesStart,
	setHelpSidebarProject, setHelpSidebarMilestone, setHelpSidebarFilter, setFilter, setMilestone, setProject,
})(TasksIndex);
