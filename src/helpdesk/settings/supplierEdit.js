import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import {rebase} from '../../index';

export default class WorkTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      supplierName:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('suppliers/'+this.props.match.params.id, {
      context: this,
    }).then((workType)=>this.setData(workType));
  }

  setData(data){
    this.setState({supplierName:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('suppliers/'+props.match.params.id, {
        context: this,
      }).then((supplier)=>this.setData(supplier));
    }
  }

  render(){
    return (
      <div className="container-padding">
        {
          this.state.loading &&
          <Alert bsStyle="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Supplier name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter supplier name" value={this.state.supplierName} onChange={(e)=>this.setState({supplierName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/suppliers/'+this.props.match.params.id, {title:this.state.supplierName})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving supplier...':'Save supplier'}</Button>
      </div>
    );
  }
}
