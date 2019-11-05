import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import {toSelArr} from '../../../helperFunctions';
import {rebase} from '../../../index';
import {selectStyle} from "../../../scss/selectStyles";

import { connect } from "react-redux";
import {storageHelpPricelistsStart,storageMetadataStart} from '../../../redux/actions';
import {sameStringForms, isEmail} from '../../../helperFunctions';

import classnames from "classnames";

class CompanyAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[],
      pricelist:null,
      oldPricelist: null,
      title:'',
      oldTitle: "",
      ICO: "",
      oldICO: "",
      DIC: "",
      oldDIC: "",
      IC_DPH: "",
      oldIC_DPH: "",
      country: "",
      oldCountry: "",
      city: "",
      oldCity: "",
      street: "",
      oldStreet: "",
      PSC: "",
      oldPSC: "",
      mail: "",
      oldMail: "",
      phone: "",
      oldPhone: "",
      description: "",
      oldDescription: "",
      pausal:0,
      oldPausal: 0,

      newData: false,
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    this.submit.bind(this);
    this.cancel.bind(this);
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

  submit(){
      this.setState({saving:true});
      let newCompany = {
        title:this.state.title,
        pausal:this.state.pausal,
        pricelist:this.state.pricelist.id,
        ICO: this.state.ICO,
        DIC: this.state.DIC,
        IC_DPH: this.state.IC_DPH,
        country: this.state.country,
        city: this.state.city,
        street: this.state.street,
        PSC: this.state.PSC,
        mail: this.state.mail,
        phone: this.state.phone,
        description: this.state.description,
      };
      rebase.addToCollection('/companies', newCompany)
        .then((comp)=>{
          this.setState({
            title:'',
            pausal:this.state.pausal,
            pricelist:this.state.pricelists.length>0?this.state.pricelists[0]:null,
            ICO: "",
            DIC: "",
            IC_DPH: "",
            country: "",
            city: "",
            street: "",
            PSC: "",
            mail: "",
            phone: "",
            description: "",
            saving:false}, () => {
              if (this.props.addCompany){
                this.props.addCompany({...newCompany, id: comp.id, label: newCompany.title, value: comp.id});
                this.props.close();
              } else {
                this.props.history.push(`/helpdesk/settings/companies/${comp.id}`)
              }
            }
            )
        });
  }

  cancel(){
    this.setState({
      pricelist: this.state.oldPricelist,
      oldPricelist: this.state.oldPricelist,
      title: this.state.oldTitle,
      ICO: this.state.oldICO,
      DIC: this.state.oldDIC,
      IC_DPH: this.state.oldIC_DPH,
      country: this.state.oldCountry,
      city: this.state.oldCity,
      street: this.state.oldStreet,
      PSC: this.state.oldPSC,
      mail: this.state.oldMail,
      phone: this.state.oldPhone,
      description: this.state.oldDescription,
      pausal: this.state.oldPausal,

      newData: false,
    })
  }

  render(){
    return (
      <div className="fit-with-header-and-commandbar">
        {this.state.newData &&
        <div style={{position: "fixed", zIndex: "999", backgroundColor: "rgba(255,255,255,0.5)", top: "0", left: "0", width: "100%", height: "100vh"}}></div>
        }

        <h1 className="p-t-10 p-l-20 p-b-5" style={(this.state.newData ? {position: "relative", zIndex: "99999"} : {})}>Add new company</h1>
        <hr style={(this.state.newData ? {position: "relative", zIndex: "99999"} : {})}/>

          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <div className={classnames({"form-body-highlighted" : this.state.newData || this.props.addCompany}, {"form-body" : !this.state.newData}, "scroll-visible", "p-20" )}>
            <FormGroup>
              <Label for="name">Company name</Label>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="Enter company name"
                value={this.state.title}
                onChange={(e)=>this.setState({title: e.target.value, newData: true, })}
                />
            </FormGroup>

            <FormGroup>
              <Label for="pausal">Paušál</Label>
              <Input
                name="pausal"
                id="pausal"
                type="number"
                placeholder="Enter pausal"
                value={this.state.pausal}
                onChange={(e)=>this.setState({pausal:e.target.value, newData: true,})}
                />

            </FormGroup>

            <FormGroup>
              <Label for="pricelist">Pricelist</Label>
              <Select
                id="pricelist"
                name="pricelist"
                styles={selectStyle}
                options={this.state.pricelists}
                value={this.state.pricelist}
                onChange={e =>{ this.setState({pricelist: e, newData: true }) }}
                />
            </FormGroup>

            <FormGroup>
              <Label for="ico">ICO</Label>
              <Input
                name="ico"
                id="ico"
                type="text"
                placeholder="Enter ICO"
                value={this.state.ICO}
                onChange={(e)=>this.setState({ICO: e.target.value, newData: true })  }
                />
            </FormGroup>

            <FormGroup>
              <Label for="dic">DIC</Label>
              <Input
                name="dic"
                id="dic"
                type="text"
                placeholder="Enter DIC"
                value={this.state.DIC}
                onChange={(e)=>this.setState({DIC: e.target.value, newData: true }) }
                />
            </FormGroup>

            <FormGroup>
              <Label for="ic_dph">IC DPH</Label>
              <Input
                name="ic_dph"
                id="ic_dph"
                type="text"
                placeholder="Enter IC DPH"
                value={this.state.IC_DPH}
                onChange={(e)=>this.setState({IC_DPH: e.target.value, newData: true }) }
                />
            </FormGroup>

            <FormGroup>
              <Label for="country">Country</Label>
              <Input
                name="country"
                id="country"
                type="text"
                placeholder="Enter country"
                value={this.state.country}
                onChange={(e)=>this.setState({country: e.target.value, newData: true })}
                />
            </FormGroup>

            <FormGroup>
              <Label for="city">City</Label>
              <Input
                name="city"
                id="city"
                type="text"
                placeholder="Enter city"
                value={this.state.city}
                onChange={(e)=>this.setState({city: e.target.value, newData: true})}
                />
            </FormGroup>

            <FormGroup>
              <Label for="street">Street</Label>
              <Input
                name="street"
                id="street"
                type="text"
                placeholder="Enter street"
                value={this.state.street}
                onChange={(e)=>this.setState({street: e.target.value, newData: true})}
                />
            </FormGroup>

            <FormGroup>
              <Label for="psc">PSČ</Label>
              <Input
                name="psc"
                id="psc"
                type="text"
                placeholder="Enter PSČ"
                value={this.state.PSC}
                onChange={(e)=>this.setState({PSC: e.target.value, newData: true})}
                />
            </FormGroup>

            <FormGroup>
              <Label for="mail">E-mail</Label>
              <Input
                name="mail"
                id="mail"
                className={(this.state.mail.length > 0 && !isEmail(this.state.mail)) ? "form-control-warning" : ""}
                type="text"
                placeholder="Enter e-mail"
                value={this.state.mail}
                onChange={(e)=>this.setState({mail: e.target.value, newData: true})}
                />
            </FormGroup>

            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                 name="phone"
                 id="phone"
                 type="text"
                 placeholder="Enter phone"
                 value={this.state.phone}
                onChange={(e)=>this.setState({phone: e.target.value, newData: true})}
                />
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                name="description"
                id="description"
                type="text"
                placeholder="Enter description"
                value={this.state.description}
                onChange={(e)=>this.setState({description: e.target.value, newData: true})}
                />
            </FormGroup>
          </div>

         <div
           className={classnames({ "form-footer": this.state.newData || this.props.addCompany}, "row")}
           style={(this.state.newData ? {zIndex: "99999"} : {})}>
            { (this.state.newData  || this.props.addCompany) &&
              <Button
                className="btn-link"
                disabled={this.state.saving}
                onClick={() => this.cancel()}>Cancel changes</Button>
            }

            {(this.state.newData  || this.props.addCompany) &&
              <Button
                className="btn ml-auto"
                disabled={this.state.saving || this.state.title.length === 0 }
                onClick={()=>{
                  this.submit()
              }}>{this.state.saving?'Adding...':'Add company'}</Button>
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
