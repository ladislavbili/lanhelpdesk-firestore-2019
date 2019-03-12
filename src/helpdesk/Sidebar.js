import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import SelectPage from '../SelectPage';
import TaskAdd from './task/taskAdd';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
		};
	}
	render() {
		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<div id="sidebar-menu">
						<li className="menu-title" style={{ paddingBottom: '0px !important' }}>
							Project
							<span className="pull-right">
								<i className="fa fa-plus" />
							</span>
						</li>
						<li className="menu-title" style={{ paddingTop: '0px !important' }}>
							<button
								type="button"
								className="btn btn-outline-secondary btn-rounded waves-effect"
								style={{ width: 210, textAlign: 'left' }}
							>
								<i className="fa fa-folder-open" /> ALL PROJECTS
							</button>
						</li>
							<button
								className="btn btn-success"
								style={{ width: '100%' }}
								onClick={()=>{this.setState({openAddTaskModal:true})}}
							> Add task
							</button>
						<hr />
						<li className="menu-title">
							FILTERS
							<span className="pull-right">
								EDIT
							</span>
						</li>

						<ul className="sidebar-menu">
							<li>
								<NavLink className="" to={{ pathname: `/helpdesk/taskList` }}>
									All Tasks
								</NavLink>
							</li>
						</ul>
						<hr />
					</div>
				</div>
				<Modal  bsSize="large" show={this.state.openAddTaskModal} className="show" onHide={()=>this.setState({openAddTaskModal:false})}>
					<Modal.Body>
						<TaskAdd toggle={()=>this.setState({openAddTaskModal:!this.state.openAddTaskModal})}/>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-secondary"
							onClick={()=>{this.setState({openAddTaskModal:false})}}
						> Close
						</button>
					</Modal.Footer>
				</Modal>

			</div>
		);
	}
}
