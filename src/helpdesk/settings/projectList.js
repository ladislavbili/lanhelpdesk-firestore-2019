import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../../index';
import ProjectAdd from './projectAdd';
import ProjectEdit from './projectEdit';

export default class ProjectList extends Component{
  constructor(props){
    super(props);
    this.state={
      projects:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/projects', {
      context: this,
      withIds: true,
      then:content=>{this.setState({projects:content, projectFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return (
      <div className="row flex container container-padding center-ver">
        <div className="col-6">
          <FormGroup>
            <InputGroup>
              <FormControl type="text" onChange={(e)=>this.setState({projectFilter:e.target.value})} />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Table striped condensed hover>
            <thead>
              <tr className="clickable">
                <th>Project name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/projects/add')}>
                <td>+ Add project</td>
              </tr>
              {this.state.projects.filter((item)=>item.title.toLowerCase().includes(this.state.projectFilter.toLowerCase())).map((project)=>
                <tr key={project.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/projects/'+project.id)}>
                  <td>{project.title}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="col-6 withSeparator">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <ProjectAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.projects.some((item)=>item.id===this.props.match.params.id) && <ProjectEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
