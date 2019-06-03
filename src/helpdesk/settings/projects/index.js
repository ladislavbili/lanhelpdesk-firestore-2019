import React, { Component } from 'react';
import {rebase} from '../../../index';
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
      <div className="row">
        <div className="col-lg-4">
          <div className="card-box fit-with-header scrollable">
          <div className="input-group">
            <input
              type="text"
              onChange={(e)=>this.setState({projectFilter:e.target.value})}
              className="form-control"
              placeholder="Search task name"
              style={{ width: 200 }}
            />
            <div className="input-group-append">
              <button className="btn btn-white" type="button">
                <i className="fa fa-search" />
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mails m-0">
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
          </table>
        </div>
        </div>
        </div>
        <div className="col-lg-8 p-0">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <ProjectAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.projects.some((item)=>item.id===this.props.match.params.id) && <ProjectEdit match={this.props.match} history={this.props.history}/>
          }
        </div>
      </div>
    );
  }
}
