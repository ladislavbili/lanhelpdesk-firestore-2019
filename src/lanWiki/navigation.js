import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import { Col } from 'react-bootstrap';
import Sidebar from './Sidebar';

import Article from './Article';
import ArticleList from './ArticleList';
import ArticleEdit from './ArticleEdit';
import ArticleAdd from './ArticleAdd';

import UsersList from '../settings/users/UsersList';
import UserAdd from '../settings/users/UserAdd';
import UserEdit from '../settings/users/UserEdit';

import CompaniesList from '../settings/companies/CompaniesList';
import CompanyAdd from '../settings/companies/CompanyAdd';
import CompanyEdit from '../settings/companies/CompanyEdit';

export default class Navigation extends Component {
  render(){
    return(
      <div>
        <div>
          <div>
            <Sidebar  {...this.props}/>
          </div>
          <div>
            <Route exact path='/lanwiki/tag/:tagID' component={ArticleList} />
            <Route exact path='/lanwiki/tag/:tagID/add/article' component={ArticleAdd} />
            <Route exact path='/lanwiki/tag/:tagID/article/:articleID' component={Article} />
            <Route exact path='/lanwiki/tag/:tagID/article/:articleID/edit' component={ArticleEdit} />

            <Route exact path='/lanwiki/settings/companies' component={CompaniesList} />
            <Route exact path='/lanwiki/settings/companies/add' component={CompanyAdd} />
            <Route exact path='/lanwiki/settings/companies/edit/:companyID' component={CompanyEdit} />
            <Route exact path='/lanwiki/settings/users' component={UsersList} />
            <Route exact path='/lanwiki/settings/users/add' component={UserAdd} />
            <Route exact path='/lanwiki/settings/users/edit/:userID' component={UserEdit} />
          </div>
       </div>
      </div>
    )
  }
}
