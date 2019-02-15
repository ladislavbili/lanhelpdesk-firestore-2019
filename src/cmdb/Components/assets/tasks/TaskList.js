import React, { Component } from 'react';
import {Col} from 'react-bootstrap';

import firebase from 'firebase';
import DataTable from '../../DataTable';
import TaskAddModal from './TaskAddModal';
import TaskEdit from './TaskEdit';

export default class TaskList extends Component{

  constructor(props){
    super(props);
    this.state =
      {
        task : null,
      };

    this.loadColumnNames.bind(this);
    this.loadAddButton.bind(this)
    this.remove.bind(this);
    this.chosenTask.bind(this);
  }

  remove(row){
    firebase.database()
            .ref(`cmdb-tasks/${row.original.id}`)
            .remove();
  }

  loadAddButton(){
    return (
      <div className="row m-b-10 m-l-5 m-r-5">
        <div class="d-flex flex-row align-items-center">
          <h4 className="page-title">Tasks</h4>
        </div>
        <div class="p-2 ml-auto">
            <TaskAddModal />
        </div>
      </div>
    );
  }

  loadColumnNames(){
      return [{
        Header: 'Title',
        accessor: 'title',
        Cell : row => <div
                onClick={() => this.chosenTask(row.original)}
                dangerouslySetInnerHTML={{
                    __html: row.original.title
                }}
              />

        }];/*[{
                Header: 'Title',
                accessor: 'title',
                Cell : row => {
                      return (
                        <div>
                          <TaskEdit info={row.original} />
                        </div>
                    )
                }
              },{
                Header: 'Description',
                accessor: 'description',
              },{
                Header: 'Status',
                accessor: 'status',
              },{
                Header: 'Made by',
                accessor: 'by',
              },{
                Header: 'Solved by',
                accessor: 'solves',
              },{
                Header: '',
                accessor: 'edit',
                Cell : row => {
                      return (
                        <div>
                          <TaskEditModal info={row.original} />
                        </div>
                    )
                },
                filterMethod: (filter, row) => true,
              }];*/
  }

  chosenTask(task){
    this.setState({ task })
  }

  render(){
      const COLUMNS = this.loadColumnNames();
      return (
        <div>

        {
          ( this.state.task !== null &&
            <div className='form-group row'>
              <div className='col-6' >
                <DataTable chosenTask={this.chosenTask.bind(this)} database={'cmdb-tasks'} columns={COLUMNS} loadButton={this.loadAddButton.bind(this)} />
              </div>
              <div className='col-6' >
                <TaskEdit info={this.state.task} close={() => {this.setState({ task : null }) }}/>
              </div>
           </div>  )

           ||

           <DataTable chosenTask={this.chosenTask.bind(this)} database={'cmdb-tasks'} columns={COLUMNS} loadButton={this.loadAddButton.bind(this)} />
         }
       </div>
      );
  }
}
