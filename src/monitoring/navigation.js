import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import MailServerAdd from './mailServers/mailServerAdd';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex main">
						<PageHeader {...this.props} showLayoutSwitch={true} settings={[]} />
						<Route exact path='/monitoring/mail-servers' component={List} />
						<Route exact path='/monitoring/mail-servers/edit/:itemID' component={List} />
						<Route exact path='/monitoring/mail-servers/add' component={MailServerAdd} />
					</div>
				</div>
			</div>
		);
	}
}
