import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import Select, { Creatable }  from 'react-select';
import {selectStyle} from '../../scss/selectStyles';
import {isEmail} from "../../helperFunctions";

import {rebase} from "../../index";

const TIME_OPTIONS = [
  { label: "minutes", value: "m"},
  { label: "hours", value: "h"},
  { label: "days", value: "d"},
];

export default class BackupTaskEdit extends Component{
  constructor(props){
    super(props);
    this.state={
			title: "",
      company: {},
      startDate: "",
      startDateDisabled: false,
      repeatNumber: "",
      repeatTime: "",

      from: "",
      fromDisabled: false,
      subject: "",
      subjectDisabled: false,
      mailOK: [],
      mailInvalid: [],
      alertMailDisabled: false,
      alertMail: "",

      note: "",
      wait: "",
      waitDisabled: false,

			options: [
				{ label: "ok", value: "ok"},
				{ label: "success", value: "success"},
				{ label: "fail", value: "fail"},
			],
			saving: false,
    }
		this.fetch.bind(this);
		this.submit.bind(this);
    this.checkNumber.bind(this);
    this.toMillisec.bind(this);
		this.msToNormal.bind(this);
  }

	componentWillMount(){
		rebase.get("companies", {
			 context: this,
			 withIds: true,
			 }).then(data => {
				 let newCompanies = data.map(com => {return {value: com.id, label: com.title}});
				 this.setState({
					 companies: newCompanies,
				 }, () => this.fetch(this.props.id));
			 }).catch(err => {
		});
	}

	fetch(id){
		rebase.get(`monitoring-notifications/${id}`, {
			context: this,
			withIds: true,
		}).then(datum => {
				 this.setState({
					 title: datum.title,
					 company: datum.company ? {label: this.state.companies.find(comp => comp.value === datum.company).label, value: datum.company} : {},
					 startDate: datum.startDate ? new Date(datum.startDate).toISOString().replace("Z", "") : "",
           startDateDisabled: datum.startDateDisabled,
					 repeatNumber: this.msToNormal(datum.repeatNumber, datum.repeatTime),
					 repeatTime: {value: datum.repeatTime, label: datum.repeatTime},

					 from: datum.from,
					 fromDisabled: datum.fromDisabled,
					 subject: datum.subject,
					 subjectDisabled: datum.subjectDisabled,
					 mailOK: datum.mailOK.map(t => {return ({value: t, label: t});}),
					 mailInvalid: datum.mailInvalid.map(t => {return ({value: t, label: t});}),
					 alertMail: datum.alertMail,
           alertMailDisabled: datum.alertMailDisabled,

					 note: datum.note,
           wait: datum.wait,
           waitDisabled: datum.waitDisabled,
				 });
			});
	}

	componentWillReceiveProps(props){
		if (this.props.id !== props.id){
			this.fetch(props.id);
		}
	}

	submit(){
    let data = {
      title: this.state.title,
      company: this.state.company.value ? this.state.company.value : "",
      startDate: new Date(this.state.startDate).getTime(),
      startDateDisabled: this.state.startDateDisabled,
      repeatTime: this.state.repeatTime.label,
      repeatNumber: this.toMillisec(this.state.repeatNumber),
      from: this.state.from,
      fromDisabled: this.state.fromDisabled,
      subject: this.state.subject,
      subjectDisabled: this.state.subjectDisabled,
      mailOK: this.state.mailOK.map(b => b.label),
      mailInvalid: this.state.mailInvalid.map(b => b.label),
      alertMail: this.state.alertMail,
      alertMailDisabled: this.state.alertMailDisabled,
      note: this.state.note,
      wait: this.state.wait,
      waitDisabled: this.state.waitDisabled,

      status: "OK",
      lastReport: this.state.startDate,
    };

    rebase.updateDoc(`monitoring-notifications/${this.props.id}`, data)
    .then(() => {
      this.props.toggleEdit();
    }).catch(err => {
  	});
  }

	checkNumber(number){
		return !isNaN(number);
	}

	toMillisec(number){
		return number * (this.state.repeatTime.value === "d" ? 24*60*60*1000 : 1) * (this.state.repeatTime.value === "h" ? 60*60*1000 : 1) * (this.state.repeatTime.value === "m" ? 60*1000 : 1);
	}

	msToNormal(time, type){
		if (type === "minutes"){
			return time / 60000;
		}
		if (type === "hours"){
			return time / 60000 / 60;
		}
		if (type === "days"){
			return time / 60000 / 60 / 24;
		}
	}

