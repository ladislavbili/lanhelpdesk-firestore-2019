import React, { Component } from 'react';
import { FormGroup, Button, Label, Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import {rebase,database} from '../../index';
import Select from 'react-select';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[],
      pricelist:null,
      companyName:'',
      pausal:0,
      saving:false,
      opened:false
    }
    this.fetchData.bind(this);
    this.setData.bind(this);
    this.fetchData();
  }

    fetchData(){
      Promise.all(
        [
          database.collection('pricelists').get(),
          rebase.get('metadata/0', {
            context: this,
          })
        ]).then(([pricelists,meta])=>{
        this.setData(toSelArr(snapshotToArray(pricelists)),meta);
      });
    }

    setData(pricelists,meta){
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

  toggle(){
    this.setState({opened:!this.state.opened})
  }
  render(){
    return (
      <div>
        <i className="fa fa-plus clickable" onClick={()=>{
            this.setState({opened:true});
          }} />
        <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
            <ModalHeader toggle={this.toggle.bind(this)}>Add company</ModalHeader>
            <ModalBody>
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" className="mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>
              <Button color="primary" className="separate" disabled={this.state.saving||this.state.loading||this.state.pricelist===undefined||this.state.companyName===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/companies', {title:this.state.companyName,pricelist:this.state.pricelist.id})
                    .then(()=>{this.setState({companyName:'',pausal:this.state.pausal,pricelist:this.state.pricelists.length>0?this.state.pricelists[0]:null,saving:false})});
                }}>{this.state.saving?'Adding...':'Add company'}</Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
