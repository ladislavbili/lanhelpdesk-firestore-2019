import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import Reports from './reports';

import TaskList from './task/TaskList';

import StatusList from './settings/statusList';
import ProjectList from './settings/projectList';
import UnitList from './settings/unitList';
import CompanyList from './settings/companyList';
import WorkTypeList from './settings/workTypeList';
import UserList from './settings/userList';
import PriceList from './settings/priceList';
import SupplierList from './settings/supplierList';
import SupplierInvoiceList from './settings/supplierInvoiceList';
import TagList from './settings/tagList';


export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">

					<PageHeader {...this.props} settings={
						[{title:'Projects',link:'projects'},
						{title:'Statuses',link:'statuses'},
						{title:'Units',link:'units'},
						{title:'Companies',link:'companies'},
						{title:'Work Type',link:'workTypes'},
						{title:'Users',link:'users'},
						{title:'Prices',link:'pricelists'},
						{title:'Supplier',link:'suppliers'},
						{title:'Tags',link:'tags'},
						{title:'Invoices',link:'supplierInvoices'}]
					} />
					<Route exact path="/helpdesk/Reports" component={Reports} />
					<Route exact path="/helpdesk" component={TaskList} />
					<Route exact path="/helpdesk/taskList" component={TaskList} />
					<Route exact path="/helpdesk/taskList/:taskID" component={TaskList} />

					<Route exact path='/helpdesk/settings/statuses' component={StatusList} />
          <Route exact path='/helpdesk/settings/statuses/:id' component={StatusList} />
          <Route exact path='/helpdesk/settings/projects' component={ProjectList} />
          <Route exact path='/helpdesk/settings/projects/:id' component={ProjectList} />
          <Route exact path='/helpdesk/settings/units' component={UnitList} />
          <Route exact path='/helpdesk/settings/units/:id' component={UnitList} />
          <Route exact path='/helpdesk/settings/companies' component={CompanyList} />
          <Route exact path='/helpdesk/settings/companies/:id' component={CompanyList} />
          <Route exact path='/helpdesk/settings/workTypes' component={WorkTypeList} />
          <Route exact path='/helpdesk/settings/workTypes/:id' component={WorkTypeList} />
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
				</div>
			</div>
		</div>
	);
}
}
