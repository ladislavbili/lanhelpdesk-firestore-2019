import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import ListExample from './listExample';
import StatusList from './statuses';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">
						<PageHeader {...this.props} />
						<Route exact path='/cmdb' component={ListExample} />
						<Route exact path='/cmdb/:id' component={ListExample} />
						<Route exact path='/cmdb/settings/statuses' component={StatusList} />
					</div>
				</div>
			</div>
		);
	}
}
