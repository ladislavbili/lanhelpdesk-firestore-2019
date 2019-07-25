import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

const ITEMS =[
		{
			id: 0,
			name: "lansystems.sk",
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
			name: "lansystems.sk",
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
      name: ITEMS[this.props.id].name,
			testEmail: ITEMS[this.props.id].testEmail,
			timeout: ITEMS[this.props.id].timeout,
			numberOfTests: ITEMS[this.props.id].numberOfTests,
			notificationEmails: ITEMS[this.props.id].notificationEmails,
			lastResp: ITEMS[this.props.id].lastResp,
			status: ITEMS[this.props.id].status,
			note: ITEMS[this.props.id].note,

      saving:false,
    }
  }

  render(){
      return (
        <div className="flex">

            <FormGroup>
              <Label>Name</Label>
              <Input type="text" placeholder="Enter mailserver name" value={this.state.name} onChange={(e)=>this.setState({name: e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label>Port</Label>
              <Input type="text" placeholder="Enter port" value={this.state.port} onChange={(e)=>this.setState({port: e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label>Timeout</Label>
              <Input type="text" placeholder="Enter timeout" value={this.state.timeout} onChange={(e)=>this.setState({timeout: e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label>Number of tests for alert</Label>
              <Input type="text" placeholder="Enter number of tests for alert" value={this.state.numberOfTests} onChange={(e)=>this.setState({numberOfTests: e.target.value})}  />
            </FormGroup>

            <FormGroup>
              <Label>Notification emails</Label>
              <Select
                value={this.state.notificationEmails}
                isMulti
                onChange={()=> {}}
                options={[]}
                styles={selectStyle}
                />
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
