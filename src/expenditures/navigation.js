import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import AddExpenditure from './list/addExpenditure';
import EditExpenditure from './list/editExpenditure';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">
						<PageHeader {...this.props} />
						<Route exact path='/expenditures/:id' component={List} />
						<Route exact path='/expenditures/:id/add' component={AddExpenditure} />
						<Route exact path='/expenditures/:id/edit/:expID' component={EditExpenditure} />
					</div>
				</div>
			</div>
		);
	}
}
