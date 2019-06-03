import React, { Component } from 'react';
import {rebase} from '../../../index';
import UnitAdd from './unitAdd';
import UnitEdit from './unitEdit';

export default class UnitsList extends Component{
  constructor(props){
    super(props);
    this.state={
      units:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/units', {
      context: this,
      withIds: true,
      then:content=>{this.setState({units:content, unitFilter:''})},
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
              onChange={(e)=>this.setState({unitFilter:e.target.value})}
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
                <th>Unit name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/units/add')}>
                <td>+ Add unit</td>
              </tr>
              {this.state.units.filter((item)=>item.title.toLowerCase().includes(this.state.unitFilter.toLowerCase())).map((unit)=>
                <tr key={unit.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/units/'+unit.id)}>
                  <td>{unit.title}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
        </div>
        <div className="col-lg-8 p-0">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <UnitAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.units.some((item)=>item.id===this.props.match.params.id) && <UnitEdit match={this.props.match} history={this.props.history} />
          }
        </div>
      </div>
    );
  }
}
