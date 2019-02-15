import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import PageHeader from './PageHeader';
import Reroute from './reroute';
import CMDBNavigation from './cmdb/navigation';
import LanWikiNavigation from './lanWiki/navigation';
import HelpdeskNavigation from './helpdesk/navigation';
import DemoHelpdeskNavigation from './demoHelpdesk/navigation';

export default class Navigation extends Component {
  render(){
    return(
      <div>
        <PageHeader {...this.props}/>
          <div>
            <Route exact path='/' component={Reroute} />
            <Route path='/cmdb' component={CMDBNavigation} />
            <Route path='/lanwiki' component={LanWikiNavigation} />
            <Route path='/helpdesk' component={HelpdeskNavigation} />
            <Route path='/demoHelpdesk' component={DemoHelpdeskNavigation} />
         </div>
      </div>
    )
  }
}
