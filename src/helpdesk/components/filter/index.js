import React, { Component } from 'react';
import { Input } from 'reactstrap';
import Select from 'react-select';
import { connect } from "react-redux";

import {rebase} from '../../../index';
import DatePicker from 'react-datepicker';
import {setFilter, storageHelpTaskTypesStart, storageUsersStart, storageCompaniesStart } from '../../../redux/actions';
import {toSelArr, sameStringForms, toMomentInput, fromMomentToUnix } from '../../../helperFunctions';
import AddFilter from './filterAdd';

import datePickerConfig from '../../../scss/datePickerConfig';
import {invisibleSelectStyleOtherFont} from '../../../scss/selectStyles';

const oneOfOptions = [
  {
    value: 'requester',
    label: 'Requester'
  },
  {
    value: 'assigned',
    label: 'Assigned'
  },
  {
    value: 'company',
    label: 'Company'
  }
]

const emptyFilter = {
  requester:{id:null,label:'Žiadny',value:null},
  company:{id:null,label:'Žiadny',value:null},
  assigned:{id:null,label:'Žiadny',value:null},
  workType:{id:null,label:'Žiadny',value:null},
  statusDateFrom: null,
  statusDateTo: null,
  closeDateFrom: null,
  closeDateTo: null,
  pendingDateFrom: null,
  pendingDateTo: null,
  deadlineFrom: null,
  deadlineTo: null,
  public:false,
  oneOf: []
}

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...emptyFilter,

      newFilterName: "",
      openEditName: false,
    };
    this.renameFilter.bind(this);
    this.canSaveFilter.bind(this);
  }

  getItemValue(sourceKey,props,id){
    const source = toSelArr( props[sourceKey], ['users'].includes(sourceKey) ? 'email' : 'title' )
    let value = source.find((item)=>item.id === id);
    if(value===undefined){
      if(id==='cur'){
        value={label:'Current',value:'cur',id:'cur'};
      }else{
        value={id:null,label:'Žiadny',value:null};
      }
    }
    return value;
  }

  componentWillReceiveProps(props){
    if(!sameStringForms( props.filter,this.props.filter )){
      this.setFilter(props);
    }
    if(!this.storageLoaded(this.props) && this.storageLoaded(props) ){
      this.setFilter(props);
    }
  }

  setFilter(props){
    if(!this.storageLoaded(props)){
      return;
    }
    const filterData = props.filters.find( (filter) => filter.id === props.filter.id );
    const filter = props.filter;
    this.setState({
      requester: this.getItemValue( 'users', props, filter.requester ),
      company: this.getItemValue( 'companies', props, filter.company ),
      assigned: this.getItemValue( 'users', props, filter.assigned ),
      workType: this.getItemValue( 'taskTypes', props, filter.workType ),
      oneOf: oneOfOptions.filter( (option) => filter.oneOf.includes(option.value) ),

      statusDateFrom: toMomentInput(filter.statusDateFrom),
      statusDateTo: toMomentInput(filter.statusDateTo),
      pendingDateFrom: toMomentInput(filter.pendingDateFrom),
      pendingDateTo: toMomentInput(filter.pendingDateTo),
      closeDateFrom: toMomentInput(filter.closeDateFrom),
      closeDateTo: toMomentInput(filter.closeDateTo),
      deadlineFrom: toMomentInput(filter.deadlineFrom),
      deadlineTo: toMomentInput(filter.deadlineTo),

      public:filterData ? filterData.public : false,
    });
  }

  componentWillMount(){

    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }

    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }

    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
  }

  storageLoaded(props){
    return (
      props.filtersLoaded &&
      props.taskTypesLoaded &&
      props.usersLoaded &&
      props.companiesLoaded
    )
  }

  deleteFilter(){
    if(window.confirm("Are you sure?")&& this.props.filterID!==null){
      this.props.resetFilter();
      this.props.close();
      this.props.history.push('/helpdesk/taskList/i/all');
      rebase.removeDoc('/help-filters/'+this.props.filterID).then(()=>{
        this.setState(emptyFilter,this.applyFilter.bind(this));
      });
    }
  }

  resetFilter(){
    if(this.props.filterID===null){
      this.setState({...emptyFilter})
    }
    this.setFilter(this.props);
  }

  applyFilter(){
    let body={
      requester:this.state.requester.id,
      company:this.state.company.id,
      assigned:this.state.assigned.id,
      workType:this.state.workType.id,
      oneOf: this.state.oneOf.map( (item) => item.value ),

      statusDateFrom: fromMomentToUnix(this.state.statusDateFrom),
      statusDateTo: fromMomentToUnix(this.state.statusDateTo),
      closeDateFrom: fromMomentToUnix(this.state.closeDateFrom),
      closeDateTo: fromMomentToUnix(this.state.closeDateTo),
      pendingDateFrom: fromMomentToUnix(this.state.pendingDateFrom),
      pendingDateTo: fromMomentToUnix(this.state.pendingDateTo),
      deadlineFrom: fromMomentToUnix(this.state.deadlineFrom),
      deadlineTo: fromMomentToUnix(this.state.deadlineTo),

      updatedAt:(new Date()).getTime()
    }
    this.props.setFilter(body);
  }

  renameFilter(){
    if (this.props.filterData.title !== this.state.newFilterName && this.state.newFilterName.length > 0){
      rebase.updateDoc('/help-filters/'+this.props.filterID, {title: this.state.newFilterName})
    }
  }

  canSaveFilter(){
    if(this.props.filterID===null){
      return true;
    }
    let filter = this.props.filterData;
    return this.props.currentUser.userData.role.value > 1 || (
      filter && filter.createdBy===this.props.currentUser.id
    )
  }


  render() {
    return (
      <div>
        <div className="d-flex m-l-15 m-t-5">
          <button type="button" className="btn-link-reversed" onClick={this.applyFilter.bind(this)}><i className="fa fa-check icon-M"/></button>
          {this.canSaveFilter() &&
            <AddFilter
              filter={{
                requester: this.state.requester.id,
                company: this.state.company.id,
                assigned: this.state.assigned.id,
                workType: this.state.workType.id,
                oneOf: this.state.oneOf.map( (item) => item.value ),

                statusDateFrom: fromMomentToUnix(this.state.statusDateFrom),
                statusDateTo: fromMomentToUnix(this.state.statusDateTo),
                pendingDateFrom: fromMomentToUnix(this.state.pendingDateFrom),
                pendingDateTo: fromMomentToUnix(this.state.pendingDateTo),
                closeDateFrom: fromMomentToUnix(this.state.closeDateFrom),
                closeDateTo: fromMomentToUnix(this.state.closeDateTo),
                deadlineFrom: fromMomentToUnix(this.state.deadlineFrom),
                deadlineTo: fromMomentToUnix(this.state.deadlineTo),
              }}
              filterID={this.props.filterID}
              filterData={this.props.filterData}
              />}
              <button type="button" className="btn-link-reversed m-2" onClick={this.resetFilter.bind(this)}><i className="fa fa-sync icon-M"/></button>
              {this.canSaveFilter() && <button type="button" className="btn-link-reversed m-2" disabled={this.props.filterID===null} onClick={this.deleteFilter.bind(this)}><i className="far fa-trash-alt icon-M"/></button>}
              <button type="button" className="btn-link-reversed m-2" onClick={() => this.props.close()}><i className="fa fa-times icon-M"/></button>
            </div>


            { this.props.filterID!==null  &&
              <div>
                <div className="sidebar-filter-label">
                  Filter name
                </div>
                <div
                  className=""
                  onClick={() => this.setState({openEditName: (this.props.filterID ? true : false)})}
                  >
                  {(!this.state.openEditName || !this.canSaveFilter()) &&
                    <h5 className="sidebar-filter-name">{this.props.filterID?' '+ (this.state.newFilterName ? this.state.newFilterName : this.props.filterData.title):' Všetky'}</h5>
                  }
                  {this.state.openEditName && this.canSaveFilter() &&
                    <Input
                      type="text"
                      className="from-control sidebar-filter-input"
                      placeholder="Enter filter name"
                      autoFocus
                      value={this.state.newFilterName ? this.state.newFilterName : this.props.filterData.title}
                      onChange={(e)=>this.setState({newFilterName: e.target.value})}
                      onBlur={() => this.setState({openEditName: false}, () => this.renameFilter())}
                      />
                  }
                </div>
              </div>
            }

            <div className=" p-r-15 p-l-15 sidebar-filter">
              <div className="sidebar-filter-row">
                <label htmlFor="example-input-small">Zadal</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(this.props.users, 'email'))}
                    onChange={(newValue)=>this.setState({requester:newValue})}
                    value={this.state.requester}
                    styles={invisibleSelectStyleOtherFont} />
                </div>
              </div>
              <div className="sidebar-filter-row">
                <label htmlFor="example-input-small">Firma</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(this.props.companies))}
                    onChange={(company)=>this.setState({company})}
                    value={this.state.company}
                    styles={invisibleSelectStyleOtherFont} />
                </div>
              </div>

              <div className="sidebar-filter-row">
                <label htmlFor="example-input-small">Riesi</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(this.props.users, 'email'))}
                    onChange={(newValue)=>this.setState({assigned:newValue})}
                    value={this.state.assigned}
                    styles={invisibleSelectStyleOtherFont} />
                </div>
              </div>
              <div className="sidebar-filter-row">
                <label>Status change</label>
                <div className="row">
                  <DatePicker
                    className="form-control hidden-input"
                    isClearable
                    selected={this.state.statusDateFrom}
                    onChange={(e)=>{
                      this.setState({statusDateFrom: e})}
                    }
                    placeholderText="No date"
                    {...datePickerConfig}
                    />
                  <DatePicker
                    className="form-control hidden-input"
                    isClearable
                    selected={this.state.statusDateTo}
                    onChange={(e)=>{
                      this.setState({statusDateTo:e})}
                    }
                    placeholderText="No date"
                    {...datePickerConfig}
                    />
                </div>
              </div>
              <div className="sidebar-filter-row">
                <label>Pending date</label>
                <div className="row">
                  <DatePicker
                    className="form-control hidden-input"
                    isClearable
                    selected={this.state.pendingDateFrom}
                    onChange={(e)=>{
                      this.setState({pendingDateFrom:e})}
                    }
                    placeholderText="No date"
                    {...datePickerConfig}
                    />
                  <DatePicker
                    className="form-control hidden-input"
                    isClearable
                    selected={this.state.pendingDateTo}
                    onChange={(e)=>{
                      this.setState({pendingDateTo:e})}
                    }
                    placeholderText="No date"
                    {...datePickerConfig}
                    />
                </div>
              </div>
              <div className="sidebar-filter-row">
                <label>Close date</label>
                <div className="row">
                  <DatePicker
                    className="form-control hidden-input"
                    isClearable
                    selected={this.state.closeDateFrom}
                    onChange={(e)=>{
                      this.setState({closeDateFrom:e})}
                    }
                    placeholderText="No date"
                    {...datePickerConfig}
                    />
                  <DatePicker
                    className="form-control hidden-input"
                    isClearable
                    selected={this.state.closeDateTo}
                    onChange={(e)=>{
                      this.setState({closeDateTo:e})}
                    }
                    placeholderText="No date"
                    {...datePickerConfig}
                    />
                </div>
              </div>

              <div className="sidebar-filter-row">
                <label>Deadline</label>
                <div className="row">
                  <DatePicker
                    className="form-control hidden-input"
                    isClearable
                    selected={this.state.deadlineFrom}
                    onChange={(e)=>{
                      this.setState({deadlineFrom:e})}
                    }
                    placeholderText="No date"
                    {...datePickerConfig}
                    />
                  <DatePicker
                    className="form-control hidden-input"
                    isClearable
                    selected={this.state.deadlineTo}
                    onChange={(e)=>{
                      this.setState({deadlineTo:e})}
                    }
                    placeholderText="No date"
                    {...datePickerConfig}
                    />
                </div>
              </div>

              <div className="sidebar-filter-row">
                <label htmlFor="example-input-small">Typ práce</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null}].concat(toSelArr(this.props.taskTypes))}
                    onChange={(newValue)=>this.setState({workType:newValue})}
                    value={this.state.workType}
                    styles={invisibleSelectStyleOtherFont} />
                </div>
              </div>

              <div className="sidebar-filter-row">
                <label htmlFor="example-input-small">Alebo - jedna splnená stačí</label>
                <div className="flex">
                  <Select
                    options={oneOfOptions}
                    onChange={(oneOf)=>this.setState({oneOf})}
                    value={this.state.oneOf}
                    isMulti
                    styles={invisibleSelectStyleOtherFont} />
                </div>
              </div>
            </div>

          </div>
        )
      }
    }


    const mapStateToProps = ({ filterReducer, storageHelpFilters, storageHelpTaskTypes, storageUsers, storageCompanies, userReducer }) => {
      const { filter } = filterReducer;
      const { filtersActive, filtersLoaded, filters } = storageHelpFilters;
      const { taskTypesActive, taskTypesLoaded, taskTypes } = storageHelpTaskTypes;
      const { usersActive, usersLoaded, users } = storageUsers;
      const { companiesActive, companiesLoaded, companies } = storageCompanies;

      return {
        filter,
        filtersActive, filtersLoaded, filters,
        taskTypesActive, taskTypesLoaded, taskTypes,
        usersActive, usersLoaded, users,
        companiesActive, companiesLoaded, companies,
        currentUser:userReducer
      };
    };

    export default connect(mapStateToProps, { setFilter, storageHelpTaskTypesStart,storageUsersStart, storageCompaniesStart })(Filter);
