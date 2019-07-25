import React, { Component } from 'react';

const ITEMS =[
		{
			id: 0,
			receiveDate: "27.6.2016 13:14:25",
			subject: "Daily test",
			status: "OK",
			},
		{
			id: 1,
			receiveDate: "27.6.2016 13:14:25",
			subject: "Daily test 2",
			status: "OK",
		},{
			id: 2,
			receiveDate: "27.6.2016 13:14:25",
			subject: "Daily test 3",
			status: "OK",
		},
]

export default class ReportDetail extends Component{
  constructor(props){
    super(props);
    this.state={
      receiveDate: ITEMS[this.props.id].receiveDate,
			subject: ITEMS[this.props.id].subject,
			status: ITEMS[this.props.id].status,

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
