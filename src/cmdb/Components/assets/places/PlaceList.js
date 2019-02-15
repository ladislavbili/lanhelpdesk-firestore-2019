import React, { Component } from 'react';
import firebase from 'firebase';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from '../../DataTable';

export default class PlaceList extends Component{

  constructor(props){
    super(props);
    this.loadColumnNames.bind(this);
    this.loadAddButton.bind(this);
    this.remove.bind(this);
  }

  remove(row){
    firebase.database()
            .ref(`cmdb-places/${row.original.id}`)
            .remove();
  }

  loadAddButton(){
    return (
      <div className="row m-b-10 m-l-5 m-r-5">
        <div class="d-flex flex-row align-items-center">
          <h4 className="page-title">Places</h4>
        </div>
        <div class="p-2 ml-auto">
          <Link className='DataTableAdd' to={{pathname: `places/add`}}>
            <button className='btn btn-success waves-effect waves-light btn-sm' >+ Add Place</button>
          </Link>
        </div>
      </div>);
  }

  loadColumnNames(){
      return [{
                Header: 'Room',
                accessor: 'room',
              },{
                Header: 'Street',
                accessor: 'street',
              },{
                Header: 'City',
                accessor: 'city',
              },{
                Header: 'State',
                accessor: 'state',
              },{
                Header: '',
                accessor: 'edit',
                Cell : row => {
                      return (
                        <div>
                          <Link className="table-action-btn" to={{pathname: `places/edit/${row.original.id}`}}>
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
          <DataTable database={'cmdb-places'} columns={COLUMNS} loadButton={this.loadAddButton.bind(this)} />
    );
  }
}
