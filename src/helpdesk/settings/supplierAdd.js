import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import {rebase} from '../../index';

export default class SupplierAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      supplierName:'',
      saving:false
    }
  }

  render(){
    return (
      <div className="container-padding form-background card-box">
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Supplier name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter supplier name" value={this.state.supplierName} onChange={(e)=>this.setState({supplierName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="primary" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/suppliers', {title:this.state.supplierName})
              .then(()=>{this.setState({supplierName:'',saving:false})});
          }}>{this.state.saving?'Adding...':'Add supplier'}</Button>
      </div>
    );
  }
}
