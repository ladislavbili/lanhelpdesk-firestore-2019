import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import {rebase} from '../../index';

export default class WorkTypeAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      workTypeName:'',
      saving:false
    }
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">WorkType name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter work type name" value={this.state.workTypeName} onChange={(e)=>this.setState({workTypeName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="primary" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/workTypes', {title:this.state.workTypeName})
              .then(()=>{this.setState({workTypeName:'',saving:false})});
          }}>{this.state.saving?'Adding...':'Add work type'}</Button>
      </div>
    );
  }
}
