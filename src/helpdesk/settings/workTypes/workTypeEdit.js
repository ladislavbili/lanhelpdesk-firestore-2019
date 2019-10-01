import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';
import Select from 'react-select';
import {selectStyle} from "../../../scss/selectStyles";

let typeOptions = [{label:'Paušál hodín',value:'work'},{label:'Paušál výjazdov',value:'trip'}]

export default class WorkTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false,
      type:typeOptions[0],
    }
    this.setData.bind(this);
    rebase.get('help-work_types/'+this.props.match.params.id, {
      context: this,
    }).then((workType)=>this.setData(workType));
  }

  setData(data){
    this.setState({title:data.title,type:data.type?typeOptions.find((item)=>item.value===data.type):typeOptions[0],loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('help-work_types/'+props.match.params.id, {
        context: this,
      }).then((workType)=>this.setData(workType));
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
            <Label for="name">WorkType name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter work type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label for="actionIfSelected">Type of work</Label>
            <Select
              id="actionIfSelected"
              name="Action"
              styles={selectStyle}
              options={typeOptions}
              value={this.state.type}
              onChange={e =>{ this.setState({ type: e }); }}
                />
          </FormGroup>

          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.updateDoc('/help-work_types/'+this.props.match.params.id, {title:this.state.title,type:this.state.type.value})
                .then(()=>{this.setState({saving:false})});
            }}>{this.state.saving?'Saving work type...':'Save work type'}</Button>
          <Button className="btn-link" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/help-work_types/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
            }}>Delete</Button>
        </div>
      </div>
    );
  }
}
