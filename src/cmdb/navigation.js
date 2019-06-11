import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';

import SidebarItemAdd from './settings/sidebarItemAdd';
import StatusList from './settings/statuses';
import ItemList from './items';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">
						<PageHeader {...this.props} settings={[{link:'statuses', title:'Statuses'}]} />
						
						<Route exact path='/cmdb/add' component={SidebarItemAdd} />
						<Route exact path='/cmdb/i/:itemID' component={ItemList} />

						<Route exact path='/cmdb/settings/statuses' component={StatusList} />
						<Route exact path='/cmdb/settings/status/add' component={StatusList} />
					</div>
				</div>
			</div>
		);
	}
}
