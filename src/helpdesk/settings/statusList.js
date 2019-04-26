import React, { Component } from 'react';
import {rebase} from '../../index';
import StatusAdd from './statusAdd';
import StatusEdit from './statusEdit';

export default class StatusesList extends Component{
  constructor(props){
    super(props);
    this.state={
      statuses:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/statuses', {
      context: this,
      withIds: true,
      then:content=>{this.setState({statuses:content, statusFilter:''})},
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
              onChange={(e)=>this.setState({statusFilter:e.target.value})}
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
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/statuses/add')}>
                <td>+ Add status</td>
              </tr>
              {this.state.statuses.filter((item)=>item.title.toLowerCase().includes(this.state.statusFilter.toLowerCase())).map((status)=>
                <tr key={status.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/statuses/'+status.id)}>
                  <td>{status.title}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
        </div>
        <div className="col-lg-8 p-0">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <StatusAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.statuses.some((item)=>item.id===this.props.match.params.id) && <StatusEdit match={this.props.match} history={this.props.history} />
          }
        </div>
  </div>
    );
  }
}
