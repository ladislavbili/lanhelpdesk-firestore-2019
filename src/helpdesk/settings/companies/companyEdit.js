import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import {rebase,database} from '../../../index';
import {toSelArr,snapshotToArray} from '../../../helperFunctions';

export default class CompanyEdit extends Component{
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
    this.fetchData.bind(this);
    this.setData.bind(this);
    this.fetchData(this.props.match.params.id);
  }

  fetchData(id){
    Promise.all([
      rebase.get('companies/'+id, {
        context: this,
      }),
      database.collection('help-pricelists').get()
    ])
    .then(([company,pricelists])=>this.setData(company,toSelArr(snapshotToArray(pricelists))))
  }

  setData(company,pricelists){
    let pricelist=pricelists.find((item)=>item.id===company.pricelist);
    if(pricelist===undefined && pricelists.length>0){
      pricelist=pricelists[0];
    }
    this.setState({companyName:company.title,pausal:company.pausal,pricelists,pricelist,loading:false})
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
            className="supressDefaultSelectStyle"
            options={this.state.pricelists}
            value={this.state.pricelist}
            onChange={e =>{ this.setState({ pricelist: e }); }}
              />
        </FormGroup>
        <Button color="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/companies/'+this.props.match.params.id, {title:this.state.companyName,pausal:this.state.pausal,pricelist:this.state.pricelist.id})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving company...':'Save company'}</Button>

        <Button color="danger" className="separate" disabled={this.state.saving} onClick={()=>{
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
