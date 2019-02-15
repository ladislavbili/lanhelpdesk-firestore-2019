import React, { Component } from 'react';
import {
	Button,
	Modal,
	Badge,
	InputGroup,
	Glyphicon,
	FormControl,
	DropdownButton,
	MenuItem,
	Nav,
	Dropdown,
} from 'react-bootstrap';
import TasksBoard from './TasksBoard';
import TasksRow from './TasksRow';
import Filter from './Filter';
import TasksTwo from './TasksTwo';
import { Link } from 'react-router-dom';

const sortTypes = [{ id: 0, name: 'Name' }, { id: 1, name: 'Created' }, { id: 2, name: 'Deadline' }];

export default class TaskListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
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
						{/*
						<div className="row">
							<div className="col-sm-6">
								<h4 className="page-title" style={{ fontSize: 24 }}>
									All Tasks
								</h4>
							</div>
						</div>
						*/}

						<div class="d-flex flex-row align-items-center">
							{this.state.filterView && (
								<div className="p2" style={{}}>
									<div class="button-list" style={{ marginRight: 10 }}>
										<button type="button" class="btn btn-primary btn-xs waves-effect waves-light">
											Apply
									</button>
										<button type="button" class="btn btn-primary waves-effect waves-light btn-xs">
											Save
									</button>
										<button type="button" class="btn btn-primary waves-effect waves-light btn-xs">
											Delete
									</button>
									</div>
								</div>
							)}

							<div className="p2" style={{}}>
								<button
									class="btn btn-primary waves-effect waves-light btn-xs"
									onClick={() => this.setState({ filterView: !this.state.filterView })}
								>
									<i class="fa fa-filter" />
								</button>
							</div>
							<div class="p-2">
								<div class="input-group">
									<input
										type="text"
										class="form-control"
										placeholder="Search task name"
										style={{ width: 200 }}
									/>
									<div class="input-group-append">
										<button class="btn btn-white" type="button">
											<i class="fa fa-search" />
										</button>
									</div>
								</div>
							</div>
							<div class="p-2">
								<Link
									className=""
									to={{ pathname: `/demoHelpdesk/TaskListSearch` }}
									style={{ color: '#1976d2' }}
								>
									Global search
								</Link>
							</div>
							<div class="ml-auto p-2 align-self-center">
								{' '}
								<button type="button" class="btn btn-link waves-effect">
									<i
										class="fas fa-copy"
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
							<div class="">
								{' '}
								<button type="button" class="btn btn-link waves-effect">
									<i
										class="fas fa-print"
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
							<div class="">
								{' '}
								<button type="button" class="btn btn-link waves-effect">
									<i
										class="fas fa-print"
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
							<div class="">
								<div class="btn-group btn-group-toggle" data-toggle="buttons">
									<label
										class={
											'btn btn-outline-blue waves-effect waves-light' +
											(this.state.taskListType === 'option1' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option1"
											autocomplete="off"
											checked={this.state.taskListType === 'option1'}
											onChange={() => this.setState({ taskListType: 'option1' })}
										/>
										<i class="fa fa-list" />
									</label>
									<label
										class={
											'btn btn-outline-blue waves-effect waves-light' +
											(this.state.taskListType === 'option2' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option2"
											autocomplete="off"
											onChange={() => this.setState({ taskListType: 'option2' })}
											checked={this.state.taskListType === 'option2'}
										/>
										<i class="fa fa-map" />
									</label>

									<label
										class={
											'btn btn-outline-blue waves-effect waves-light' +
											(this.state.taskListType === 'option3' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option3"
											autocomplete="off"
											onChange={() => this.setState({ taskListType: 'option3' })}
											checked={this.state.taskListType === 'option3'}
										/>
										<i class="fa fa-columns" />
									</label>
								</div>
							</div>
						</div>
					</div>

					<div class="row m-0">
						{this.state.filterView && (
							<div className="col-xl-3">
								<Filter />
							</div>
						)}

						{this.state.taskListType === 'option2' && (
							<div class={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksRow />{' '}
							</div>
						)}

						{this.state.taskListType === 'option1' && (
							<div class={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksBoard />
							</div>
						)}

						{this.state.taskListType === 'option3' && (
							<div class={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksTwo />
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
