import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import AddExpenditure from './list/addExpenditure';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex main">
						<PageHeader {...this.props} showLayoutSwitch={true} />
						<Route exact path='/expenditures/add' component={AddExpenditure} />
						<Route exact path='/expenditures/i/:listID' component={List} />
						<Route exact path='/expenditures/i/:listID/:expID' component={List} />
					</div>
				</div>
			</div>
		);
	}
}
