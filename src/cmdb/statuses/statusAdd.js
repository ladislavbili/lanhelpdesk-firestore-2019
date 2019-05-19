import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {rebase} from '../../index';

export default class StatusAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
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
        <Button color="primary" onClick={()=>{
            this.setState({opened:true});
          }}>
          <i className="fa fa-plus clickable" style={{paddingRight:5}} />
           Status
        </Button>
        <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
            <ModalHeader toggle={this.toggle.bind(this)}>Add status</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="name">Status name</Label>
                <Input type="text" name="name" id="name" placeholder="Enter status name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" className="mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>

              <Button color="primary" disabled={this.state.saving} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/cmdb-statuses', {title:this.state.title})
                  .then(()=>{this.setState({title:'',saving:false})});
                }}>
                {this.state.saving?'Adding...':'Add status'}
              </Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
