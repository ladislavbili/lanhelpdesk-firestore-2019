import React, { Component } from 'react';
import base from '../../firebase';
import ReactTable from 'react-table';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default class TaskList extends Component{

  constructor(props){
    super(props);
    this.state = {
      users:[]
    }
    this.getLocation.bind(this);
    this.remove.bind(this);
  }

  componentWillMount(){
    this.ref2 = base.bindToState(`settings-users`, {
      context: this,
      state: 'users',
      asArray: true
    });
  }

  remove(row){
    if (window.confirm("Are you sure you want to delete user "+row.original.username+"?")) {
      base.remove(`settings-users/`+row.original.id);
    } else {
      return;
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref2);
  }

  getLocation(){
    let url = this.props.history.location.pathname;
    if(url.includes('cmdb')){
      return '/cmdb';
    }else if(url.includes('helpdesk')){
      return '/helpdesk';
    }else{
      return '/lanwiki';
    }
  }

  render(){
    const tableSetting=[
      {
      Header: 'ID',
      accessor: 'id',
      },{
      Header: 'Title',
      accessor: 'username'},
    {
      Header: '',
      accessor: 'edit',
      Cell : row => {
            return (
              <div>
                <Link className="table-action-btn" to={{pathname: `users/edit/${row.original.id}`}}>
                    <i class="md md-edit" />
                </Link>
                <a href="#" className="table-action-btn" onClick={() => {
                    this.remove(row)}
                  }>
                    <i class="md md-close" />
                  </a>
              </div>
          )
      }
    }];
    const DATA =[...this.state.users];
    return (
      <div className='content-page'>
        <div className="content">
          <div className="container-fluid">

            <div className="row m-t-10 m-b-10 m-l-5 m-r-5">
              <div class="d-flex flex-row align-items-center">
                <h4 className="page-title">Users</h4>
              </div>
              <div class="p-2 ml-auto">
                <Button bsStyle="success" onClick={()=>this.props.history.push(this.getLocation()+'/settings/users/add')} style={{marginLeft:10}}>
                  Add user
                </Button>
              </div>
            </div>


            {(DATA.length > 0) &&
              <ReactTable
                data={DATA}
                columns={tableSetting}
                defaultPageSize={DATA.length}
                showPagination={false}
                /> }
          </div>
        </div>
      </div>
    );
  }
}
