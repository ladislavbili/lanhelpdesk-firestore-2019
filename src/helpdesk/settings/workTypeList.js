import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../../index';
import WorkTypeAdd from './workTypeAdd';
import WorkTypeEdit from './workTypeEdit';

export default class WorkTypesList extends Component{
  constructor(props){
    super(props);
    this.state={
      workTypes:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/workTypes', {
      context: this,
      withIds: true,
      then:content=>{this.setState({workTypes:content, workTypeFilter:''})},
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
              onChange={(e)=>this.setState({workTypeFilter:e.target.value})}
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
                <th>Work type name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/workTypes/add')}>
                <td>+ Add work type</td>
              </tr>
              {this.state.workTypes.filter((item)=>item.title.toLowerCase().includes(this.state.workTypeFilter.toLowerCase())).map((workType)=>
                <tr key={workType.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/workTypes/'+workType.id)}>
                  <td>{workType.title}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      <div className="col-lg-8 p-0">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <WorkTypeAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.workTypes.some((item)=>item.id===this.props.match.params.id) && <WorkTypeEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
