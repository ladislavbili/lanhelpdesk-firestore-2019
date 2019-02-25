import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl } from 'react-bootstrap';
import Comments from '../components/comments.js';
import Subtasks from '../components/subtasks';
import Items from '../components/taskMaterials';
import TasksTwoEdit from './TasksTwoEdit';
import TaskTop3 from './TaskTop3';
import {rebase} from '../../index';
import {timestampToString} from '../../helperFunctions';

const tableStyle = {
	border: 'none',
};



export default class TasksRow extends Component {

	constructor(props){
		super(props);
		this.state={
			tasks:[],
			statuses:[],
			projects:[],
			users:[]
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
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
		rebase.removeBinding(this.ref2);
		rebase.removeBinding(this.ref3);
		rebase.removeBinding(this.ref4);
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
							tasks.map((task)=>
							<ul
								className={"sortable-list taskList list-unstyled clickable"+(this.props.match.params.taskID===task.id?' active selected-item':'')}
								id="upcoming"
								onClick={()=>{this.props.history.push('/helpdesk/taskList/'+task.id)}}
								key={task.id} >
								<li className="" style={{ border: "none", borderBottom: "1px solid #ddd", borderRadius: 0 }}>
									<div className="checkbox checkbox-primary m-b-0">
										<input type="checkbox" aria-label="Single checkbox Two" />
										<label>#ID {task.title}</label>
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
									<span className="label label-info m-r-5">Neimplementované</span>
									<span className="label label-info m-r-5">Tag 1</span>
									<span className="label label-success m-r-5">Tag 2</span>
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
