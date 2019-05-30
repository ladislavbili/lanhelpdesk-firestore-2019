import React, { Component } from 'react';
import TasksTwoEdit from './TasksTwoEdit';
import {rebase} from '../../index';
import { connect } from "react-redux";
import {timestampToString} from '../../helperFunctions';

class TasksRow extends Component {

	constructor(props){
		super(props);
		this.state={
			tasks:[],
			statuses:[],
			projects:[],
			users:[],
			tags:[]
		}
	}
	componentWillMount(){
		this.ref1 = rebase.listenToCollection('/tasks', {
			context: this,
			withIds: true,
			then:content=>{this.setState({tasks:content })},
		});
		this.ref2 = rebase.listenToCollection('/statuses', {
			context: this,
			withIds: true,
			then:content=>{this.setState({statuses:content })},
		});
		this.ref3 = rebase.listenToCollection('/projects', {
			context: this,
			withIds: true,
			then:content=>{this.setState({projects:content })},
		});
		this.ref4 = rebase.listenToCollection('/users', {
			context: this,
			withIds: true,
			then:content=>{this.setState({users:content })},
		});
		this.ref5 = rebase.listenToCollection('/help-tags', {
			context: this,
			withIds: true,
			then:content=>{this.setState({tags:content })},
		});
	}

	filterTasks(tasks){
		let newTasks=tasks.map((task)=>{
			return {
				...task,
				tags:this.state.tags.filter((tag)=>task.tags && task.tags.includes(tag.id))
			}
		});
		return newTasks.filter((task)=>{
			return (this.props.filter.status===null||task.status.id===this.props.filter.status) &&
			(this.props.filter.requester===null||task.requester.id===this.props.filter.requester) &&
			(this.props.filter.company===null||task.company===this.props.filter.company) &&
			(this.props.filter.assigned===null||task.assigned.id===this.props.filter.assigned) &&
			(this.props.filter.statusDateFrom===''||task.statusChange >= this.props.filter.statusDateFrom) &&
			(this.props.filter.statusDateTo===''||task.statusChange <= this.props.filter.statusDateTo) &&
			((task.status?task.status.title:'')+task.title+task.id+
				(task.deadline?timestampToString(task.deadline):'')+
				(task.requester?(task.requester.email+task.requester.name+' '+task.requester.surname):'')+
				(task.statusChange?timestampToString(task.statusChange):'')+
				(task.tags.reduce(((cur,item)=>cur+item.title+' '),''))+
				(task.assigned?(task.assigned.email+task.assigned.name+' '+task.assigned.surname):'')
			).toLowerCase().includes(this.props.search.toLowerCase()) &&

			(this.props.project===null||task.project.id===this.props.project)
				}
			);
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
		rebase.removeBinding(this.ref2);
		rebase.removeBinding(this.ref3);
		rebase.removeBinding(this.ref4);
		rebase.removeBinding(this.ref5);
	}

	render() {
		let tasks = this.state.tasks.map((task)=>{
			let newTask={...task};
			newTask.status=this.state.statuses.find((status)=>status.id===task.status);
			newTask.project=this.state.projects.find((project)=>project.id===task.project);
			newTask.assigned=this.state.users.find((user)=>user.id===task.assigned);
			newTask.requester=this.state.users.find((user)=>user.id===task.requester);
			return newTask;
		})

		return (
			<div>
				<div className="row p-0" style={{ background: "white" }}>
					<div className="col-lg-4 p-0 scrollable fit-with-header">
						{
							this.filterTasks(tasks).map((task)=>
							<ul
								className={"sortable-list taskList list-unstyled clickable"+(this.props.match.params.taskID===task.id?' active selected-item':'')}
								id="upcoming"
								onClick={()=>{this.props.history.push('/helpdesk/taskList/'+task.id)}}
								key={task.id} >
								<li className="" style={{ border: "none", borderBottom: "1px solid #ddd", borderRadius: 0, paddingBottom:task.tags.length===0?21:0 }}>
									<div className="m-b-0">
										<label>#{task.id} {task.title}</label>
									</div>
									<div className="m-t-5">
										<p className="pull-right text-muted m-b-0 font-13">
											<span className="label label-info">{task.status?task.status.title:'Neznámy status'}</span>
										</p>
										<p className="text-muted m-b-0 font-13">
											<span className="">Zadal: {task.requester?(task.requester.name+' '+task.requester.surname):'Neznámy používateľ'}</span>
										</p>
										<p className="pull-right text-muted m-b-0 font-13">
											<i className="fa fa-clock-o" /> <span>{task.statusChange?timestampToString(task.statusChange):'None'}</span>
										</p>
										<p className="text-muted m-b-0 font-13">
											<span className="">Riesi: {task.assigned?(task.assigned.name+' '+task.assigned.surname):'Neznámy používateľ'}</span>
										</p>
									</div>
									<p className="pull-right text-muted m-b-0 font-13">
										<i className="fa fa-clock-o" /> <span>{task.deadline?timestampToString(task.deadline):'None'}</span>
									</p>
									{task.tags.map((tag)=>
										<span key={tag.id} className="label label-info m-r-5">{tag.title}</span>
									)}
								</li>
							</ul>
						)
					}

					</div>
					<div className="col-lg-8 p-0">
						{
							this.props.match.params.taskID && this.props.match.params.taskID==='add' && <TasksTwoEdit />
						}
						{
							this.props.match.params.taskID && this.props.match.params.taskID!=='add' && this.state.tasks.some((item)=>item.id===this.props.match.params.taskID) &&
							<TasksTwoEdit match={this.props.match} columns={true} />
						}

					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ filterReducer }) => {
	const { project, filter, search } = filterReducer;
	return { project, filter, search };
};

export default connect(mapStateToProps, {  })(TasksRow);
