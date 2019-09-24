import React, { Component } from 'react';
import {Button } from 'reactstrap';
import { connect } from "react-redux";
import {storageSuppliersStart, storageSupplierInvoicesStart} from '../../../redux/actions';

import {rebase} from '../../../index';
import {timestampToString, sameStringForms} from '../../../helperFunctions';
import SupplierInvoiceAdd from './supplierInvoiceAdd';
import SupplierInvoiceEdit from './supplierInvoiceEdit';

class SupplierInvoicesList extends Component{
  constructor(props){
    super(props);
    this.state={
      supplierInvoices:[],
      suppliers:[],
      supplierInvoiceFilter:''
    }
  }
  componentWillReceiveProps(props){
		if(!sameStringForms(props.supplierInvoices,this.props.supplierInvoices)){
			this.setState({supplierInvoices:props.supplierInvoices})
		}
    if(!sameStringForms(props.suppliers,this.props.suppliers)){
			this.setState({suppliers:props.suppliers})
		}
	}


  componentWillMount(){
    if(!this.props.suppliersActive){
      this.props.storageSuppliersStart();
    }
    this.setState({supplierInvoices:this.props.supplierInvoices});

    if(!this.props.supplierInvoicesActive){
      this.props.storageSupplierInvoicesStart();
    }
    this.setState({suppliers:this.props.suppliers});
  }

  render(){
    return (
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="container-fluid">
						<div className="row align-items-center">
              <div className="p-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control commandbar-search"
                    value={this.state.supplierInvoiceFilter}
                    onChange={(e)=>this.setState({supplierInvoiceFilter:e.target.value})}
                    placeholder="Search"
                  />
                  <div className="input-group-append">
                    <button className="commandbar-btn-search" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>

                <Button
          				className="btn-link t-a-l"
          				onClick={()=>this.props.history.push('/helpdesk/settings/supplierInvoices/add')}>
          			 <i className="fa fa-plus sidebar-icon-center"/> Add invoice
          			</Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr>
                    <th>Invoice identifier</th>
                    <th>Supplier</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.supplierInvoices.filter((item)=>item.identifier.toString().toLowerCase().includes(this.state.supplierInvoiceFilter.toLowerCase())).map((supplierInvoice)=>
                    <tr
                      key={supplierInvoice.id}
                      className={"clickable" + (this.props.match.params.id === supplierInvoice.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/supplierInvoices/'+supplierInvoice.id)}>
                      <td className={(this.props.match.params.id === supplierInvoice.id ? "text-highlight":"")}>
                        {supplierInvoice.identifier}
                      </td>
                      <td className={(this.props.match.params.id === supplierInvoice.id ? "text-highlight":"")}>
                        {this.state.suppliers.some((supplier)=>supplier.id===supplierInvoice.supplier)?this.state.suppliers.find((supplier)=>supplier.id===supplierInvoice.supplier).title:'Unknown supplier'}
                      </td>
                      <td className={(this.props.match.params.id === supplierInvoice.id ? "text-highlight":"")}>
                        {timestampToString(supplierInvoice.date)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpSuppliers,storageHelpSupplierInvoices }) => {
  const { suppliersActive, suppliers } = storageHelpSuppliers;
  const { supplierInvoicesActive, supplierInvoices } = storageHelpSupplierInvoices;
  return { suppliersActive,suppliers,supplierInvoicesActive,supplierInvoices };
};

export default connect(mapStateToProps, { storageSuppliersStart, storageSupplierInvoicesStart })(SupplierInvoicesList);
