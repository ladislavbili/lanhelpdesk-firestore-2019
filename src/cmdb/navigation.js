import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';
import ServerList from './servers';

import StatusList from './statuses';
import ServerAdd from './servers/serverAdd';
import ServerEdit from './servers/serverEdit';

import ItemList from './items';
import ItemAdd from './items/itemAdd';
import ItemEdit from './items/itemEdit';

export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div className="row">
						<Sidebar {...this.props} />
					<div className="flex">
						<PageHeader {...this.props} settings={[{link:'statuses', title:'Statuses'}]} />

						<Route exact path='/cmdb/settings/statuses' component={StatusList} />
						<Route exact path='/cmdb/settings/status/add' component={ServerAdd} />

						<Route exact path='/cmdb/servers' component={ServerList} />
						<Route exact path='/cmdb/server/add' component={ServerAdd} />
						<Route exact path='/cmdb/servers/:id' component={ServerEdit} />

							<Route exact path='/cmdb/items' component={ItemList} />
							<Route exact path='/cmdb/item/add' component={ItemAdd} />
							<Route exact path='/cmdb/item/:id' component={ItemEdit} />
					</div>
				</div>
			</div>
		);
	}
}
