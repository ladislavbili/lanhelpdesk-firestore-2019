import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import {testing} from '../helperFunctions';
import {setTasklistLayout} from '../redux/actions';
import {rebase} from '../index';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';

import TaskList from './task';

import StatusList from './settings/statuses';
import ProjectList from './settings/projects';
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

let settings = [
	{title:'Users',link:'users'},
	{title:'Companies',link:'companies'},
	{title:'Projects',link:'projects'},
	{title:'Statuses',link:'statuses'},
	{title:'Units',link:'units'},
	{title:'Prices',link:'pricelists'},
	{title:'Supplier',link:'suppliers'},
	{title:'Tags',link:'tags'},
	{title:'Invoices',link:'supplierInvoices'},
	{title:'Types',link:'taskTypes'},
	{title:'Trip types',link:'tripTypes'},
	{title:'Imaps',link:'imaps'},
	{title:'SMTPs',link:'smtps'},
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
				<div className="row">
						<Sidebar {...this.props} settings={settings} />
					<div className="main">

					<PageHeader {...this.props}
						showLayoutSwitch={true}
						setLayout={this.setLayout.bind(this)}
						layout={this.props.layout}
						dndLayout={true}
						settings={settings} />

					<Route exact path="/helpdesk" component={TaskList} />
					<Route exact path="/helpdesk/taskList" component={TaskList} />
					<Route exact path="/helpdesk/taskList/i/:listID" component={TaskList} />
					<Route exact path="/helpdesk/taskList/i/:listID/:taskID" component={TaskList} />

				{((this.props.currentUser.userData && this.props.currentUser.userData.role.value===3) || testing) && <div>
						<Route exact path='/helpdesk/settings/statuses' component={StatusList} />
	          <Route exact path='/helpdesk/settings/statuses/:id' component={StatusList} />
	          <Route exact path='/helpdesk/settings/projects' component={ProjectList} />
	          <Route exact path='/helpdesk/settings/projects/:id' component={ProjectList} />
	          <Route exact path='/helpdesk/settings/units' component={UnitList} />
	          <Route exact path='/helpdesk/settings/units/:id' component={UnitList} />
	          <Route exact path='/helpdesk/settings/companies' component={CompanyList} />
	          <Route exact path='/helpdesk/settings/companies/:id' component={CompanyList} />
	          <Route exact path='/helpdesk/settings/tripTypes' component={TripTypeList} />
	          <Route exact path='/helpdesk/settings/tripTypes/:id' component={TripTypeList} />
	          <Route exact path='/helpdesk/settings/users' component={UserList} />
	          <Route exact path='/helpdesk/settings/users/:id' component={UserList} />
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
