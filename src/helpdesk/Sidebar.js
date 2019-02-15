import React, { Component } from 'react';
import base from '../firebase';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import ProjectEdit from './ProjectEdit';
import ProjectAdd from './ProjectAdd';

export default class Tags extends Component{
  constructor(props){
    super(props);
    this.state = {
      project : {id:'all', title:'All', value:'all', label:'All'},
      openAddTag:false,
      projects:[],
      openEditProject:false,
      openAddProject:false,
    }
    //this.isActive.bind(this);
  }

  componentDidMount(){
    this.ref = base.bindToState(`hd-projects`, {
      context: this,
      state: 'projects',
      asArray: true
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  isActive(id){
    return this.props.history.location.pathname.toLowerCase().includes(id) &&! this.props.history.location.pathname.toLowerCase().includes(id+'/');
  }

  render(){
    let projects=[{id:'all', title:'All'}].concat(this.state.projects).map((project)=>{
      project.value=project.id;
      project.label=project.title;
      return project;
    });
    return (
      <ListGroup className='sidebar fullWidth'>
        <ListGroupItem className='sidebarItem noColor' >
          <label>Project</label>
          <Select
            options={projects}
            value={projects.find((item)=>item.id===this.state.project.id)}
            onChange={e =>{ this.setState({ project: e })}}
            />
        </ListGroupItem>

          <Link className='link' to={{pathname: `/helpdesk/filter/all`}}>
            <ListGroupItem active={this.isActive('/helpdesk/filter/all')} className='sidebarItem' >
              All tasks
            </ListGroupItem>
          </Link>
          <Link className='link' to={{pathname: `/helpdesk/filter/my`}}>
            <ListGroupItem active={this.isActive('/helpdesk/filter/my')} className='sidebarItem' >
              My tasks
            </ListGroupItem>
          </Link>
          <Link className='link' to={{pathname: `/helpdesk/filter/add`}}>
            <ListGroupItem active={this.isActive('/helpdesk/filter/add')} className='sidebarItem' >
              + Filter
            </ListGroupItem>
          </Link>

          <div style={{borderTop:'solid #337ab7 5px'}}>
            {this.state.project.id!=='all' && <ListGroupItem onClick={()=>{this.setState({openEditProject:true})}} className='sidebarItem addTagSidebar' >
              Project settings
            </ListGroupItem>}

            <ListGroupItem onClick={()=>{this.setState({openAddProject:true})}} className='sidebarItem addTagSidebar' >
              Add project
            </ListGroupItem>
          </div>

          <Modal show={this.state.openEditProject} onHide={()=>{this.setState({openEditProject:false})}}>
            <Modal.Header closeButton>
              <Modal.Title>Editing project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ProjectEdit closeModal={()=>{this.setState({openEditProject:false})}} id={this.state.project.id} />
            </Modal.Body>
          </Modal>
          <Modal show={this.state.openAddProject} onHide={()=>{this.setState({openAddProject:false})}}>
            <Modal.Header closeButton>
              <Modal.Title>Adding project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ProjectAdd closeModal={()=>{this.setState({openAddProject:false})}} />
            </Modal.Body>
          </Modal>

      </ListGroup>
    );

  }
}
