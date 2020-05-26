import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import {testing} from '../helperFunctions';
import {setTasklistLayout} from '../redux/actions';
import {rebase} from '../index';

import Sidebar from './components/sidebar';
import ErrorMessages from 'components/errorMessages';

import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';

import TaskList from './task';

import StatusList from './settings/statuses';
import ProjectList from './settings/projects';
import PausalList from './settings/pausals';
import UnitList from './settings/units';
import CompanyList from './settings/companies';
import TripTypeList from './settings/tripTypes';
import UserList from './settings/users';
import PriceList from './settings/prices';
import SupplierList from './settings/suppliers';
import SupplierInvoiceList from './settings/supplierInvoices';
import TagList from './settings/tags';
import TaskTypeList from './settings/taskTypes';
import ImapList from './settings/imaps';
import SMTPList from './settings/smtps';
import NotificationList from './notifications';

let settings = [
	{title:'Users',link:'users',minimalRole:1},
	{title:'Companies',link:'companies',minimalRole:1},
	{title:'Mesačné paušály firiem',link:'pausals',minimalRole:3},
	{title:'Projects',link:'projects',minimalRole:2},
	{title:'Statuses',link:'statuses',minimalRole:3},
	{title:'Units',link:'units',minimalRole:2},
	{title:'Prices',link:'pricelists',minimalRole:2},
	{title:'Supplier',link:'suppliers',minimalRole:2},
	{title:'Tags',link:'tags',minimalRole:2},
	{title:'Invoices',link:'supplierInvoices',minimalRole:2},
	{title:'Types',link:'taskTypes',minimalRole:2},
	{title:'Trip types',link:'tripTypes',minimalRole:2},
	{title:'Imaps',link:'imaps',minimalRole:3},
	{title:'SMTPs',link:'smtps',minimalRole:3},
]

class Navigation extends Component {
	constructor(props){
		super(props);
		this.setLayout.bind(this);
	}

	setLayout(layout){
		rebase.updateDoc('/users/'+this.props.currentUser.id, {tasklistLayout:layout})
		this.props.setTasklistLayout(layout);
	}

	render() {
		return (
			<div>
				<div className="page-header">
					<div className="center-ver row center flex">
						<SelectPage />
						<PageHeader {...this.props}
							showLayoutSwitch={true}
							setLayout={this.setLayout.bind(this)}
							layout={this.props.layout}
							dndLayout={true}
							calendarLayout={true}
							settings={settings} />
					</div>
				</div>

				<div className="row center center-ver">
						<Sidebar {...this.props} settings={settings} />
					<div className="main">
					<Route exact path="/helpdesk/errorMessages" component={ErrorMessages} />

					<Route exact path="/helpdesk" component={TaskList} />
					<Route exact path="/helpdesk/taskList" component={TaskList} />
					<Route exact path="/helpdesk/taskList/i/:listID" component={TaskList} />
					<Route exact path="/helpdesk/taskList/i/:listID/:taskID" component={TaskList} />
					<Route exact path="/helpdesk/notifications" component={NotificationList} />
					<Route exact path="/helpdesk/notifications/:notificationID/:taskID" component={NotificationList} />

					{((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 	0) || testing) && <div>
						<Route exact path='/helpdesk/settings/companies' component={CompanyList} />
						<Route exact path='/helpdesk/settings/companies/:id' component={CompanyList} />
						<Route exact path='/helpdesk/settings/users' component={UserList} />
						<Route exact path='/helpdesk/settings/users/:id' component={UserList} />
					</div>}
					{((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 	1) || testing) && <div>
						<Route exact path='/helpdesk/settings/projects' component={ProjectList} />
						<Route exact path='/helpdesk/settings/projects/:id' component={ProjectList} />
						<Route exact path='/helpdesk/settings/pausals' component={PausalList} />
						<Route exact path='/helpdesk/settings/pausals/:id' component={PausalList} />
						<Route exact path='/helpdesk/settings/units' component={UnitList} />
						<Route exact path='/helpdesk/settings/units/:id' component={UnitList} />
						<Route exact path='/helpdesk/settings/tripTypes' component={TripTypeList} />
						<Route exact path='/helpdesk/settings/tripTypes/:id' component={TripTypeList} />
						<Route exact path='/helpdesk/settings/pricelists' component={PriceList} />
						<Route exact path='/helpdesk/settings/pricelists/:id' component={PriceList} />
						<Route exact path='/helpdesk/settings/suppliers' component={SupplierList} />
						<Route exact path='/helpdesk/settings/suppliers/:id' component={SupplierList} />
						<Route exact path='/helpdesk/settings/supplierInvoices' component={SupplierInvoiceList} />
						<Route exact path='/helpdesk/settings/supplierInvoices/:id' component={SupplierInvoiceList} />
						<Route exact path='/helpdesk/settings/tags' component={TagList} />
						<Route exact path='/helpdesk/settings/tags/:id' component={TagList} />
						<Route exact path='/helpdesk/settings/taskTypes' component={TaskTypeList} />
						<Route exact path='/helpdesk/settings/taskTypes/:id' component={TaskTypeList} />
					</div>}
					{((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 	2) || testing) && <div>
						<Route exact path='/helpdesk/settings/statuses' component={StatusList} />
						<Route exact path='/helpdesk/settings/statuses/:id' component={StatusList} />
						<Route exact path='/helpdesk/settings/imaps' component={ImapList} />
						<Route exact path='/helpdesk/settings/imaps/:id' component={ImapList} />
						<Route exact path='/helpdesk/settings/smtps' component={SMTPList} />
						<Route exact path='/helpdesk/settings/smtps/:id' component={SMTPList} />
					</div>}
				</div>
			</div>
		</div>
	);
}
}

const mapStateToProps = ({taskReducer, userReducer}) => {
	return {layout:taskReducer.tasklistLayout, currentUser:userReducer };
};

export default connect(mapStateToProps, { setTasklistLayout })(Navigation);
