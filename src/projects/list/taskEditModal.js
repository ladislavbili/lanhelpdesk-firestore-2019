import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import TaskEdit from './taskEdit';

export default class TaskEditModal extends Component{

  render(){
    return (
      <Modal size="lg" isOpen={this.props.opened} toggle={this.props.toggle} >
        <ModalHeader toggle={this.props.toggle}>Edit Task</ModalHeader>
        <ModalBody>
          <TaskEdit id={this.props.id} toggle={this.props.toggle} />
        </ModalBody>
      </Modal>
    );
  }
}
