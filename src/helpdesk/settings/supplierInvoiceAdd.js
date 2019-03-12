import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import InvoiceItems from './invoiceItems';
import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray} from '../../helperFunctions';

export default class SupplierInvoiceAdd extends Component{
  constructor(props){
    super(props);
    let date = new Date().toISOString();
    this.state={
      loading:true,
      units:[],
      suppliers:[],
      supplier:null,
      identifier:0,
      note:'',
      date:date.substring(0,date.indexOf('.')),
      saving:false,
      invoiceItems:[],
      newItemID:0
    }
    this.fetchData.bind(this);
    this.setData.bind(this);
    this.fetchData();
  }

  fetchData(){
    Promise.all([
    database.collection('units').get(),
    database.collection('suppliers').get()
    ])
    .then(([units,suppliers])=>this.setData(toSelArr(snapshotToArray(units)),toSelArr(snapshotToArray(suppliers))));
  }
  setData(units,suppliers){
    let supplier = null;
    if(suppliers.length>0){
      supplier=suppliers[0];
    }
    this.setState({units,supplier,suppliers,loading:false})
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Invoice indetifier</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="number" placeholder="Supplier invoice indetifier" value={this.state.identifier} onChange={(e)=>this.setState({identifier:e.target.value})} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Supplier</ControlLabel>
          </Col>
          <Col sm={9}>
            <Select
              value={this.state.supplier}
              onChange={(supplier)=>this.setState({supplier})}
              options={this.state.suppliers}
              />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Date</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="datetime-local" placeholder="Enter date" value={this.state.date} onChange={(e)=>{this.setState({date:e.target.value})}} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Note</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl componentclassName="textarea" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note:e.target.value})} />
          </Col>
        </FormGroup>

        <InvoiceItems
          units={this.state.units}
          invoiceItems={this.state.invoiceItems}
          addItem={(newItem)=>this.setState({invoiceItems:[...this.state.invoiceItems, newItem],newItemID:this.state.newItemID+1})}
          deleteItem={(id)=>this.setState({invoiceItems:this.state.invoiceItems.filter((item)=>item.id!==id)})}
          editItem={(newItem)=>this.setState({invoiceItems:[...this.state.invoiceItems.filter((item)=>item.id!==newItem.id),newItem]})}
          disabled={this.state.saving||this.state.loading}
          newItemID={this.state.newItemID}
          />

        <Button bsStyle="primary" className="separate" disabled={this.state.saving||this.state.loading} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/supplierInvoices', {supplier:this.state.supplier.id,identifier:this.state.identifier,note:this.state.note,date:this.state.date!==null?(new Date(this.state.date)).getTime():0})
              .then((response)=>{
                this.state.invoiceItems.map((invoiceItem)=>{
                  rebase.addToCollection('/invoiceItems', {
                    title:invoiceItem.title,
                    unit:invoiceItem.unit,
                    quantity:invoiceItem.quantity,
                    price:invoiceItem.price,
                    sn:invoiceItem.sn,
                    invoice:response.id
                  }).then((response)=>{
                    rebase.addToCollection('/storedItems', {
                      invoiceItem:response.id,
                      quantity:invoiceItem.quantity,
                    });
                  });
                  return null;
                })
                this.setState({ supplier:null,identifier:0,note:'',invoiceItems:[],saving:false});
              });
          }}>{this.state.saving?'Adding...':'Add supplier'}</Button>
      </div>
    );
  }
}
