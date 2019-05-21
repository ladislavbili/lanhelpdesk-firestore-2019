import React, { Component } from 'react';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';

export default class FolderEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title: this.props.folder.title,
      note: this.props.folder.note,
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
                <Label>Title</Label>
                <Input type="text" placeholder="Enter folder name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Note</Label>
                <Input type="textarea" placeholder="Enter folder note" value={this.state.note} onChange={(e)=>this.setState({note:e.target.value})} />
              </FormGroup>

            </ModalBody>
            <ModalFooter>
              <Button color="danger" className="mr-auto" disabled={this.state.saving} onClick={() => this.props.close()}>
                Close
              </Button>
              <Button color="primary" className="separate" disabled={this.state.saving||this.state.title===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.updateDoc(`/expenditures-folders/${this.props.folder.id}`, {title:this.state.title,note:this.state.note})
                    .then(()=>{this.setState({title:'',note:'',saving:false}); this.props.close();});
                }}>{this.state.saving?'Saving...':'Save changes'}</Button>
            </ModalFooter>
      </div>
    );
  }
}
