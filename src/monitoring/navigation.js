import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import MailServersList from './mailServers';
import MailServerAdd from './mailServers/mailServerAdd';

import BackupTasksList from './backupTasks';
import BackupTaskAdd from './backupTasks/backupTaskAdd';

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


							<Route exact path='/monitoring/backup-tasks' component={BackupTasksList} />
							<Route exact path='/monitoring/backup-tasks/edit/:itemID' component={BackupTasksList} />
							<Route exact path='/monitoring/backup-tasks/add' component={BackupTaskAdd} />
					</div>
				</div>
			</div>
		);
	}
}
