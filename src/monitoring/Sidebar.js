import React, { Component } from 'react';
import {NavItem, Nav, Modal, Button} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import SelectPage from '../components/SelectPage';
import MailServersEdit from './mailServers/allMailServersEdit';
import BackupTasksEdit from './backupTasks/allBackupTasksEdit';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openedEditServers: false,
			openedEditBackupTasks: false,
		};
		this.toggleEditServers.bind(this);
		this.toggleEditBackupTasks.bind(this);
	}

	componentWillMount(){
	}

	componentWillUnmount(){
	}

	toggleEditServers(){
		this.setState({openedEditServers:!this.state.openedEditServers})
	}

	toggleEditBackupTasks(){
		this.setState({openedEditBackupTasks:!this.state.openedEditBackupTasks})
	}

	render() {
		return (
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<Nav vertical>
						<NavItem key={0}  className="sidebar-link">
							<Link
								className="text-basic sidebar-align sidebar-menu-item-link"
								key={0}
								to={{ pathname: `/monitoring/mail-notifications`  }}>
								Mail notifications
							</Link>
							<div className='sidebar-menu-item-btn'>
								<Button
									key={0}
									className='hidden-button full-width full-height'
									onClick={() => {this.setState({openedEditBackupTasks: true})}}
									>
									<i className="fa fa-cog"/>
								</Button>
							</div>
						</NavItem>

						<NavItem key={1}  className="sidebar-link">
							<Link
								className="text-basic sidebar-align sidebar-menu-item-link"
								key={1}
								to={{ pathname: `/monitoring/mail-servers`}}>
								Mail servers
							</Link>
						<div className='sidebar-menu-item-btn'>
								<Button
									key={1}
									className='hidden-button full-width full-height'
									onClick={() => {this.setState({openedEditServers: true})}}
									>
									<i className="fa fa-cog"/>
								</Button>
							</div>
						</NavItem>
					</Nav>

					<Modal isOpen={this.state.openedEditServers} toggle={this.toggleEditServers.bind(this)}>
						<MailServersEdit close={this.toggleEditServers.bind(this)}/>
					</Modal>

					<Modal isOpen={this.state.openedEditBackupTasks} toggle={this.toggleEditBackupTasks.bind(this)}>
						<BackupTasksEdit close={this.toggleEditBackupTasks.bind(this)}/>
					</Modal>

				</div>

			</div>
			);
		}
	}
