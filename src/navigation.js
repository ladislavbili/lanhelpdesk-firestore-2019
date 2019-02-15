import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import PageHeader from './PageHeader';
import Reroute from './reroute';
import HelpdeskNavigation from './helpdesk/navigation';

export default class Navigation extends Component {
  render(){
    return(
      <div>
          <div>
            <Route exact path='/' component={Reroute} />
            <Route path='/helpdesk' component={HelpdeskNavigation} />
         </div>
      </div>
    )
  }
}
