import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import SelectPage from '../SelectPage';

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
		const projects = [
			{ value: 'hotline@lansystems.sk', label: 'hotline@lansystems.sk' },
			{ value: 'Mertel CRM', label: 'Mertel CRM' },
			{ value: 'All', label: 'All' },
		];

		const selectStyle = {
			control: styles => ({ ...styles, backgroundColor: 'white', maxHeight: 30 }),
		};

		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="sidebar-inner slimscrollleft">
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
						<hr />
						<li className="menu-title">
							FILTERS
							<span className="pull-right">
								EDIT
							</span>
						</li>

						<ul className="sidebar-menu">
							<li>
								<Link className="" to={{ pathname: `/helpdesk/taskList` }}>
									Riešiť
								</Link>
								<Link className="" to={{ pathname: `/helpdesk/taskList` }}>
									Odložené
								</Link>
								<Link className="" to={{ pathname: `/helpdesk/taskList` }}>
									Zatvorené
								</Link>
								<Link className="" to={{ pathname: `/helpdesk/taskList` }}>
									Zadané
								</Link>
								<Link className="" to={{ pathname: `/helpdesk/taskList` }}>
									Opakujúce
								</Link>
							</li>
						</ul>
						<hr />
					</div>
				</div>
			</div>
		);
	}
}
