import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import {rebase, database} from '../../index';
import {snapshotToArray, isEmail} from '../../helperFunctions';

export default class UserAdd extends Component{
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
    database.collection('workTypes').get().then((data)=>{
      let companies=snapshotToArray(data);
      this.setState({companies,company:companies.length===0 ? null :{...companies[0],label:companies[0].title,value:companies[0].id}});
    });
  }

  render(){
    return (
      <div className="container-padding">
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
            rebase.addToCollection('/users', {username:this.state.username,name:this.state.name,surname:this.state.surname,email:this.state.email,company:this.state.company.id})
              .then(()=>{
                let company = {...this.state.companies[0],label:this.state.companies[0].title,value:this.state.companies[0].id};
                this.setState({
                username:'',
                name:'',
                surname:'',
                email:'',
                company,
                saving:false})});
          }}>{this.state.saving?'Adding...':'Add user'}</Button>
      </div>
    );
  }
}
