import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Reports from "./reports"
import {rebase} from "../../index";

export default class MailServerShowInfo extends Component{
  constructor(props){
    super(props);
    this.state={
			title: "",
			company: "",
			testEmail: "",
      numberOfTests: "",
      repeatNumber: "",
			note: "",
      success: false,

      saving: false,
    }
		this.fetch.bind(this);
		this.msToTime.bind(this);
		console.log(this.props.id);
		this.fetch(this.props.id);
  }

	componentWillReceiveProps(props){
		if (this.props.id !== props.id){
			this.fetch(props.id);
		}
	}

	fetch(id){
		rebase.get(`monitoring-servers/${id}`, {
			context: this,
			withIds: true,
		}).then(datum => {
      rebase.get(`companies`, {
  			context: this,
  			withIds: true,
  		}).then(companies => {
          let company = companies.find(comp => comp.id === datum.company);
  				 this.setState({
  					 title: datum.title ? datum.title : "no title",
  		 			 company: company ? company.title : "no company",
  		 			 testEmail: datum.testEmail ? datum.testEmail : "no test mail",
             numberOfTests: datum.numberOfTests ? datum.numberOfTests : "not provided",
             repeatNumber: datum.repeatNumber ? datum.repeatNumber : "not provided",
  					 note: datum.note ? datum.note : "no notes",
             success: datum.success,
  				 });
  			});
			});
	}

	msToTime(time){
		return time / 60000;
	}

  render(){
      return (
        <div className="flex">
					<div className="row m-b-30">
						<div >
							<h1>{this.state.title}</h1>
						</div>
            <div className="mr-auto m-l-15">
              <Button
                className={this.state.success ? "btn-success" : "btn-danger"}
              > {this.state.success ? "working" : "failed"}
              </Button>
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
							<strong>Title:</strong>
						</div>
						<div className="pull-right">
							{this.state.title}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Company:</strong>
						</div>
						<div className="pull-right">
							{this.state.company}
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
							<strong>Number of tests fo fail:</strong>
						</div>
						<div className="pull-right">
							{this.state.numberOfTests}
						</div>
					</div>

          <div className="row">
						<div className="mr-auto">
							<strong>Repeating tests every (min):</strong>
						</div>
						<div className="pull-right">
							{this.state.repeatNumber}
						</div>
					</div>

			{/*			<div className="row">
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
							{this.state.lastResponse}
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
					</div>*/}

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
