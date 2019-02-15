import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import {rebase} from '../../index';

export default class StatusAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      statusName:'',
      saving:false
    }
  }

  render(){
    return (
      <div className="container-padding">
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Status name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter status name" value={this.state.statusName} onChange={(e)=>this.setState({statusName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="primary" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/statuses', {title:this.state.statusName})
              .then(()=>{this.setState({statusName:'',saving:false})});
          }}>{this.state.saving?'Adding...':'Add status'}</Button>
      </div>
    );
  }
}
