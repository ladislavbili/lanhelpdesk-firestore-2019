import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import Select from 'react-select';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import {rebase,database} from '../../index';

export default class CompanyAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[],
      pricelist:null,
      companyName:'',
      loading:true,
      saving:false
    }
    this.fetchData.bind(this);
    this.setData.bind(this);
    this.fetchData();
  }

  fetchData(){
    database.collection('pricelists').get().then((pricelists)=>this.setData(toSelArr(snapshotToArray(pricelists))));
  }

  setData(pricelists){
    let pricelist = null;
    if(pricelists.length>0){
      pricelist=pricelists[0];
    }
    this.setState({pricelists,pricelist,loading:false})
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
            <ControlLabel className="center-hor">Company name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter company name" value={this.state.companyName} onChange={(e)=>this.setState({companyName:e.target.value})} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Pricelist</ControlLabel>
          </Col>
          <Col sm={9}>
            <Select
              className="supressDefaultSelectStyle"
              options={this.state.pricelists}
              value={this.state.pricelist}
              onChange={e =>{ this.setState({ pricelist: e }); }}
                />
          </Col>
        </FormGroup>
        <Button bsStyle="primary" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/companies', {title:this.state.companyName,pricelist:this.state.pricelist.id})
              .then(()=>{this.setState({companyName:'',pricelist:this.state.pricelists.length>0?this.state.pricelists[0]:null,saving:false})});
          }}>{this.state.saving?'Adding...':'Add company'}</Button>
      </div>
    );
  }
}
