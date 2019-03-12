import React, { Component } from 'react';
import {rebase} from '../../index';
import UserAdd from './userAdd';
import UserEdit from './userEdit';

export default class UsersList extends Component{
  constructor(props){
    super(props);
    this.state={
      users:[],
      userFilter:''
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/users', {
      context: this,
      withIds: true,
      then:content=>{this.setState({users:content, userFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return (
      <div className="row">
        <div className="col-lg-4">
          <div className="card-box fit-with-header scrollable">
          <div className="input-group">
            <input
              type="text"
              onChange={(e)=>this.setState({userFilter:e.target.value})}
              className="form-control"
              placeholder="Search task name"
              style={{ width: 200 }}
            />
            <div className="input-group-append">
              <button className="btn btn-white" type="button">
                <i className="fa fa-search" />
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mails m-0">
            <thead>
              <tr className="clickable">
                <th>User name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/users/add')}>
                <td>+ Add user</td>
              </tr>
              {this.state.users.filter((item)=>item.email.toLowerCase().includes(this.state.userFilter.toLowerCase())).map((user)=>
                <tr key={user.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/users/'+user.id)}>
                  <td>{user.email}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
        </div>
        <div className="col-lg-8 p-0">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <UserAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.users.some((item)=>item.id===this.props.match.params.id) && <UserEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
