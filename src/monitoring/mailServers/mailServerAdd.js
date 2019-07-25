import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

export default class MailServerAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      name: "",
      port: "",
      timeout: "",
      numberOfTests: "",
      notificationEmails: "",
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
            <h1>Add mail server</h1>

              <FormGroup>
                <Label>Name</Label>
                <Input type="text" placeholder="Enter mailserver name" value={this.state.name} onChange={(e)=>this.setState({name: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Port</Label>
                <Input type="text" placeholder="Enter port" value={this.state.port} onChange={(e)=>this.setState({port: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Timeout</Label>
                <Input type="text" placeholder="Enter timeout" value={this.state.timeout} onChange={(e)=>this.setState({timeout: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Number of tests for alert</Label>
                <Input type="text" placeholder="Enter number of tests for alert" value={this.state.numberOfTests} onChange={(e)=>this.setState({numberOfTests: e.target.value})}  />
              </FormGroup>

              <FormGroup>
                <Label>Notification emails</Label>
                <Select
                  value={this.state.notificationEmails}
                  isMulti
                  onChange={()=> {}}
                  options={[]}
                  styles={selectStyle}
                  />
              </FormGroup>

              <FormGroup>
                <Label>Note</Label>
                <textarea className="form-control b-r-0" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note: e.target.value})}  />
              </FormGroup>

              <Button
    						className="btn pull-right"
                disabled={this.state.saving || this.state.name === ""}
    					> { this.state.saving ? "Adding..." : "Add mail server"}
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
