import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon, InputGroupText, Alert, Table } from 'reactstrap';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import Select from 'react-select';

export default class ServerAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      companies:[],
      statuses:[],
      title:'',
      company:null,
      status:null,
      IPlist:[],
      backupTasks:[],
      diskArray:[],
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData();
  }

  getData(){
    Promise.all([
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
    ])
    .then(([statuses,companies])=>{
      this.setData(toSelArr(snapshotToArray(statuses)),toSelArr(snapshotToArray(companies)));
    });
  }

  setData(statuses,companies){
    this.setState({
      statuses,
      companies
    });
  }


  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
          <div className="ml-auto mr-auto" style={{maxWidth:1000}}>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label>Company</Label>
              <Select
                className="supressDefaultSelectStyle"
                options={this.state.companies}
                value={this.state.company}
                onChange={e =>{ this.setState({ company: e }); }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select
                className="supressDefaultSelectStyle"
                options={this.state.statuses}
                value={this.state.status}
                onChange={e =>{ this.setState({ status: e }); }}
              />
            </FormGroup>

            <Table striped>
              <thead>
                <tr>
                  <th>NIC</th>
                  <th>IP</th>
                  <th>Mask</th>
                  <th>Gateway</th>
                  <th>DNS</th>
                </tr>
              </thead>
              <tbody>
                
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
              </tbody>

            </Table>

        <Button color="secondary" onClick={this.props.history.goBack}>Cancel</Button>

        <Button color="primary" disabled={true} onClick={()=>{
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
                  this.props.history.goBack();
              });
          }}>{this.state.saving?'Adding...':'Add password'}</Button>
        </div>
      </div>
    );
  }
}
