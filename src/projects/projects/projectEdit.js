import React, { Component } from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import Permits from "../../components/permissions";

export default class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title: this.props.project.title,
      description: this.props.project.description,

      view: this.props.project.view,
      edit: this.props.project.edit,
      permissions: this.props.project.permissions,

      saving:false,
      opened:false
    }
  }

  render(){
    return (
      <div>
            <ModalBody>

              <FormGroup>
                <Label>Project name</Label>
                <Input type="text" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Project description</Label>
                <Input type="textarea" placeholder="Enter project description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
              </FormGroup>

              <Permits id={this.props.project.id} view={this.props.project.view} edit={this.props.project.edit} permissions={this.props.project.permissions} db="lanwiki-tags"/>


              </ModalBody>

              <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
                Close
              </Button>

              <Button className="btn" disabled={this.state.saving||this.state.title===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.updateDoc(`/proj-projects/${this.props.project.id}`, {title:this.state.title,description:this.state.description})
                    .then(()=>{this.setState({title:'aaaaaaaaaaaaaaaa',description:'ssssssssssssssssss',saving:false}, () => this.props.close())});
                }}>{this.state.saving?'Saving...':'Save changes'}</Button>
            </ModalFooter>

          </div>
    );
  }
}
