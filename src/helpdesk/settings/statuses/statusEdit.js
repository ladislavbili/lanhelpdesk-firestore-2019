import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';
import { SketchPicker } from "react-color";

export default class StatusEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      color:'FFF',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('help-statuses/'+this.props.match.params.id, {
      context: this,
    }).then((status)=>this.setData(status));
  }

  setData(data){
    this.setState({title:data.title,color:data.color?data.color:'FFF',loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('help-statuses/'+props.match.params.id, {
        context: this,
      }).then((status)=>this.setData(status));
    }
  }

  render(){
    return (
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">
        {
          this.state.loading &&
          <Alert color="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Label for="name">Status name</Label>
          <SketchPicker
            id="color"
            color={this.state.color}
            onChangeComplete={value => this.setState({ color: value.hex })}
          />
          <Input type="text" name="name" id="name" placeholder="Enter status name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <Button className="btn" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/help-statuses/'+this.props.match.params.id, {title:this.state.title, color:this.state.color})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving status...':'Save status'}</Button>
        <Button className="btn-link" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/help-statuses/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
              }}>Delete</Button>
            </div>
        </div>
    );
  }
}
