import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import {rebase} from '../../index';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      projectName:'',
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
        <i className="fa fa-plus clickable" onClick={()=>{
            this.setState({opened:true});
          }} />
          <Modal className="show" show={this.state.opened} >
            <Modal.Header>
              <h1 className="modal-header">Add project</h1>
              <button type="button" className="close ml-auto" aria-label="Close" onClick={this.toggle.bind(this)}><span aria-hidden="true">×</span></button>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <Col sm={3}>
                  <ControlLabel className="center-hor">Project name</ControlLabel>
                </Col>
                <Col sm={9}>
                  <FormControl type="text" placeholder="Enter project name" value={this.state.projectName} onChange={(e)=>this.setState({projectName:e.target.value})} />
                </Col>
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button bsStyle="danger" className="mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>

              <Button bsStyle="primary" disabled={this.state.saving} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/projects', {title:this.state.projectName})
                  .then(()=>{this.setState({projectName:'',saving:false})});
                }}>
                {this.state.saving?'Adding...':'Add project'}
              </Button>
            </Modal.Footer>
          </Modal>
          </div>
    );
  }
}
