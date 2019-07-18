import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import Permits from "../../components/permissions";

export default class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title: props.item.title,
      body: props.item.body,
      saving: false,
      opened: false
    }
  }

  toggle(){
    if(!this.state.opened && this.props.item){
      this.setState({title: this.props.item.title});
    }
    this.setState({opened: !this.state.opened})
  }

  render(){
    console.log(this.props.item);
    return (
      <div className='sidebar-menu-item'>
        <Button
          className='btn-link sidebar-menu-item t-a-l'
          onClick={this.toggle.bind(this)}
          >
          <i className="fa fa-cog sidebar-icon-center"/> Project settings
        </Button>

        <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
            <ModalBody>
              <FormGroup>
                <Label>Filter name</Label>
                <Input type="text" className="from-control" placeholder="Enter filter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              <FormGroup>
    						<Label htmlFor="body">Popis</Label>
    						<Input type="textarea" className="form-control" id="body" placeholder="Zadajte text" value={this.state.body} onChange={(e) => this.setState({body: e.target.value})}/>
    					</FormGroup>

              <Permits id={this.props.item.id} view={this.props.item.view} edit={this.props.item.edit} permissions={this.props.item.permissions} db="help-projects" />

              </ModalBody>
              <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>


              <Button
                className="btn"
                disabled={this.state.saving||this.state.title===""}
                onClick={()=>
                  {this.setState({saving:true});
                  rebase.updateDoc(`/help-projects/${this.props.item.id}`, {title: this.state.title, body: this.state.body})
                        .then(()=>{this.setState({title:'', body:'', saving:false, opened: false})});
              }}>
                {(this.state.saving?'Saving...':'Save project')}</Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
