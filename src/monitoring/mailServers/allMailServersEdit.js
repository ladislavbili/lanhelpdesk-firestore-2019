import React, { Component } from 'react';
import { ModalBody, ModalFooter, Button, FormGroup, Label, Input  } from 'reactstrap';

export default class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      sendServer: "",
      sendPort: "",
      sendLogin: "",
      sendPassword: "",
      sendSsl: false,

      receiveServer: "",
      receivePort: "",
      receiveLogin: "",
      receivePassword: "",
      receiveSsl: "",

      testMail: "I am a test mail.",

      saving:false,
      opened:false
    }

    this.sendTestMail.bind(this);
    this.testIMAPServer.bind(this);
  }

  sendTestMail(){

  }

  testIMAPServer(){

  }

  render(){
    return (
      <div>
            <ModalBody>
              <h1>Send e-mail SMTP settings</h1>
              <FormGroup>
                <Label>Server</Label>
                <Input type="text" placeholder="Enter server" value={this.state.sendServer} onChange={(e)=>this.setState({sendServer: e.target.value})} />
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
                  <Label >SSL</Label>
                </div>
                <div className="m-l-15">
                  <Input  type="checkbox" value={this.state.ssl} onChange={(e)=>this.setState({ssl: !this.state.ssl})} />
                </div>
                <div className="m-l-15">{this.state.ssl ? "YES" : "NO"}</div>
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
                <FormGroup>
                  <Label>SSL</Label>
                  <Input type="text" placeholder="Enter ssl" value={this.state.receiveSsl} onChange={(e)=>this.setState({receiveSsl: e.target.value})} />
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

              <Button className="btn" disabled={this.state.saving||this.state.title===""} onClick={()=>{}}>
                {this.state.saving?'Saving...':'Save changes'}</Button>
            </ModalFooter>

          </div>
    );
  }
}
