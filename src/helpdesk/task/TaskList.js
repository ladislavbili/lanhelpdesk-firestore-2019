import React, { Component } from 'react';
import TasksBoard from './TasksBoard';
import TasksRow from './TasksRow';
import TasksTwo from './TasksTwo';
import {Button} from 'reactstrap';
import { connect } from "react-redux";
import {setSearch, setFilter} from '../../redux/actions';


class TaskListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: this.props.search,
			taskListType: 'option3',
			filterView: false,
			sortType: 0,
		};
	}
	render() {
		return (
			<div className="content-page">

				<div className="content" style={{ paddingTop: 0 }}>

					<div className="container-fluid">

						<div className="d-flex flex-row align-items-center">
							{this.state.filterView && (
								<div className="p2" style={{}}>
									<div className="button-list" style={{ marginRight: 10 }}>
										<button type="button" className="btn btn-primary btn-xs waves-effect waves-light">
											Apply
									</button>
										<button type="button" className="btn btn-primary waves-effect waves-light btn-xs">
											Save
									</button>
										<button type="button" className="btn btn-primary waves-effect waves-light btn-xs">
											Delete
									</button>
									</div>
								</div>
							)}

							<div className="p2" style={{}}>
							</div>
							<div className="p-2">
								<div className="input-group">
									<input
										type="text"
										className="form-control"
										value={this.state.search}
										onChange={(e)=>this.setState({search:e.target.value})}
										placeholder="Search task name"
										style={{ width: 200 }}
									/>
									<div className="input-group-append">
										<button className="btn btn-search" type="button" onClick={()=>this.props.setSearch(this.state.search)}>
											<i className="fa fa-search" />
										</button>
									</div>
								</div>
							</div>
							<div className="p-2">
								<Button
									onClick={()=>{
										let body={
											requester:null,
											company:null,
											assigned:null,
											workType:null,
											status:null,
							        statusDateFrom:'',
							        statusDateTo:'',
							        updatedAt:(new Date()).getTime()
							      }
							      this.props.setFilter(body);
									}}
									color="link">
									Global search
								</Button>
							</div>
							<div className="ml-auto p-2 align-self-center">
								{' '}
								<button type="button" className="btn btn-link waves-effect">
									<i
										className="fas fa-copy"
										style={{
											color: '#4a81d4',
											fontSize: '1.2em',
										}}
									/>
									<span style={{
										color: '#4a81d4',
										fontSize: '1.2em',
									}}> COPY</span>
								</button>
							</div>
							<div className="">
								{' '}
								<button type="button" className="btn btn-link waves-effect">
									<i
										className="fas fa-print"
										style={{
											color: '#4a81d4',
											fontSize: '1.2em',
										}}
									/>
									<span style={{
										color: '#4a81d4',
										fontSize: '1.2em',
									}}> SERVISNY LIST</span>
								</button>
							</div>
							<div className="">
								{' '}
								<button type="button" className="btn btn-link waves-effect">
									<i
										className="fas fa-print"
										style={{
											color: '#4a81d4',
											fontSize: '1.2em',
										}}
									/>
									<span style={{
										color: '#4a81d4',
										fontSize: '1.2em',
									}}> CENOVA PONUKA</span>
								</button>
							</div>
							<div className="">
								<div className="btn-group btn-group-toggle" data-toggle="buttons">
									<label
										className={
											'btn btn-outline-blue waves-effect waves-light' +
											(this.state.taskListType === 'option1' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option1"
											autoComplete="off"
											checked={this.state.taskListType === 'option1'}
											onChange={() => this.setState({ taskListType: 'option1' })}
										/>
										<i className="fa fa-list" />
									</label>
									<label
										className={
											'btn btn-outline-blue waves-effect waves-light' +
											(this.state.taskListType === 'option2' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option2"
											autoComplete="off"
											onChange={() => this.setState({ taskListType: 'option2' })}
											checked={this.state.taskListType === 'option2'}
										/>
										<i className="fa fa-map" />
									</label>

									<label
										className={
											'btn btn-outline-blue waves-effect waves-light' +
											(this.state.taskListType === 'option3' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option3"
											autoComplete="off"
											onChange={() => this.setState({ taskListType: 'option3' })}
											checked={this.state.taskListType === 'option3'}
										/>
										<i className="fa fa-columns" />
									</label>
								</div>
							</div>
						</div>
					</div>

					<div className="row m-0">
						{this.state.taskListType === 'option2' && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksRow history={this.props.history} match={this.props.match}/>{' '}
							</div>
						)}

						{this.state.taskListType === 'option1' && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksBoard history={this.props.history} match={this.props.match}/>
							</div>
						)}

						{this.state.taskListType === 'option3' && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksTwo history={this.props.history} match={this.props.match}/>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ filterReducer }) => {
	return { search:filterReducer.search };
};

export default connect(mapStateToProps, { setSearch, setFilter })(TaskListContainer);
