import React, { Component } from 'react';
import firebase from 'firebase';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from '../../DataTable';

export default class CompanyList extends Component{

  constructor(props){
    super(props);
    this.loadColumnNames.bind(this);
    this.loadAddButton.bind(this);
    this.remove.bind(this);
  }

  remove(row){
    firebase.database()
            .ref(`settings-companies/${row.original.id}`)
            .remove();
  }

  loadAddButton(){
    return (
      <Link className='DataTableAdd' to={{pathname: `companies/add`}}>
        <Button bsStyle="success" className='DataTableAddButton' >+ Add Company</Button>
      </Link>);
  }

  loadColumnNames(){
      return [{
                Header: 'Name',
                accessor: 'companyName',
              },{
                Header: '',
                accessor: 'edit',
                Cell : row => {
                      return (
                        <div>
                          <Link className="table-action-btn" to={{pathname: `companies/edit/${row.original.id}`}}>
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
          <DataTable database={'settings-companies'} columns={COLUMNS} loadButton={this.loadAddButton.bind(this)} />
    );
  }
}
