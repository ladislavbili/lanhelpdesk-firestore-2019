import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from "../../index";
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';
import {isEmail} from "../../helperFunctions";

export default class MailServerEdit extends Component{
  constructor(props){
    super(props);
    this.state={
			title: "",
      company: null,
      testEmail: "",
      numberOfTests: "",
      repeatNumber: "",
      note: "",
      success: false,

			companies: [],

      saving:false,
    }
		this.fetch.bind(this);
		this.submit.bind(this);
  }

	componentWillMount(){
		rebase.get("companies", {
			context: this,
			withIds: true,
		}).then(data => {
			let newCompanies = data.map(com => {return {value: com.id, label: com.title}});
			this.setState({
				companies: newCompanies,
			}, () => this.fetch(this.props.id));
		}).catch(err => {
			//handle error
		})
	}

	fetch(id){
		rebase.get(`monitoring-servers/${id}`, {
			context: this,
			withIds: true,
		}).then(datum => {
				 this.setState({
					 title: datum.title,
		 			 company: {label: this.state.companies.find(comp => comp.value === datum.company).label, value: datum.company},
		 			 testEmail: datum.testEmail,
           numberOfTests: datum.numberOfTests,
           repeatNumber: datum.repeatNumber,
           success: datum.success,
					 note: datum.note,
				 });
			});
	}

	componentWillReceiveProps(props){
		if (this.props.id !== props.id){
			this.fetch(props.id);
		}
	}


	submit(){
		this.setState({
			saving: true,
		})
		let data = {
			title: this.state.title,
			company: this.state.company.value,
			testEmail: this.state.testEmail,
      numberOfTests: this.state.numberOfTests,
      repeatNumber: this.state.repeatNumber,
			note: this.state.note,
      success: this.state.success,
		};

		rebase.updateDoc(`monitoring-servers/${this.props.id}`, data)
		.then(() => {
			this.setState({
				saving: false,
			})
			this.props.toggleEdit();
		}).catch(err => {
		});
	}



  render(){
      return (
        <div className="flex">

          <Button
            className={this.state.success ? "btn-success" : "btn-danger"}
            onClick={() => this.setState({success: !this.state.success})}
          > {this.state.success ? "working" : "failed"}
          </Button>

            <FormGroup>
              <Label>Title *</Label>
              <Input type="text" placeholder="Enter mailserver name" value={this.state.title} onChange={(e)=>this.setState({title: e.target.value})} />
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
              <Label>Test e-mail *</Label>
              <Input type="text" placeholder="Enter port" value={this.state.testEmail} onChange={(e)=>this.setState({testEmail: e.target.value})} />
            </FormGroup>

            <FormGroup>
              <Label>Number of tests for fail</Label>
              <Input type="number" placeholder="Enter number of tests for alert" value={this.state.numberOfTests} onChange={(e)=>this.setState({numberOfTests: e.target.value})}  />
            </FormGroup>

            <FormGroup>
              <Label>Repeat test every ... minutes</Label>
              <Input type="number" placeholder="Enter number of tests for alert" value={this.state.repeatNumber} onChange={(e)=>this.setState({repeatNumber: e.target.value})}  />
            </FormGroup>

            <FormGroup>
              <Label>Note</Label>
              <textarea className="form-control b-r-0" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note: e.target.value})}  />
            </FormGroup>

            <Button
  						className="btn pull-right"
							disabled={this.state.saving
								|| this.state.title === ""
								|| !isEmail(this.state.testEmail)
							}
							onClick={() => this.submit()}
  					> { this.state.saving ? "Saving..." : "Save changes"}
            </Button>
            <Button
              className="btn-link m-r-10"
              onClick={() => this.props.toggleEdit()}
            > Back to overview
            </Button>

  			</div>
      )
  }
}
