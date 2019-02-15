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
    return (
      <div className="row flex container container-padding center-ver">
        <div className="col-6">
          <FormGroup>
            <InputGroup>
              <FormControl type="text" onChange={(e)=>this.setState({companyFilter:e.target.value})} />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Table striped condensed hover>
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
                <tr key={company.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/companies/'+company.id)}>
                  <td>{company.title}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="col-6 withSeparator">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <CompanyAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.companies.some((item)=>item.id===this.props.match.params.id) && <CompanyEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
