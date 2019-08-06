import React, { Component } from 'react';
import { ModalBody, ModalFooter, Button, FormGroup, Label, Input  } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

export default class AllMailServersEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      repeatL: "",
      timeoutL: "",
      numberOfTestsL: "",
      notificationEmailsL: "",

      sendServer: "",
      sendHost: "",
      sendPort: "",
      sendSecure: false,
      sendLogin: "",
      sendPassword: "",
      sendSsl: false,
      sendRejectUnauthorized: false,

      receiveServer: "",
      receiveHost: "",
      receivePort: "",
      receiveLogin: "",
      receivePassword: "",
      receiveTsl: false,
      receiveSsl: false,
      receiveRejectUnauthorized: false,

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
                <Input type="text" placeholder="Enter server" value={this.state.sendServer} onChange={(e)=>this.setState({sendServer: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Host</Label>
                <Input type="text" placeholder="Enter port" value={this.state.sendHost} onChange={(e)=>this.setState({sendHost: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Port</Label>
                <Input type="text" placeholder="Enter port" value={this.state.sendPort} onChange={(e)=>this.setState({sendPort: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Login</Label>
                <Input type="text" placeholder="Enter login" value={this.state.sendLogin} onChange={(e)=>this.setState({sendLogin: e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input type="password" placeholder="Enter password" value={this.state.sendPassword} onChange={(e)=>this.setState({sendPassword: e.target.value})}  />
              </FormGroup>
              <FormGroup className="row">
                <div className="m-r-10">
                  <Label >Secure</Label>
                </div>
                <div className="m-l-15">
                  <Input  type="checkbox" value={this.state.sendSecure} onChange={(e)=>this.setState({ssl: !this.state.sendSecure})} />
                </div>
                <div className="m-l-15">{this.state.sendSsl ? "YES" : "NO"}</div>
              </FormGroup>
              <FormGroup className="row">
                <div className="m-r-10">
                  <Label >SSL</Label>
                </div>
                <div className="m-l-15">
                  <Input  type="checkbox" value={this.state.sendSsl} onChange={(e)=>this.setState({ssl: !this.state.sendSsl})} />
                </div>
                <div className="m-l-15">{this.state.sendSsl ? "YES" : "NO"}</div>
              </FormGroup>
              <FormGroup className="row m-b-15">
                <div className="m-r-10">
                  <Label >Reject unauthorized</Label>
                </div>
                <div className="m-l-15">
                  <Input  type="checkbox" value={this.state.sendRejectUnauthorized} onChange={(e)=>this.setState({ssl: !this.state.sendRejectUnauthorized})} />
                </div>
                <div className="m-l-15">{this.state.sendSsl ? "YES" : "NO"}</div>
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
                  <Input type="text" placeholder="Enter server" value={this.state.receiveServer} onChange={(e)=>this.setState({receiveServer: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Host</Label>
                  <Input type="text" placeholder="Enter port" value={this.state.sendHost} onChange={(e)=>this.setState({sendHost: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Port</Label>
                  <Input type="text" placeholder="Enter port" value={this.state.receivePort} onChange={(e)=>this.setState({receivePort: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Login</Label>
                  <Input type="text" placeholder="Enter login" value={this.state.receiveLogin} onChange={(e)=>this.setState({receiveLogin: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Password</Label>
                  <Input type="password" placeholder="Enter password" value={this.state.receivePassword} onChange={(e)=>this.setState({receivePassword: e.target.value})} />
                </FormGroup>
                <FormGroup className="row">
                  <div className="m-r-10">
                    <Label >TSL</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" value={this.state.receiveTsl} onChange={(e)=>this.setState({ssl: !this.state.receiveTsl})} />
                  </div>
                  <div className="m-l-15">{this.state.sendSsl ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row">
                  <div className="m-r-10">
                    <Label >SSL</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" value={this.state.receiveSsl} onChange={(e)=>this.setState({ssl: !this.state.receiveSsl})} />
                  </div>
                  <div className="m-l-15">{this.state.receiveSsl ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row m-b-15">
                  <div className="m-r-10">
                    <Label >Reject unauthorized</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" value={this.state.receiveRejectUnauthorized} onChange={(e)=>this.setState({ssl: !this.state.receiveRejectUnauthorized})} />
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
