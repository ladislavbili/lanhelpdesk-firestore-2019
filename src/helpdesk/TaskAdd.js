import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import Select from 'react-select';
import base from '../firebase';
import moment from 'moment';
import DatePicker from "react-datepicker";
export default class StatusAdd extends Component {

  constructor(props){
    super(props);
    this.state = {
      task:null,
      statuses:[],
      projects:[],
      users:[],
      companies:[],


      title:'',
      status:null,
      project:null,
      requestedBy:null,
      company:null,
      solver:null,
      deadline:null,
      description:'',
      hours:0,

    }
    this.submit.bind(this);
  }

  componentWillMount(){
    this.connections=[];
      this.connections.push(base.bindToState(`hd-tasks`, {
        context: this,
        state: 'task',
        asArray: true,
        queries: {
          orderByChild: 'id',
          limitToLast: 1
        }
      }));
      this.connections.push(base.bindToState(`hd-statuses`, {
        context: this,
        state: 'statuses',
        asArray: true
      }));
      this.connections.push(base.bindToState(`hd-projects`, {
        context: this,
        state: 'projects',
        asArray: true
      }));
      this.connections.push(base.bindToState(`settings-users`, {
        context: this,
        state: 'users',
        asArray: true
      }));
      this.connections.push(base.bindToState(`settings-companies`, {
        context: this,
        state: 'companies',
        asArray: true
      }));
    }

  componentWillUnmount() {
    this.connections.map((item)=>
      base.removeBinding(item)
    )
  }

  submit(){
    if(this.state.status===null){
      this.setState({status:this.state.statuses.length>0?this.state.statuses.map(item=>{
        item.value=item.id;
        item.label=item.title;
        return item;
      })[0]:null});
      return;
    }
    let data={
      title:this.state.title,
      status:this.state.status.id,
      id:(this.state.task.length>0?this.state.task[0].id+1:0),
      project:this.state.project?this.state.project.id:null,
      requestedBy:this.state.requestedBy?this.state.requestedBy.id:null,
      company:this.state.company?this.state.company.id:null,
      solver:this.state.solver?this.state.solver.id:null,
      deadline:this.state.deadline,
      description:this.state.description,
      hours:this.state.hours,
    }
    base.post(`hd-tasks/`+data.id,{data});
    this.props.closeModal();
  }

  render() {
    return (
      <div style={{padding:10}}>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Task name</label>
          <FormControl type="text"
            onChange={e => {
              this.setState({ title: e.target.value });
            }}
            value={this.state.title}/>
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Status</label>
          <Select
            options={this.state.statuses.map(item=>{
              item.value=item.id;
              item.label=item.title;
              return item;
            })}
            value={this.state.status}
            onChange={e =>{ this.setState({ status: e })}}
            />
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Project</label>
          <Select
            options={this.state.projects.map(item=>{
              item.value=item.id;
              item.label=item.title;
              return item;
            })}
            value={this.state.project}
            onChange={e =>{ this.setState({ project: e })}}
            />
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Requested by</label>
          <Select
            options={this.state.users.map(item=>{
              item.value=item.id;
              item.label=item.username;
              return item;
            })}
            value={this.state.requestedBy}
            onChange={e =>{ this.setState({ requestedBy: e })}}
            />
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Company</label>
          <Select
            options={this.state.companies.map(item=>{
              item.value=item.id;
              item.label=item.companyName;
              return item;
            })}
            value={this.state.company}
            onChange={e =>{ this.setState({ company: e })}}
            />
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Solver</label>
          <Select
            options={this.state.users.map(item=>{
              item.value=item.id;
              item.label=item.username;
              return item;
            })}
            value={this.state.solver}
            onChange={e =>{ this.setState({ solver: e })}}
            />
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Deadline</label>
          <div style={{ width: "100%" }} className="datepickerWrap">
            <DatePicker
              selected={this.state.deadline?moment(this.state.deadline):null}
              onChange={e => {
                this.setState({ deadline: e.valueOf() });
              }}
              locale="en-gb"
              placeholderText="Deadline"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="DD.MM.YYYY HH:mm"
              />
          </div>
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Description</label>
          <FormControl componentClass="textarea"
            onChange={e => {
              this.setState({ description: e.target.value });
            }}
            value={this.state.description}/>
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Hours</label>
          <FormControl type="text"
            onChange={e => {
              this.setState({ hours: e.target.value });
            }}
            value={this.state.hours}/>
        </FormGroup>
        <Button onClick={this.submit.bind(this)} bsStyle="primary">Add</Button>
      </div>
    );
}}
