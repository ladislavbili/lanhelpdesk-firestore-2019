import React, { Component } from 'react';
import {rebase} from '../../index';
import TagAdd from './tagAdd';
import TagEdit from './tagEdit';

export default class TagList extends Component{
  constructor(props){
    super(props);
    this.state={
      tags:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/help-tags', {
      context: this,
      withIds: true,
      then:content=>{this.setState({tags:content, tagFilter:''})},
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
              onChange={(e)=>this.setState({tagFilter:e.target.value})}
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
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/tags/add')}>
                <td>+ Add tag</td>
              </tr>
              {this.state.tags.filter((item)=>item.title.toLowerCase().includes(this.state.tagFilter.toLowerCase())).map((tag)=>
                <tr key={tag.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/tags/'+tag.id)}>
                  <td>{tag.title}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
        </div>
        <div className="col-lg-8 p-0">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <TagAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.tags.some((item)=>item.id===this.props.match.params.id) && <TagEdit match={this.props.match} history={this.props.history} />
          }
        </div>
  </div>
    );
  }
}
