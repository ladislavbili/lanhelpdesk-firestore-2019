import React, { Component } from 'react';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';

export default class FolderEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title: this.props.folder.title,
      description: this.props.folder.description,
      saving:false,
      opened:false
    }
  }

  toggle(){
    this.setState({opened:!this.state.opened})
  }

  render(){
    return (
      <div>
          <ModalHeader>Edit folder</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Folder name</Label>
                <Input type="text" placeholder="Enter folder name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Folder description</Label>
                <Input type="textarea" placeholder="Enter folder description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
              </FormGroup>

              </ModalBody>
              <ModalFooter>
              <Button color="danger" className="mr-auto" disabled={this.state.saving} onClick={() => this.props.close()}>
                Close
              </Button>
              <Button color="primary" className="separate" disabled={this.state.saving||this.state.title===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.updateDoc(`/pass-folders/${this.props.folder.id}`, {title:this.state.title,description:this.state.description})
                    .then(()=>{this.setState({title:'',description:'',saving:false}); this.props.close();});
                }}>{this.state.saving?'Saving...':'Save changes'}</Button>
            </ModalFooter>
          </div>
    );
  }
}
