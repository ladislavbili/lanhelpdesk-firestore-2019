import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../index';

export default class StatusAdd extends Component{
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
          <Label for="name">Status name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter status name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <Button color="primary" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/statuses', {title:this.state.title})
              .then(()=>{this.setState({title:'',saving:false})});
          }}>{this.state.saving?'Adding...':'Add status'}</Button>
      </div>
    );
  }
}
