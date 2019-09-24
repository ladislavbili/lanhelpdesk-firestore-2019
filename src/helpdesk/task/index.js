import React, { Component } from 'react';
import { connect } from "react-redux";
import ShowData from '../../components/showData';
import {timestampToString, sameStringForms} from '../../helperFunctions';
import TaskEdit from './taskEditContainer';
import TaskEmpty from './taskEmpty';
import {setTasksOrderBy, setTasksAscending,storageCompaniesStart,storageHelpTagsStart,storageUsersStart,storageHelpProjectsStart,storageHelpStatusesStart,storageHelpTasksStart, storageHelpFiltersStart} from '../../redux/actions';


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
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.listID!==props.match.params.listID||!sameStringForms(props.filters,this.props.filters)){
			this.getFilterName(props.match.params.listID);
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

		this.getFilterName(this.props.match.params.listID);
	}

	getFilterName(id){
		if(!id){
			this.setState({filterName:''});
			return;
		}else if(id==='all'){
			this.setState({filterName:'All'});
			return;
		}
		let filter = this.props.filters.find((filter)=>filter.id===id);
		if(filter){
			this.setState({filterName:filter.title});
		}
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
		return newTasks.filter((task)=>{
			return (this.props.filter.status.length===0||(task.status && this.props.filter.status.includes(task.status.id))) &&
			(this.props.filter.requester===null||(task.requester && task.requester.id===this.props.filter.requester)||(task.requester && this.props.filter.requester==='cur' && task.requester.id === this.props.currentUser.id)) &&
			(this.props.filter.workType===null||(task.type===this.props.filter.workType)) &&
			(this.props.filter.company===null||(task.company && task.company.id===this.props.filter.company) ||(task.company && this.props.filter.company==='cur' && task.company.id===this.props.currentUser.userData.company)) &&
			(this.props.filter.assigned===null||(task.assignedTo && task.assignedTo.map((item)=>item.id).includes(this.props.filter.assigned))||(task.assignedTo && this.props.filter.requester==='cur' && task.assignedTo.map((item)=>item.id).includes(this.props.currentUser.id))) &&
			(this.props.filter.statusDateFrom===''||task.statusChange >= this.props.filter.statusDateFrom) &&
			(this.props.filter.statusDateTo===''||task.statusChange <= this.props.filter.statusDateTo) &&
			(this.props.project===null||(task.project && task.project.id===this.props.project))
		})
	}

	render() {
		console.log(this.filterTasks());
		let link='';
		if(this.props.match.params.hasOwnProperty('listID')){
			link = '/helpdesk/taskList/i/'+this.props.match.params.listID;
		}else{
			link = '/helpdesk/taskList'
		}
		return (
			<ShowData
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
						{/*
							<div className="taskList-tags">
								{task.tags.map((tag)=>
									<span key={tag.id} className="label label-info m-r-5">{tag.title}</span>
								)}
							</div>
						*/}
					</li>
				}
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
				 />
		);
	}
}

const mapStateToProps = ({ filterReducer, taskReducer, userReducer, storageCompanies, storageHelpTags, storageUsers, storageHelpProjects, storageHelpStatuses,storageHelpTasks,storageHelpFilters }) => {
	const { project, filter } = filterReducer;
	const { orderBy, ascending } = taskReducer;

	const { companiesActive, companies } = storageCompanies;
	const { tagsActive, tags } = storageHelpTags;
	const { usersActive, users } = storageUsers;
	const { projectsActive, projects } = storageHelpProjects;
	const { statusesActive, statuses } = storageHelpStatuses;
	const { tasksActive, tasks } = storageHelpTasks;
	const { filtersActive, filters } = storageHelpFilters;

	return { project, filter,orderBy,ascending, currentUser:userReducer,companiesActive, companies, tagsActive, tags, usersActive, users, projectsActive, projects, statusesActive, statuses, tasksActive, tasks, filtersActive, filters };
};

export default connect(mapStateToProps, { setTasksOrderBy, setTasksAscending ,storageCompaniesStart,storageHelpTagsStart,storageUsersStart,storageHelpProjectsStart,storageHelpStatusesStart,storageHelpTasksStart, storageHelpFiltersStart})(TasksIndex);
