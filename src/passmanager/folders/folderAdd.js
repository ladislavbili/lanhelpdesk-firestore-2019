import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import {rebase,database} from '../../index';
import Select from 'react-select';

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
        <Button onClick={this.toggle.bind(this)} color="primary" style={{width:'100%'}}>
          <i className="fa fa-plus clickable pr-2"  />
          Folder
        </Button>
          <Modal className="show" show={this.state.opened} >
            <Modal.Header>
              <h1 className="modal-header">Add folder</h1>
              <button type="button" className="close ml-auto" aria-label="Close" onClick={this.toggle.bind(this)}><span aria-hidden="true">×</span></button>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <Label>Folder name</Label>
                <Input type="text" placeholder="Enter folder name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Folder description</Label>
                <Input type="textarea" placeholder="Enter folder description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
              </FormGroup>

              </Modal.Body>
              <Modal.Footer>
              <Button color="danger" className="mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>
              <Button color="primary" className="separate" disabled={this.state.saving||this.state.title===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/pass-folders', {title:this.state.title,description:this.state.description})
                    .then(()=>{this.setState({title:'',description:'',saving:false})});
                }}>{this.state.saving?'Adding...':'Add folder'}</Button>
            </Modal.Footer>
          </Modal>
          </div>
    );
  }
}
