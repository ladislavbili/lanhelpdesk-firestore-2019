import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import {setLayout} from '../redux/actions';
import {testing} from '../helperFunctions';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import AddPassword from './list/addPassword';

class Navigation extends Component {
	render() {
		if((this.props.currentUser.userData===null||this.props.currentUser.userData.role.value < 1 )&&!testing){
			return (
				<div>
				<div className="row">
					<div className="main">
						<PageHeader {...this.props} setLayout={this.props.setLayout} layout={this.props.layout} showLayoutSwitch={true} />
					</div>
				</div>
			</div>
			)
		}
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="main">
						<PageHeader {...this.props} setLayout={this.props.setLayout} layout={this.props.layout} showLayoutSwitch={true} />
						<Route exact path='/passmanager/i/:listID' component={List} />
						<Route exact path='/passmanager/add' component={AddPassword} />
						<Route exact path='/passmanager/i/:listID/:passID' component={List} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ userReducer, appReducer }) => {
	return { layout:appReducer.layout, currentUser:userReducer };
};

export default connect(mapStateToProps, { setLayout })(Navigation);
