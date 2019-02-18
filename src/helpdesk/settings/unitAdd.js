import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import {rebase} from '../../index';

export default class UnitAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      unitName:'',
      saving:false
    }
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Unit name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter unit name" value={this.state.unitName} onChange={(e)=>this.setState({unitName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="primary" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/units', {title:this.state.unitName})
              .then(()=>{this.setState({unitName:'',saving:false})});
          }}>{this.state.saving?'Adding...':'Add unit'}</Button>
      </div>
    );
  }
}
