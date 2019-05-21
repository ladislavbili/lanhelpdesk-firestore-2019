import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import TaskEdit from './list/taskEdit';
import "../scss/projects.scss";

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">
						<PageHeader {...this.props} />
						<Route exact path='/projects/:projectID' component={List} />
						<Route exact path='/projects/:projectID/edit/:taskID' component={TaskEdit} />
					</div>
				</div>
			</div>
		);
	}
}
