import React, { Component } from 'react';
import {Button } from 'reactstrap';
import AttributeAdd from './attributeAdd';
import AttributeEdit from './attributeEdit';

import { connect } from "react-redux";

const ATTRIBUTES = [
  {label: 'Status', value:'1', static: true, title: 'Status', id: '1'},
  {label: 'Projekt', value:'2', static: true, title: 'Projekt', id: '2'},
  {label: 'Zadal', value:'3', static: true, title: 'Zadal', id: '3'},
  {label: 'Deadline', value:'4', static: true, title: 'Deadline', id: '4'},
  {label: 'Milestone', value:'5', static: true, title: 'Milestone', id: '5'},
  {label: 'Repeat', value:'6', static: true, title: 'Repeat', id: '6'},
  {label: 'Typ', value:'7', static: false, title: 'Typ', id: '7'},
  {label: 'Paušál', value:'8', static: false, title: 'Paušál', id: '8'},
  {label: 'Mimo PH', value:'9', static: false, title: 'Mimo PH', id: '9'},
];

class AttributesList extends Component{
  constructor(props){
    super(props);
    this.state={
      attributesFilter: "",
    }
  }

  componentWillMount(){
	}

  render(){
    const STATIC = ATTRIBUTES.filter(attribute => attribute.static);
    const OPTIONAL = ATTRIBUTES.filter(attribute => !attribute.static);

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
                    value={this.state.attributesFilter}
                    onChange={(e)=>this.setState({attributesFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=> this.props.history.push('/helpdesk/settings/attributes/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Attribute
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row p-l-10 p-b-10">
                <h2 className="">
    							Static attributes
    						</h2>
              </div>
              <table className="table table-hover">
                <tbody>
                  {STATIC.map((attribute)=>
                    <tr
                      key={attribute.id}
                      className={"clickable" + (this.props.match.params.id === attribute.id ? " sidebar-item-active":"")}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                      onClick={()=>this.props.history.push('/helpdesk/settings/attributes/'+attribute.id.toString())}>
                      <td
                        className={(this.props.match.params.id === attribute.id ? "text-highlight":"")}
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {attribute.title}
                      </td>
                      <td
                        className={(this.props.match.params.id === attribute.id ? "text-highlight":"")}
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {attribute.order}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="row p-l-10 p-b-10">
                <h2 className="">
    							Optional attributes
    						</h2>
              </div>
              <table className="table table-hover">
                <tbody>
                  {OPTIONAL.map((attribute)=>
                    <tr
                      key={attribute.id}
                      className={"clickable" + (this.props.match.params.id === attribute.id ? " sidebar-item-active":"")}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                      onClick={()=>this.props.history.push('/helpdesk/settings/attributes/'+attribute.id.toString())}>
                      <td
                        className={(this.props.match.params.id === attribute.id ? "text-highlight":"")}
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {attribute.title}
                      </td>
                      <td
                        className={(this.props.match.params.id === attribute.id ? "text-highlight":"")}
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {attribute.order}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"><h2>DEMO</h2>  </div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <AttributeAdd />
            }
            {
              this.props.match.params.id &&
              this.props.match.params.id!=='add' &&
              ATTRIBUTES.some((item)=>item.id.toString()===this.props.match.params.id) &&
              <AttributeEdit match={this.props.match} history={this.props.history}/>
              }
          </div>
        </div>
      </div>
    );
  }
}



export default connect()(AttributesList);
