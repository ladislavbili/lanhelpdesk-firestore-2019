import React, { Component } from 'react';
import {Button } from 'reactstrap';
import ProjectAdd from './projectAdd';
import { connect } from "react-redux";
import ProjectEdit from './projectEdit';
import {sameStringForms} from '../../../helperFunctions';
import {storageHelpProjectsStart} from '../../../redux/actions';

class ProjectList extends Component{
  constructor(props){
    super(props);
    this.state={
      projectFilter:''
    }
  }

  componentWillMount(){
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
  }


  render(){
    return (
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="container-fluid">
						<div className="row align-items-center">
              <div className="p-2" >
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control commandbar-search"
                    value={this.state.projectFilter}
                    onChange={(e)=>this.setState({projectFilter:e.target.value})}
                    placeholder="Search"
                  />
                  <div className="input-group-append">
                    <button className="commandbar-btn-search" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>

              <Button
                className="btn-link t-a-l"
                onClick={()=>this.props.history.push('/helpdesk/settings/projects/add')}>
               <i className="fa fa-plus sidebar-icon-center"/> Add project
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
                  {this.props.projects.filter((item)=>item.title.toLowerCase().includes(this.state.projectFilter.toLowerCase())).map((project)=>
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
                this.props.match.params.id && this.props.match.params.id!=='add' && this.props.projects.some((item)=>item.id===this.props.match.params.id) && <ProjectEdit match={this.props.match} history={this.props.history} id={this.props.match.params.id} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ storageHelpProjects }) => {
  const { projectsActive, projects } = storageHelpProjects;
  return { projectsActive, projects };
};

export default connect(mapStateToProps, { storageHelpProjectsStart })(ProjectList);
