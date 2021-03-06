import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import Select, { Creatable } from 'react-select';
import DatePicker from 'react-datepicker';

import {rebase} from "../../index";
import {selectStyle, disabledSelectStyle} from 'configs/components/select';
import datePickerConfig from 'configs/components/datepicker';
import { isEmail, toMillisec, fromMomentToUnix } from "../../helperFunctions";

const TIME_OPTIONS = [
//  { label: "minutes", value: "m"},
  { label: "hours", value: "hours"},
  { label: "days", value: "days"},
];

export default class NotificationAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title: "",
      company: null,
      startDate: null,
      startDateDisabled: false,
      repeatNumber: "",
      repeatTime: "",

      emailFrom: "",
      fromDisabled: false,
      subject: "",
      subjectDisabled: false,
      mailOK: [],
      mailInvalid: [],
      alertMail: "",
      alertMailDisabled: false,
      note: "",

      success: false,

      saving: false,
      companies: [],
      options: [
        { label: "ok", value: "ok"},
        { label: "success", value: "success"},
        { label: "fail", value: "fail"},
      ],
    }
    this.submit.bind(this);
  }

  componentWillMount(){
    rebase.get("companies", {
       context: this,
       withIds: true,
     }).then(data => {
       let newCompanies = data.map(com => {return {value: com.id, label: com.title}});
       this.setState({
         companies: newCompanies,
       });
     }).catch(err => {
     })
  }

  submit(){
    let data = {
      title: this.state.title,
      company: this.state.company ? this.state.company.value : null,
      startDate: fromMomentToUnix(this.state.startDate),
      startDateDisabled: this.state.startDateDisabled,
      repeatTime: this.state.repeatTime ? this.state.repeatTime.label : null,
      repeatNumber: this.state.repeatNumber ? toMillisec(this.state.repeatNumber, this.state.repeatTime.label) : null,
      from: this.state.emailFrom ? this.state.emailFrom : null,
      fromDisabled: this.state.fromDisabled,
      subject: this.state.subject ? this.state.subject : null,
      subjectDisabled: this.state.subjectDisabled,
      mailOK: this.state.mailOK.length > 0 ? this.state.mailOK.map(b => b.label) : null,
      mailInvalid: this.state.mailInvalid.length > 0 ? this.state.mailInvalid.map(b => b.label) : [],
      alertMail: this.state.alertMail ? this.state.alertMail : null,
      alertMailDisabled: this.state.alertMailDisabled,
      note: this.state.note ? this.state.note : null,

      success: this.state.success,
    };
    rebase.addToCollection('/monitoring-notifications', data)
    .then(() => {
      this.props.history.goBack();
    }).catch(err => {
  });
  }

  render(){
    return (
      <div classtitle="flex">
				<div className="commandbar p-2">
				</div>

					<div className={"card-box p-t-15 scrollable fit-with-header-and-commandbar " + (!this.props.columns ? " center-ver w-50" : "")}>
            <div className="row">
            <h2 className="flex">Add mail notification</h2>
              <Button
                className={this.state.success ? "btn-success" : "btn-danger"}
                onClick={() => this.setState({success: !this.state.success})}
              > {this.state.success ? "working" : "failed"}
              </Button>

            </div>

              <FormGroup>
                <Label>Title *</Label>
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
                <div>
                  <DatePicker
                    className="form-control hidden-input"
                    disabled={this.state.startDateDisabled}
                    selected={this.state.startDate}
                    onChange={date => {
                      this.setState({ startDate: date });
                    }}
                    placeholderText="No pending date"
                    {...datePickerConfig}
                    />
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Repeat every *</Label>
                <div className="row">
                  <div className="w-50 p-r-20">
                    <Input type="number"  className={(this.state.repeatNumber < 0 ) ? "form-control-warning" : ""} disabled={this.state.startDateDisabled} placeholder="Enter number" value={this.state.repeatNumber} onChange={(e)=>this.setState({repeatNumber: e.target.value})} />
                    { this.state.repeatNumber &&
                      this.state.repeatNumber < 0 &&
                      <Label className="warning">This value must be non-negative.</Label>
                    }
                </div>
                  <div className="w-50">
                    <Select
                      isDisabled={this.state.startDateDisabled}
                      value={this.state.repeatTime}
                      onChange={(e)=> this.setState({repeatTime: e})}
                      options={TIME_OPTIONS}
                      styles={this.state.startDateDisabled ? disabledSelectStyle : selectStyle}
                      />
                  </div>
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
                <div>
                  <Input type="text"  className={(this.state.emailFrom.length > 0 && !isEmail(this.state.emailFrom)) ? "form-control-warning" : ""} disabled={this.state.fromDisabled} placeholder="Enter sender" value={this.state.emailFrom} onChange={(e)=>this.setState({emailFrom: e.target.value})} />
                  { this.state.emailFrom.length > 0 &&
                    !isEmail(this.state.emailFrom) &&
                    <Label className="pull-right warning">This mail address is invalid.</Label>
                  }
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
                <div>
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
                <Label>Mail body INVALID</Label>
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
                  <Label htmlFor="alertDis">Alert mail *</Label>
                  <div className="m-l-15">
                      <Input type="checkbox" id="alertDis" className="position-inherit" checked={this.state.alertMailDisabled} onChange={(e)=>this.setState({alertMailDisabled: !this.state.alertMailDisabled})} />
                  </div>
                  <div className="m-l-15 w-10" htmlFor="alertDis">Disabled</div>
                </div>
                <div>
                  <Input type="text"  className={(this.state.alertMail.length > 0 && !isEmail(this.state.alertMail)) ? "form-control-warning" : ""} disabled={this.state.alertMailDisabled} placeholder="Enter alert mail" value={this.state.alertMail} onChange={(e)=>this.setState({alertMail: e.target.value})} />
                  { this.state.alertMail.length > 0 &&
                    !isEmail(this.state.alertMail) &&
                    <Label className="pull-right warning">This mail address is invalid.</Label>
                  }
               </div>
              </FormGroup>

              <FormGroup>
                <Label>Note</Label>
                <textarea className="form-control b-r-0" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note: e.target.value})}  />
              </FormGroup>

              <Button
    						className="btn pull-right"
                disabled={this.state.saving
                  || this.state.title === ""
                  || (!this.state.startDateDisabled && this.state.startDate === null)
                  || (!this.state.startDateDisabled && this.state.repeatNumber < 0)
                  || (!this.state.startDateDisabled && !this.state.repeatTime )
                  || (!this.state.fromDisabled && !isEmail(this.state.emailFrom))
                  || (!this.state.subjectDisabled && this.state.subject === "")
                  || this.state.mailOK.length === 0
                  || (!this.state.alertMailDisabled && !isEmail(this.state.alertMail))}
                onClick={() => this.submit()}
              > { this.state.saving ? "Adding..." : "Add mail notification"}
              </Button>
              <Button
                className="btn-link m-r-10"
                onClick={() => this.props.history.goBack()}
              > Back
              </Button>

    				</div>
			</div>
    );
  }
}
