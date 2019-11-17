import React, { Component } from 'react';
import {NavItem, Nav, Modal, Button} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import SelectPage from '../components/SelectPage';
import MailServersEdit from './mailServers/settings';
import NotificationServersEdit from './notificationServers/settings';

import classnames from "classnames";

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openedEditServers: false,
			openedEditNotifications: false,
		};
		this.toggleEditServers.bind(this);
		this.toggleEditNotificationServers.bind(this);
	}

	componentWillMount(){
	}

	componentWillUnmount(){
	}

	toggleEditServers(){
		this.setState({openedEditServers:!this.state.openedEditServers})
	}

	toggleEditNotificationServers(){
		this.setState({openedEditNotifications:!this.state.openedEditNotifications})
	}

	render() {
		return (
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<Nav vertical>
						<NavItem key={0}  className="row">
							<div className={classnames("sidebar-icon", {"active" : this.props.location.pathname.includes("mail-notifications")})}
								onClick={() => {this.setState({openedEditNotifications: true})}}
								>
									<i className="fa fa-cog"/>
							</div>
							<Link
								className="sidebar-menu-item"
								key={0}
								to={{ pathname: `/monitoring/mail-notifications`  }}>
								Mail notifications
							</Link>
						</NavItem>

						<NavItem key={1}  className="row">
						<div className={classnames("sidebar-icon", {"active" : this.props.location.pathname.includes("mail-servers")})}
							onClick={() => {this.setState({openedEditServers: true})}}
							>
									<i className="fa fa-cog"/>
							</div>
							<Link
								className=" sidebar-menu-item"
								key={1}
								to={{ pathname: `/monitoring/mail-servers`}}>
								Mail servers
							</Link>
						</NavItem>
					</Nav>

					<Modal isOpen={this.state.openedEditServers} toggle={this.toggleEditServers.bind(this)}>
						<MailServersEdit close={this.toggleEditServers.bind(this)}/>
					</Modal>

					<Modal isOpen={this.state.openedEditNotifications} toggle={this.toggleEditNotificationServers.bind(this)}>
						<NotificationServersEdit close={this.toggleEditNotificationServers.bind(this)}/>
					</Modal>

				</div>

			</div>
			);
		}
	}
