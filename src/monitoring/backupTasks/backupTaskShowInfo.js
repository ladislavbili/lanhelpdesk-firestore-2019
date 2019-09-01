import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Reports from "./reports"
import {rebase} from "../../index";
import {arraySelectToString, fromMillisec} from "../../helperFunctions";

export default class BackupTaskShowInfo extends Component{
  constructor(props){
    super(props);
    this.state={
			title: "",
      company: {},
      startDate: "",
      repeatNumber: "",

      from: "",
      fromDisabled: false,
      subject: "",
      subjectDisabled: false,
      mailOK: [],
      mailInvalid: [],
      alertMail: "",

      note: "",
    }
		this.fetch.bind(this);
		this.fetch(this.props.id);
  }


	fetch(id){
		rebase.get(`monitoring-notifications/${id}`, {
			context: this,
			withIds: true,
		}).then(datum => {
				 this.setState({
					 title: datum.title ? datum.title : "untitled",
		       company: datum.company ? datum.company.label : "no company",
		       startDate: datum.startDate ? new Date(datum.startDate).toLocaleString() : "no start date",
		       repeatEvery: datum.repeatNumber ? fromMillisec(datum.repeatNumber, "minutes") + " min." : "not provided",

		       from: (datum.from ? datum.from : "no sender") + (datum.fromDisabled ? " (sender disabled)" : "") ,
		       subject: (datum.subject ? datum.subject : "no subject")  + (datum.subjectDisabled ? " (subject disabled)" : "") ,
		       mailOK: datum.mailOK ? datum.mailOK : ["no phrases"],
		       mailInvalid: datum.mailInvalid ? datum.mailInvalid : ["no phrases"],
		       alertMail: (datum.alertMail ? datum.alertMail : "no alert mail")  + (datum.alertMailDisabled ? " (disabled)" : ""),

		       note: datum.note ? datum.note : "no note",
				 });
			});
	}

	componentWillReceiveProps(props){
		if (this.props.id !== props.id){
			this.fetch(props.id);
		}
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
							{this.state.repeatEvery}
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
							{arraySelectToString(this.state.mailOK)}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Mail body INVALID:</strong>
						</div>
						<div className="pull-right">
							{arraySelectToString(this.state.mailInvalid)}
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
