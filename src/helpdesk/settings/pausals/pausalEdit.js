import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';

import { connect } from "react-redux";
import {storageCompaniesStart} from '../../../redux/actions';
import CompanyRents from '../companies/companyRents';

class PausalEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      drivePausal:0,
      pausal:0,
      rented:[],

      fakeID:0,
      loading:true,
      saving:false,
    }
    this.setData.bind(this);
    this.submit.bind(this);
  }

  getFakeID(){
    let fakeID = this.state.fakeID;
    this.setState({fakeID:fakeID+1})
    return fakeID;
  }

  storageLoaded(props){
    return props.companiesLoaded
  }

  componentWillReceiveProps(props){
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
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
  }

  setData(props){
    let company = props.companies.find((company)=>company.id===props.match.params.id);
    let rented = company.rented||[];
    let fakeID = 0;
    if(rented.length!==0){
      fakeID = rented.sort((item1,item2)=>item1.id < item2.id?1:-1)[0].id+1;
    }
    this.setState({
      title: company.title,
      workPausal: company.workPausal || 0,
      drivePausal: company.drivePausal || 0,
      rented,

      fakeID,
      loading:false,
      newData: false,
    })
  }

  submit(){
      this.setState({saving:true});
      rebase.updateDoc('/companies/'+this.props.match.params.id,
      {
        workPausal:this.state.workPausal,
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
      })
        .then(()=>this.setState({
          saving:false,
        }));
  }


  render(){
    return (
      <div className="fit-with-header-and-commandbar">

      <h1 className="p-t-10 p-l-20 p-b-5">Paušále firmy: {this.state.title}</h1>


        <h3>Paušál</h3>
        <FormGroup>
          <Label for="pausal">Paušál práce</Label>
          <Input
            name="pausal"
            id="pausal"
            type="number"
            placeholder="Enter work pausal"
            value={this.state.workPausal}
            onChange={(e)=>this.setState({workPausal:e.target.value,})}
            />
        </FormGroup>
        <FormGroup>
          <Label for="pausal">Paušál výjazdy</Label>
          <Input
            name="pausal"
            id="pausal"
            type="number"
            placeholder="Enter drive pausal"
            value={this.state.drivePausal}
            onChange={(e)=>this.setState({drivePausal:e.target.value,})}
            />
        </FormGroup>
        <CompanyRents
          clearForm={this.state.clearCompanyRents}
          setClearForm={()=>this.setState({clearCompanyRents:false})}
          data={this.state.rented}
          updateRent={(rent)=>{
            let newRents=[...this.state.rented];
            newRents[newRents.findIndex((item)=>item.id===rent.id)]={...newRents.find((item)=>item.id===rent.id),...rent};
            this.setState({rented:newRents });
          }}
          addRent={(rent)=>{
            let newRents=[...this.state.rented];
            newRents.push({...rent,id:this.getFakeID()})
            this.setState({rented:newRents });
          }}
          removeRent={(rent)=>{
            let newRents=[...this.state.rented];
            newRents.splice(newRents.findIndex((item)=>item.id===rent.id),1);
            this.setState({rented:newRents });
          }}
        />
        <Button
          className="btn"
          disabled={this.state.saving || this.state.title.length === 0 }
          onClick={()=>{
            this.submit()
          }}>{this.state.saving?'Saving...':'Save changes'}</Button>
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

export default connect(mapStateToProps, { storageCompaniesStart })(PausalEdit);
