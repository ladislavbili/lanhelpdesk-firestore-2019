import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import TaskEdit from './list/taskEdit';
import TagList from './tags'
import "../scss/projects.scss";

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex main">
						<PageHeader {...this.props} settings={[{title:'Tags',link:'tags'}]} />
						<Route exact path='/projects/:projectID' component={List} />
						<Route exact path='/projects/:projectID/edit/:taskID' component={TaskEdit} />
						<Route exact path='/projects/settings/tags' component={TagList} />
	          <Route exact path='/projects/settings/tags/:id' component={TagList} />
					</div>
				</div>
			</div>
		);
	}
}
