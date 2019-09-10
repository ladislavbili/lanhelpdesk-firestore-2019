import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import MailServersList from './mailServers';
import MailServerAdd from './mailServers/add';

import NotificationServersList from './notificationServers';
import NotificationServersAdd from './notificationServers/add';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex main">
						<PageHeader {...this.props} showLayoutSwitch={true} settings={[]} />

						<Route exact path='/monitoring/mail-servers' component={MailServersList} />
						<Route exact path='/monitoring/mail-servers/edit/:itemID' component={MailServersList} />
						<Route exact path='/monitoring/mail-servers/add' component={MailServerAdd} />


							<Route exact path='/monitoring/mail-notifications' component={NotificationServersList} />
							<Route exact path='/monitoring/mail-notifications/edit/:itemID' component={NotificationServersList} />
							<Route exact path='/monitoring/mail-notifications/add' component={NotificationServersAdd} />
					</div>
				</div>
			</div>
		);
	}
}
