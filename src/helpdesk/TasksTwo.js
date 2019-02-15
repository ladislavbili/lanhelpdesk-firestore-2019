import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl } from 'react-bootstrap';
import Comments from './components/comments.js';
import Subtasks from './components/subtasks.js';
import Items from './components/items.js';
import TasksTwoEdit from './TasksTwoEdit';
import TaskTop3 from './TaskTop3';

const tableStyle = {
	border: 'none',
};

export default class TasksRow extends Component {
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
			<div>
				<div className="row p-0" style={{ background: "white" }}>
					<div className="col-lg-4 p-0">


						<ul className="sortable-list taskList list-unstyled " id="upcoming" >
							<li className="" style={{ border: "none", borderBottom: "1px solid #ddd", borderRadius: 0 }}>
								<div className="checkbox checkbox-primary m-b-0">
									<input type="checkbox" aria-label="Single checkbox Two" />
									<label>#142 Nefunguje klavesnica</label>
								</div>

								<div className="m-t-5">
									<p className="pull-right text-muted m-b-0 font-13">
										<span class="label label-info">NEW</span>
									</p>
									<p className="text-muted m-b-0 font-13">
										<span className="">Zadal: Petey Cruiser</span>
									</p>
									<p className="pull-right text-muted m-b-0 font-13">
										<i className="fa fa-clock-o" /> <span>15/06/2016</span>
									</p>
									<p className="text-muted m-b-0 font-13">
										<span className="">Riesi: Petey Cruiser</span>
									</p>
								</div>
								<p className="pull-right text-muted m-b-0 font-13">
									<i className="fa fa-clock-o" /> <span>15/06/2016</span>
								</p>
								<span class="label label-info m-r-5">Tag 1</span>
								<span class="label label-success m-r-5">Tag 2</span>
							</li>
						</ul>

					</div>
					<div className="col-lg-8 p-0">
						<TasksTwoEdit />
					</div>
				</div>
			</div>
		);
	}
}
