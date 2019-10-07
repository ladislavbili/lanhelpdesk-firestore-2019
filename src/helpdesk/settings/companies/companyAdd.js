import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import {toSelArr} from '../../../helperFunctions';
import {rebase} from '../../../index';
import {selectStyle} from "../../../scss/selectStyles";

import { connect } from "react-redux";
import {storageHelpPricelistsStart,storageMetadataStart} from '../../../redux/actions';
import {sameStringForms, isEmail} from '../../../helperFunctions';

class CompanyAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[],
      pricelist:null,
      oldPricelist: null,
      changedPricelist: false,
      companyName:'',
      oldCompanyName: "",
      changedCompanyName: false,
      ICO: "",
      oldICO: "",
      changedICO: false,
      DIC: "",
      oldDIC: "",
      changedDIC: false,
      IC_DPH: "",
      oldIC_DPH: "",
      changedIC_DPH: false,
      country: "",
      oldCountry: "",
      changedCountry: false,
      city: "",
      oldCity: "",
      changedCity: false,
      street: "",
      oldStreet: "",
      changedStreet: false,
      PSC: "",
      oldPSC: "",
      changedPSC: false,
      mail: "",
      oldMail: "",
      changedMail: false,
      phone: "",
      oldPhone: "",
      changedPhone: false,
      description: "",
      oldDescription: "",
      changedDescription: false,
      pausal:0,
      oldPausal: 0,
      changedPausal: false,
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    this.submit.bind(this);
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
      let newCompany = { title:this.state.companyName,
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
            companyName:'',
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

  render(){

    return (
      <div className="card-box scroll-visible fit-with-header-and-commandbar">
        {(this.state.changedPSC ||
        this.state.changedDIC ||
        this.state.changedICO ||
        this.state.changedIC_DPH ||
        this.state.changedMail ||
        this.state.changedCity ||
        this.state.changedPhone ||
        this.state.changedStreet ||
        this.state.changedCountry ||
        this.state.changedPricelist ||
        this.state.changedPausal ||
        this.state.changedDescription ||
        this.state.changedCompanyName) &&
        <div style={{position: "fixed", zIndex: "999", backgroundColor: "rgba(255,255,255,0.5)", top: "0", left: "0", width: "100%", height: "100vh"}}></div>
      }
        <div className="">
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <FormGroup style={(this.state.changedCompanyName ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="name">Company name</Label>
            <Input
              name="name"
              id="name"
              type="text"
              placeholder="Enter company name"
              value={this.state.companyName}
              onChange={(e)=>this.setState({oldCompanyName: (this.state.changedCompanyName ? this.state.oldCompanyName : this.state.companyName), companyName:e.target.value, changedCompanyName: true, })}
              onBlur={() => {
                if (this.state.changedCompanyName) {
                  setTimeout(() => document.getElementById("name").focus(), 5);
                }
                }}
              />
            {this.state.changedCompanyName &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedCompanyName: false, oldCompanyName: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedCompanyName: false, companyName: this.state.oldCompanyName, oldCompanyName: ""})
                }}>Cancel</Button>
            </div>
          }
          </FormGroup>

          <FormGroup style={(this.state.changedPausal ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="pausal">Paušál</Label>
            <Input
              name="pausal"
              id="pausal"
              type="number"
              placeholder="Enter pausal"
              value={this.state.pausal}
              onChange={(e)=>this.setState({oldPausal: (this.state.changedPausal ? this.state.oldPausal : this.state.pausal), pausal:e.target.value, changedPausal: true,})}
              onBlur={() => {
                if (this.state.changedPausal) {
                  setTimeout(() => document.getElementById("pausal").focus(), 5);
                }
                }}
              />
            {this.state.changedPausal &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedPausal: false, oldPausal: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedPausal: false, pausal: this.state.oldPausal, oldPausal: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup  style={(this.state.changedPricelist ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="pricelist">Pricelist</Label>
            <Select
              id="pricelist"
              name="pricelist"
              styles={selectStyle}
              options={this.state.pricelists}
              value={this.state.pricelist}
              onChange={e =>{ this.setState({ oldPricelist: (this.state.changedPricelist ? this.state.oldPricelist : this.state.pricelist),  pricelist: e, changedPricelist: true }) }}
              onBlur={() => {
                if (this.state.changedPricelist) {
                  setTimeout(() => document.getElementById("pricelist").focus(), 5);
                }
                }}
              />
            {this.state.changedPricelist &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedPricelist: false, oldPricelist: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedPricelist: false, pricelist: this.state.oldPricelist, oldPricelist: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup style={(this.state.changedICO ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="ico">ICO</Label>
            <Input
              name="ico"
              id="ico"
              type="text"
              placeholder="Enter ICO"
              value={this.state.ICO}
              onChange={(e)=>this.setState({ oldICO: (this.state.changedICO ? this.state.oldICO : this.state.ICO),  ICO: e.target.value, changedICO: true })  }
              onBlur={() => {
                if (this.state.changedICO) {
                  setTimeout(() => document.getElementById("ico").focus(), 5);
                }
                }}
              />
            {this.state.changedICO &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedICO: false, oldICO: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedICO: false, ICO: this.state.oldICO, oldICO: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup style={(this.state.changedDIC ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="dic">DIC</Label>
            <Input
              name="dic"
              id="dic"
              type="text"
              placeholder="Enter DIC"
              value={this.state.DIC}
              onChange={(e)=>this.setState({ oldDIC: (this.state.changedDIC ? this.state.oldDIC : this.state.DIC),  DIC: e.target.value, changedDIC: true }) }
              onBlur={() => {
                if (this.state.changedDIC) {
                  setTimeout(() => document.getElementById("dic").focus(), 5);
                }
                }}
              />
            {this.state.changedDIC &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedDIC: false, oldDIC: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedDIC: false, DIC: this.state.oldDIC, oldDIC: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup style={(this.state.changedIC_DPH ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="ic_dph">IC DPH</Label>
            <Input
              name="ic_dph"
              id="ic_dph"
              type="text"
              placeholder="Enter IC DPH"
              value={this.state.IC_DPH}
              onChange={(e)=>this.setState({ oldIC_DPH: (this.state.changedIC_DPH ? this.state.oldIC_DPH : this.state.IC_DPH),  IC_DPH: e.target.value, changedIC_DPH: true }) }
              onBlur={() => {
                if (this.state.changedIC_DPH) {
                  setTimeout(() => document.getElementById("ic_dph").focus(), 5);
                }
                }}
              />
            {this.state.changedIC_DPH &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedIC_DPH: false, oldIC_DPH: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedIC_DPH: false, IC_DPH: this.state.oldIC_DPH, oldIC_DPH: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup style={(this.state.changedCountry ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="country">Country</Label>
            <Input
              name="country"
              id="country"
              type="text"
              placeholder="Enter country"
              value={this.state.country}
              onChange={(e)=>this.setState({ oldCountry: (this.state.changedCountry ? this.state.oldCountry : this.state.country),  country: e.target.value, changedCountry: true })}
              onBlur={() => {
                if (this.state.changedCountry) {
                  setTimeout(() => document.getElementById("country").focus(), 5);
                }
                }}
              />
            {this.state.changedCountry &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedCountry: false, oldCountry: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedCountry: false, country: this.state.oldCountry, oldCountry: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup style={(this.state.changedCity ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="city">City</Label>
            <Input
              name="city"
              id="city"
              type="text"
              placeholder="Enter city"
              value={this.state.city}
              onChange={(e)=>this.setState({oldCity: (this.state.changedCity ? this.state.oldCity : this.state.city),  city: e.target.value, changedCity: true})}
              onBlur={() => {
                if (this.state.changedCity) {
                  setTimeout(() => document.getElementById("city").focus(), 5);
                }
                }}
              />
            {this.state.changedCity &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedCity: false, oldCity: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedCity: false, city: this.state.oldCity, oldCity: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup style={(this.state.changedStreet ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="street">Street</Label>
            <Input
              name="street"
              id="street"
              type="text"
              placeholder="Enter street"
              value={this.state.street}
              onChange={(e)=>this.setState({oldStreet: (this.state.changedStreet ? this.state.oldStreet : this.state.street),  street: e.target.value, changedStreet: true})}
              onBlur={() => {
                if (this.state.changedStreet) {
                  setTimeout(() => document.getElementById("street").focus(), 5);
                }
                }}
              />
            {this.state.changedStreet &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedStreet: false, oldStreet: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedStreet: false, street: this.state.oldStreet, oldStreet: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup style={(this.state.changedPSC ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="psc">PSČ</Label>
            <Input
              name="psc"
              id="psc"
              type="text"
              placeholder="Enter PSČ"
              value={this.state.PSC}
              onChange={(e)=>this.setState({oldPSC: (this.state.changedPSC ? this.state.oldPSC : this.state.PSC),  PSC: e.target.value, changedPSC: true})}
              onBlur={() => {
                if (this.state.changedPSC) {
                  setTimeout(() => document.getElementById("psc").focus(), 5);
                }
                }}
              />
            {this.state.changedPSC &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedPSC: false, oldPSC: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedPSC: false, PSC: this.state.oldPSC, oldPSC: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup style={(this.state.changedMail ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="mail">E-mail</Label>
            <Input
              name="mail"
              id="mail"
              className={(this.state.mail.length > 0 && !isEmail(this.state.mail)) ? "form-control-warning" : ""}
              type="text"
              placeholder="Enter e-mail"
              value={this.state.mail}
              onChange={(e)=>this.setState({oldMail: (this.state.changedMail ? this.state.oldMail : this.state.mail),  mail: e.target.value, changedMail: true})}
              onBlur={() => {
                if (this.state.changedMail) {
                  setTimeout(() => document.getElementById("mail").focus(), 5);
                }
                }}
              />
            { this.state.mail.length > 0 &&
              !isEmail(this.state.mail) &&
              <Label className="pull-right warning">This mail address is invalid.</Label>
            }
            {this.state.changedMail &&
            <div className="row">
              {
                this.state.mail.length > 0 &&
                isEmail(this.state.mail) &&
                <Button className="btn-link-reversed"
                   onClick={()=>{
                    this.setState({changedMail: false, oldMail: ""}, () => this.submit())
                  }}>Save</Button>
              }
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedMail: false, mail: this.state.oldMail, oldMail: ""})
                }}>Cancel</Button>
              </div>
            }

          </FormGroup>

          <FormGroup style={(this.state.changedPhone ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="phone">Phone</Label>
            <Input
               name="phone"
               id="phone"
               type="text"
               placeholder="Enter phone"
               value={this.state.phone}
              onChange={(e)=>this.setState({oldPhone: (this.state.changedPhone ? this.state.oldPhone : this.state.phone),  phone: e.target.value, changedPhone: true})}
              onBlur={() => {
                if (this.state.changedPhone) {
                  setTimeout(() => document.getElementById("phone").focus(), 5);
                }
                }}
              />
            {this.state.changedPhone &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedPhone: false, oldPhone: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedPhone: false, phone: this.state.oldPhone, oldPhone: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>

          <FormGroup style={(this.state.changedDescription ? {position: "relative", zIndex: "99999"} : {})}>
            <Label for="description">Description</Label>
            <Input
              name="description"
              id="description"
              type="text"
              placeholder="Enter description"
              value={this.state.description}
              onChange={(e)=>this.setState({oldDescription: (this.state.changedDescription ? this.state.oldDescription : this.state.description),  description: e.target.value, changedDescription: true})}
              onBlur={() => {
                if (this.state.changedDescription) {
                  setTimeout(() => document.getElementById("description").focus(), 5);
                }
                }}
              />
            {this.state.changedDescription &&
            <div className="row">
              <Button className="btn-link-reversed"
                 onClick={()=>{
                  this.setState({changedDescription: false, oldDescription: ""}, () => this.submit())
                }}>Save</Button>
              <Button className="btn-link"
                onClick={()=>{
                  this.setState({changedDescription: false, description: this.state.oldDescription, oldDescription: ""})
                }}>Cancel</Button>
            </div>
          }

          </FormGroup>


          {false && <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              let newCompany = {
                title: this.state.companyName,
                pricelist: this.state.pricelist.id,
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
                    companyName:'',
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
                      }
                    }
                    )});
            }}>{this.state.saving?'Adding...':'Add company'}</Button>}

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
