import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input,  InputGroup, InputGroupAddon, InputGroupText, Alert } from 'reactstrap';
import {toSelArr,snapshotToArray} from '../../helperFunctions';
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

export default class UnitAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      folders:[],
      displayPasswordConfirm:false,
      displayPassword:false,
      passwordConfirm:'',
      folder:null,
      title:'',
      login:'',
      URL:'',
      password:'',
      expire:'',
      note:'',
      saving:false,
      loading:true,
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData(this.props.match.params.passID);
  }

  getData(id){
    Promise.all([
      rebase.get('pass-passwords/'+id, {
        context: this,
      }),
      database.collection('pass-folders').get()
    ])
    .then(([pass,folders])=>{
      this.setData(pass,toSelArr(snapshotToArray(folders)),id);
    });
  }

  setData(pass,folders,id){
    let folder=folders.find((item)=>item.id=== pass.folder);
    if(folder===undefined){
        folder=null;
      }
    this.setState({
      folders,
      passwordConfirm:pass.password,
      folder,
      title:pass.title,
      login:pass.login,
      URL:pass.URL,
      password:pass.password,
      expire:pass.expire,
      note:pass.note,
      loading:false
    });
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.passID!==props.match.params.passID){
      this.getData(props.match.params.passID);
    }
  }

  render(){
    return (
      <div className="flex">
        <div className="container-fluid ">
          <div className="d-flex flex-row align-items-center p-l-18">
          </div>
        </div>

        <div className={"card-box scrollable fit-with-header-and-commandbar p-t-15 "  + (!this.props.columns ? " center-ver w-50" : "")}>

          <FormGroup>
            <Label>Password name</Label>
            <Input type="text" className="form-control" placeholder="Enter name" value={this.state.title} disabled={this.state.loading} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Folder</Label>
            <Select
              styles={selectStyle}
              options={this.state.folders}
              value={this.state.folder}
              disabled={this.state.loading}
              onChange={e =>{ this.setState({ folder: e }); }}
                />
          </FormGroup>

          <FormGroup>
            <Label>URL</Label>
            <Input type="text" className="form-control" placeholder="Enter URL" value={this.state.URL} disabled={this.state.loading} onChange={(e)=>this.setState({URL:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Login</Label>
            <Input type="text" className="form-control" placeholder="Enter login" value={this.state.login} disabled={this.state.loading} onChange={(e)=>this.setState({login:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputGroup>
              <Input type={this.state.displayPassword?'text':"password"} className="form-control" disabled={this.state.loading} placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} />
              <InputGroupAddon addonType="append" className="clickable" onClick={()=>this.setState({displayPassword:!this.state.displayPassword})}><InputGroupText><i className={"mt-auto mb-auto "+ (!this.state.displayPassword ?'fa fa-eye':'fa fa-eye-slash')}/></InputGroupText></InputGroupAddon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Password confirm</Label>
            <InputGroup>
              <Input type={this.state.displayPasswordConfirm?'text':"password"} className="form-control" disabled={this.state.loading} placeholder="Confirm password" value={this.state.passwordConfirm} onChange={(e)=>this.setState({passwordConfirm:e.target.value})} />
              <InputGroupAddon addonType="append" className="clickable" onClick={()=>this.setState({displayPasswordConfirm:!this.state.displayPasswordConfirm})}><InputGroupText><i className={"mt-auto mb-auto "+ (!this.state.displayPasswordConfirm ?'fa fa-eye':'fa fa-eye-slash')}/></InputGroupText></InputGroupAddon>
            </InputGroup>
          </FormGroup>

          {this.state.password.length>0 && this.state.password===this.state.passwordConfirm &&
            <Alert color="success">
              Passwords match!
            </Alert>
          }
          { this.state.password.length>0 && this.state.password!==this.state.passwordConfirm &&
            <Alert color="warning">
              Passwords don't match!
            </Alert>
          }

          <Button color="primary" disabled={this.state.saving||this.state.loading} onClick={()=>{
              let password=Math.random().toString(36).slice(-8);
              this.setState({password,passwordConfirm:password});
            }}>Generate password</Button>

          <FormGroup>
            <Label>Password expire</Label>
            <Input type="datetime-local" className="form-control" placeholder="Expiration date" value={this.state.expire} disabled={this.state.loading} onChange={(e)=>this.setState({expire:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Note</Label>
            <Input type="textarea" className="form-control" placeholder="Leave a note here" value={this.state.note} disabled={this.state.loading} onChange={(e)=>this.setState({note:e.target.value})} />
          </FormGroup>

        <Button className="btn-link" onClick={this.props.history.goBack}>Cancel</Button>

        <Button className="btn" disabled={this.state.saving||this.state.loading||this.state.password!==this.state.passwordConfirm||this.state.password===""||this.state.title===""||this.state.folder===null} onClick={()=>{
            this.setState({saving:true});
            let body = {
              title:this.state.title,
              login:this.state.login,
              URL:this.state.URL,
              password:this.state.password,
              expire:this.state.expire,
              note:this.state.note,
              folder:this.state.folder.id
            };
            rebase.updateDoc('/pass-passwords/'+this.props.match.params.passID, body)
              .then((response)=>{
                this.setState({saving:false});
              });
          }}>{this.state.saving?'Saving...':'Save password'}</Button>
        </div>
      </div>
    );
  }
}
