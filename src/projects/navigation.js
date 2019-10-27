import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import {testing} from '../helperFunctions';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import TagList from './tags'

class Navigation extends Component {
	render() {
		if((this.props.currentUser.userData===null||!this.props.currentUser.userData.isAgent)&&!testing){
			return null
		}
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex main">
						<PageHeader {...this.props} showLayoutSwitch={true} settings={[{title:'Tags',link:'tags'}]} />
						<Route exact path='/projects/:projectID/:milestoneID' component={List} />
						<Route exact path='/projects/:projectID/:milestoneID/edit/:taskID' component={List} />
						<Route exact path='/projects/settings/tags' component={TagList} />
	          <Route exact path='/projects/settings/tags/:id' component={TagList} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ userReducer}) => {
	return { currentUser:userReducer };
};

export default connect(mapStateToProps, {  })(Navigation);
