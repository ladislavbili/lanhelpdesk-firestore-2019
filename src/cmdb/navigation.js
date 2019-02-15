import React, {Component} from 'react';
import { Col } from 'react-bootstrap';
import {Route} from 'react-router-dom';

import Sidebar from './Components/Sidebar';

import ServerList from './Components/assets/servers/ServerList';
import ServerAdd from './Components/assets/servers/ServerAdd';
import ServerEdit from './Components/assets/servers/ServerEdit';

import CompanyList from './Components/assets/companies/CompanyList';
import CompanyAdd from './Components/assets/companies/CompanyAdd';
import CompanyEdit from './Components/assets/companies/CompanyEdit';

import StatusList from './Components/assets/statuses/StatusList';
import StatusAdd from './Components/assets/statuses/StatusAdd';
import StatusEdit from './Components/assets/statuses/StatusEdit';

import TypeList from './Components/assets/types/TypeList';
import TypeAdd from './Components/assets/types/TypeAdd';
import TypeEdit from './Components/assets/types/TypeEdit';

import PlaceList from './Components/assets/places/PlaceList';
import PlaceAdd from './Components/assets/places/PlaceAdd';
import PlaceEdit from './Components/assets/places/PlaceEdit';

import TaskList from './Components/assets/tasks/TaskList';

import UsersList from '../settings/users/UsersList';
import UserAdd from '../settings/users/UserAdd';
import UserEdit from '../settings/users/UserEdit';

import CompaniesList from '../settings/companies/CompaniesList';
import SettingsCompanyAdd from '../settings/companies/CompanyAdd';
import SettingsCompanyEdit from '../settings/companies/CompanyEdit';

export default class Navigation extends Component {
  render(){
    return(
      <div>
           <div>
              <Sidebar  {...this.props}/>
            </div>
            <div>
              <Route exact path='/cmdb/servers' component={ServerList} />
              <Route exact path='/cmdb/servers/add' component={ServerAdd } />
              <Route exact path='/cmdb/servers/edit/:id' component={ServerEdit }/>

              <Route exact path='/cmdb/companies' component={CompanyList} />
              <Route exact path='/cmdb/companies/add' component={CompanyAdd} />
              <Route exact path='/cmdb/companies/edit/:id' component={CompanyEdit} />

              <Route exact path='/cmdb/statuses' component={StatusList} />
              <Route exact path='/cmdb/statuses/add' component={StatusAdd} />
              <Route exact path='/cmdb/statuses/edit/:id' component={StatusEdit} />

              <Route exact path='/cmdb/types' component={TypeList} />
              <Route exact path='/cmdb/types/add' component={TypeAdd} />
              <Route exact path='/cmdb/types/edit/:id' component={TypeEdit} />

              <Route exact path='/cmdb/places' component={PlaceList} />
              <Route exact path='/cmdb/places/add' component={PlaceAdd} />
              <Route exact path='/cmdb/places/edit/:id' component={PlaceEdit} />

              <Route exact path='/cmdb/tasks' component={TaskList} />

              <Route exact path='/cmdb/settings/companies' component={CompaniesList} />
              <Route exact path='/cmdb/settings/companies/add' component={SettingsCompanyAdd} />
              <Route exact path='/cmdb/settings/companies/edit/:companyID' component={SettingsCompanyEdit} />
              <Route exact path='/cmdb/settings/users' component={UsersList} />
              <Route exact path='/cmdb/settings/users/add' component={UserAdd} />
              <Route exact path='/cmdb/settings/users/edit/:userID' component={UserEdit} />
            </div>

      </div>
    )
  }
}
