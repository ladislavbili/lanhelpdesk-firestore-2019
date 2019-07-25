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

export default class BackupTaskShowInfo extends Component{
  constructor(props){
    super(props);
    this.state={
			name: ITEMS[this.props.id].name,
			startDate: ITEMS[this.props.id].startDate,
			repeatNumber: ITEMS[this.props.id].repeatNumber,
			repeatTime: ITEMS[this.props.id].repeatTime,
			wait: ITEMS[this.props.id].wait,
			from: ITEMS[this.props.id].from,
			subject: ITEMS[this.props.id].subject,
			mailOK: ITEMS[this.props.id].mailOK,
			mailInvalid: ITEMS[this.props.id].mailInvalid,
			alertMail: ITEMS[this.props.id].alertMail,
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
							<strong>Start date:</strong>
						</div>
						<div className="pull-right">
							{this.state.startDate}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Repeat every:</strong>
						</div>
						<div className="pull-right">
							{this.state.repeatTime + " " + this.state.repeatNumber}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Wait period</strong>
						</div>
						<div className="pull-right">
							{this.state.wait + " hours"}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>From:</strong>
						</div>
						<div className="pull-right">
							{this.state.from}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Subject:</strong>
						</div>
						<div className="pull-right">
							{this.state.subject}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Mail body OK:</strong>
						</div>
						<div className="pull-right">
							{this.state.mailOK}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Mail body INVALID:</strong>
						</div>
						<div className="pull-right">
							{this.state.mailInvalid}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Alert mail:</strong>
						</div>
						<div className="pull-right">
							{this.state.alertMail}
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
