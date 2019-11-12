import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';

export default class TripTypeAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      saving:false
    }
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">

        <FormGroup>
          <Label for="name">Trip type</Label>
          <Input type="text" name="name" id="name" placeholder="Enter trip type" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <Button className="btn" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/help-trip_types', {title:this.state.title})
              .then((response)=>{
                this.setState({title:'',saving:false})
              });
          }}>{this.state.saving?'Adding...':'Add trip type'}</Button>
    </div>
    );
  }
}
