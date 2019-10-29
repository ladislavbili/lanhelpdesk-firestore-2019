import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import { connect } from "react-redux";

class FilterAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      public:false,
      saving:false,
      opened:false
    }
  }

  toggle(){
    if(!this.state.opened && this.props.filterID){
      this.setState({title:this.props.filterData.title, public:this.props.filterData.public});
    }
    this.setState({opened:!this.state.opened})
  }

  render(){
    return (
      <div>
        <Button className="btn-link-reversed m-2" onClick={this.toggle.bind(this)}>
          <i className="far fa-save icon-M"/>
        </Button>

        <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
            <ModalBody>
              <FormGroup>
                <Label>Filter name</Label>
                <Input type="text" className="from-control" placeholder="Enter filter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              { this.props.currentUser.userData.role.value > 1 &&
                <FormGroup>
                  <Label for="public">Public</Label>
                  <Input type="checkbox" id="public" checked={this.state.public} onChange={(e)=>this.setState({public:!this.state.public })} />
                </FormGroup>
              }

              </ModalBody>
              <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>


              <Button
                className="btn"
                disabled={this.state.saving||this.state.title===""}
                onClick={()=>{
                  this.setState({saving:true});
                  if(this.props.filterID!==null){
                    rebase.updateDoc('/help-filters/'+this.props.filterID, {title: this.state.title, public:this.state.public, filter:this.props.filter})
                    .then(()=> {
                      this.setState({title:'',public:false,saving:false});
                      this.toggle();
                    });
                  }else{
                    rebase.addToCollection('/help-filters', {title: this.state.title, public:this.state.public, createdBy:this.props.currentUser.id, filter: this.props.filter})
                    .then(()=> {
                      this.setState({title:'',public:false,saving:false});
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

const mapStateToProps = ({ userReducer }) => {
  return {
    currentUser:userReducer
   };
};

export default connect(mapStateToProps, {  })(FilterAdd);
