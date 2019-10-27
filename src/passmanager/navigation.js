import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import {testing} from '../helperFunctions';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import AddPassword from './list/addPassword';

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

const mapStateToProps = ({ userReducer}) => {
	return { currentUser:userReducer };
};

export default connect(mapStateToProps, {  })(Navigation);
