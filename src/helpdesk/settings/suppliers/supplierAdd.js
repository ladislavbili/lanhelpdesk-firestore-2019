import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';

export default class SupplierAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      saving:false
    }
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
          <FormGroup>
            <Label for="name">Supplier name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter supplier name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
        <Button color="primary" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/suppliers', {title:this.state.title})
              .then(()=>{this.setState({supplierName:'',saving:false})});
          }}>{this.state.saving?'Adding...':'Add supplier'}</Button>
      </div>
    );
  }
}
