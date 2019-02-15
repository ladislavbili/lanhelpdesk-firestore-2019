import React, { Component } from 'react';
import {Button, Modal, Badge, InputGroup, Glyphicon, FormControl} from 'react-bootstrap';
import StatusAdd from './StatusAdd';
import TaskAdd from './TaskAdd';
import TaskListColumns from './TaskListColumns';
import TaskList from './TaskList';

export default class TaskListContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      openAddStatusModal:false,
      openAddTaskModal:false,
      isColumn:false,
      search:'',
    }
  }
  render(){
      return (
        <div style={{padding:15}}>
          <div>
            <span style={{display:'flex'}}>
            <Button bsStyle="success" onClick={()=>this.setState({openAddTaskModal:true})} style={{marginLeft:10}}>
              Add task
            </Button>
            <Button bsStyle="success" onClick={()=>this.setState({openAddStatusModal:true})} style={{marginLeft:10}}>
              Add status
            </Button>
              <InputGroup style={{marginLeft:5}}>
                <InputGroup.Addon>
                  <Glyphicon glyph="search" />
                </InputGroup.Addon>
                <FormControl type="text"
                  placeholder="Search"
                  style={{width:250}}
                  onChange={e => {
                    this.setState({ search: e.target.value });
                  }}
                  value={this.state.search}/>
              </InputGroup>
            </span>

            <span style={{float:'right'}}>
              <Badge className="statusStyle" style={{backgroundColor:!this.state.isColumn?'#337ab7':'#8db9df'}}
                onClick={()=>{this.setState({isColumn:false})}}>
                Row
              </Badge>
              <Badge className="statusStyle" style={{backgroundColor:this.state.isColumn?'#337ab7':'#8db9df'}}
                onClick={()=>{this.setState({isColumn:true})}}>
                Column
              </Badge>
            </span>
          </div>
          {this.state.isColumn &&
            <TaskListColumns {...this.props} />
          }
          {!this.state.isColumn &&
            <TaskList {...this.props} />
          }
        <Modal show={this.state.openAddStatusModal} onHide={()=>{this.setState({openAddStatusModal:false})}}>
          <Modal.Header closeButton>
            <Modal.Title>Add status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <StatusAdd closeModal={()=>{this.setState({openAddStatusModal:false})}} />
          </Modal.Body>
        </Modal>
        <Modal show={this.state.openAddTaskModal} onHide={()=>{this.setState({openAddTaskModal:false})}}>
          <Modal.Header closeButton>
            <Modal.Title>Add task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TaskAdd closeModal={()=>{this.setState({openAddTaskModal:false})}} />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
