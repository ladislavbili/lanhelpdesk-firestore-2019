import React, { Component } from 'react';
import { ModalBody, ModalFooter, Button, FormGroup, Label, Input  } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';
import {rebase} from "../../index";
import {isEmail} from "../../helperFunctions";

export default class AllMailServersEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      repeat: "",
      numberOfTests: "",
      timeout: "",
      notificationEmails: "",
      testMail: "I am a test mail.",

      smtpServer: "",
      smtpHost: "",
      smtpPort: "",
      smtpSecure: false,
      smtpUser: "",
      smtpPass: "",
      smtpTls: false,
      smtpRejectUnauthorized: false,

      imapServer: "",
      imapHost: "",
      imapPort: "",
      imapUser: "",
      imapPassword: "",
      imapTll: false,
      imapRejectUnauthorized: false,


      saving:false,
      opened:false
    }

    this.msToTime.bind(this);
    this.submit.bind(this);
    this.sendTestMail.bind(this);
    this.testIMAPServer.bind(this);
    this.fetch.bind(this);
    this.fetch("servers");
  }

  fetch(id){
    rebase.get(`monitoring-sidebar/${id}`,{
      context: this,
      withIds: true,
    }
    ).then((data) => {
      this.setState({
        repeat: data.repeat,
        numberOfTests: data.numberOfTests,
        timeout: this.msToTime(data.timeout),
        notificationEmails: data.notificationEmails,
        testMail: data.testMail,

        smtpServer: data.smtp.server,
        smtpHost: data.smtp.host,
        smtpPort: data.smtp.port,
        smtpSecure: data.smtp.secure,
        smtpUser: data.smtp.user,
        smtpPass: data.smtp.pass,
        smtpTls: data.smtp.tls,
        smtpRejectUnauthorized: data.smtp.rejectUnauthorized,

        imapServer: data.imap.server,
        imapHost: data.imap.host,
        imapPort: data.imap.port,
        imapUser: data.imap.user,
        imapPassword: data.imap.password,
        imapTls: data.imap.tls,
        imapRejectUnauthorized: data.imap.rejectUnauthorized,
      });
      }).catch(err => {
    });
  }

  submit(){
    this.setState({
      saving: true,
    })
    let smtp = {
      server: this.state.smtpServer,
      host: this.state.smtpHost,
      port: this.state.smtpPort,
      secure: this.state.smtpSecure,
      user: this.state.smtpUser,
      pass: this.state.smtpPass,
      tls: this.state.smtpTls,
      rejectUnauthorized: this.state.smtpRejectUnauthorized,
    };
    let imap = {
      server: this.state.imapServer,
      host: this.state.imapHost,
      port: this.state.imapPort,
      user: this.state.imapUser,
      password: this.state.imapPassword,
      tls: this.state.imapTls,
      rejectUnauthorized: this.state.imapRejectUnauthorized,
    };
    let data = {
      repeat: this.state.repeat,
      numberOfTests: this.state.numberOfTests,
      timeout: this.state.timeout * 60000,
      notificationEmails: this.state.notificationEmails,
      testMail: this.state.testMail,
      smtp,
      imap,
    };
    rebase.updateDoc('monitoring-sidebar/servers', data)
      .then(() => {
        this.setState({
          saving: false,
        }, () => this.props.close())
      }).catch(err => {
    });
  }

  sendTestMail(){

  }

  testIMAPServer(){

  }

  msToTime(time){
		return time / 60000;
	}

  render(){
    return (
      <div>
            <ModalBody>
              <h1>Mail settings</h1>
              <FormGroup>
                <Label>Test mail repeat (min)</Label>
                <Input type="text" placeholder="Enter port" value={this.state.repeat} onChange={(e)=>this.setState({repeat: e.target.value})} />
              </FormGroup>


              <FormGroup>
  							<Label>Timeout (min)</Label>
  							<Input type="number" placeholder="Enter timeout" value={this.state.timeout} onChange={(e)=>this.setState({timeout: e.target.value})} />
  						</FormGroup>
  {/*
              <FormGroup>
                <Label>Number of tests for fail</Label>
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
              </FormGroup>*/}

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
                  <Input  type="checkbox" checked={this.state.smtpSecure} onChange={(e)=>this.setState({smtpSecure: !this.state.smtpSecure})} />
                </div>
                <div className="m-l-15">{this.state.smtpSecure ? "YES" : "NO"}</div>
              </FormGroup>
              <FormGroup className="row">
                <div className="m-r-10">
                  <Label >TLS/SSL</Label>
                </div>
                <div className="m-l-15">
                  <Input  type="checkbox" checked={this.state.smtpTls} onChange={(e)=>this.setState({smtpTls: !this.state.smtpTls})} />
                </div>
                <div className="m-l-15">{this.state.smtpTls ? "YES" : "NO"}</div>
              </FormGroup>
              <FormGroup className="row m-b-15">
                <div className="m-r-10">
                  <Label >Reject unauthorized</Label>
                </div>
                <div className="m-l-15">
                  <Input  type="checkbox" checked={this.state.smtpRejectUnauthorized} onChange={(e)=>this.setState({smtpRejectUnauthorized: !this.state.smtpRejectUnauthorized})} />
                </div>
                <div className="m-l-15">{this.state.smtpRejectUnauthorized ? "YES" : "NO"}</div>
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
                    <Label >TLS/SSL</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.imapTls} onChange={(e)=>this.setState({imapTls: !this.state.imapTls})} />
                  </div>
                  <div className="m-l-15">{this.state.imapTls ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row m-b-15">
                  <div className="m-r-10">
                    <Label >Reject unauthorized</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.imapRejectUnauthorized} onChange={(e)=>this.setState({imapRejectUnauthorized: !this.state.imapRejectUnauthorized})} />
                  </div>
                  <div className="m-l-15">{this.state.imapRejectUnauthorized ? "YES" : "NO"}</div>
                </FormGroup>
                <div className="h-30">
                  <Button className="pull-right btn-link" disabled={this.state.saving} onClick={() => this.testIMAPServer()}>
                    Test IMAP Server
                  </Button>
                </div>
              </ModalBody>




              <ModalFooter>
              <Button
                className="mr-auto btn-link"
                 disabled={this.state.saving
                 || !isEmail(this.state.imapUser)
                 || !isEmail(this.state.smtpUser)}
                 onClick={() => this.props.close()}>
                Close
              </Button>

              <Button className="btn" disabled={this.state.saving} onClick={()=> this.submit()}>
                {this.state.saving?'Saving...':'Save changes'}
              </Button>
            </ModalFooter>

          </div>
    );
  }
}
