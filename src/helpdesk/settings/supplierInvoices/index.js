import React, { Component } from 'react';
import {rebase} from '../../../index';
import {timestampToString} from '../../../helperFunctions';
import SupplierInvoiceAdd from './supplierInvoiceAdd';
import SupplierInvoiceEdit from './supplierInvoiceEdit';

export default class SupplierInvoicesList extends Component{
  constructor(props){
    super(props);
    this.state={
      supplierInvoices:[],
      suppliers:[],
      supplierInvoiceFilter:''
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/help-supplier_invoices', {
      context: this,
      withIds: true,
      then:content=>{this.setState({supplierInvoices:content})},
    });
    this.ref2 = rebase.listenToCollection('/help-suppliers', {
      context: this,
      withIds: true,
      then:content=>{this.setState({suppliers:content})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
    rebase.removeBinding(this.ref2);
  }

  render(){
    return (
      <div className="row">
        <div className="col-lg-4">
          <div className="card-box fit-with-header scrollable">
          <div className="input-group">
            <input
              type="text"
              onChange={(e)=>this.setState({supplierInvoiceFilter:e.target.value})}
              className="form-control"
              placeholder="Search task name"
              style={{ width: 200 }}
            />
            <div className="input-group-append">
              <button className="btn btn-white" type="button">
                <i className="fa fa-search" />
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mails m-0">
            <thead>
              <tr className="clickable">
                <th>Invoice identifier</th>
                <th>Supplier</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/supplierInvoices/add')}>
                <td colSpan="3">+ Add invoice</td>
              </tr>
              {this.state.supplierInvoices.filter((item)=>item.identifier.toString().toLowerCase().includes(this.state.supplierInvoiceFilter.toLowerCase())).map((supplierInvoice)=>
                <tr key={supplierInvoice.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/supplierInvoices/'+supplierInvoice.id)}>
                  <td>{supplierInvoice.identifier}</td>
                  <td>{this.state.suppliers.some((supplier)=>supplier.id===supplierInvoice.supplier)?this.state.suppliers.find((supplier)=>supplier.id===supplierInvoice.supplier).title:'Unknown supplier'}</td>
                  <td>{timestampToString(supplierInvoice.date)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
        <div className="col-lg-8 p-0">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <SupplierInvoiceAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.supplierInvoices.some((item)=>item.id===this.props.match.params.id) && <SupplierInvoiceEdit match={this.props.match} history={this.props.history} />
          }
        </div>
      </div>
    );
  }
}
