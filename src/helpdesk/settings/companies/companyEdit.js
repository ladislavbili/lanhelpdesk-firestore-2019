import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import {rebase} from '../../../index';
import {toSelArr} from '../../../helperFunctions';
import {selectStyle} from "../../../scss/selectStyles";

import { connect } from "react-redux";
import {storageHelpPricelistsStart,storageMetadataStart, storageCompaniesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class CompanyEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[],
      pricelist:null,
      companyName:'',
      pausal:0,
      loading:true,
      saving:false
    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.pricelistsLoaded && props.metadataLoaded && props.companiesLoaded
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.pricelists,this.props.pricelists)){
      this.setState({pricelists:toSelArr(props.pricelists)})
    }
    if(!this.storageLoaded(this.props) && this.storageLoaded(props)){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(this.storageLoaded(props)){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    }
    if(!this.props.metadataActive){
      this.props.storageMetadataStart();
    }
    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
  }

  setData(props){
    let pricelists = toSelArr(props.pricelists);
    let meta = props.metadata;
    let company = props.companies.find((company)=>company.id===props.match.params.id);
    let pricelist=pricelists.find((item)=>item.id===company.pricelist);
    if(pricelist===undefined){
      pricelist=pricelists.find((item)=>item.id===meta.defaultPricelist);
      if(pricelist===undefined && pricelists.length>0){
        pricelist=pricelists[0];
      }
    }
    this.setState({companyName:company.title,pausal:company.pausal,pricelists,pricelist,loading:false})
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
          <Label for="name">Company name</Label>
          <Input name="name" id="name" type="text" placeholder="Enter company name" value={this.state.companyName} onChange={(e)=>this.setState({companyName:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="pausal">Paušál</Label>
          <Input name="pausal" id="pausal" type="number" placeholder="Enter pausal" value={this.state.pausal} onChange={(e)=>this.setState({pausal:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="pricelist">Pricelist</Label>
          <Select
            id="pricelist"
            name="pausal"
            styles={selectStyle}
            options={this.state.pricelists}
            value={this.state.pricelist}
            onChange={e =>{ this.setState({ pricelist: e }); }}
              />
        </FormGroup>
        <Button className="btn" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/companies/'+this.props.match.params.id, {title:this.state.companyName,pausal:this.state.pausal,pricelist:this.state.pricelist.id})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving company...':'Save company'}</Button>

        <Button className="btn-link" disabled={this.state.saving} onClick={()=>{
            if(window.confirm("Are you sure?")){
              rebase.removeDoc('/companies/'+this.props.match.params.id).then(()=>{
                this.props.history.goBack();
              });
            }
            }}>Delete</Button>

          </div>
      </div>
    );
  }
}


const mapStateToProps = ({ storageMetadata, storageHelpPricelists, storageCompanies}) => {
  const { metadataActive, metadata, metadataLoaded } = storageMetadata;
  const { pricelistsActive, pricelists, pricelistsLoaded } = storageHelpPricelists;
  const { companiesActive, companies, companiesLoaded } = storageCompanies;
  return { metadataActive, metadata, metadataLoaded, pricelistsActive, pricelists, pricelistsLoaded, companiesActive, companies, companiesLoaded };
};

export default connect(mapStateToProps, { storageHelpPricelistsStart,storageMetadataStart, storageCompaniesStart })(CompanyEdit);
