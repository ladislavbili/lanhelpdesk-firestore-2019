import React, { Component } from 'react';
import { Input } from 'reactstrap';
import Select from 'react-select';
import { connect } from "react-redux";

import {database, rebase} from '../../index';
import DatePicker from 'react-datepicker';
import {setFilter, storageHelpTaskTypesStart,storageUsersStart, storageCompaniesStart, storageHelpStatusesStart} from '../../redux/actions';
import {toSelArr, snapshotToArray, sameStringForms, toMomentInput, fromMomentToUnix } from '../../helperFunctions';
import AddFilter from './filterAdd';

import datePickerConfig from '../../scss/datePickerConfig';
import {invisibleSelectStyleOtherFont} from '../../scss/selectStyles';

const emptyFilter = {
  status:[],
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
  public:false,
}

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses:[],
      users:[],
      companies:[],
      workTypes:[],
      loading:true,

      ...emptyFilter,

      newFilterName: "",
      openEditName: false,
    };
    this.renameFilter.bind(this);
    this.canSaveFilter.bind(this);
  }

  getItemValue(sourceKey,state,id){
    let value = state[sourceKey].find((item)=>item.id===id);
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
    let oldFilter = this.props.filters.find((filter)=>filter.id===props.filterID);
    let newFilter = props.filters.find((filter)=>filter.id===props.filterID);
    if(this.props.filter.updatedAt!==props.filter.updatedAt||!sameStringForms(oldFilter,newFilter)){
      let filter = props.filter;
      this.setState({
        status:this.state.statuses.filter((status)=>filter.status.includes(status.id)),
        requester:this.getItemValue('users',this.state,filter.requester),
        company:this.getItemValue('companies',this.state,filter.company),
        assigned:this.getItemValue('users',this.state,filter.assigned),
        workType:this.getItemValue('workTypes',this.state,filter.workType),

        statusDateFrom: toMomentInput(filter.statusDateFrom),
        statusDateTo: toMomentInput(filter.statusDateTo),
        pendingDateFrom: toMomentInput(filter.pendingDateFrom),
        pendingDateTo: toMomentInput(filter.pendingDateTo),
        closeDateFrom: toMomentInput(filter.closeDateFrom),
        closeDateTo: toMomentInput(filter.closeDateTo),

        public:newFilter?newFilter.public:false,
      });
    }
    if(!sameStringForms(props.statuses,this.props.statuses)){
			this.setState({statuses:toSelArr(props.statuses)})
		}
    if(!sameStringForms(props.users,this.props.users)){
      this.setState({users:toSelArr(props.users,'email')})
    }
    if(!sameStringForms(props.companies,this.props.companies)){
      this.setState({companies:toSelArr(props.companies)})
    }
    if(!sameStringForms(props.taskTypes,this.props.taskTypes)){
      this.setState({taskTypes:toSelArr(props.taskTypes)})
    }
  }

  componentWillMount(){
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}
		this.setState({statuses:toSelArr(this.props.statuses)});

    if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		this.setState({users:toSelArr(this.props.users,'email')});

    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    this.setState({companies:toSelArr(this.props.companies)});

    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    this.setState({workTypes:toSelArr(this.props.taskTypes)});
  }

  fetchData(){
    Promise.all([
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
    let filter = this.props.filterData.filter;

    this.setState({
      status:this.state.statuses.filter((status)=>filter.status.includes(status.id)),
      requester:this.getItemValue('users',this.state,filter.requester),
      company:this.getItemValue('companies',this.state,filter.company),
      assigned:this.getItemValue('users',this.state,filter.assigned),
      workType:this.getItemValue('workTypes',this.state,filter.workType),

      statusDateFrom: toMomentInput(filter.statusDateFrom),
      statusDateTo: toMomentInput(filter.statusDateTo),
      pendingDateFrom: toMomentInput(filter.pendingDateFrom),
      pendingDateTo: toMomentInput(filter.pendingDateTo),
      closeDateFrom: toMomentInput(filter.closeDateFrom),
      closeDateTo: toMomentInput(filter.closeDateTo),
    });
  }

  applyFilter(){
    let body={
      requester:this.state.requester.id,
      company:this.state.company.id,
      assigned:this.state.assigned.id,
      workType:this.state.workType.id,
      status:this.state.status.map((item)=>item.id),

      statusDateFrom: fromMomentToUnix(this.state.statusDateFrom),
      statusDateTo: fromMomentToUnix(this.state.statusDateTo),
      closeDateFrom: fromMomentToUnix(this.state.closeDateFrom),
      closeDateTo: fromMomentToUnix(this.state.closeDateTo),
      pendingDateFrom: fromMomentToUnix(this.state.pendingDateFrom),
      pendingDateTo: fromMomentToUnix(this.state.pendingDateTo),

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
                    requester:this.state.requester.id,
                    company:this.state.company.id,
                    assigned:this.state.assigned.id,
                    workType:this.state.workType.id,
                    status:this.state.status.map((item)=>item.id),
                    statusDateFrom: fromMomentToUnix(this.state.statusDateFrom),
                    statusDateTo: fromMomentToUnix(this.state.statusDateTo),
                    pendingDateFrom: fromMomentToUnix(this.state.pendingDateFrom),
                    pendingDateTo: fromMomentToUnix(this.state.pendingDateTo),
                    closeDateFrom: fromMomentToUnix(this.state.closeDateFrom),
                    closeDateTo: fromMomentToUnix(this.state.closeDateTo),
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
                <label htmlFor="example-input-small">Status</label>
                {
                  this.state.statuses.map(status =>
                    <div className="row  m-b-5" key={status.id}>
                      <label className="custom-container">
                        <input
                          type="checkbox"
                          checked={this.state.status.find(s => s.id === status.id)}
                          onChange={(e) => {
                            let checked = this.state.status.find(s => s.id === status.id);
                            let newStatus = [];
                            if (checked){
                              newStatus = this.state.status.filter(s => s.id !== status.id);
                            } else {
                              newStatus = [...this.state.status, status];
                            }
                            this.setState({
                              status: newStatus,
                            })
                          }
                        } />
                      <span className="checkmark" > </span>
                    </label>
                    <span className="m-l-30 sidebar-filter-name">{status.title}</span>
                    </div>
                  )
                }
              </div>

              <div className="sidebar-filter-row">
                <label htmlFor="example-input-small">Zadal</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(this.state.users)}
                    onChange={(newValue)=>this.setState({requester:newValue})}
                    value={this.state.requester}
                    styles={invisibleSelectStyleOtherFont} />
                </div>
              </div>
              <div className="sidebar-filter-row">
                <label htmlFor="example-input-small">Firma</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(this.state.companies)}
                    onChange={(newValue)=>this.setState({company:newValue})}
                    value={this.state.company}
                    styles={invisibleSelectStyleOtherFont} />
                </div>
              </div>

              <div className="sidebar-filter-row">
                <label htmlFor="example-input-small">Riesi</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(this.state.users)}
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
              <label htmlFor="example-input-small">Typ práce</label>
              <div className="flex">
                <Select
                  options={[{label:'Žiadny',value:null,id:null}].concat(this.state.workTypes)}
                  onChange={(newValue)=>this.setState({workType:newValue})}
                  value={this.state.workType}
                  styles={invisibleSelectStyleOtherFont} />
              </div>
            </div>
        </div>

      </div>
      )
    }
  }


  const mapStateToProps = ({ filterReducer, storageHelpFilters, storageHelpTaskTypes, storageUsers, storageCompanies, storageHelpStatuses, userReducer }) => {
    const { filter } = filterReducer;
    const { filters,filtersLoaded } = storageHelpFilters;
    const { taskTypesActive, taskTypes } = storageHelpTaskTypes;
    const { usersActive, users } = storageUsers;
    const { companiesActive, companies } = storageCompanies;
    const { statusesActive, statuses } = storageHelpStatuses;

    return { filter,
      filters,filtersLoaded,
      taskTypesActive, taskTypes,
      usersActive, users,
      companiesActive, companies,
      statusesActive, statuses,
      currentUser:userReducer
     };
  };

  export default connect(mapStateToProps, { setFilter, storageHelpTaskTypesStart,storageUsersStart, storageCompaniesStart, storageHelpStatusesStart })(Filter);
