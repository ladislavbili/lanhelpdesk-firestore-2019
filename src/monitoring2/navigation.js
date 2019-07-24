import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';

import SidebarItemAdd from './settings/sidebarItemAdd';
import SidebarItemEdit from './settings/sidebarItemEdit';
import StatusList from './settings/statuses';
import ItemList from './items';
import ItemAdd from './items/itemAdd';
import ItemContainer from './items/itemContainer';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex main">
						<PageHeader {...this.props} settings={[]} />

						<Route exact path='/monitoring/add' component={SidebarItemAdd} />
						<Route exact path='/monitoring/edit/:sidebarID' component={SidebarItemEdit} />
						<Route exact path='/monitoring/i/:sidebarID' component={ItemList} />
						<Route exact path='/monitoring/i/:sidebarID/i/add' component={ItemAdd} />
						<Route exact path='/monitoring/i/:sidebarID/:itemID' component={ItemContainer} />


						<Route exact path='/monitoring/settings/statuses' component={StatusList} />
						<Route exact path='/monitoring/settings/status/add' component={StatusList} />
					</div>
				</div>
			</div>
		);
	}
}
