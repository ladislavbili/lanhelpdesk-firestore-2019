import React, { Component } from 'react';
import base from '../firebase';
import ReactTable from 'react-table';
import { Badge, Glyphicon, Button, Modal } from 'react-bootstrap';
import TaskEdit from './TaskEdit';
export default class TaskList extends Component{

  constructor(props){
    super(props);
    this.state = {
      tasks:[],
      statuses:[],
      status:'all',
      projects:[],
      users:[],
      companies:[],
      openEditTaskModal:false,
      editedTaskID:null
    }
    this.remove.bind(this);
    this.rebindData.bind(this);
  }

  componentWillMount(){
    this.ref2 = base.bindToState(`hd-tasks`, {
      context: this,
      state: 'tasks',
      asArray: true
    });
    this.connections=[];
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

  remove(row){
    if (window.confirm("Are you sure you want to delete task "+row.original.title+"?")) {
      base.remove(`hd-tasks/`+row.original.id);
    } else {
      return;
    }
  }

  componentWillUnmount() {
    this.connections.map((item)=>
      base.removeBinding(item)
    )
    base.removeBinding(this.ref2);
  }

  rebindData(item){
    base.removeBinding(this.ref2);
    if(item.id==='all'){
      this.ref2 = base.bindToState(`hd-tasks`, {
        context: this,
        state: 'tasks',
        asArray: true
      });
    }else{
      this.ref2 = base.bindToState(`hd-tasks`, {
        context: this,
        state: 'tasks',
        asArray: true,
        queries: {
          orderByChild: 'status',
          equalTo: item.id
        }
      });
    }
  }

  render(){
    const tableSetting=[
      {
        Header: 'ID',
        accessor: 'id',
      },{
        Header: 'Title',
        accessor: 'title',
      },{
        Header: 'Status',
        accessor: 'status',
        Cell : row => {
          let status=this.state.statuses.find((item)=>item.id===row.value);
          return (
            <span>{status?status.title:'No status'}</span>
          )
        }
      },{
        Header: 'Project',
        accessor: 'project',
        Cell : row => {
          let item=this.state.projects.find((item)=>item.id===row.value);
          return (
            <span>{item?item.title:'No project'}</span>
          )
        }
      },{
        Header: 'Requested by',
        accessor: 'requestedBy',
        Cell : row => {
          let item=this.state.users.find((item)=>item.id===row.value);
          return (
            <span>{item?item.username:'No user'}</span>
          )
        }
      },{
        Header: 'Company',
        accessor: 'company',
        Cell : row => {
          let item=this.state.companies.find((item)=>item.id===row.value);
          return (
            <span>{item?item.companyName:'No company'}</span>
          )
        }
      },{
        Header: 'Solver',
        accessor: 'solver',
        Cell : row => {
          let item=this.state.users.find((item)=>item.id===row.value);
          return (
            <span>{item?item.username:'No user'}</span>
          )
        }
      },{
        Header: 'Deadline',
        accessor: 'deadline',
        Cell : (row)=> <span>{row.value?row.value:'No deadline'}</span>,
      },{
        Header: 'Hours',
        accessor: 'hours',
        Cell : (row)=><span>{row.value?row.value:'No hours'}</span>
        },
      {
        Header: '',
        accessor: 'edit',
        Cell : row => <span>
                  <Button
                    onClick={()=>this.setState({openEditTaskModal:true,editedTaskID:row.original.id})}
                    bsStyle='warning'>
                    Edit
                  </Button>
                  <Button
                    style={{marginLeft:5}}
                    onClick={() => {
                        this.remove(row)}
                      }
                    bsStyle='danger'>Delete</Button>
                </span>
        }
    ];
    const data =[...this.state.tasks];
    return (
      <div style={{padding:15}}>
        <div style={{padding:15}}>
          {[{id:'all',title:'All'}].concat(this.state.statuses).map((item)=>
          <Badge key={item.id} className="statusStyle" style={{backgroundColor:this.state.status===item.id?'#337ab7':'#8db9df'}}
            >
            <span style={{margin:'auto'}}
              onClick={()=>{
                this.setState({status:item.id});
                this.rebindData(item);
              }}
              >{item.title}</span>
            {item.id!=='all' &&
              <Glyphicon style={{marginLeft:5}}
                glyph="remove-sign"
                onClick={()=>{
                  if (window.confirm("Are you sure you want to delete status "+ item.title+"?")) {
                    base.remove(`hd-statuses/`+item.id);
                    this.setState({status:'all'});
                    this.rebindData({id:'all',title:'All'});
                  } else {
                    return;
                  }
                }
              }
              />}
            </Badge>)}
          </div>
          <ReactTable
            data={data}
            columns={tableSetting}
            className="-striped -highlight"
            />
          <Modal show={this.state.openEditTaskModal} onHide={()=>{this.setState({openEditTaskModal:false})}}>
              <Modal.Header closeButton>
                <Modal.Title>Edit task</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <TaskEdit taskID={this.state.editedTaskID} closeModal={()=>{this.setState({openEditTaskModal:false})}} />
              </Modal.Body>
            </Modal>
        </div>
      );
    }
  }
