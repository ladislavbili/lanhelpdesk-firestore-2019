import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import {rebase} from '../../index';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      projectName:'',
      saving:false
    }
  }

  render(){
    return (
      <div className="container-padding form-background card-box">
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Project name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter project name" value={this.state.projectName} onChange={(e)=>this.setState({projectName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="primary" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/projects', {title:this.state.projectName})
              .then(()=>{this.setState({projectName:'',saving:false})});
          }}>{this.state.saving?'Adding...':'Add project'}</Button>
      </div>
    );
  }
}
