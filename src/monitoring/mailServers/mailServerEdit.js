import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from "../../index";
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

const ITEMS =[
		{
			id: 0,
			title: "lansystems.sk",
			company: {value: "2H0yphdPRH7JCDwgy68Q", label: "Pozagas"},
			testEmail: "mail.test@lansystems.sk",
			timeout: "5",
			numberOfTests: "2",
			notificationEmails: "5:25",
			lastResp: "5 min.",
			status: "OK",
			note: "No note",
			},
		{
			id: 1,
			title: "essco.sk",
			company: {value: "y999M6qHn1cyvfjDn9O8", label: "Bala"},
			testEmail: "mail.test@essco.sk",
			timeout: "10",
			numberOfTests: "5",
			notificationEmails: "1:25",
			lastResp: "10 min.",
			status: "OK",
			note: "No notes here",
		}
]

export default class MailServerEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title: ITEMS[this.props.id].title,
			company: ITEMS[this.props.id].company,
			testEmail: ITEMS[this.props.id].testEmail,
			note: ITEMS[this.props.id].note,

      saving:false,
    }
  }

	componentWillReceiveProps(props){
		if (this.props.id !== props.id){
			this.setState({
				title: ITEMS[props.id].title,
				company: ITEMS[props.id].company,
				testEmail: ITEMS[props.id].testEmail,
				note: ITEMS[props.id].note,
			})
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

            <FormGroup>
              <Label>Name</Label>
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
