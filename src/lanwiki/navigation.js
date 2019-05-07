import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import ListExample from './listExample';

import ListNotes from './Notes/NoteList';
import TagEdit from './Tags/TagEdit';
import TagAdd from './Tags/TagAdd';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">
						<PageHeader {...this.props} />
						<Route exact path='/lanwiki/notes/:tagID/:noteID' component={ListNotes} />
            <Route exact path='/lanwiki/notes/:tagID' component={ListNotes} />
            <Route exact path='/lanwiki/notes' component={ListNotes} />

						<Route exact path='/lanwiki/tags/add' component={TagAdd} />
						<Route exact path='/lanwiki/tags/:tagID' component={TagEdit} />
					</div>
				</div>
			</div>
		);
	}
}
