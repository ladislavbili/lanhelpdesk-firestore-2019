import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../../index';
import CompanyAdd from './companyAdd';
import CompanyEdit from './companyEdit';

export default class CompaniesList extends Component{
  constructor(props){
    super(props);
    this.state={
      companies:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/companies', {
      context: this,
      withIds: true,
      then:content=>{this.setState({companies:content, companyFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){

   console.log(this.props.match.params.id);
   console.log(this.state.companies);

    return (
      <div className="row">
        <div className="col-lg-4">
          <div className="card-box fit-with-header scrollable">
          <div className="input-group">
            <input
              type="text"
              onChange={(e)=>this.setState({companyFilter:e.target.value})}
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
                  <th>Company name</th>
                </tr>
              </thead>
              <tbody>
                <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/companies/add')}>
                  <td>+ Add company</td>
                </tr>
                {this.state.companies.filter((item)=>item.title.toLowerCase().includes(this.state.companyFilter.toLowerCase())).map((company)=>
                  <tr key={company.id} className={"clickable" + (this.props.match.params.id === company.id ? " selected-item":"")} onClick={()=>this.props.history.push('/helpdesk/settings/companies/'+company.id)}>
                    <td>{company.title}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
        <div className="col-lg-8 p-0">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <CompanyAdd />
        }
        {
          this.props.match.params.id && this.props.match.params.id!=='add' && this.state.companies.some((item)=>item.id===this.props.match.params.id) && <CompanyEdit match={this.props.match} history = {this.props.history} />
      }
    </div>
  </div>
);
}
}
