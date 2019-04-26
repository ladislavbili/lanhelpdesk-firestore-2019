import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
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
        <Button bsStyle="primary" onClick={()=>{
            this.setState({opened:true});
          }}>
          <i className="fa fa-plus clickable" style={{paddingRight:5}} />
           Status
        </Button>
          <Modal className="show" show={this.state.opened} >
            <Modal.Header>
              <h1 className="modal-header">Add status</h1>
              <button type="button" className="close ml-auto" aria-label="Close" onClick={this.toggle.bind(this)}><span aria-hidden="true">×</span></button>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <Col sm={3}>
                  <ControlLabel className="center-hor">Status name</ControlLabel>
                </Col>
                <Col sm={9}>
                  <FormControl type="text" placeholder="Enter status name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
                </Col>
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button bsStyle="danger" className="mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>

              <Button bsStyle="primary" disabled={this.state.saving} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/cmdb-statuses', {title:this.state.title})
                  .then(()=>{this.setState({title:'',saving:false})});
                }}>
                {this.state.saving?'Adding...':'Add status'}
              </Button>
            </Modal.Footer>
          </Modal>
          </div>
    );
  }
}
