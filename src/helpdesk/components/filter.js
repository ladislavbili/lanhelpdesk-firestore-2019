import React, { Component } from 'react';
import {NavItem, Nav, Input} from 'reactstrap';
import Select from 'react-select';
import { connect } from "react-redux";

import {database, rebase} from '../../index';
import {setFilter} from '../../redux/actions';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import AddFilter from './filterAdd';

import {invisibleSelectStyle} from '../../scss/selectStyles';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses:[],
      users:[],
      companies:[],
      workTypes:[],
      status:{id:null,label:'Žiadny',value:null},
      requester:{id:null,label:'Žiadny',value:null},
      company:{id:null,label:'Žiadny',value:null},
      assigned:{id:null,label:'Žiadny',value:null},
      workType:{id:null,label:'Žiadny',value:null},
      statusDateFrom:'',
      statusDateTo:'',
      loading:true,

      newFilterName: "",
      openEditName: false,
    };
    this.renameFilter.bind(this);
    this.fetchData();
  }

  setData(statuses,users,companies,workTypes){
    this.setState({
      statuses,
      users,
      companies,
      workTypes,
      status:{id:null,label:'Žiadny',value:null},
      requester:{id:null,label:'Žiadny',value:null},
      company:{id:null,label:'Žiadny',value:null},
      assigned:{id:null,label:'Žiadny',value:null},
      workType:{id:null,label:'Žiadny',value:null},
      statusDateFrom:'',
      statusDateTo:'',
      loading:false
    });
  }

  getItemValue(sourceKey,state,id){
    let value = state[sourceKey].find((item)=>item.id===id);
    if(value===undefined){
      value={id:null,label:'Žiadny',value:null};
    }
    return value;
  }

  componentWillReceiveProps(props){
    if(this.props.filter.updatedAt!==props.filter.updatedAt){
      let filter = props.filter;
      this.setState({
        status:this.getItemValue('statuses',this.state,filter.status),
        requester:this.getItemValue('users',this.state,filter.requester),
        company:this.getItemValue('companies',this.state,filter.company),
        assigned:this.getItemValue('users',this.state,filter.assigned),
        workType:this.getItemValue('workTypes',this.state,filter.workType),
        statusDateFrom:filter.statusDateFrom,
        statusDateTo:filter.statusDateTo,
      });
    }
  }

  fetchData(){
    Promise.all(
      [
        database.collection('help-statuses').get(),
        database.collection('users').get(),
        database.collection('companies').get(),
        database.collection('help-task_types').get(),
      ]).then(([statuses,users, companies, workTypes])=>{
        this.setData(toSelArr(snapshotToArray(statuses)),toSelArr(snapshotToArray(users),'email'),toSelArr(snapshotToArray(companies)),toSelArr(snapshotToArray(workTypes)));
      });
    }

    deleteFilter(){
      if(window.confirm("Are you sure?")&& this.props.filterID!==null){
        rebase.removeDoc('/help-filters/'+this.props.filterID).then(()=>{
          this.props.resetFilter();
          this.setState({
            status:{id:null,label:'Žiadny',value:null},
            requester:{id:null,label:'Žiadny',value:null},
            company:{id:null,label:'Žiadny',value:null},
            assigned:{id:null,label:'Žiadny',value:null},
            workType:{id:null,label:'Žiadny',value:null},
            statusDateFrom:'',
            statusDateTo:'',
          });
          this.applyFilter();
        });
      }
    }

    resetFilter(){
      if(this.props.filterID===null){
        this.setState({
          status:{id:null,label:'Žiadny',value:null},
          requester:{id:null,label:'Žiadny',value:null},
          company:{id:null,label:'Žiadny',value:null},
          assigned:{id:null,label:'Žiadny',value:null},
          workType:{id:null,label:'Žiadny',value:null},
          statusDateFrom:'',
          statusDateTo:'',
        })
      }else{
        this.setState({
          status:this.getItemValue('statuses',this.state,this.props.filterData.filter.status),
          requester:this.getItemValue('users',this.state,this.props.filterData.filter.requester),
          company:this.getItemValue('companies',this.state,this.props.filterData.filter.company),
          assigned:this.getItemValue('users',this.state,this.props.filterData.filter.assigned),
          workType:this.getItemValue('workTypes',this.state,this.props.filterData.filter.workType),
          statusDateFrom:this.props.filterData.filter.statusDateFrom,
          statusDateTo:this.props.filterData.filter.statusDateTo,
        });
      }
    }

    applyFilter(){
      let body={
        requester:this.state.requester.id,
        company:this.state.company.id,
        assigned:this.state.assigned.id,
        workType:this.state.workType.id,
        status:this.state.status.id,
        statusDateFrom:isNaN(new Date(this.state.statusDateFrom).getTime())||this.state.statusDateFrom === '' ? '' : (new Date(this.state.statusDateFrom).getTime()),
        statusDateTo:isNaN(new Date(this.state.statusDateTo).getTime())|| this.state.statusDateTo === '' ? '' : (new Date(this.state.statusDateTo).getTime()),
        updatedAt:(new Date()).getTime()
      }
      this.props.setFilter(body);
    }

    renameFilter(){
      if (this.props.filterData.title !== this.state.newFilterName
        && this.state.newFilterName.length > 0){
        rebase.updateDoc('/help-filters/'+this.props.filterID, {title: this.state.newFilterName})
        .then(()=> {
        });
      }
    }


    render() {
      return (
        <div>

          <div
            className="row sidebar-btn text-highlight"
            onClick={() => this.setState({openEditName: (this.props.filterID ? true : false)})}
            >

            {!this.state.openEditName &&
              <h5 className=""><i className="fa fa-cog sidebar-icon-center"/> {this.props.filterID?' '+ (this.state.newFilterName ? this.state.newFilterName : this.props.filterData.title):' Všetky'}</h5>
            }
            {this.state.openEditName &&
                <Input
                  type="text"
                  className="from-control sidebar-input"
                  placeholder="Enter filter name"
                  autoFocus
                  value={this.state.newFilterName ? this.state.newFilterName : this.props.filterData.title}
                  onChange={(e)=>this.setState({newFilterName: e.target.value})}
                  onBlur={() => this.setState({openEditName: false}, () => this.renameFilter())}
              />
          }
          </div>


          <Nav vertical className="p-10 p-r-20 p-l-20 sidebar-filter">

            <NavItem>
              <div className="m-b-5 row sidebar-filter-row">
                <label htmlFor="example-input-small">Status:</label>
                <div className="flex m-t--5 m-l-5">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null}].concat(this.state.statuses)}
                    onChange={(newValue)=>this.setState({status:newValue})}
                    value={this.state.status}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="m-b-5 row sidebar-filter-row">
                <label htmlFor="example-input-small">Zadal:</label>
                <div className="flex m-t--5 m-l-5">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null}].concat(this.state.users)}
                    onChange={(newValue)=>this.setState({requester:newValue})}
                    value={this.state.requester}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="m-b-5 row sidebar-filter-row">
                <label htmlFor="example-input-small">Firma:</label>
                <div className="flex m-t--5 m-l-5">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null}].concat(this.state.companies)}
                    onChange={(newValue)=>this.setState({company:newValue})}
                    value={this.state.company}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="m-b-5 row sidebar-filter-row">
                <label htmlFor="example-input-small">Riesi:</label>
                <div className="flex m-t--5 m-l-5">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null}].concat(this.state.users)}
                    onChange={(newValue)=>this.setState({assigned:newValue})}
                    value={this.state.assigned}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="m-b-5 row sidebar-filter-row">
                <label>Start:</label>
                <div className="flex m-t--5">
                  <Input
                    type="datetime-local"
                    value={this.state.statusDateFrom}
                    onChange={(e)=>{
                      this.setState({statusDateFrom:e.target.value})}
                    }
                    className="form-control invisible-input"
                    placeholder="Od" />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="m-b-5 row sidebar-filter-row">
                <div>
                  <label>Due:</label>
                </div>
                <div className="flex m-t--5">
                  <Input
                    type="datetime-local"
                    value={this.state.statusDateTo}
                    onChange={(e)=>{
                      this.setState({statusDateTo:e.target.value})}
                    }
                    className="form-control invisible-input"
                    placeholder="Od" />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="m-b-5 row sidebar-filter-row">
                <label htmlFor="example-input-small">Typ práce:</label>
                <div className="flex m-t--5 m-l-5">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null}].concat(this.state.workTypes)}
                    onChange={(newValue)=>this.setState({workType:newValue})}
                    value={this.state.workType}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
          <NavItem className="center-ver">
            <div className="d-flex m-b-2">
              <button type="button" className="btn-link-reversed m-2" onClick={this.applyFilter.bind(this)}><i className="fa fa-check icon-M"/></button>
              <AddFilter
                filter={{
                  requester:this.state.requester.id,
                  company:this.state.company.id,
                  assigned:this.state.assigned.id,
                  workType:this.state.workType.id,
                  status:this.state.status.id,
                  statusDateFrom:isNaN(new Date(this.state.statusDateFrom).getTime())||this.state.statusDateFrom === '' ? '' : (new Date(this.state.statusDateFrom).getTime()),
                  statusDateTo:isNaN(new Date(this.state.statusDateTo).getTime())|| this.state.statusDateTo === '' ? '' : (new Date(this.state.statusDateTo).getTime())
                }}
                filterID={this.props.filterID}
                filterData={this.props.filterData}
                />
              <button type="button" className="btn-link-reversed m-2" onClick={this.resetFilter.bind(this)}><i className="fa fa-sync icon-M"/></button>
              <button type="button" className="btn-link-reversed m-2" onClick={this.deleteFilter.bind(this)}><i className="far fa-trash-alt icon-M"/></button>
            </div>
          </NavItem>
        </Nav>
      </div>
      )
    }
  }


  const mapStateToProps = ({ filterReducer }) => {
    const { filter } = filterReducer;
    return { filter };
  };

  export default connect(mapStateToProps, { setFilter })(Filter);
