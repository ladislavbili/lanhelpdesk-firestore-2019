import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';

export default class FilterAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      saving:false,
      opened:false
    }
  }

  toggle(){
    if(!this.state.opened && this.props.filterID){
      this.setState({title:this.props.filterData.title});
    }
    this.setState({opened:!this.state.opened})
  }

  render(){
    return (
      <div>
        <Button className="btn btn-light btn-xs" onClick={this.toggle.bind(this)} color="primary" style={{width:'100%'}}>
          Save
        </Button>
        <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
            <ModalHeader toggle={this.toggle.bind(this)}>Add filter</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Filter name</Label>
                <Input type="text" placeholder="Enter filter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              </ModalBody>
              <ModalFooter>
              <Button color="secondary" className="mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>


              <Button
                color="primary"
                className="separate"
                disabled={this.state.saving||this.state.title===""}
                onClick={()=>{
                  this.setState({saving:true});
                  if(this.props.filterID!==null){
                    rebase.updateDoc('/help-filters/'+this.props.filterID, {title: this.state.title, filter:this.props.filter})
                    .then(()=> {
                      this.setState({title:'',saving:false});
                      this.toggle();
                    });
                  }else{
                    rebase.addToCollection('/help-filters', {title: this.state.title, filter: this.props.filter})
                    .then(()=> {
                      this.setState({title:'',saving:false});
                      this.toggle();
                    });
                  }
                }}>{this.props.filterID!==null?(this.state.saving?'Saving...':'Save filter'):(this.state.saving?'Adding...':'Add filter')}</Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}