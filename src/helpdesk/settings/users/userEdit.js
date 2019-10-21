import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import firebase from 'firebase';

import {rebase} from '../../../index';
import { isEmail} from '../../../helperFunctions';
import {selectStyle} from "../../../scss/selectStyles";

import { connect } from "react-redux";
import {storageCompaniesStart,storageUsersStart, setUserData} from '../../../redux/actions';
import {toSelArr} from '../../../helperFunctions';

class UserEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      isAdmin:false,
      username:'',
      name:'',
      surname:'',
      email:'',
      company:null,
      loading:true,
      saving:false,
      passReseted:false,
      passResetEnded:true,
      companies:[]
    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.companiesLoaded &&
    props.usersLoaded
  }

  componentWillReceiveProps(props){
    if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(this.storageLoaded(props)){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  setData(props){
    let user = props.users.find((item)=>item.id===props.match.params.id);
    let companies = toSelArr(props.companies);
    let company;
    if(companies.length===0){
      company=null;
    }else{
      company=companies.find((item)=>item.id===user.company);
      if(!company){
        company=companies[0];
      }
    }
    this.setState({
      company,
      companies,
      username:user.username,
      name:user.name,
      surname:user.surname,
      email:user.email,
      isAdmin:user.isAdmin ? true : false,
      loading:false
    })
  }

  render(){
    return(
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <FormGroup>
            <Label for="isAdmin">Admin</Label>
            <Input type="checkbox" id="isAdmin" placeholder="Enter username" checked={this.state.isAdmin} onChange={(e)=>this.setState({isAdmin:!this.state.isAdmin})} />
          </FormGroup>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input type="text" name="username" id="username" placeholder="Enter username" value={this.state.username} onChange={(e)=>this.setState({username:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter name" value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="surname">Surname</Label>
            <Input type="text" name="surname" id="surname" placeholder="Enter surname" value={this.state.surname} onChange={(e)=>this.setState({surname:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="email">E-mail</Label>
            <Input type="email" name="email" id="email" disabled={true} placeholder="Enter email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="company">Company</Label>
            <Select
              styles={selectStyle}
              options={this.state.companies}
              value={this.state.company}
              onChange={e =>{ this.setState({ company: e }); }}
              />
          </FormGroup>

          <Button className="btn" disabled={this.state.saving|| this.state.companies.length===0||!isEmail(this.state.email)} onClick={()=>{
            this.setState({saving:true});
            let body = {username:this.state.username,name:this.state.name,surname:this.state.surname,email:this.state.email,company:this.state.company.id, isAdmin:this.state.isAdmin}
            rebase.updateDoc('/users/'+this.props.match.params.id, body)
              .then(()=>{
                this.props.setUserData(body);
                this.setState({saving:false})});
              }}>{this.state.saving?'Saving user...':'Save user'}</Button>

          <Button disabled={true} onClick={()=>{
                if(window.confirm("Are you sure?")){
                  rebase.removeDoc('/users/'+this.props.match.params.id).then(()=>{
                    this.props.history.goBack();
                  });
                }
              }}
              >Delete</Button>
            <Button className="btn-link"  disabled={this.state.saving||this.state.passReseted} onClick={()=>{
                this.setState({passReseted:true,passResetEnded:false})
                firebase.auth().sendPasswordResetEmail(this.state.email).then(()=>{
                  this.setState({passResetEnded:true})
                })
              }}
              >{this.state.passResetEnded?(this.state.passReseted?'Password reseted!':"Reset user's password"):"Resetting..."}</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageCompanies, storageUsers}) => {
  const { companiesActive, companies, companiesLoaded } = storageCompanies;
  const { usersActive, users, usersLoaded } = storageUsers;
  return { companiesActive, companies, companiesLoaded, usersActive, users, usersLoaded };
};

export default connect(mapStateToProps, { storageCompaniesStart,storageUsersStart,setUserData })(UserEdit);
