import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../index';

export default class UnitEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      defaultUnit:null,
      def:false,
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('units/'+this.props.match.params.id, {
      context: this,
    }).then((unit)=>this.setData(unit));

    rebase.get('metadata/0', {
      context: this,
    }).then((metadata)=>this.setState({def:metadata.defaultUnit===this.props.match.params.id,defaultUnit:metadata.defaultUnit }));

  }

  setData(data,id){
    this.setState({title:data.title,loading:false,def:this.state.defaultUnit?id===this.state.defaultUnit:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('units/'+props.match.params.id, {
        context: this,
      }).then((unit)=>this.setData(unit,props.match.params.id));
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

        <FormGroup check>
          <Label check>
            <Input type="checkbox" checked={this.state.def} onChange={(e)=>this.setState({def:!this.state.def})}/>
            Default
          </Label>
        </FormGroup>

        <FormGroup>
          <Label for="name">Unit name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter unit name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <Button color="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            if(!this.state.def && this.state.defaultUnit===this.props.match.params.id){
              this.setState({defaultUnit:null});
              rebase.updateDoc('/metadata/0',{defaultUnit:null});
            }else if(this.state.def){
              this.setState({defaultUnit:this.props.match.params.id});
              rebase.updateDoc('/metadata/0',{defaultUnit:this.props.match.params.id});
            }
            rebase.updateDoc('/units/'+this.props.match.params.id, {title:this.state.title})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving unit...':'Save unit'}</Button>
        <Button color="danger" className="separate" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/units/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
              }}>Delete</Button>
      </div>
    );
  }
}
