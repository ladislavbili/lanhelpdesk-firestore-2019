import React, { Component } from 'react';
import {Button } from 'reactstrap';
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
    this.ref = rebase.listenToCollection('/help-projects', {
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
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="commandbar">
						<div className="row align-items-center">
              <div className="p-2" >
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control search"
                    value={this.state.projectFilter}
                    onChange={(e)=>this.setState({projectFilter:e.target.value})}
                    placeholder="Search"
                  />
                  <div className="input-group-append">
                    <button className="search-btn" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>

              <Button
                className="btn-link t-a-l"
                onClick={()=>this.props.history.push('/helpdesk/settings/projects/add')}>
               <i className="fa fa-plus m-r-5 m-l-5 "/> Project
              </Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr className="clickable">
                    <th>Project name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.projects.filter((item)=>item.title.toLowerCase().includes(this.state.projectFilter.toLowerCase())).map((project)=>
                    <tr key={project.id}
                      className={"clickable" + (this.props.match.params.id === project.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/projects/'+project.id)}>
                      <td className={(this.props.match.params.id === project.id ? "text-highlight":"")}>
                        {project.title}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
        </div>
      </div>
    );
  }
}
