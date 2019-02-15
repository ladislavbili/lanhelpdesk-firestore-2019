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
    this.fetchInvoiceItems.bind(this);
    this.setData.bind(this);
    this.fetchData(this.props.match.params.id);
  }

  fetchInvoiceItems(){
    database.collection('invoiceItems').where("invoice", "==", this.props.match.params.id).get().then((response)=>{
      this.setState({invoiceItems:snapshotToArray(response)});
    })
  }

  fetchData(id){
    Promise.all([
    database.collection('units').get(),
    database.collection('suppliers').get(),
    database.collection('invoiceItems').where("invoice", "==", id).get(),
    rebase.get('supplierInvoices/'+id, {
      context: this
    })
    ])
    .then(([units,suppliers,invoiceItems,supplierInvoice])=>this.setData(toSelArr(snapshotToArray(units)),toSelArr(snapshotToArray(suppliers)),snapshotToArray(invoiceItems),supplierInvoice));
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      this.fetchData(props.match.params.id);
    }
  }

  setData(units,suppliers,invoiceItems, supplierInvoice){
    let date=new Date().toISOString();
    if(supplierInvoice.date){
       date = new Date(supplierInvoice.date).toISOString();
    }
    date=date.substring(0,date.indexOf('.'));
    this.setState({units,suppliers, invoiceItems,loading:false, identifier:supplierInvoice.identifier,supplier:suppliers.find((supplier)=>supplier.id===supplierInvoice.supplier),date,note:supplierInvoice.note})
  }

  render(){
    return (
      <div className="container-padding form-background card-box">
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
          addItem={(newItem)=>{
            rebase.addToCollection('/invoiceItems', {
              title:newItem.title,
              unit:newItem.unit,
              quantity:parseFloat(newItem.quantity),
              price:parseFloat(newItem.price),
              sn:newItem.sn,
              invoice:this.props.match.params.id
            }).then((response)=>{
              this.fetchInvoiceItems();
              rebase.addToCollection('/storedItems', {
                invoiceItem:response.id,
                quantity:parseFloat(newItem.quantity),
              });
            });
          }}
          deleteItem={(id)=>{
            rebase.removeDoc('/invoiceItems/'+id).then(()=>{
              this.fetchInvoiceItems();
              database.collection('storedItems').where("invoiceItem", "==", id).get().then((item)=>{
                let data=snapshotToArray(item);
                if(data.length===1){
                  rebase.removeDoc('/storedItems/'+data[0].id);
                }
              })
          });
          }}
          editItem={(newItem)=>{
            let quantityDifference=newItem.quantity-this.state.invoiceItems.find((item)=>item.id===newItem.id).quantity;
            rebase.updateDoc('/invoiceItems/'+newItem.id, {
              title:newItem.title,
              unit:newItem.unit,
              quantity:parseFloat(newItem.quantity),
              price:parseFloat(newItem.price),
              sn:newItem.sn
            }).then((response)=>{
              this.fetchInvoiceItems();
              database.collection('storedItems').where("invoiceItem", "==", newItem.id).get().then((item)=>{
                let data=snapshotToArray(item);
                if(data.length===1){
                  rebase.updateDoc('/storedItems/'+data[0].id, {quantity:data[0].quantity+quantityDifference});
              }
            });
          })}}
          disabled={this.state.saving||this.state.loading}
          newItemID={this.state.newItemID}
          />

        <Button bsStyle="primary" className="separate" disabled={this.state.saving||this.state.loading} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/supplierInvoices/'+this.props.match.params.id, {supplier:this.state.supplier.id,identifier:this.state.identifier,note:this.state.note,date:this.state.date!==null?(new Date(this.state.date)).getTime():0})
              .then((response)=>{
                this.setState({ saving:false});
              });
          }}>{this.state.saving?'Saving...':'Save supplier'}</Button>
      </div>
    );
  }
}
