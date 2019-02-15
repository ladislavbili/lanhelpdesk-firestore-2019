import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import Select from 'react-select';
import base from '../firebase';
import moment from 'moment';
import DatePicker from "react-datepicker";
export default class TaskEdit extends Component {

  constructor(props){
    super(props);
    this.state = {
      statuses:[],
      statusesLoaded:false,
      projects:[],
      projectsLoaded:false,
      users:[],
      usersLoaded:false,
      companies:[],
      companiesLoaded:false,
      task:null,
      taskLoaded:false,
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
    this.tryLoad.bind(this);
  }

  tryLoad(last, value){
    let stateCopy={...this.state};
    if(last==='task'){
      stateCopy.task=value;
    }
    stateCopy[(last+'Loaded')]=true;
    if(
      !stateCopy.statusesLoaded||
      !stateCopy.projectsLoaded||
      !stateCopy.usersLoaded||
      !stateCopy.companiesLoaded||
      !stateCopy.taskLoaded
    )return;
    this.setState({
      title:stateCopy.task.title?stateCopy.task.title:'',
      status:stateCopy.task.status?(stateCopy.statuses.map((item)=>{item.label=item.title;item.value=item.id;return item}).find((item)=>item.id===stateCopy.task.status)):null,
      project:stateCopy.task.project?(stateCopy.projects.map((item)=>{item.label=item.title;item.value=item.id;return item}).find((item)=>item.id===stateCopy.task.project)):null,
      requestedBy:stateCopy.task.requestedBy?(stateCopy.users.map((item)=>{item.label=item.username;item.value=item.id;return item}).find((item)=>item.id===stateCopy.task.requestedBy)):null,
      company:stateCopy.task.company?(stateCopy.companies.map((item)=>{item.label=item.companyName;item.value=item.id;return item}).find((item)=>item.id===stateCopy.task.company)):null,
      solver:stateCopy.task.solver?(stateCopy.users.map((item)=>{item.label=item.username;item.value=item.id;return item}).find((item)=>item.id===stateCopy.task.solver)):null,
      deadline:stateCopy.task.deadline?stateCopy.task.deadline:null,
      description:stateCopy.task.description?stateCopy.task.description:'',
      hours:stateCopy.task.hours?stateCopy.task.hours:'',
    });
  }

  componentWillMount(){
    this.connections=[];
    base.fetch('hd-tasks/'+this.props.taskID, {
      context: this,
      state:'task',
      then:(task)=>{
        this.tryLoad('task',task);
        this.setState({task,taskLoaded:true});

        }
    });

      this.connections.push(base.bindToState(`hd-statuses`, {
        context: this,
        state: 'statuses',
        asArray: true,
        then:()=>{
          this.tryLoad('statuses', true);
          this.setState({statusesLoaded:true});
        }
      }));
      this.connections.push(base.bindToState(`hd-projects`, {
        context: this,
        state: 'projects',
        asArray: true,
        then:()=>{
          this.tryLoad('projects', true);
          this.setState({projectsLoaded:true});
        }
      }));
      this.connections.push(base.bindToState(`settings-users`, {
        context: this,
        state: 'users',
        asArray: true,
        then:()=>{
          this.tryLoad('users', true);
          this.setState({usersLoaded:true});
        }
      }));
      this.connections.push(base.bindToState(`settings-companies`, {
        context: this,
        state: 'companies',
        asArray: true,
        then:()=>{
          this.tryLoad('companies', true);
          this.setState({companiesLoaded:true});
        }
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
      status:this.state.status?this.state.status.id:null,
      id:this.props.taskID,
      project:this.state.project?this.state.project.id:null,
      requestedBy:this.state.requestedBy?this.state.requestedBy.id:null,
      company:this.state.company?this.state.company.id:null,
      solver:this.state.solver?this.state.solver.id:null,
      deadline:this.state.deadline,
      description:this.state.description,
      hours:this.state.hours,
    }
    base.update(`hd-tasks/`+data.id,{data});
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
        <Button onClick={this.submit.bind(this)} bsStyle="primary">Save</Button>
      </div>
    );
}}
