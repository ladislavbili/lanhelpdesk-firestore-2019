import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import {rebase, database} from '../../index';
import {snapshotToArray, isEmail} from '../../helperFunctions';

export default class UserEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      username:'',
      name:'',
      surname:'',
      email:'',
      company:null,
      saving:false,
      companies:[]
    }
    this.setData.bind(this);

    Promise.all(
      [
        database.collection('companies').get(),
        rebase.get('users/'+this.props.match.params.id, {
          context: this,
        })
    ]).then(([ companiesData,user])=>{
      let companies = snapshotToArray(companiesData);
      let company;
      if(companies.length===0){
        company=null;
      }else{
        company=companies.find((item)=>item.id===user.company);
        if(company){
          company= {...company,label:company.title,value:company.id};
        }else{
          company=null;
        }
      }
      this.setData(user);
      this.setState({companies,company});
    });
  }

  setData(data){
    this.setState({
      username:data.username,
      name:data.name,
      surname:data.surname,
      email:data.email,
    })
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('users/'+props.match.params.id, {
        context: this,
      }).then((user)=>this.setData(user));
    }
  }

  render(){
    return(
        <div className="container-padding form-background card-box scrollable fit-with-header">
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Username</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter username" value={this.state.username} onChange={(e)=>this.setState({username:e.target.value})} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter name" value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Surname</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter surname" value={this.state.surname} onChange={(e)=>this.setState({surname:e.target.value})} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">E-mail</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter e-mail" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
          </Col>
        </FormGroup>
        <div style={{fontSize:1}}>A</div>
          <Select
            className="supressDefaultSelectStyle"
            options={
              this.state.companies.map(company => {
              company.label = company.title;
              company.value = company.id;
              return company;
              })}
            value={this.state.company}
            onChange={e =>{ this.setState({ company: e }); }}
            />
        <Button bsStyle="primary" className="separate" disabled={this.state.saving|| this.state.companies.length===0||!isEmail(this.state.email)} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/users/'+this.props.match.params.id, {username:this.state.username,name:this.state.name,surname:this.state.surname,email:this.state.email,company:this.state.company.id})
              .then(()=>{
                this.setState({saving:false})});
          }}>{this.state.saving?'Saving user...':'Save user'}</Button>
      </div>
    );
  }
}
