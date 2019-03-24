import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import {rebase} from '../../index';

export default class UnitAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      unitName:'',
      def:false,
      saving:false
    }
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
          <input type="checkbox" id="default" checked={this.state.def} onChange={(e)=>this.setState({def:!this.state.def})} />
          <ControlLabel className="center-hor" htmlFor="default">Default</ControlLabel>
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
              .then((response)=>{
                if(this.state.def){
                  rebase.updateDoc('/metadata/0',{defaultUnit:response.id})
                }
                this.setState({unitName:'',saving:false})
              });
          }}>{this.state.saving?'Adding...':'Add unit'}</Button>
      </div>
    );
  }
}
