import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {rebase} from '../../index';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      body:'',
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
        <Button className="btn-link sidebar-menu-item t-a-l"  onClick={()=>{this.setState({opened:true});}} >
        <i className="fa fa-plus sidebar-icon-center" /> Project
        </Button>
          <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
            <ModalHeader toggle={this.toggle.bind(this)}> <h1> Add project </h1></ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="name">Project name</Label>
                <Input type="text" name="name" id="name" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              <FormGroup>
    						<Label htmlFor="body">Popis</Label>
    						<Input type="textarea" className="form-control" id="body" placeholder="Zadajte text" value={this.state.body} onChange={(e) => this.setState({body: e.target.value})}/>
    					</FormGroup>

            </ModalBody>

            <ModalFooter>
              <Button className="btn mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>

              <Button className="btn" disabled={this.state.saving} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/help-projects', {title: this.state.title, body: this.state.body})
                  .then(()=>{this.setState({title:'', body:'', saving:false})});
                }}>
                {this.state.saving?'Adding...':'Add project'}
              </Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
