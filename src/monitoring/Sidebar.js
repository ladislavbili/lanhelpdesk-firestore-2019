import React, { Component } from 'react';
import {NavItem, Nav, Modal, Button} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import SelectPage from '../components/SelectPage';
import MailServersEdit from './mailServers/allMailServersEdit';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openedEditServers: false,
		};
		this.toggleEdit.bind(this);
	}

	componentWillMount(){
	}

	componentWillUnmount(){
	}

	toggleEdit(){
		this.setState({openedEditServers:!this.state.openedEditServers})
	}

	render() {
		return (
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<div className="text-basic sidebar-align">
						Monitoring
					</div>
					<Nav vertical>
						<NavItem key={0}  className="sidebar-link">
							<Link
								className="text-basic sidebar-align sidebar-menu-item-link"
								key={0}
								to={{ pathname: `/monitoring/backup-tasks`  }}>
								Backup tasks
							</Link>
							<div className='sidebar-menu-item-btn'>
								<Button
									key={0}
									className='hidden-button full-width full-height'
									onClick={() => {/*this.setState({openedEditServers: true})*/}}
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

					<Modal isOpen={this.state.openedEditServers} toggle={this.toggleEdit.bind(this)}>
						<MailServersEdit close={this.toggleEdit.bind(this)}/>
					</Modal>

				</div>

			</div>
			);
		}
	}
