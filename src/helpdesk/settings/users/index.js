import React, { Component } from 'react';
import {Button } from 'reactstrap';
import UserAdd from './userAdd';
import UserEdit from './userEdit';
import {rebase} from '../../../index';

import { connect } from "react-redux";
import {storageUsersStart, storageCompaniesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class UsersList extends Component{
  constructor(props){
    super(props);
    this.state={
      users:[],
      companies: [],
      userFilter:''
    }
  }

  componentWillReceiveProps(props){
    if (!sameStringForms(props.users, this.props.users)){
      this.setState({users: props.users})
    }
    if (!sameStringForms(props.companies, this.props.companies)){
      this.setState({companies: props.companies})
    }
  }

  componentWillMount(){
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    this.setState({users:this.props.users, companies: this.props.companies});
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
                    value={this.state.userFilter}
                    onChange={(e)=>this.setState({userFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=> this.props.history.push('/helpdesk/settings/users/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> User
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10">
  							Users
  						</h2>
              <table className="table table-hover">
                <tbody>
                  {this.state.users.filter((item)=>item.email.toLowerCase().includes(this.state.userFilter.toLowerCase())).sort((user1,user2)=>user1.email>user2.email?1:-1).map((user)=>
                    <tr
                      key={user.id}
                      className={"clickable" + (this.props.match.params.id === user.id ? " sidebar-item-active":"")}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                      onClick={()=>this.props.history.push('/helpdesk/settings/users/'+user.id)}>
                      <td
                        className={(this.props.match.params.id === user.id ? "text-highlight":"")}
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {user.email}
                      </td>
                      <td  className={(this.props.match.params.id === user.id ? " sidebar-item-active":"") }
                        style={{maxWidth: "200px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }} >
                        {(this.state.companies.filter(company => company.id === user.company)[0] ? this.state.companies.filter(company => company.id === user.company)[0].title  : "NEZARADENÉ")}
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
              this.props.match.params.id && this.props.match.params.id==='add' && <UserAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.users.some((item)=>item.id===this.props.match.params.id) && <UserEdit match={this.props.match} history={this.props.history}/>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageUsers, storageCompanies}) => {
  const { usersActive, users } = storageUsers;
  const { companiesActive, companies } = storageCompanies;
  return { usersActive, users, companiesActive, companies };
};

export default connect(mapStateToProps, { storageUsersStart, storageCompaniesStart })(UsersList);
