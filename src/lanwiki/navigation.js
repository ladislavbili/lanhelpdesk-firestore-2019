import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
//import ListExample from './listExample';

import ListNotes from './Notes';
import TagEdit from './Tags/TagEdit';
import TagAdd from './Tags/TagAdd';
import "../scss/lanwiki.scss";

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex main">
						<PageHeader {...this.props} showLayoutSwitch={true} />
						<Route exact path='/lanwiki' component={ListNotes} />
            <Route exact path='/lanwiki/i/:listID' component={ListNotes} />
						<Route exact path='/lanwiki/i/:listID/:noteID' component={ListNotes} />

						<Route exact path='/lanwiki/tags/add' component={TagAdd} />
						<Route exact path='/lanwiki/tags/:tagID' component={TagEdit} />
					</div>
				</div>
			</div>
		);
	}
}
