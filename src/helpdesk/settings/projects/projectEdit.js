import React, { Component } from 'react';
import { Button, FormGroup, Label,Input,Alert } from 'reactstrap';
import {rebase} from '../../../index';

export default class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      projectName:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('projects/'+this.props.match.params.id, {
      context: this,
    }).then((project)=>this.setData(project));
  }

  setData(data){
    this.setState({projectName:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('projects/'+props.match.params.id, {
        context: this,
      }).then((project)=>this.setData(project));
    }
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
        {
          this.state.loading &&
          <Alert color="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Label for="name">Project name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter project name" value={this.state.projectName} onChange={(e)=>this.setState({projectName:e.target.value})} />
        </FormGroup>
        <Button color="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/projects/'+this.props.match.params.id, {title:this.state.projectName})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving project...':'Save project'}</Button>
        <Button color="danger" className="separate" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/projects/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
              }}>Delete</Button>
      </div>
    );
  }
}
