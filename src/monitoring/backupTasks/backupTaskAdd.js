import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

export default class BackupTaskAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      name: "",
      startDate: "",
      repeatNumber: "",
      repeatTime: "",
      wait: "",

      from: "",
      subject: "",
      mailOK: "",
      mailInvalid: "",
      alertMail: "",

      note: "",

      saving:false,
    }
  }

  render(){
    return (
      <div className="flex">
				<div className="container-fluid p-2">
				</div>

					<div className={"card-box p-t-15 scrollable fit-with-header-and-commandbar " + (!this.props.columns ? " center-ver w-50" : "")}>
            <h1>Add backup task monitor</h1>

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
                <Label>Wait period (hour)</Label>
                <Input type="number" placeholder="Enter hours to wait" value={this.state.wait} onChange={(e)=>this.setState({wait: e.target.value})}  />
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
    					> { this.state.saving ? "Adding..." : "Add backup task monitor"}
              </Button>
              <Button
                className="btn-link m-r-10"
                onClick={()=>this.props.history.goBack()}
              > Back
              </Button>

    				</div>
			</div>
    );
  }
}
