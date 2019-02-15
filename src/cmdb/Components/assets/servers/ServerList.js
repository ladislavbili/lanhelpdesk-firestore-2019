import React, { Component } from 'react';
import firebase from 'firebase';
import base from '../../../../firebase';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from '../../DataTable';

export default class ServerList extends Component{

  constructor(props){
    super(props);
    this.loadColumnNames.bind(this);
    this.loadAddButton.bind(this);
    this.remove.bind(this);
  }

  componentDidMount(){
    this.ref1 = base.syncState(`cmdb-nics`, {
        context: this,
        state: 'nics',
        asArray: true
      });

    this.ref2 = base.syncState(`cmdb-backup-tasks`, {
        context: this,
        state: 'backupTasks',
        asArray: true
      });
  }

  componentWillUnmount(){
    base.removeBinding(this.ref1);
      base.removeBinding(this.ref2);
  }

  remove(row){
    if (window.confirm("Are you sure you want to delete this server? Note: It's NICs and Backup Tasks will be deleted as well.")) {
      base.remove(`cmdb-servers/${row.original.id}`);
      const NICsToRemove = this.state.nics
                          .filter(nic => nic.serverID === ''+row.original.id)
                          .map(nic => nic.id);

      NICsToRemove.forEach(id => base.remove(`cmdb-nics/${id}`))

      const BTsToRemove = this.state.backupTasks
                          .filter(bt => bt.serverID === row.original.id)
                          .map(bt => bt.id);

      BTsToRemove.forEach(id => base.remove(`cmdb-backup-tasks/${id}`))
    } else {
      return;
    }
  }

  loadAddButton(){
    return (
      <div className="row m-b-10 m-l-5 m-r-5">
        <div class="d-flex flex-row align-items-center">
          <h4 className="page-title">Servers</h4>
        </div>
        <div class="p-2 ml-auto">
          <Link className='DataTableAdd' to={{pathname: `servers/add`}}>
            <button className='btn btn-success waves-effect waves-light btn-sm' >+ Add Server</button>
          </Link>
        </div>
      </div>);

  }

  loadColumnNames(){
      return [{
                Header: 'Name',
                accessor: 'serverName',
              }, {
                Header: 'Company Name',
                accessor: 'companyName',
              },{
                Header: 'Action',
                accessor: 'edit',
                Cell : row => {
                      return (
                        <div>
                          <Link className="table-action-btn" to={{pathname: `servers/edit/${row.original.id}`}}>
                              <i class="md md-edit" />
                          </Link>
                          <a href="#" className="table-action-btn" onClick={() => {
                              this.remove(row)}
                            }>
                              <i class="md md-close" />
                            </a>
                        </div>
                    )
                },
                filterMethod: (filter, row) => true,
              }];
  }

  render(){
    const COLUMNS = this.loadColumnNames();
    return (
         <DataTable database={'cmdb-servers'} header='Servers' columns={COLUMNS} loadButton={this.loadAddButton.bind(this)} />
    );
  }
}
