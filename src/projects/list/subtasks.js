import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Input, Table } from 'reactstrap';

export default class Subtasks extends Component{
  constructor(props){
    super(props);
    this.state={
      newSubtask:'',
      subtasks:[]
    }
    this.submitSubtask.bind(this);
    this.getData.bind(this);
    this.getData(this.props.id);
  }

  getData(id){
      database.collection('proj-subtasks').where("task", "==", id).get()
    .then((subtasks)=>{
      this.setState({subtasks})
    });
  }

  canSave(){
    return this.state.title!=='' && this.state.project!==null && !this.state.loading
  }

  submitSubtask(){
    if(this.state.newSubtask===''){
      return;
    }
    this.setState({saving:false});
    let body={
      title:this.state.title,
      task:this.props.id
    }
    rebase.addToCollection('/proj-subtasks',body).then(()=>this.setState({saving:false,newSubtask:''}))
  }

  render(){
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th style={{width:40}}></th>
              <th>Subtask</th>
              <th style={{width:20}}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><Input type="checkbox" /></td>
              <td><Input type="text" defaultValue="Otto" className="invisible-input" /></td>
              <td>
                <button
                  className="btn"
                  type="button"
                >
                  <i className="fa fa-trash primary-color" />
                </button>
              </td>
            </tr>
            <tr>
              <td><Input type="checkbox" /></td>
              <td><Input type="text" defaultValue="Thornton" className="invisible-input" /></td>
              <td>
                <button
                  className="btn"
                  type="button"
                >
                  <i className="fa fa-trash primary-color" />
                </button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td><Input type="text" defaultValue="bird" /></td>
              <td>
                <button
                  className="btn"
                  type="button"
                >
                  <i className="fa fa-plus primary-color" />
                </button>
              </td>
            </tr>
          </tbody>
        </Table>

      </div>
    );
  }
}
