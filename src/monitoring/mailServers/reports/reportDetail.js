import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';

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

export default class ReportDetail extends Component{
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

					<div>
					HELLO
					</div>



  			</div>
      )
  }
}
