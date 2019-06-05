import React, { Component } from 'react';
import {rebase} from '../../../index';
import SupplierAdd from './supplierAdd';
import SupplierEdit from './supplierEdit';

export default class SuppliersList extends Component{
  constructor(props){
    super(props);
    this.state={
      suppliers:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/help-suppliers', {
      context: this,
      withIds: true,
      then:content=>{this.setState({suppliers:content, supplierFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return (
      <div className="row">
        <div className="col-lg-4">
          <div className="card-box fit-with-header scrollable">
          <div className="input-group">
            <input
              type="text"
              onChange={(e)=>this.setState({supplierFilter:e.target.value})}
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
                <th>Supplier name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/add')}>
                <td>+ Add supplier</td>
              </tr>
              {this.state.suppliers.filter((item)=>item.title.toLowerCase().includes(this.state.supplierFilter.toLowerCase())).map((supplier)=>
                <tr key={supplier.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/'+supplier.id)}>
                  <td>{supplier.title}</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
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
    );
  }
}
