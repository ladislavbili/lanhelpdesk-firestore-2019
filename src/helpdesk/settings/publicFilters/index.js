import React, { Component } from 'react';
import {Button } from 'reactstrap';
import PublicFilterAdd from './publicFilterAdd';
import PublicFilterEdit from './publicFilterEdit';

import { storageHelpFiltersStart } from 'redux/actions';
import { connect } from "react-redux";

class PublicFiltersList extends Component{
  constructor(props){
    super(props);
    this.state={
      publicFiltersFilter: "",
    }
  }

  componentWillMount(){
		if(!this.props.filtersActive){
			this.props.storageHelpFiltersStart();
		}
	}

  render(){
    let publicFilters = this.props.filters.filter((filter)=>filter.public)
    .sort((item1,item2)=> item1.order - item2.order);
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
                  {publicFilters.map((filter)=>
                    <tr
                      key={filter.id}
                      className={"clickable" + (this.props.match.params.id === filter.id ? " sidebar-item-active":"")}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                      onClick={()=>this.props.history.push('/helpdesk/settings/publicFilters/'+filter.id.toString())}>
                      <td
                        className={(this.props.match.params.id === filter.id ? "text-highlight":"")}
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {filter.title}
                      </td>
                      <td
                        className={(this.props.match.params.id === filter.id ? "text-highlight":"")}
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {filter.order}
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
              this.props.match.params.id &&
              this.props.match.params.id!=='add' &&
              publicFilters.some((item)=>item.id.toString()===this.props.match.params.id) &&
              <PublicFilterEdit match={this.props.match} history={this.props.history}/>
              }
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ storageHelpFilters }) => {
  const { filtersActive, filters, filtersLoaded } = storageHelpFilters;
  return {
    filtersActive, filters, filtersLoaded,
  };
};

export default connect(mapStateToProps, { storageHelpFiltersStart })(PublicFiltersList);
