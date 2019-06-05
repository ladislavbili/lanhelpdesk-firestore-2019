import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';

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
        <div className="container-padding form-background card-box scrollable fit-with-header">
        <FormGroup>
          <Label for="name">Project name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter project name" value={this.state.projectName} onChange={(e)=>this.setState({projectName:e.target.value})} />
        </FormGroup>
        <Button color="primary" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/help-projects', {title:this.state.projectName})
              .then(()=>{this.setState({projectName:'',saving:false})});
          }}>{this.state.saving?'Adding...':'Add project'}</Button>
      </div>
    );
  }
}
