import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import {rebase} from '../../index';

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
      <div className="container-padding">
        {
          this.state.loading &&
          <Alert bsStyle="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Project name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter project name" value={this.state.projectName} onChange={(e)=>this.setState({projectName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/projects/'+this.props.match.params.id, {title:this.state.projectName})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving project...':'Save project'}</Button>
      </div>
    );
  }
}
