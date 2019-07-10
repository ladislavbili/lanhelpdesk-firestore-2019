import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../index';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      description:'',
      saving:false,
      opened:false
    }
  }

  toggle(){
    this.setState({opened:!this.state.opened})
  }
  render(){
    return (
      <div>
        <Button
          onClick={this.toggle.bind(this)}
          className="btn-link t-a-l sidebar-menu-item">
          <i className="fa fa-plus sidebar-icon-center"  /> Project
        </Button>

        <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)}>
            <ModalHeader toggle={this.toggle.bind(this)}>Add project</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Project name</Label>
                <Input type="text" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Project description</Label>
                <Input type="textarea" placeholder="Enter project description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
              </FormGroup>

              </ModalBody>
              <ModalFooter>
              <Button color="danger" className="mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>
              <Button color="primary" className="separate" disabled={this.state.saving||this.state.title===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/proj-projects', {title:this.state.title,description:this.state.description})
                    .then(()=>{this.setState({title:'',description:'',saving:false})});
                }}>{this.state.saving?'Adding...':'Add project'}</Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
