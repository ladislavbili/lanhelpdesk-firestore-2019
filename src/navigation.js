import React, {Component} from 'react';
import {Route} from 'react-router-dom';


import Reroute from './reroute';
import HelpdeskNavigation from './helpdesk/navigation';
import CMDBNavigation from './cmdb/navigation';
import LanWikiNavigation from './lanwiki/navigation';
import PassManagerNavigation from './passmanager/navigation';
import ExpendituresNavigation from './expenditures/navigation';


export default class Navigation extends Component {
  render(){
    return(
      <div>
          <div>
            <Route exact path='/' component={Reroute} />
            <Route path='/helpdesk' component={HelpdeskNavigation} />
            <Route path='/cmdb' component={CMDBNavigation} />
            <Route path='/lanwiki' component={LanWikiNavigation} />
            <Route path='/passmanager' component={PassManagerNavigation} />
            <Route path='/expenditures' component={ExpendituresNavigation} />
         </div>
      </div>
    )
  }
}
