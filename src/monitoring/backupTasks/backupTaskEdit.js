import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

const ITEMS =[
		{
			id: 0,
			name: "daily backup sh01.lansystems.sk",
      startDate: "17.07.2019 11:00:00",
      repeatNumber: "24",
      repeatTime: "hours",
      wait: "12 hours",

      from: "sh01.notification.local",
      subject: "Daily backup task",
      mailOK: "OK",
      mailInvalid: "FAILED, ERROR",
      alertMail: "mail@mail.com",

      note: "no note",
			},
		{
			id: 1,
			name: "daily backup sh01.essco.sk",
      startDate: "17.07.2019 11:00:00",
      repeatNumber: "24",
      repeatTime: "hours",
      wait: "12 hours",

      from: "sh01.notification.local",
      subject: "Daily backup task",
      mailOK: "OK",
      mailInvalid: "FAILED, ERROR",
      alertMail: "mail@mail.com",

      note: "no note",
		},
		{
			id: 2,
			name: "daily backup sh01.lansystems.sk",
			startDate: "17.07.2019 11:00:00",
			repeatNumber: "24",
			repeatTime: "hours",
			wait: "12 hours",

			from: "sh01.notification.local",
			subject: "Daily backup task",
			mailOK: "OK",
			mailInvalid: "FAILED, ERROR",
			alertMail: "mail@mail.com",

			note: "no note",
		}
]

export default class BackupTaskEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      name: ITEMS[this.props.id].name,
      startDate: ITEMS[this.props.id].startDate,
      repeatNumber: ITEMS[this.props.id].repeatNumber,
      repeatTime: ITEMS[this.props.id].repeatTime,

      from: ITEMS[this.props.id].from,
      subject: ITEMS[this.props.id].subject,
      mailOK: ITEMS[this.props.id].mailOK,
      mailInvalid: ITEMS[this.props.id].mailInvalid,
      alertMail: ITEMS[this.props.id].alertMail,

      note: ITEMS[this.props.id].note,

      saving:false,
    }
  }

	componentWillReceiveProps(props){
		if (this.props.id !== props.id){
			this.setState({
				name: ITEMS[props.id].name,
	      startDate: ITEMS[props.id].startDate,
	      repeatNumber: ITEMS[props.id].repeatNumber,
	      repeatTime: ITEMS[props.id].repeatTime,
	      wait: ITEMS[props.id].wait,

	      from: ITEMS[props.id].from,
	      subject: ITEMS[props.id].subject,
	      mailOK: ITEMS[props.id].mailOK,
	      mailInvalid: ITEMS[props.id].mailInvalid,
	      alertMail: ITEMS[props.id].alertMail,

	      note: ITEMS[props.id].note,
			})
		}
	}

  render(){
    return (
      <div className="flex">
              <FormGroup>
                <Label>Name</Label>
                <Input type="text" placeholder="Enter name" value={this.state.name} onChange={(e)=>this.setState({name: e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label>Start Date</Label>
                <Input type="datetime-local" placeholder="Enter start date" value={this.state.startDate} onChange={(e)=>this.setState({startDate: e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label>Repeat every</Label>
                <div className="row">
                  <div className="w-50 p-r-20">
                    <Input type="number" placeholder="Enter number" value={this.state.repeatNumber} onChange={(e)=>this.setState({repeatNumber: e.target.value})} />
                  </div>
                  <div className="w-50">
                    <Select
                      value={this.state.repeatTime}
                      onChange={()=> {}}
                      options={[]}
                      styles={selectStyle}
                      />
                  </div>
                </div>
              </FormGroup>

              <FormGroup>
                <Label>From</Label>
                <Input type="text" placeholder="Enter sender" value={this.state.from} onChange={(e)=>this.setState({from: e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label>Subject</Label>
                <Input type="text" placeholder="Enter subject" value={this.state.subject} onChange={(e)=>this.setState({subject: e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label>Mail body OK</Label>
                <Input type="text" placeholder="Enter string that has to appera in the mail for it to be OK" value={this.state.mailOK} onChange={(e)=>this.setState({mailOK: e.target.value})} />
              </FormGroup>


              <FormGroup>
                <Label>Mail body INVALID</Label>
                <Input type="text" placeholder="Enter string that has to appera in the mail for it to be invalid" value={this.state.mailInvalid} onChange={(e)=>this.setState({mailInvalid: e.target.value})} />
              </FormGroup>


              <FormGroup>
                <Label>Alert mail</Label>
                <Input type="text" placeholder="Enter the body of alert mail" value={this.state.alertMail} onChange={(e)=>this.setState({alertMail: e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label>Note</Label>
                <textarea className="form-control b-r-0" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note: e.target.value})}  />
              </FormGroup>

              <Button
    						className="btn pull-right"
                disabled={this.state.saving || this.state.name === ""}
    					> { this.state.saving ? "Saving..." : "Save mail notification"}
              </Button>
              <Button
                className="btn-link m-r-10"
                onClick={()=>this.props.toggleEdit()}
              > Back
              </Button>

			</div>
    );
  }
}
