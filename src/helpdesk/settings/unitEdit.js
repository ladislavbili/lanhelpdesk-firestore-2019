import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import {rebase} from '../../index';

export default class UnitEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      unitName:'',
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
    this.setState({unitName:data.title,loading:false,def:this.state.defaultUnit?id===this.state.defaultUnit:false})
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
          <Alert bsStyle="success">
            Loading data...
          </Alert>
        }
        <input type="checkbox" id="default" checked={this.state.def} onChange={(e)=>this.setState({def:!this.state.def})} />
        <ControlLabel className="center-hor" htmlFor="default">Default</ControlLabel>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Unit name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter unit name" value={this.state.unitName} onChange={(e)=>this.setState({unitName:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            if(!this.state.def && this.state.defaultUnit===this.props.match.params.id){
              this.setState({defaultUnit:null});
              rebase.updateDoc('/metadata/0',{defaultUnit:null});
            }else if(this.state.def){
              this.setState({defaultUnit:this.props.match.params.id});
              rebase.updateDoc('/metadata/0',{defaultUnit:this.props.match.params.id});              
            }
            rebase.updateDoc('/units/'+this.props.match.params.id, {title:this.state.unitName})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving unit...':'Save unit'}</Button>
      </div>
    );
  }
}
