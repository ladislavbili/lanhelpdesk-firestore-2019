import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import Select from 'react-select';
import firebase from 'firebase';
import {rebase} from '../../../index';
import {isEmail} from '../../../helperFunctions';
import {selectStyle} from "../../../scss/selectStyles";
import config from '../../../firebase';

import { connect } from "react-redux";
import {storageCompaniesStart} from '../../../redux/actions';
import {sameStringForms, toSelArr} from '../../../helperFunctions';

let roles=[
  {label:'User',value:0},
  {label:'Agent',value:1},
  {label:'Manager',value:2},
  {label:'Admin',value:3},
]

class UserAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      username:'',
      name:'',
      surname:'',
      email:'',
      company:null,
      saving:false,
      password:'',
      companies:[],
      mailNotifications: true,
      role:roles[0],
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.companies,this.props.companies)){
      this.setState({companies:toSelArr(props.companies)})
    }
    if(!this.props.companiesLoaded&&props.companiesLoaded){
      let companies = toSelArr(props.companies);
      this.setState({companies,company:companies.length===0 ? null :companies[0]});
    }
  }

  componentWillMount(){
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    let companies = toSelArr(this.props.companies);
    this.setState({companies,company:companies.length===0 ? null :companies[0]});
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="role">Role</Label>
            <Select
              styles={selectStyle}
              options={roles}
              value={this.state.role}
              onChange={role => this.setState({ role })}
              />
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
            <Input type="email" name="email" id="email" placeholder="Enter email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} />
          </FormGroup>

          <FormGroup check className="m-b-5 p-l-0">
            <Input type="checkbox" id="notificationCheck" checked={this.state.mailNotifications} onChange={(e)=>this.setState({mailNotifications:!this.state.mailNotifications})}/>
            <Label htmlFor="notificationCheck" check className="p-l-15">
              Receive e-mail notifications
            </Label>
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

              <Button className="btn" disabled={this.state.saving || this.state.companies.length===0 || !isEmail(this.state.email) || this.state.password.length < 6 } onClick={()=>{
                  this.setState({saving:true});
                  var secondaryApp = firebase.initializeApp(config, "Secondary");
                  secondaryApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((user) => {
                    secondaryApp.auth().signOut();
                    secondaryApp.delete();
                    let newUser = {
                      username:this.state.username,
                      name:this.state.name,
                      surname:this.state.surname,
                      email:this.state.email,
                      company:this.state.company.id,
                      role:this.state.role,
                      mailNotifications:this.state.mailNotifications,
                    };
                    rebase.addToCollection('/users', newUser, user.user.uid)
                    .then(()=>{
                      let company = {...this.state.companies[0],label:this.state.companies[0].title,value:this.state.companies[0].id};
                      this.setState({
                        username:'',
                        name:'',
                        surname:'',
                        email:'',
                        company,
                        password:'',
                        role:roles[0],
                        mailNotifications:true,
                        saving:false
                      }, () => {
                        if (this.props.userAdd){
                          this.props.addUser({...newUser, id: user.user.id, value: user.user.id, label: newUser.email});
                          this.props.close();
                        }
                      }
                    );
                    });
                  });
                }}>{this.state.saving?'Adding...':'Add user'}</Button>

              {this.props.close &&
              <Button className="btn-link"
                onClick={()=>{this.props.close()}}>Cancel</Button>
              }
      </div>
    );
  }
}

const mapStateToProps = ({ storageCompanies}) => {
  const { companiesActive, companies, companiesLoaded } = storageCompanies;
  return { companiesActive, companies, companiesLoaded };
};

export default connect(mapStateToProps, { storageCompaniesStart })(UserAdd);
