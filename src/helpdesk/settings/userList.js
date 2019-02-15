import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../../index';
import UserAdd from './userAdd';
import UserEdit from './userEdit';

export default class UsersList extends Component{
  constructor(props){
    super(props);
    this.state={
      users:[]
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
      <div className="row flex container container-padding center-ver">
        <div className="col-6">
          <FormGroup>
            <InputGroup>
              <FormControl type="text" onChange={(e)=>this.setState({userFilter:e.target.value})} />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Table striped condensed hover>
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
          </Table>
        </div>
        <div className="col-6 withSeparator">
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
