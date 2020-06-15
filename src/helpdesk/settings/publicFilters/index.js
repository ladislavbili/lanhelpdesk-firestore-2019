import React, { Component } from 'react';
import {Button } from 'reactstrap';
import PublicFilterAdd from './publicFilterAdd';
import PublicFilterEdit from './publicFilterEdit';

import { connect } from "react-redux";

const FILTERS = [
  {label:'My tasks',value:1},
  {label:'All tasks',value:2},
  {label:'Assigned tasks',value:3},
];

class PublicFiltersList extends Component{
  constructor(props){
    super(props);
    this.state={
      publicFiltersFilter: "",
    }
  }

  componentWillReceiveProps(props){
  }

  componentWillMount(){
  }

  render(){
    return (
			<div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.publicFiltersFilter}
                    onChange={(e)=>this.setState({publicFiltersFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=> this.props.history.push('/helpdesk/settings/publicFilters/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Public Filter
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row p-l-10 p-b-10">
                <h2 className="">
    							Public Filters
    						</h2>
              </div>
              <table className="table table-hover">
                <tbody>
                  {FILTERS.map((filter)=>
                    <tr
                      key={filter.value}
                      className={"clickable" + (this.props.match.params.id === filter.label ? " sidebar-item-active":"")}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                      onClick={()=>this.props.history.push('/helpdesk/settings/publicFilters/'+filter.value.toString())}>
                      <td
                        className={(this.props.match.params.id === filter.label ? "text-highlight":"")}
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {filter.label + ", " + filter.value}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <PublicFilterAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && FILTERS.some((item)=>item.value.toString()===this.props.match.params.id) && <PublicFilterEdit match={this.props.match} history={this.props.history}/>
              }
          </div>
        </div>
      </div>
    );
  }
}


export default connect()(PublicFiltersList);
