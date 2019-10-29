import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import {rebase} from '../index';

import {setLayout} from '../redux/actions';
import {testing} from '../helperFunctions';
import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import MailServersList from './mailServers';
import MailServerAdd from './mailServers/add';
import NotificationServersList from './notificationServers';
import NotificationServersAdd from './notificationServers/add';

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
		if((this.props.currentUser.userData===null||this.props.currentUser.userData.role.value < 1 )&&!testing){
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
							showLayoutSwitch={true} />

						<Route exact path='/monitoring/mail-servers' component={MailServersList} />
						<Route exact path='/monitoring/mail-servers/edit/:itemID' component={MailServersList} />
						<Route exact path='/monitoring/mail-servers/add' component={MailServerAdd} />


							<Route exact path='/monitoring/mail-notifications' component={NotificationServersList} />
							<Route exact path='/monitoring/mail-notifications/edit/:itemID' component={NotificationServersList} />
							<Route exact path='/monitoring/mail-notifications/add' component={NotificationServersAdd} />
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
