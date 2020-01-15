import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';

import { connect } from "react-redux";
import {storageCompaniesStart} from '../../../redux/actions';

class PausalEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      drivePausal:0,
      pausal:0,
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

    this.setState({
      title: company.title,
      workPausal: company.workPausal || 0,
      drivePausal: company.drivePausal || 0,

      loading:false,
      newData: false,
    })
  }

  submit(){
      this.setState({saving:true});
      rebase.updateDoc('/companies/'+this.props.match.params.id,
      { workPausal:this.state.workPausal,
        drivePausal:this.state.drivePausal,
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
