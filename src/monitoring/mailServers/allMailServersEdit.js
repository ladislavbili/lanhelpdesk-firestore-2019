import React, { Component } from 'react';
import { ModalBody, ModalFooter, Button, FormGroup, Label, Input  } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

export default class AllMailServersEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      repeat: "",
      timeout: "",
      numberOfTests: "",
      notificationEmails: "",

      smtpServer: "",
      smtpHost: "",
      smtpPort: "",
      smtpSecure: false,
      smtpUser: "",
      smtpPass: "",
      smtpSsl: false,
      smtpRejectUnauthorized: false,

      imapServer: "",
      imapHost: "",
      imapPort: "",
      imapUser: "",
      imapPassword: "",
      imapTsl: false,
      imapSsl: false,
      imapRejectUnauthorized: false,

      testMail: "I am a test mail.",

      saving:false,
      opened:false
    }

    this.sendTestMail.bind(this);
    this.testIMAPServer.bind(this);
  }

  /*
  v db smtp
  host: "",
  port: 465,
  secure: true,
  user: '',
  pass: '',
  rejectUnauthorized: false,


  v db imap
  host: "",
  port: 993,
  user: '',
  password: '',
  tls: true,
  rejectUnauthorized: false,
  */

  sendTestMail(){

  }

  testIMAPServer(){

  }

  render(){
    return (
      <div>
            <ModalBody>
              <h1>Mail settings</h1>
              <FormGroup>
                <Label>Test mail repeat</Label>
                <Input type="text" placeholder="Enter port" value={this.state.repeat} onChange={(e)=>this.setState({repeat: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Timeout</Label>
                <Input type="text" placeholder="Enter port" value={this.state.timeout} onChange={(e)=>this.setState({timeout: e.target.value})} />
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

              <hr className="m-b-15"/>

              <h1>Send e-mail SMTP settings</h1>
              <FormGroup>
                <Label>Server</Label>
                <Input type="text" placeholder="Enter server" value={this.state.smtpServer} onChange={(e)=>this.setState({smtpServer: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Host</Label>
                <Input type="text" placeholder="Enter port" value={this.state.smtpHost} onChange={(e)=>this.setState({smtpHost: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Port</Label>
                <Input type="text" placeholder="Enter port" value={this.state.smtpPort} onChange={(e)=>this.setState({smtpPort: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Login</Label>
                <Input type="text" placeholder="Enter login" value={this.state.smtpUser} onChange={(e)=>this.setState({smtpUser: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input type="password" placeholder="Enter password" value={this.state.smtpPass} onChange={(e)=>this.setState({smtpPass: e.target.value})}  />
              </FormGroup>
              <FormGroup className="row">
                <div className="m-r-10">
                  <Label >Secure</Label>
                </div>
                <div className="m-l-15">
                  <Input  type="checkbox" value={this.state.smtpSecure} onChange={(e)=>this.setState({ssl: !this.state.smtpSecure})} />
                </div>
                <div className="m-l-15">{this.state.smtpSsl ? "YES" : "NO"}</div>
              </FormGroup>
              <FormGroup className="row">
                <div className="m-r-10">
                  <Label >SSL</Label>
                </div>
                <div className="m-l-15">
                  <Input  type="checkbox" value={this.state.smtpSsl} onChange={(e)=>this.setState({ssl: !this.state.smtpSsl})} />
                </div>
                <div className="m-l-15">{this.state.smtpSsl ? "YES" : "NO"}</div>
              </FormGroup>
              <FormGroup className="row m-b-15">
                <div className="m-r-10">
                  <Label >Reject unauthorized</Label>
                </div>
                <div className="m-l-15">
                  <Input  type="checkbox" value={this.state.smtpRejectUnauthorized} onChange={(e)=>this.setState({ssl: !this.state.smtpRejectUnauthorized})} />
                </div>
                <div className="m-l-15">{this.state.smtpSsl ? "YES" : "NO"}</div>
              </FormGroup>

              <hr/>
              <FormGroup className="m-t-10 m-b-10">
                <Label>Send test e-mail</Label>
                <Input type="text" placeholder="Enter test mail body." value={this.state.testMail} onChange={(e)=>this.setState({testMail: e.target.value})} />
              </FormGroup>
              <div className="h-30">
                <Button className="pull-right btn-link" disabled={this.state.saving} onClick={() => this.sendTestMail()}>
                  Send
                </Button>
              </div>
              <hr className="m-t-10 m-b-10"/>

              <h1>Receive e-mail IMAP settings</h1>
                <FormGroup>
                  <Label>Server</Label>
                  <Input type="text" placeholder="Enter server" value={this.state.imapServer} onChange={(e)=>this.setState({imapServer: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Host</Label>
                  <Input type="text" placeholder="Enter port" value={this.state.imapHost} onChange={(e)=>this.setState({imapHost: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Port</Label>
                  <Input type="text" placeholder="Enter port" value={this.state.imapPort} onChange={(e)=>this.setState({imapPort: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Login</Label>
                  <Input type="text" placeholder="Enter login" value={this.state.imapUser} onChange={(e)=>this.setState({imapUser: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Password</Label>
                  <Input type="password" placeholder="Enter password" value={this.state.imapPassword} onChange={(e)=>this.setState({imapPassword: e.target.value})} />
                </FormGroup>
                <FormGroup className="row">
                  <div className="m-r-10">
                    <Label >TSL</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" value={this.state.imapTsl} onChange={(e)=>this.setState({ssl: !this.state.imapTsl})} />
                  </div>
                  <div className="m-l-15">{this.state.sendSsl ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row">
                  <div className="m-r-10">
                    <Label >SSL</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" value={this.state.imapSsl} onChange={(e)=>this.setState({ssl: !this.state.imapSsl})} />
                  </div>
                  <div className="m-l-15">{this.state.imapSsl ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row m-b-15">
                  <div className="m-r-10">
                    <Label >Reject unauthorized</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" value={this.state.imapRejectUnauthorized} onChange={(e)=>this.setState({ssl: !this.state.imapRejectUnauthorized})} />
                  </div>
                  <div className="m-l-15">{this.state.sendSsl ? "YES" : "NO"}</div>
                </FormGroup>
                <div className="h-30">
                  <Button className="pull-right btn-link" disabled={this.state.saving} onClick={() => this.testIMAPServer()}>
                    Test IMAP Server
                  </Button>
                </div>
              </ModalBody>




              <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
                Close
              </Button>

              <Button className="btn" disabled={this.state.saving} onClick={()=>{}}>
                {this.state.saving?'Saving...':'Save changes'}
              </Button>
            </ModalFooter>

          </div>
    );
  }
}
