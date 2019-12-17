import React, { Component } from 'react';
import {Button } from 'reactstrap';
import UserAdd from './userAdd';
import UserEdit from './userEdit';

import { connect } from "react-redux";
import {storageUsersStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class UsersList extends Component{
  constructor(props){
    super(props);
    this.state={
      users:[],
      userFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.users,this.props.users)){
      this.setState({users:props.users})
    }
  }

  componentWillMount(){
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    this.setState({users:this.props.users});
  }

  render(){
    return (
				<div className="content">
					<div className="commandbar">
              <div className="search">
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.userFilter}
                    onChange={(e)=>this.setState({userFilter:e.target.value})}
                    placeholder="Search"
                  />
                <button className="search-btn" type="button">
                  <i className="fa fa-search" />
                </button>
              </div>
              <Button
        				className="btn-link center-hor"
        				onClick={()=>this.props.history.push('/helpdesk/settings/users/add')}>
        			 <i className="fa fa-plus p-l-5 p-r-5"/> Add user
        			</Button>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h4 className="font-24 p-b-10">
  							Users
  						</h4>
              <table className="table table-hover">
                <tbody>
                  {this.state.users.filter((item)=>item.email.toLowerCase().includes(this.state.userFilter.toLowerCase())).sort((user1,user2)=>user1.email>user2.email?1:-1).map((user)=>
                    <tr
                      key={user.id}
                      className={"clickable" + (this.props.match.params.id === user.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/users/'+user.id)}>
                      <td className={(this.props.match.params.id === user.id ? "text-highlight":"")}>
                        {user.email}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8">
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

const mapStateToProps = ({ storageUsers}) => {
  const { usersActive, users } = storageUsers;
  return { usersActive, users };
};

export default connect(mapStateToProps, { storageUsersStart })(UsersList);
