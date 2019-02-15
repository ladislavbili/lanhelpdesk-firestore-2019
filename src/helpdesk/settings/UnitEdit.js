import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import {rebase} from '../../index';

export default class UnitEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      unitName:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('units/'+this.props.match.params.id, {
      context: this,
    }).then((unit)=>this.setData(unit));
  }

  setData(data){
    this.setState({unitName:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('units/'+props.match.params.id, {
        context: this,
      }).then((unit)=>this.setData(unit));
    }
  }

  render(){
    return (
      <div className="container-padding form-background card-box">
        {
          this.state.loading &&
          <Alert bsStyle="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Unit name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter unit name" value={this.state.unitName} onChange={(e)=>this.setState({unitName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/units/'+this.props.match.params.id, {title:this.state.unitName})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving unit...':'Save unit'}</Button>
      </div>
    );
  }
}
