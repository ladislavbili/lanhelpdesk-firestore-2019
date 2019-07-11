import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import AddPassword from './list/addPassword';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex main">
						<PageHeader {...this.props} showLayoutSwitch={true} />
						<Route exact path='/passmanager/i/:listID' component={List} />
						<Route exact path='/passmanager/add' component={AddPassword} />
						<Route exact path='/passmanager/i/:listID/:passID' component={List} />
					</div>
				</div>
			</div>
		);
	}
}