  render(){
    return (
      <div className="flex">
				<FormGroup>
					<Label>Name</Label>
					<Input type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title: e.target.value})} />
				</FormGroup>

				<FormGroup>
					<Label>Customer</Label>
					<Select
						value={this.state.company}
						onChange={(e)=> this.setState({company: e})}
						options={this.state.companies}
						styles={selectStyle}
						/>
				</FormGroup>

        <FormGroup>
          <div  className="row">
            <Label htmlFor="startDis">Start Date *</Label>
            <div className="m-l-15">
                <Input type="checkbox" id="startDis" className="position-inherit" checked={this.state.startDateDisabled} onChange={(e)=>this.setState({startDateDisabled: !this.state.startDateDisabled})} />
            </div>
            <div className="m-l-15 w-10" htmlFor="startDis">Disabled</div>
          </div>
          <div className="m-r-10">
            <Input type="datetime-local" disabled={this.state.startDateDisabled} placeholder="Enter start date" value={this.state.startDate} onChange={(e)=>this.setState({startDate: e.target.value})} />
          </div>
        </FormGroup>

				<FormGroup>
					<Label>Repeat every *</Label>
					<div className="row">
						<div className="w-50 p-r-20">
							<Input type="number" placeholder="Enter number" value={this.state.repeatNumber} onChange={(e)=>this.setState({repeatNumber: e.target.value})} />
						</div>
						<div className="w-50">
							<Select
								value={this.state.repeatTime}
								onChange={(e)=> this.setState({repeatTime: e})}
								options={TIME_OPTIONS}
								styles={selectStyle}
								/>
						</div>
					</div>
				</FormGroup>

        <FormGroup>
          <div  className="row">
            <Label htmlFor="waitDis">Wait period (hour)</Label>
            <div className="m-l-15">
                <Input type="checkbox" id="waitDis" className="position-inherit" checked={this.state.waitDisabled} onChange={(e)=>this.setState({waitDisabled: !this.state.waitDisabled})} />
            </div>
            <div className="m-l-15 w-10" htmlFor="waitDis">Disabled</div>
          </div>
          <div className="m-r-10">
            <Input type="number" disabled={this.state.waitDisabled} placeholder="Enter wait period" value={this.state.wait} onChange={(e)=>this.setState({wait: e.target.value})} />
          </div>
          </FormGroup>


					<FormGroup>
						<div  className="row">
							<Label htmlFor="fromDis">From {!this.state.fromDisabled ? "*" : ""}</Label>
							<div className="m-l-15">
									<Input type="checkbox" id="fromDis" className="position-inherit" checked={this.state.fromDisabled} onChange={(e)=>this.setState({fromDisabled: !this.state.fromDisabled})} />
							</div>
							<div className="m-l-15 w-10" htmlFor="fromDis">Disabled</div>
						</div>
						<div className="m-r-10">
							<Input type="text" disabled={this.state.fromDisabled} placeholder="Enter sender" value={this.state.from} onChange={(e)=>this.setState({from: e.target.value})} />
						</div>
						</FormGroup>

				<FormGroup>
					<div  className="row">
						<Label htmlFor="subjectDis">Subject {!this.state.subjectDisabled ? "*" : ""}</Label>
						<div className="m-l-15">
								<Input type="checkbox" id="subjectDis" className="position-inherit" checked={this.state.subjectDisabled} onChange={(e)=>this.setState({subjectDisabled: !this.state.subjectDisabled})} />
						</div>
						<div className="m-l-15 w-10" htmlFor="subjectDis">Disabled</div>
					</div>
					<div className="m-r-10">
						<Input type="text" disabled={this.state.subjectDisabled} placeholder="Enter subject" value={this.state.subject} onChange={(e)=>this.setState({subject: e.target.value})} />
					</div>
				</FormGroup>

				<FormGroup>
					<Label>Mail body OK *</Label>
					<Creatable
						isMulti
						value={this.state.mailOK}
						onChange={(newData) => this.setState({mailOK: newData})}
						options={this.state.options}
						styles={selectStyle}
					/>
				</FormGroup>

				<FormGroup>
					<Label>Mail body INVALID *</Label>
					<Creatable
						isMulti
						value={this.state.mailInvalid}
						onChange={(newData) => this.setState({mailInvalid: newData})}
						options={this.state.options}
						styles={selectStyle}
					/>
				</FormGroup>

        <FormGroup>
          <div  className="row">
            <Label htmlFor="alertDis">Alert mail</Label>
            <div className="m-l-15">
                <Input type="checkbox" id="alertDis" className="position-inherit" checked={this.state.alertMailDisabled} onChange={(e)=>this.setState({alertMailDisabled: !this.state.alertMailDisabled})} />
            </div>
            <div className="m-l-15 w-10" htmlFor="alertDis">Disabled</div>
          </div>
          <div className="m-r-10">
            <Input type="text" disabled={this.state.alertMailDisabled} placeholder="Enter alert mail" value={this.state.alertMail} onChange={(e)=>this.setState({alertMail: e.target.value})} />
          </div>
        </FormGroup>

				<FormGroup>
					<Label>Note</Label>
					<textarea className="form-control b-r-0" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note: e.target.value})}  />
				</FormGroup>

				<Button
					className="btn pull-right"
					disabled={this.state.saving
						|| (!this.state.startDateDisabled === this.state.startDate === "")
						|| !this.checkNumber(this.state.repeatNumber)
						|| this.state.repeatTime === ""
						|| (!this.state.fromDisabled && !isEmail(this.state.from))
						|| (!this.state.subjectDisabled && this.state.subject === "")
						|| this.state.mailOK.length === 0
						|| this.state.mailInvalid.length === 0
            || (this.state.alertMail !== "" && !isEmail(this.state.alertMail))}
					onClick={() => this.submit()}
				> { this.state.saving ? "Saving..." : "Save changes"}
				</Button>

        <Button
          className="btn-link m-r-10"
          onClick={()=>this.props.toggleEdit()}
        > Back to overview
        </Button>

			</div>
    );
  }
}
