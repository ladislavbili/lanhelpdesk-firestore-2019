import base from '../../firebase';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export default class Sidebar extends Component{

  constructor(props){
    super(props);
    this.state = {
        assets : []
    }
    this.isActive.bind(this);
  }

  componentDidMount(){
    this.ref = base.syncState(`assets`, {
      context: this,
      state: 'assets'
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  isActive(item){
      return this.props.location.pathname.toLowerCase().indexOf(item.toLowerCase()) > -1;
    }

  render(){
    return (
      <div className="left side-menu">
        <div className="sidebar-inner slimscrollleft">
					<div id="sidebar-menu">
            <ul className="sidebar-menu">
              {
              Object
                .keys(this.state.assets)
                .map(asset =>
                    <li className="sidebar-menu">
                      <Link className='' to={{pathname: `/cmdb/${this.state.assets[asset].toLowerCase()}`}}  key={this.state.assets[asset]}>
                          {this.state.assets[asset]}
                      </Link>
                    </li>
                  )
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }

}
