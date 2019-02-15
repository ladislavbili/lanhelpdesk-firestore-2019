import React, { Component } from 'react';
import base from '../firebase';
import { ListGroup, Glyphicon, Modal } from 'react-bootstrap';
import TaskListRow from './TaskListRow';
import TaskEdit from './TaskEdit';

export default class TaskList extends Component{

  constructor(props){
    super(props);
    this.state = {
      tasks:[],
      statuses:[],
      status:'all',
      openEditTaskModal:false,
      editedTaskID:null
    }
  }

  componentWillMount(){
    this.ref = base.bindToState(`hd-statuses`, {
      context: this,
      state: 'statuses',
      asArray: true
    });
    this.ref2 = base.bindToState(`hd-tasks`, {
      context: this,
      state: 'tasks',
      asArray: true
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
    base.removeBinding(this.ref2);
  }

  render(){
      return (
        <div style={{padding:15}}>

        <div className="taskTableContentColumns">
          {this.state.statuses.map((status)=>
            (<ListGroup key={status.id}>
              <label>{status.title}
                <Glyphicon style={{marginLeft:5}}
                  glyph="remove-sign"
                  onClick={()=>{
                    if (window.confirm("Are you sure you want to delete status "+ status.title+"?")) {
                      base.remove(`hd-statuses/`+status.id);
                    } else {
                      return;
                    }
                  }
                }
                /></label>
              {
                this.state.tasks.filter((item)=>item.status===status.id).map((task)=><TaskListRow task={task} key={task.id} status={status} openEdit={()=>this.setState({openEditTaskModal:true,editedTaskID:task.id})} />)
              }
            </ListGroup>)
          )
          }
      </div>
      <Modal show={this.state.openEditTaskModal} onHide={()=>{this.setState({openEditTaskModal:false})}}>
          <Modal.Header closeButton>
            <Modal.Title>Edit task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TaskEdit taskID={this.state.editedTaskID} closeModal={()=>{this.setState({openEditTaskModal:false})}} />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
