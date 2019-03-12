import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import Select from 'react-select';
import {rebase,database} from '../../index';
import {toSelArr,snapshotToArray} from '../../helperFunctions';

export default class CompanyEdit extends Component{
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
    this.fetchData(this.props.match.params.id);
  }

  fetchData(id){
    Promise.all([
      rebase.get('companies/'+id, {
        context: this,
      }),
      database.collection('pricelists').get()
    ])
    .then(([company,pricelists])=>this.setData(company,toSelArr(snapshotToArray(pricelists))))
  }

  setData(company,pricelists){
    let pricelist=pricelists.find((item)=>item.id===company.pricelist);
    if(pricelist===undefined && pricelists.length>0){
      pricelist=pricelists[0];
    }
    this.setState({companyName:company.title,pricelists,pricelist,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      this.fetchData(props.match.params.id);
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
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/companies/'+this.props.match.params.id, {title:this.state.companyName,pricelist:this.state.pricelist.id})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving company...':'Save company'}</Button>

        <Button bsStyle="danger" className="separate" disabled={this.state.saving} onClick={()=>{
            if(window.confirm("Are you sure?")){
              rebase.removeDoc('/companies/'+this.props.match.params.id).then(()=>{
                this.props.history.goBack();
              });
            }
            }}>Delete</Button>


      </div>
    );
  }
}
