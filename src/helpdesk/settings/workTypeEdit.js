import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import {rebase} from '../../index';

export default class WorkTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      workTypeName:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('workTypes/'+this.props.match.params.id, {
      context: this,
    }).then((workType)=>this.setData(workType));
  }

  setData(data){
    this.setState({workTypeName:data.title,loading:false})
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
      <div className="container-padding">
        {
          this.state.loading &&
          <Alert bsStyle="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">WorkType name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter work type name" value={this.state.workTypeName} onChange={(e)=>this.setState({workTypeName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/workTypes/'+this.props.match.params.id, {title:this.state.workTypeName})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving work type...':'Save work type'}</Button>
      </div>
    );
  }
}
