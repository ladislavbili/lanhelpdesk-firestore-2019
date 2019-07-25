import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';
import Reports from "./reports"

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

export default class MailServerShowInfo extends Component{
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
					<div className="row m-b-30">
						<div className="mr-auto">
							<h1>{this.state.name}</h1>
						</div>
						<div className="pull-right">
							<Button
	              className="btn-link"
	              onClick={() => this.props.toggleEdit()}
	            > Edit
	            </Button>
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Name:</strong>
						</div>
						<div className="pull-right">
							{this.state.name}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Test email:</strong>
						</div>
						<div className="pull-right">
							{this.state.testEmail}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Timeout (mins):</strong>
						</div>
						<div className="pull-right">
							{this.state.timeout}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Number of tests for alert</strong>
						</div>
						<div className="pull-right">
							{this.state.numberOfTests}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Notification emails:</strong>
						</div>
						<div className="pull-right">
							{this.state.notificationEmails}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Last response:</strong>
						</div>
						<div className="pull-right">
							{this.state.lastResp}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Average response time for last 1 hour:</strong>
						</div>
						<div className="pull-right">
							4:25
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Average response time for last 24 hours:</strong>
						</div>
						<div className="pull-right">
							4:25
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Average response time for last 1 month:</strong>
						</div>
						<div className="pull-right">
							4:25
						</div>
					</div>

					<hr className="m-t-15 m-b-15"/>

					<div>
						<div className="mr-auto">
							<strong>Note</strong>
						</div>
							{this.state.note}
					</div>

					<hr className="m-t-15 m-b-15"/>

					<Reports id={this.props.id}/>

  			</div>
      )
  }
}
