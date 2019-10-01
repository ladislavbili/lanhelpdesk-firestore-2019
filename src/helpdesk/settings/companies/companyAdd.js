import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import {toSelArr} from '../../../helperFunctions';
import {rebase} from '../../../index';
import {selectStyle} from "../../../scss/selectStyles";

import { connect } from "react-redux";
import {storageHelpPricelistsStart,storageMetadataStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class CompanyAdd extends Component{
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
    return props.pricelistsLoaded && props.metadataLoaded
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.pricelists,this.props.pricelists)){
      this.setState({pricelists:toSelArr(props.pricelists)})
    }
    if(!this.storageLoaded(this.props) && this.storageLoaded(props)){
      this.setData(props);
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
  }

  setData(props){
    let pricelists = toSelArr(props.pricelists);
    let meta = props.metadata;
    let pricelist = null;
      if(pricelists.length>0){
        if(meta.defaultPricelist!==null){
          pricelist=pricelists.find((item)=>item.id===meta.defaultPricelist);
        }else{
          pricelist=pricelists[0];
        }
      }
      this.setState({pricelists,pricelist,loading:false})
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
              let newCompany = {title:this.state.companyName, pricelist:this.state.pricelist.id};
              rebase.addToCollection('/companies', newCompany)
                .then((comp)=>{
                  this.setState({
                    companyName:'',
                    pausal:this.state.pausal,
                    pricelist:this.state.pricelists.length>0?this.state.pricelists[0]:null,
                    saving:false}, () => {this.props.addCompany({...newCompany, id: comp.id, label: newCompany.title, value: comp.id}); this.props.close()})});
            }}>{this.state.saving?'Adding...':'Add company'}</Button>

            {this.props.close &&
            <Button className="btn btn-link"
              onClick={()=>{this.props.close()}}>Cancel</Button>
            }
          </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageMetadata, storageHelpPricelists}) => {
  const { metadataActive, metadata, metadataLoaded } = storageMetadata;
  const { pricelistsActive, pricelists, pricelistsLoaded } = storageHelpPricelists;
  return { metadataActive, metadata, metadataLoaded, pricelistsActive, pricelists, pricelistsLoaded };
};

export default connect(mapStateToProps, { storageHelpPricelistsStart,storageMetadataStart })(CompanyAdd);
