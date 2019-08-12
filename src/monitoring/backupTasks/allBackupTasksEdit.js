import React, { Component } from 'react';
import { ModalBody, ModalFooter, Button, FormGroup, Label, Input  } from 'reactstrap';
import {rebase} from "../../index";

export default class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      wait: "",

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
      imapTls: false,
      imapSsl: false,
      imapRejectUnauthorized: false,

      testMail: "I am a test mail.",

      saving: false,
      opened: false
    }
    this.sendTestMail.bind(this);
    this.testIMAPServer.bind(this);
    this.fetch.bind(this);
    this.fetch("notifications");
  }

  fetch(id){
    rebase.get('monitoring-sidebar/notifications',{
      context: this,
      withIds: true,
    }
    ).then((data) => {
      this.setState({
        wait: data.wait,
        testMail: data.testMail,

        smtpServer: data.smtp.server,
        smtpHost: data.smtp.host,
        smtpPort: data.smtp.port,
        smtpSecure: data.smtp.secure,
        smtpUser: data.smtp.user,
        smtpPass: data.smtp.pass,
        smtpSsl: data.smtp.ssl,
        smtpRejectUnauthorized: data.smtp.rejectUnauthorized,

        imapServer: data.imap.server,
        imapHost: data.imap.host,
        imapPort: data.imap.port,
        imapUser: data.imap.user,
        imapPassword: data.imap.password,
        imapTls: data.imap.tls,
        imapSsl: data.imap.ssl,
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
      ssl: this.state.smtpSsl,
      rejectUnauthorized: this.state.smtpRejectUnauthorized,
    };
    let imap = {
      server: this.state.imapServer,
      host: this.state.imapHost,
      port: this.state.imapPort,
      user: this.state.imapUser,
      password: this.state.imapPassword,
      ssl: this.state.imapSsl,
      tls: this.state.imapTls,
      rejectUnauthorized: this.state.imapRejectUnauthorized,
    };
    let data = {
      wait: this.state.wait,
      testMail: this.state.testMail,
      smtp,
      imap,
    };
    rebase.updateDoc('monitoring-sidebar/notifications', data)
      .then(() => {
        this.setState({
          saving: false,
        })
      }).catch(err => {
    });
  }

  sendTestMail(){

  }

  testIMAPServer(){

  }

  render(){
    return (
      <div>
            <ModalBody>
              <h1>Email notification settings</h1>
              <FormGroup>
                <Label>Wait period (hour)</Label>
                <Input type="number" placeholder="Enter hours to wait" value={this.state.wait} onChange={(e)=>this.setState({wait: e.target.value})}  />
              </FormGroup>
              <hr/>

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
                    <Input  type="checkbox" checked={this.state.smtpSecure} value={this.state.smtpSecure} onChange={(e)=>this.setState({smtpSecure: !this.state.smtpSecure})} />
                  </div>
                  <div className="m-l-15">{this.state.smtpSecure ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row">
                  <div className="m-r-10">
                    <Label >SSL</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.smtpSsl} value={this.state.smtpSsl} onChange={(e)=>this.setState({smtpSsl: !this.state.smtpSsl})} />
                  </div>
                  <div className="m-l-15">{this.state.smtpSsl ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row m-b-15">
                  <div className="m-r-10">
                    <Label >Reject unauthorized</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.smtpRejectUnauthorized} value={this.state.smtpRejectUnauthorized} onChange={(e)=>this.setState({smtpRejectUnauthorized: !this.state.smtpRejectUnauthorized})} />
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
                    <Label >TLS</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.imapTls} value={this.state.imapTls} onChange={(e)=>this.setState({imapTls: !this.state.imapTls})} />
                  </div>
                  <div className="m-l-15">{this.state.imapTls ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row">
                  <div className="m-r-10">
                    <Label >SSL</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.imapSsl} value={this.state.imapSsl} onChange={(e)=>this.setState({imapSsl: !this.state.imapSsl})} />
                  </div>
                  <div className="m-l-15">{this.state.imapSsl ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row m-b-15">
                  <div className="m-r-10">
                    <Label >Reject unauthorized</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.imapRejectUnauthorized} value={this.state.imapRejectUnauthorized} onChange={(e)=>this.setState({imapRejectUnauthorized: !this.state.imapRejectUnauthorized})} />
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
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
                Close
              </Button>

              <Button className="btn" disabled={this.state.saving} onClick={() => this.submit()}>
                {this.state.saving?'Saving...':'Save changes'}</Button>
            </ModalFooter>

          </div>
    );
  }
}
