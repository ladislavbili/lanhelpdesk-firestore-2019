import React, { Component } from 'react';
import {Button } from 'reactstrap';
import RoleAdd from './roleAdd';
import RoleEdit from './roleEdit';

import { connect } from "react-redux";

const ROLES = [
  {label:'Guest',value:-1},
  {label:'User',value:0},
  {label:'Agent',value:1},
  {label:'Manager',value:2},
  {label:'Admin',value:3},
];

class RolesList extends Component{
  constructor(props){
    super(props);
    this.state={
      roles:[],
      roleFilter: "",
    }
  }

  componentWillReceiveProps(props){
  }

  componentWillMount(){
  }

  render(){
    return (
			<div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.roleFilter}
                    onChange={(e)=>this.setState({roleFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=> this.props.history.push('/helpdesk/settings/roles/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Role
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row p-l-10 p-b-10">
                <h2 className="">
    							Roles
    						</h2>
              </div>
              <table className="table table-hover">
                <tbody>
                  {ROLES.map((role)=>
                    <tr
                      key={role.value}
                      className={"clickable" + (this.props.match.params.id === role.label ? " sidebar-item-active":"")}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                      onClick={()=>this.props.history.push('/helpdesk/settings/roles/'+role.label)}>
                      <td
                        className={(this.props.match.params.id === role.label ? "text-highlight":"")}
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {role.label}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <RoleAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && ROLES.some((item)=>item.label===this.props.match.params.id) && <RoleEdit match={this.props.match} history={this.props.history}/>
              }
          </div>
        </div>
      </div>
    );
  }
}


export default connect()(RolesList);
