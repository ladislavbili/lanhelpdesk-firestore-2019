import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import { Col } from 'react-bootstrap';
import Sidebar from './Sidebar';

import TaskListContainer from './TaskListContainer';

import CompaniesList from '../settings/companies/CompaniesList';
import CompanyAdd from '../settings/companies/CompanyAdd';
import CompanyEdit from '../settings/companies/CompanyEdit';

import UsersList from '../settings/users/UsersList';
import UserAdd from '../settings/users/UserAdd';
import UserEdit from '../settings/users/UserEdit';

export default class Navigation extends Component {
  render(){
    return(
      <div>
        <div>
          <Col xs={1} className='noPadding'>
            <Sidebar  {...this.props}/>
          </Col>
          <Col xs={11} className='noPadding'>
            <Route exact path='/helpdesk/filter/:id' component={TaskListContainer} />

            <Route exact path='/helpdesk/settings/companies' component={CompaniesList} />
            <Route exact path='/helpdesk/settings/companies/add' component={CompanyAdd} />
            <Route exact path='/helpdesk/settings/companies/edit/:companyID' component={CompanyEdit} />
            <Route exact path='/helpdesk/settings/users' component={UsersList} />
            <Route exact path='/helpdesk/settings/users/add' component={UserAdd} />
            <Route exact path='/helpdesk/settings/users/edit/:userID' component={UserEdit} />
          </Col>
       </div>
      </div>
    )
  }
}
