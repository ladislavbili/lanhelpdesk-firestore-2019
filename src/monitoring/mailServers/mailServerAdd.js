import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from "../../index";
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

export default class MailServerAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      name: "",
      company: null,
      testEmail: "",
      note: "",

      saving:false,
    }
  }

  componentWillMount(){
		rebase.get("companies", {
			 context: this,
			 withIds: true,
		 }).then(data => {
			 let newCompanies = data.map(com => {return {value: com.id, label: com.title}});
			 this.setState({
				 companies: newCompanies,
			 });
		 }).catch(err => {
			 //handle error
		 })
	}

  render(){
    return (
      <div className="flex">
				<div className="container-fluid p-2">
				</div>

					<div className={"card-box p-t-15 scrollable fit-with-header-and-commandbar " + (!this.props.columns ? " center-ver w-50" : "")}>
            <h1>Add mail server</h1>

              <FormGroup>
                <Label>Name</Label>
                <Input type="text" placeholder="Enter mailserver name" value={this.state.name} onChange={(e)=>this.setState({name: e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label>Company</Label>
                <Select
                  value={this.state.company}
                  onChange={(company)=>this.setState({company})}
                  options={this.state.companies}
                  styles={selectStyle}
                  />
              </FormGroup>

              <FormGroup>
                <Label>Test e-mail</Label>
                <Input type="text" placeholder="Enter port" value={this.state.testEmail} onChange={(e)=>this.setState({testEmail: e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label>Note</Label>
                <textarea className="form-control b-r-0" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note: e.target.value})}  />
              </FormGroup>

              <Button
    						className="btn pull-right"
                disabled={this.state.saving || this.state.name === ""}
    					> { this.state.saving ? "Adding..." : "Add mail server"}
              </Button>
              <Button
                className="btn-link m-r-10"
                onClick={()=>this.props.history.goBack()}
              > Back
              </Button>

    				</div>
			</div>
    );
  }
}
