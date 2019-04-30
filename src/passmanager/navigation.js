import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import List from './list';
import AddPassword from './list/addPassword';
import EditPassword from './list/editPassword';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">
						<PageHeader {...this.props} />
						<Route exact path='/passmanager/:id' component={List} />
						<Route exact path='/passmanager/:id/add' component={AddPassword} />
						<Route exact path='/passmanager/:id/edit/:passID' component={EditPassword} />
					</div>
				</div>
			</div>
		);
	}
}
