import React, { Component } from 'react';

const ITEMS =[
		{
			id: 0,
			sendTestDate: "27.6.2016 13:14:25",
			responseDateTime: "27.6.2016 13:14:25",
			responseTime: "5",
			twentyFive: "25",
			status: "OK",
			},
		{
			id: 1,
			sendTestDate: "27.6.2016 13:14:25",
			responseDateTime: "27.6.2016 13:14:25",
			responseTime: "5",
			twentyFive: "25",
			status: "OK",
		},{
			id: 2,
			sendTestDate: "27.6.2016 13:14:25",
			responseDateTime: "27.6.2016 13:14:25",
			responseTime: "5",
			twentyFive: "25",
			status: "OK",
		},
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
