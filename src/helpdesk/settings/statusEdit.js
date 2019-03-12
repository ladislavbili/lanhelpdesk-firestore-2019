import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import {rebase} from '../../index';

export default class StatusEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      statusName:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('statuses/'+this.props.match.params.id, {
      context: this,
    }).then((status)=>this.setData(status));
  }

  setData(data){
    this.setState({statusName:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('statuses/'+props.match.params.id, {
        context: this,
      }).then((status)=>this.setData(status));
    }
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
        {
          this.state.loading &&
          <Alert bsStyle="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Status name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter status name" value={this.state.statusName} onChange={(e)=>this.setState({statusName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/statuses/'+this.props.match.params.id, {title:this.state.statusName})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving status...':'Save status'}</Button>
      </div>
    );
  }
}
