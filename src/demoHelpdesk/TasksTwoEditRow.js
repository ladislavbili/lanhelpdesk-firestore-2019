import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl } from 'react-bootstrap';
import Comments from './components/comments.js';
import Subtasks from './components/subtasks.js';
import Items from './components/items.js';
import TasksTwoEdit from './TasksTwoEdit';

const tableStyle = {
	border: 'none',
};

export default class TasksTwoEditRow extends Component {
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
			<div class="content-page">
				<div className="content">
					<div className="container-fluid" style={{ maxWidth: 1000, margin: 'auto' }}>
						<div className="row">
							<div className="col-lg-12">
								<TasksTwoEdit />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
