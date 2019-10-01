import React, { Component } from 'react';

import {Button } from 'reactstrap';
import TaskTypeAdd from './taskTypeAdd';
import TaskTypeEdit from './taskTypeEdit';

import { connect } from "react-redux";
import {storageHelpTaskTypesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class TaskTypesList extends Component{
  constructor(props){
    super(props);
    this.state={
      taskTypes:[],
      taskTypeFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.taskTypes,this.props.taskTypes)){
      this.setState({taskTypes:props.taskTypes})
    }
  }

  componentWillMount(){
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    this.setState({taskTypes:this.props.taskTypes});
  }

  render(){
    return (
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="container-fluid">
						<div className="row align-items-center">
              <div className="p-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control commandbar-search"
                    value={this.state.taskTypeFilter}
                    onChange={(e)=>this.setState({taskTypeFilter:e.target.value})}
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
          				onClick={()=>this.props.history.push('/helpdesk/settings/taskTypes/add')}>
          			 <i className="fa fa-plus sidebar-icon-center"/> Add task type
          			</Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr className="clickable">
                    <th>Task type name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.taskTypes.filter((item)=>item.title.toLowerCase().includes(this.state.taskTypeFilter.toLowerCase())).map((taskType)=>
                    <tr key={taskType.id}
                      className={"clickable" + (this.props.match.params.id === taskType.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/taskTypes/'+taskType.id)}>
                      <td
                        className={(this.props.match.params.id === taskType.id ? "text-highlight":"")}>
                        {taskType.title}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8 p-0">
              {
                this.props.match.params.id && this.props.match.params.id==='add' && <TaskTypeAdd />
              }
              {
                this.props.match.params.id && this.props.match.params.id!=='add' && this.state.taskTypes.some((item)=>item.id===this.props.match.params.id) && <TaskTypeEdit match={this.props.match} history={this.props.history} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpTaskTypes}) => {
  const { taskTypesActive, taskTypes } = storageHelpTaskTypes;
  return { taskTypesActive, taskTypes };
};

export default connect(mapStateToProps, { storageHelpTaskTypesStart })(TaskTypesList);
