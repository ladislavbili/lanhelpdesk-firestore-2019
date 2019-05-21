import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import {timestampToString} from '../../helperFunctions';
import TaskEditModal from './taskEditModal';

const statuses = [{id:0,title:'New'},{id:1,title:'Open'},{id:2,title:'Pending'},{id:3,title:'Closed'}]


export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			tasks:[],
			users:[],
			newTitle:'',
			statusFilter:[],
			statuses:[0,1,2,3],
			saving:false,
			openedID:null,
			editOpened:false
		};
		this.ref=null;
		this.fetchData.bind(this);
		this.addTask.bind(this);
		this.fetchData(this.props.match.params.projectID);
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.projectID!==props.match.params.projectID){
			rebase.removeBinding(this.ref);
			rebase.removeBinding(this.ref2);
			this.fetchData(props.match.params.projectID);
		}
	}

	fetchData(id){
		if(id==='all'){
			this.ref = rebase.listenToCollection('/proj-tasks', {
				context: this,
				withIds: true,
				then:tasks=>{this.setState({tasks})},
			});

		}else{
			this.ref = rebase.listenToCollection('/proj-tasks', {
				context: this,
				withIds: true,
				query: (ref) => ref.where('project', '==', id),
				then:tasks=>{this.setState({tasks})},
			});
		}

		this.ref2 = rebase.listenToCollection('/users', {
			context: this,
			withIds: true,
			then:users => {this.setState({users})},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
		rebase.removeBinding(this.ref2);
	}

	getData(){
		let tasks = this.state.tasks.map((item)=>{
			return{
				...item,
				assignedTo:this.state.users.find((user)=>user.id===item.assignedTo),
				assignedBy:this.state.users.find((user)=>user.id===item.assignedBy),
				status:statuses.find((status)=>status.id===item.status)
			}
		});
		return tasks.filter((item)=>
				item.status && this.state.statuses.includes(item.status.id)
			).filter((item)=>
			(item.title && item.title.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.createdAt && timestampToString(item.createdAt).toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.assignedTo && item.assignedTo.email.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.assignedBy && item.assignedBy.email.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.status && item.status.title.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.hours && item.hours.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.deadline && timestampToString(item.deadline).toLowerCase().includes(this.state.search.toLowerCase()))
		)
	}


	addTask(){
		this.setState({saving:true});
		rebase.addToCollection('/proj-tasks',
		{title:this.state.newTitle,
			project:this.props.match.params.projectID!=='all'?this.props.match.params.projectID:null,
			status:0,
			createdAt: (new Date()).getTime()
		})
		.then(()=>{
			this.setState({newTitle:'',saving:false})
		})
	}



	render() {
		return (
			<div>
				<div className="commandbar row">
					<div className="commandbar-item ml-2">
						<input
							type="text"
							value={this.state.search}
							className="form-control command-search"
							onChange={(e)=>this.setState({search:e.target.value})}
							placeholder="Search" />
					</div>
					<Button color="link">Global search</Button>
					<span className="center-hor ml-3" style={{color:'#095eb3'}}>
						<FormGroup check>
							<Input type="checkbox"
								id="check-new"
								checked={this.state.statuses.includes(0)}
								onClick={()=>{
									this.setState({
										statuses: this.state.statuses.includes(0)?this.state.statuses.filter((item)=>item!==0):[...this.state.statuses,0]
									})
								}} />{' '}
							<Label htmlFor="check-new" check className="clickable">
								New
							</Label>
						</FormGroup>
					</span>

					<span className="center-hor ml-3" style={{color:'#095eb3'}}>
						<FormGroup check>
							<Input type="checkbox"
								id="check-open"
								checked={this.state.statuses.includes(1)}
								onClick={()=>{
									this.setState({
										statuses: this.state.statuses.includes(1)?this.state.statuses.filter((item)=>item!==1):[...this.state.statuses,1]
									})
								}} />{' '}
							<Label htmlFor="check-open" check className="clickable">
								Open
							</Label>
						</FormGroup>
					</span>

					<span className="center-hor ml-3" style={{color:'#095eb3'}}>
						<FormGroup check>
							<Input type="checkbox"
								id="check-pending"
								checked={this.state.statuses.includes(2)}
								onClick={()=>{
									this.setState({
										statuses: this.state.statuses.includes(2)?this.state.statuses.filter((item)=>item!==2):[...this.state.statuses,2]
									})
								}} />{' '}
							<Label htmlFor="check-pending" check className="clickable">
								Pending
							</Label>
						</FormGroup>
					</span>

					<span className="center-hor ml-3" style={{color:'#095eb3'}}>
						<FormGroup check>
							<Input type="checkbox"
								id="check-close"
								checked={this.state.statuses.includes(3)}
								onClick={()=>{
									this.setState({
										statuses: this.state.statuses.includes(3)?this.state.statuses.filter((item)=>item!==3):[...this.state.statuses,3]
									})
								}} />{' '}
							<Label htmlFor="check-close" check className="clickable">
								Closed
							</Label>
						</FormGroup>
					</span>
				</div>
				<div className="fit-with-header scrollable">
					<h1>Tasks</h1>
						<div className="p-2 max-input-400">
							<div className="input-group">
								<input
									type="text"
									className="form-control"
									value={this.state.newTitle}
									onChange={(e)=>this.setState({newTitle:e.target.value})}
									placeholder="New task name"
									style={{ width: 200 }}
									onKeyPress={(e)=>{
		                if(e.key==='Enter' && !this.state.saving && this.state.newTitle!==''){
		                  this.addTask();
		                }
		              }}
								/>
								<div className="input-group-append">
									<button className="btn btn-search"
										type="button"
										disabled={this.state.saving || this.state.newTitle===''}
										onClick={this.addTask.bind(this)}>
										<i className="fa fa-plus" />
									</button>
								</div>
							</div>
						</div>
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
									<th>Created</th>
									<th>Title</th>
									<th>Assigned by</th>
									<th>Assigned to</th>
									<th>Status</th>
									<th>Deadline</th>
									<th>Hours</th>
								</tr>
							</thead>
							<tbody>
								{
									this.getData().map((item)=>
										<tr className="clickable" key={item.id} onClick={()=>this.setState({editOpened:true, openedID:item.id})}>
											<td>{item.createdAt?timestampToString(item.createdAt):'No date'}</td>
											<td>{item.title}</td>
											<td>{item.assignedBy?item.assignedBy.email:'No user'}</td>
											<td>{item.assignedTo?item.assignedTo.email:'No user'}</td>
											<td>{item.status.title}</td>
											<td>{item.deadline?timestampToString(item.deadline):'No deadline'}</td>
											<td>{item.hours?item.hours:0}</td>
										</tr>
									)
								}
							</tbody>
						</table>
					<TaskEditModal id={this.state.openedID} opened={this.state.editOpened} toggle={()=>this.setState({editOpened:!this.state.editOpened})} />
				</div>
			</div>
			);
		}
	}
