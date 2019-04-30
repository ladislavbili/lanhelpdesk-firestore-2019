import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import ServerList from './servers';
import StatusList from './statuses';
import ServerAdd from './servers/serverAdd';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">
						<PageHeader {...this.props} />
						<Route exact path='/cmdb/settings/statuses' component={StatusList} />
						<Route exact path='/cmdb/servers' component={ServerList} />
						<Route exact path='/cmdb/settings/status/add' component={ServerAdd} />
					</div>
				</div>
			</div>
		);
	}
}
