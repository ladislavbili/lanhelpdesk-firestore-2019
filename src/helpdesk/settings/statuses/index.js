import React, { Component } from 'react';
import {Button } from 'reactstrap';
import StatusAdd from './statusAdd';
import StatusEdit from './statusEdit';

import { connect } from "react-redux";
import {storageHelpStatusesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class StatusesList extends Component{
  constructor(props){
    super(props);
    this.state={
      statuses:[],
      statusFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.statuses,this.props.statuses)){
      this.setState({statuses:props.statuses.sort((item1,item2)=>{
        if(item1.order &&item2.order){
          return item1.order > item2.order? 1 :-1;
        }
        return -1;
      })})
    }
  }

  componentWillMount(){
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }
    this.setState({statuses:this.props.statuses.sort((item1,item2)=>{
      if(item1.order &&item2.order){
        return item1.order > item2.order? 1 :-1;
      }
      return -1;
    })});
  }

  render(){
    return (
      <div className="content">
        <div className="commandbar">
            <div className="search">
                <input
                  type="text"
                  className="form-control search-text"
                  value={this.state.statusFilter}
                  onChange={(e)=>this.setState({statusFilter:e.target.value})}
                  placeholder="Search"
                />
              <button className="search-btn" type="button">
                <i className="fa fa-search" />
              </button>
            </div>
            <Button
              className="btn-link center-hor"
              onClick={()=>this.props.history.push('/helpdesk/settings/statuses/add')}>
             <i className="fa fa-plus p-l-5 p-r-5"/> Add status
            </Button>
        </div>

        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4 p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
            <h4 className="font-24 p-b-10 ">
              Statuses
            </h4>
            <table className="table table-hover">
              <tbody>
                {this.state.statuses.filter((item)=>item.title.toLowerCase().includes(this.state.statusFilter.toLowerCase())).map((status)=>
                  <tr key={status.id}
                     className={"clickable" + (this.props.match.params.id === status.id ? " sidebar-item-active":"")}
                     onClick={()=>this.props.history.push('/helpdesk/settings/statuses/'+status.id)}>
                    <td className={(this.props.match.params.id === status.id ? "text-highlight":"")}>
                      {status.title}
                    </td>
                    <td className={(this.props.match.params.id === status.id ? "text-highlight":"")}>
                      {status.order?status.order:0}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="col-lg-8">
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <StatusAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.statuses.some((item)=>item.id===this.props.match.params.id) && <StatusEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpStatuses}) => {
  const { statusesActive, statuses } = storageHelpStatuses;
  return { statusesActive, statuses };
};

export default connect(mapStateToProps, { storageHelpStatusesStart })(StatusesList);
