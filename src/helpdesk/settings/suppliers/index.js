import React, { Component } from 'react';
import {Button } from 'reactstrap';
import SupplierAdd from './supplierAdd';
import SupplierEdit from './supplierEdit';

import { connect } from "react-redux";
import {storageHelpSuppliersStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class SuppliersList extends Component{
  constructor(props){
    super(props);
    this.state={
      suppliers:[],
      supplierFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.suppliers,this.props.suppliers)){
      this.setState({suppliers:props.suppliers})
    }
  }

  componentWillMount(){
    if(!this.props.suppliersActive){
      this.props.storageHelpSuppliersStart();
    }
    this.setState({suppliers:this.props.suppliers});
  }


  render(){
    return (
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="container-fluid">
						<div className="row align-items-center">
              <div className="p-2" >
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control commandbar-search"
                    value={this.state.supplierFilter}
                    onChange={(e)=>this.setState({supplierFilter:e.target.value})}
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
                onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/add')}>
               <i className="fa fa-plus sidebar-icon-center"/> Add supplier
              </Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr className="clickable">
                    <th>Supplier name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.suppliers.filter((item)=>item.title.toLowerCase().includes(this.state.supplierFilter.toLowerCase())).map((supplier)=>
                    <tr
                      key={supplier.id}
                      className={"clickable" + (this.props.match.params.id === supplier.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/'+supplier.id)}>
                      <td className={(this.props.match.params.id === supplier.id ? "text-highlight":"")}>
                        {supplier.title}
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
                </div>
                <div className="col-lg-8 p-0">
                  {
                    this.props.match.params.id && this.props.match.params.id==='add' && <SupplierAdd />
                  }
                  {
                    this.props.match.params.id && this.props.match.params.id!=='add' && this.state.suppliers.some((item)=>item.id===this.props.match.params.id) && <SupplierEdit match={this.props.match} history={this.props.history}/>
                  }
                </div>
              </div>
            </div>
          </div>
    );
  }
}

const mapStateToProps = ({ storageHelpSuppliers}) => {
  const { suppliersActive, suppliers } = storageHelpSuppliers;
  return { suppliersActive, suppliers };
};

export default connect(mapStateToProps, { storageHelpSuppliersStart })(SuppliersList);
