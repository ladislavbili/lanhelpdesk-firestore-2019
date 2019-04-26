import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import {rebase} from '../../index';

export default class StatusEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false
    }

    this.setData.bind(this);
    if(this.props.id!==null){
      rebase.get('cmdb-statuses/'+this.props.id, {
        context: this,
      }).then((status)=>this.setData(status));
    }
  }

  setData(data){
    this.setState({title:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.id!==props.id && props.id!==null){
      this.setState({loading:true})
      rebase.get('cmdb-statuses/'+props.id, {
        context: this,
      }).then((status)=>this.setData(status));
    }
  }


  render(){
    return (
          <Modal className="show" show={this.props.opened} >
            <Modal.Header>
              <h1 className="modal-header">Add status</h1>
              <button type="button" className="close ml-auto" aria-label="Close" onClick={this.props.toggle}><span aria-hidden="true">×</span></button>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <Col sm={3}>
                  <ControlLabel className="center-hor">Status name</ControlLabel>
                </Col>
                <Col sm={9}>
                  <FormControl type="text" placeholder="Enter status name" disabled={this.state.loading} value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
                </Col>
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button bsStyle="danger" className="mr-auto" disabled={this.state.saving} onClick={this.props.toggle}>
                Close
              </Button>

              <Button bsStyle="primary" disabled={this.state.saving||this.state.loading} onClick={()=>{
                this.setState({saving:true});
                rebase.updateDoc('/cmdb-statuses/'+this.props.id, {title:this.state.title})
                  .then(()=>{this.setState({saving:false})});
                }}>
                {this.state.saving?'Saving...':'Save status'}
              </Button>
            </Modal.Footer>
          </Modal>
    );
  }
}
