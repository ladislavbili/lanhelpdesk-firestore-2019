import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import {rebase} from '../index';

import {setLayout} from '../redux/actions';
import {testing} from '../helperFunctions';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import List from './list';
import AddExpenditure from './list/addExpenditure';

class Navigation extends Component {
	constructor(props){
		super(props);
		this.setLayout.bind(this);
	}

	setLayout(layout){
		rebase.updateDoc('/users/'+this.props.currentUser.id, {generalLayout:layout})
		this.props.setLayout(layout);
	}

	render() {
		if((this.props.currentUser.userData===null||this.props.currentUser.userData.role.value < 2 )&&!testing){
			return (
				<div>
				<div className="row">
					<div className="main">
						<PageHeader {...this.props}
							setLayout={this.setLayout.bind(this)}
							layout={this.props.layout}
							showLayoutSwitch={true}
							/>
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
						<PageHeader {...this.props}
							setLayout={this.setLayout.bind(this)}
							layout={this.props.layout}
							showLayoutSwitch={true}
							/>
						<Route exact path='/expenditures/add' component={AddExpenditure} />
						<Route exact path='/expenditures/i/:listID' component={List} />
						<Route exact path='/expenditures/i/:listID/:expID' component={List} />
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
