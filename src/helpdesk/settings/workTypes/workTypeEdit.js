import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';

export default class WorkTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('workTypes/'+this.props.match.params.id, {
      context: this,
    }).then((workType)=>this.setData(workType));
  }

  setData(data){
    this.setState({title:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('workTypes/'+props.match.params.id, {
        context: this,
      }).then((workType)=>this.setData(workType));
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
          <Label for="name">WorkType name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter work type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <Button color="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/workTypes/'+this.props.match.params.id, {title:this.state.title})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving work type...':'Save work type'}</Button>
        <Button color="danger" className="separate" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/workTypes/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
              }}>Delete</Button>
      </div>
    );
  }
}
