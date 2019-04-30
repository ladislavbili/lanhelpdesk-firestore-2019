import React, { Component } from 'react';
import {rebase} from '../../index';
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Select from 'react-select';

export default class UnitAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      folder:'',
      title:'',
      login:'',
      URL:'',
      displayPasswordConfirm:false,
      displayPassword:false,
      password:'',
      passwordConfirm:'',
      expire:'',
      note:'',
      saving:false
    }
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
          <div className="ml-auto mr-auto" style={{maxWidth:1000}}>
          <FormGroup>
            <Label>Folder</Label>
            
            <Input type="text" placeholder="Select folder" value={this.state.folder} onChange={(e)=>this.setState({folder:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label>Password name</Label>
            <Input type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label>URL</Label>
            <Input type="text" placeholder="Enter URL" value={this.state.URL} onChange={(e)=>this.setState({URL:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label>Login</Label>
            <Input type="text" placeholder="Enter login" value={this.state.login} onChange={(e)=>this.setState({login:e.target.value})} />
          </FormGroup>
          <Label>Password</Label>
          <InputGroup>
            <Input type={this.state.displayPassword?'text':"password"} placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} />
            <InputGroupAddon addonType="append" className="clickable" onClick={()=>this.setState({displayPassword:!this.state.displayPassword})}><InputGroupText><i className={"mt-auto mb-auto "+ (!this.state.displayPassword ?'fa fa-eye':'fa fa-eye-slash')}/></InputGroupText></InputGroupAddon>
          </InputGroup>

          <Label>Password confirm</Label>
          <InputGroup>
            <Input type={this.state.displayPasswordConfirm?'text':"password"} placeholder="Confirm password" value={this.state.passwordConfirm} onChange={(e)=>this.setState({passwordConfirm:e.target.value})} />
            <InputGroupAddon addonType="append" className="clickable" onClick={()=>this.setState({displayPasswordConfirm:!this.state.displayPasswordConfirm})}><InputGroupText><i className={"mt-auto mb-auto "+ (!this.state.displayPasswordConfirm ?'fa fa-eye':'fa fa-eye-slash')}/></InputGroupText></InputGroupAddon>
          </InputGroup>
          <Button color="primary" disabled={this.state.saving} onClick={()=>{
              let password=Math.random().toString(36).slice(-8);
              this.setState({password,passwordConfirm:password});
            }}>Generate password</Button>
          <FormGroup>



            <Label>Password expire</Label>
            <Input type="datetime-local" placeholder="Expiration date" value={this.state.expire} onChange={(e)=>this.setState({expire:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label>Note</Label>
            <Input type="textarea" placeholder="Leave a note here" value={this.state.note} onChange={(e)=>this.setState({note:e.target.value})} />
          </FormGroup>

          {
            pridat cancel a krok spat
          }

        <Button color="primary" disabled={this.state.saving||this.state.password!==this.state.passwordConfirm||this.state.password===""||this.state.title===""} onClick={()=>{
            this.setState({saving:true});
            let body = {...this.state};
            delete body['saving'];
            delete body['passwordConfirm'];
            delete body['displayPassword'];
            delete body['displayPasswordConfirm'];
            rebase.addToCollection('/pass-passwords', body)
              .then((response)=>{
                this.setState({
                  folder:'',
                  title:'',
                  login:'',
                  URL:'',
                  password:'',
                  passwordConfirm:'',
                  expire:isNaN(new Date(this.state.expire).getTime()) ? null : (new Date(this.state.expire).getTime()),
                  note:'',
                  saving:false});
              });
          }}>{this.state.saving?'Adding...':'Add password'}</Button>
        </div>
      </div>
    );
  }
}
