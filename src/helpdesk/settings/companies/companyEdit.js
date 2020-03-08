import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import Switch from "react-switch";
import {rebase} from '../../../index';
import {toSelArr} from '../../../helperFunctions';
import {selectStyle} from "../../../scss/selectStyles";

import { connect } from "react-redux";
import {storageHelpPricelistsStart,storageMetadataStart, storageCompaniesStart, storageHelpTaskTypesStart, storageHelpTripTypesStart} from '../../../redux/actions';
import {sameStringForms, isEmail} from '../../../helperFunctions';
import CompanyRents from './companyRents';
import PriceEdit from "../prices/priceEdit";

class CompanyEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[{label: "Nový cenník", value: "0"}],
      pricelist:{},
      oldPricelist: {},
      priceName: "",
      taskTypes: [],
      tripTypes: [],
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
      workPausal:0,
      oldWorkPausal:0,
      pausalPrice:0,
      oldPausalPrice:0,
      drivePausal:0,
      oldDrivePausal:0,
      pausal:0,
      oldPausal: 0,
      rented:[],
      oldRented:[],
      dph:20,
      oldDph:20,
      monthlyPausal:false,
      oldMonthlyPausal:false,
      fakeID:0,
      oldFakeID:0,
      newData: false,
      loading:true,
      saving:false,
      clearCompanyRents:false,
    }
    this.getFakeID.bind(this);
    this.savePriceList.bind(this);
    this.setData.bind(this);
    this.submit.bind(this);
    this.cancel.bind(this);
  }

  getFakeID(){
    let fakeID = this.state.fakeID;
    this.setState({fakeID:fakeID+1})
    return fakeID;
  }

  storageLoaded(props){
    return props.pricelistsLoaded && props.metadataLoaded && props.companiesLoaded && props.tripTypesLoaded && props.taskTypesLoaded;
  }
  componentWillReceiveProps(props){
    if(!sameStringForms(props.pricelists,this.props.pricelists)){
      this.setState({pricelists: [{label: "Nový cenník", value: "0"}, ...toSelArr(props.pricelists)]})
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
    if(!this.props.tripTypesActive){
      this.props.storageHelpTripTypesStart();
    }
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
  }

  setData(props){
    let pricelists = [{label: "Nový cenník", value: "0"}, ...toSelArr(props.pricelists)];
    let meta = props.metadata;
    let company = props.companies.find((company)=>company.id===props.match.params.id);
    let pricelist=pricelists.find((item)=>item.id===company.pricelist);
    if(pricelist===undefined){
      pricelist=pricelists.find((item)=>item.id===meta.defaultPricelist);
      if(pricelist===undefined && pricelists.length>0){
        pricelist=pricelists[0];
      }
    }
    let taskTypes = props.taskTypes.map((type)=>{
      let newType={...type};
      newType.price={price:0};
      return newType;
    });

    let tripTypes = props.tripTypes.map((type)=>{
      let newType={...type};
      newType.price={price:0};
      return newType;
    });
    let rented = company.rented||[];
    let fakeID = 0;
    if(rented.length!==0){
      fakeID = rented.sort((item1,item2)=>item1.id < item2.id?1:-1)[0].id+1;
    }

    this.setState({
      title: company.title,
      pausal: company.pausal || 0,
      workPausal: company.workPausal || 0,
      pausalPrice: company.pausalPrice || 0,
      drivePausal: company.drivePausal || 0,
      rented,
      fakeID,
      ICO: company.ICO || "",
      DIC: company.DIC || "",
      IC_DPH: company.IC_DPH || "",
      country: company.country || "",
      city: company.city || "",
      street: company.street || "",
      PSC: company.PSC || "",
      mail: company.mail || "",
      phone: company.phone || "",
      description: company.description || "",
      dph:company.dph || 0,
      monthlyPausal: company.monthlyPausal === true,
      pricelists,
      pricelist,
      taskTypes,
      tripTypes,

      oldPausal: company.pausal || 0,
      oldWorkPausal: company.workPausal || 0,
      oldPausalPrice: company.pausalPrice || 0,
      oldDrivePausal: company.drivePausal || 0,
      oldRented:rented,
      oldFakeID:fakeID,
      oldPricelist: pricelist,
      oldTitle: company.title,
      oldICO: company.ICO || "",
      oldDIC: company.DIC || "",
      oldIC_DPH: company.IC_DPH || "",
      oldCountry: company.country || "",
      oldCity: company.city || "",
      oldStreet: company.street || "",
      oldPSC: company.PSC || "",
      oldMail: company.mail || "",
      oldPhone: company.phone || "",
      oldDescription: company.description || "",
      oldDph:company.dph || 0,
      oldMonthlyPausal: company.monthlyPausal === true,
      loading:false,
      newData: false,
    })
  }

  submit(){
      this.setState({saving:true});
      rebase.updateDoc('/companies/'+this.props.match.params.id,
      { title:this.state.title,
        workPausal:this.state.workPausal,
        pausalPrice: this.state.pausalPrice,
        drivePausal:this.state.drivePausal,
        rented:this.state.rented.map((rent)=>{
          return{
            id:rent.id,
            title:rent.title,
            quantity:isNaN(parseInt(rent.quantity))?0:rent.quantity,
            unitCost:isNaN(parseFloat(rent.unitCost))?0:rent.unitCost,
            unitPrice:isNaN(parseFloat(rent.unitPrice))?0:rent.unitPrice,
            totalPrice:isNaN(parseFloat(rent.totalPrice))?0:rent.totalPrice,
          }
        }),
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
        monthlyPausal:this.state.monthlyPausal,
        description: this.state.description,
        dph:isNaN(parseInt(this.state.dph))?0:parseInt(this.state.dph),
      })
        .then(()=>{this.setState({
          saving:false,
          newData: false,
          rented:this.state.rented.map((rent)=>{
            return{
              id:rent.id,
              title:rent.title,
              quantity:isNaN(parseInt(rent.quantity))?0:rent.quantity,
              unitCost:isNaN(parseFloat(rent.unitCost))?0:rent.unitCost,
              unitPrice:isNaN(parseFloat(rent.unitPrice))?0:rent.unitPrice,
              totalPrice:isNaN(parseFloat(rent.totalPrice))?0:rent.totalPrice,
            }
          }),

          oldWorkPausal:this.state.workPausal,
          oldPausalPrice: this.state.pausalPrice,
          oldDrivePausal:this.state.drivePausal,
          oldRented:this.state.rented,
          oldFakeID:this.state.fakeID,
          oldPricelist: this.state.pricelist,
          oldTitle: this.state.title,
          oldICO: this.state.ICO,
          oldDIC: this.state.DIC,
          oldIC_DPH: this.state.IC_DPH,
          oldCountry: this.state.country,
          oldCity: this.state.city,
          oldStreet: this.state.street,
          oldPSC: this.state.PSC,
          oldMail: this.state.mail,
          oldPhone: this.state.phone,
          oldDescription: this.state.description,
          oldPausal: this.state.pausal,
          oldDph: this.state.dph,
          oldMonthlyPausal: this.state.monthlyPausal,
        })});
  }

  savePriceList(){
    this.setState({saving:true});
    rebase.addToCollection('/help-pricelists',
    {
      title: this.state.priceName,
      afterHours:'0',
      materialMargin:'0',
      materialMarginExtra:'0'
    })
      .then((listResponse)=>{
        this.state.taskTypes.map((taskType,index)=>
          rebase.addToCollection('/help-prices', {pricelist:listResponse.id,type:taskType.id,price:"0"})
        );
        this.state.tripTypes.map((tripType,index)=>
          rebase.addToCollection('/help-prices', {pricelist:listResponse.id,type:tripType.id,price:"0"})
        );
        this.setState({
          saving:false,
          pricelist: {label: this.state.priceName, value: listResponse.id, id: listResponse.id},
          newData: false,
        }, () => this.submit());
      });
  }

  cancel(){
    this.setState({
      pricelist: this.state.oldPricelist,
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
      workPausal: this.state.oldWorkPausal,
      pausalPrice: this.state.oldPausalPrice,
      drivePausal: this.state.oldDrivePausal,
      rented:this.state.oldRented,
      dph:this.state.oldDph,
      monthlyPausal:this.state.monthlyPausal,

      clearCompanyRents:true,
      newData: false,
    })
  }

  render(){
    return (
      <div className="fit-with-header-and-commandbar">
        {this.state.newData &&
        <div style={{position: "fixed", zIndex: "999", backgroundColor: "rgba(255,255,255,0.5)", top: "0", left: "0", width: "100%", height: "100vh"}}></div>
      }

      <h2 className="p-t-10 p-l-20 p-b-5" style={(this.state.newData ? {position: "relative", zIndex: "99999"} : {})}>Edit company</h2>
      <hr style={(this.state.newData ? {position: "relative", zIndex: "99999"} : {})}/>

        {
          this.state.loading &&
          <Alert color="success">
            Loading data...
          </Alert>
        }

        <div className="form-body-highlighted scroll-visible">
          <div className="p-20">
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="name">Company name</Label>
              </div>
              <div className="flex">
                <Input
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Enter company name"
                  value={this.state.title}
                  onChange={(e)=>this.setState({title: e.target.value, newData: true, })}
                  />
              </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="dph">DPH</Label>
              </div>
                <div className="flex">
              <Input
                name="dph"
                id="dph"
                type="number"
                placeholder="Enter DPH"
                value={this.state.dph}
                onChange={(e)=>this.setState({dph: e.target.value, newData: true })  }
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="ico">ICO</Label>
              </div>
                <div className="flex">
              <Input
                name="ico"
                id="ico"
                type="text"
                placeholder="Enter ICO"
                value={this.state.ICO}
                onChange={(e)=>this.setState({ICO: e.target.value, newData: true })  }
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="dic">DIC</Label>
              </div>
                <div className="flex">
              <Input
                name="dic"
                id="dic"
                type="text"
                placeholder="Enter DIC"
                value={this.state.DIC}
                onChange={(e)=>this.setState({DIC: e.target.value, newData: true }) }
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="ic_dph">IC DPH</Label>
              </div>
                <div className="flex">
              <Input
                name="ic_dph"
                id="ic_dph"
                type="text"
                placeholder="Enter IC DPH"
                value={this.state.IC_DPH}
                onChange={(e)=>this.setState({IC_DPH: e.target.value, newData: true }) }
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="country">Country</Label>
              </div>
                <div className="flex">
              <Input
                name="country"
                id="country"
                type="text"
                placeholder="Enter country"
                value={this.state.country}
                onChange={(e)=>this.setState({country: e.target.value, newData: true })}
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="city">City</Label>
              </div>
                <div className="flex">
              <Input
                name="city"
                id="city"
                type="text"
                placeholder="Enter city"
                value={this.state.city}
                onChange={(e)=>this.setState({city: e.target.value, newData: true})}
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="street">Street</Label>
              </div>
                <div className="flex">
              <Input
                name="street"
                id="street"
                type="text"
                placeholder="Enter street"
                value={this.state.street}
                onChange={(e)=>this.setState({street: e.target.value, newData: true})}
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="psc">PSČ</Label>
              </div>
                <div className="flex">
              <Input
                name="psc"
                id="psc"
                type="text"
                placeholder="Enter PSČ"
                value={this.state.PSC}
                onChange={(e)=>this.setState({PSC: e.target.value, newData: true})}
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="mail">E-mail</Label>
              </div>
                <div className="flex">
              <Input
                name="mail"
                id="mail"
                className={(this.state.mail.length > 0 && !isEmail(this.state.mail)) ? "form-control-warning" : ""}
                type="text"
                placeholder="Enter e-mail"
                value={this.state.mail}
                onChange={(e)=>this.setState({mail: e.target.value, newData: true})}
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="phone">Phone</Label>
              </div>
                <div className="flex">
              <Input
                 name="phone"
                 id="phone"
                 type="text"
                 placeholder="Enter phone"
                 value={this.state.phone}
                onChange={(e)=>this.setState({phone: e.target.value, newData: true})}
                />
            </div>
            </FormGroup>

            <FormGroup className="row">
              <div className="m-r-10 w-20">
              <Label for="description">Description</Label>
              </div>
                <div className="flex">
              <Input
                name="description"
                id="description"
                type="text"
                placeholder="Enter description"
                value={this.state.description}
                onChange={(e)=>this.setState({description: e.target.value, newData: true})}
                />
            </div>
            </FormGroup>

          </div>

          { this.props.role > 1 && <div className="p-20 table-highlight-background">
            <div className="row">
              <span>
                <h3 className="m-r-5 m-b-10">Mesačný paušál</h3>
              </span>

              <label>
                <Switch
                  checked={this.state.monthlyPausal}
                  onChange={()=>{
                    this.setState({monthlyPausal:!this.state.monthlyPausal, newData: true })
                  }}
                  height={22}
                  checkedIcon={<span className="switchLabel">YES</span>}
                  uncheckedIcon={<span className="switchLabel">NO</span>}
                  onColor={"#0078D4"} />
                <span className="m-l-10"></span>
              </label>
            </div>
            { this.state.monthlyPausal && <div>
              <FormGroup className="row m-b-10 m-t-20">
                <div className="m-r-10 w-20">
                  <Label for="pausal">Mesačná</Label>
                </div>
                <div className="flex">
                  <Input
                    name="pausal"
                    id="pausal"
                    type="number"
                    placeholder="Enter work pausal"
                    value={this.state.pausalPrice}
                    onChange={(e)=>this.setState({pausalPrice:e.target.value, newData: true,})}
                    />
                </div>
                <div className="m-l-10">
                  <Label for="pausal">EUR bez DPH/mesiac</Label>
                </div>
              </FormGroup>
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="pausal">Paušál práce</Label>
              </div>
                <div className="flex">
              <Input
                name="pausal"
                id="pausal"
                type="number"
                placeholder="Enter work pausal"
                value={this.state.workPausal}
                onChange={(e)=>this.setState({workPausal:e.target.value, newData: true,})}
                />
            </div>
            </FormGroup>
            <FormGroup className="row">
              <div className="m-r-10 w-20">
              <Label for="pausal">Paušál výjazdy</Label>
              </div>
                <div className="flex">
              <Input
                name="pausal"
                id="pausal"
                type="number"
                placeholder="Enter drive pausal"
                value={this.state.drivePausal}
                onChange={(e)=>this.setState({drivePausal:e.target.value, newData: true,})}
                />
            </div>
            </FormGroup>

          <div className="p-20">
            <h3 className="m-b-15">Mesačný prenájom licencií a hardware</h3>
            <CompanyRents
              clearForm={this.state.clearCompanyRents}
              setClearForm={()=>this.setState({clearCompanyRents:false})}
              data={this.state.rented}
              updateRent={(rent)=>{
                let newRents=[...this.state.rented];
                newRents[newRents.findIndex((item)=>item.id===rent.id)]={...newRents.find((item)=>item.id===rent.id),...rent};
                this.setState({rented:newRents, newData:true });
              }}
              addRent={(rent)=>{
                let newRents=[...this.state.rented];
                newRents.push({...rent,id:this.getFakeID()})
                this.setState({rented:newRents, newData:true });
              }}
              removeRent={(rent)=>{
                let newRents=[...this.state.rented];
                newRents.splice(newRents.findIndex((item)=>item.id===rent.id),1);
                this.setState({rented:newRents, newData:true });
              }}
            />
        </div>
      </div>}
      <div className="row">
        <h3 className="m-b-20 m-r-10">Cenník</h3>
          <label>
            <Switch
              checked={this.state.pricelist.def}
              onChange={(checked)=>{
                if (checked){
                  this.setState({oldPricelist: {...this.state.pricelist}, pricelist: this.state.pricelists.find(list => list.def), newData: true})
                } else {
                  this.setState({oldPricelist: {...this.state.pricelist}, pricelist: (this.state.pricelists.length > 1 ? this.state.pricelists.slice(1, this.state.pricelists.length).find(list => !list.def) : {}), newData: true})
                }
              }}
              height={22}
              width={80}
              checkedIcon={<span className="switchLabel">Default</span>}
              uncheckedIcon={<span className="switchLabel-right">Vlastný</span>}
              onColor={"#0078D4"} />
            <span className="m-l-10"></span>
          </label>
      </div>
      {!this.state.pricelist.def && this.state.pricelist !== null &&
          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
            <Label for="pricelist">Pricelist</Label>
            </div>
              <div className="flex">
            <Select
              id="pricelist"
              name="pricelist"
              styles={selectStyle}
              options={this.state.pricelists}
              value={this.state.pricelist}
              onChange={e =>{ this.setState({oldPricelist: {...this.state.pricelist}, pricelist: e, newData: true}) }}
              />
          </div>
          </FormGroup>
        }
          {!this.state.pricelist.def &&
            this.state.pricelist.value === "0" &&
            (this.state.priceName === "" ||
            this.state.newData) &&
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
              <Label for="priceName">Price list name</Label>
              </div>
                <div className="flex">
                  <Input
                    name="priceName"
                    id="priceName"
                    type="text"
                    placeholder="Enter price list nema"
                    value={this.state.priceName}
                    onChange={(e)=>this.setState({priceName: e.target.value, newData: true})}/>
                </div>
            </FormGroup>
          }
          { Object.keys(this.state.pricelist).length &&
            this.state.pricelist !== {} &&
            this.state.pricelist.value !== "0" &&
            !this.state.pricelist.def &&
            <PriceEdit {...this.props}
              listId={this.state.pricelist.id}
              changedName={ (e) => this.setState({pricelist: {...this.state.pricelist, label: e} }) }
              deletedList={ () => this.setState({pricelist: {}, priceName: ""}) }/>
          }
          { Object.keys(this.state.pricelist).length &&
            this.state.pricelist.value !== "0" &&
            this.state.pricelist.def &&
            <div>
              <Button
                className="btn-link-reversed p-l-0"
                onClick={()=>{
                  if (window.confirm("You will be redirected to a page where you can edit this pricelist. All unsaved progress will be lost, are you sure you want to proceed?")){
                    this.cancel();
                    this.props.history.push(`/helpdesk/settings/pricelists/${this.state.pricelist.id}`)
                  }
              }}>Edit here</Button>
            </div>
          }
        </div>}
      </div>

        <div
          className="form-footer row"
          style={(this.state.newData ? {zIndex: "99999"} : {})}>
          {this.state.newData &&
            <Button
              className="btn"
              disabled={this.state.saving || this.state.title.length === 0 || (this.state.pricelist.value === "0" &&
                                                                              (this.state.priceName === "")) }
              onClick={()=>{
                if (this.state.pricelist.value === "0" && this.state.priceName !== ""){
                  this.savePriceList();
                } else {
                  this.submit()
                }
            }}>{this.state.saving?'Saving...':'Save changes'}</Button>
          }

           <Button className="btn-red ml-auto" disabled={this.state.saving} onClick={()=>{
               if(window.confirm("Are you sure?")){
                 rebase.removeDoc('/companies/'+this.props.match.params.id).then(()=>{
                   this.props.history.goBack();
                 });
               }
              }}>Delete</Button>


          {this.state.newData &&
            <Button
              className="btn-link"
              disabled={this.state.saving}
              onClick={() => this.cancel()}>Cancel changes</Button>
          }

        </div>

      </div>
    );
  }
}


const mapStateToProps = ({ storageMetadata, storageHelpPricelists, storageCompanies, storageHelpTaskTypes, storageHelpTripTypes, userReducer }) => {
  const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
  const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;
  const { metadataActive, metadata, metadataLoaded } = storageMetadata;
  const { pricelistsActive, pricelists, pricelistsLoaded } = storageHelpPricelists;
  const { companiesActive, companies, companiesLoaded } = storageCompanies;
  const role = userReducer.userData ? userReducer.userData.role.value : 0;
  return { taskTypesLoaded, taskTypesActive, taskTypes, tripTypesActive, tripTypes, tripTypesLoaded, metadataActive, metadata, metadataLoaded, pricelistsActive, pricelists, pricelistsLoaded, companiesActive, companies, companiesLoaded, role };
};

export default connect(mapStateToProps, { storageHelpPricelistsStart,storageMetadataStart, storageCompaniesStart, storageHelpTaskTypesStart, storageHelpTripTypesStart })(CompanyEdit);
