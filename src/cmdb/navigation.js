import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { connect } from "react-redux";
import {testing} from '../helperFunctions';
import Sidebar from './Sidebar';
import PageHeader from '../components/PageHeader';

import SidebarItemAdd from './settings/sidebarItemAdd';
import SidebarItemEdit from './settings/sidebarItemEdit';
import StatusList from './settings/statuses';
import ItemList from './items';
import ItemAdd from './items/itemAdd';
import ItemContainer from './items/itemContainer';

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
						<PageHeader {...this.props} settings={[{link:'statuses', title:'Statuses'}]} />

						<Route exact path='/cmdb/add' component={SidebarItemAdd} />
						<Route exact path='/cmdb/edit/:sidebarID' component={SidebarItemEdit} />
						<Route exact path='/cmdb/i/:sidebarID' component={ItemList} />
						<Route exact path='/cmdb/i/:sidebarID/i/add' component={ItemAdd} />
						<Route exact path='/cmdb/i/:sidebarID/:itemID' component={ItemContainer} />


						<Route exact path='/cmdb/settings/statuses' component={StatusList} />
						<Route exact path='/cmdb/settings/status/add' component={StatusList} />
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
