import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Alert } from 'reactstrap';

import { connect } from "react-redux";
import DatePicker from 'react-datepicker';
import datePickerConfig from 'scss/datePickerConfig';
import Checkbox from 'components/checkbox';
import {rebase} from 'index';

import Select from 'react-select';
import {selectStyle} from 'scss/selectStyles';
import {
  storageUsersStart,
  storageCompaniesStart,
  storageHelpTaskTypesStart,
  storageHelpProjectsStart,
} from 'redux/actions';
import roles from '../roles/roles';
import { toMomentInput, toSelArr, filterProjectsByPermissions, fromMomentToUnix } from 'helperFunctions';

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

class PublicFilterAdd extends Component{
  constructor(props){
    super(props);
    this.state = {
      global:false,
      dashboard:false,
      order: 0,
      roles: [],
      title: '',
      project: null,
      ...emptyFilter,

      saving: false,
    }
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

    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
  }

  storageLoaded(props){
    return (
      props.taskTypesLoaded &&
      props.usersLoaded &&
      props.companiesLoaded &&
      props.projectsLoaded
    )
  }

  cantSaveFilter(){
    return this.state.saving || this.state.title === "" || (!this.state.global && this.state.project === null) || isNaN(parseInt(this.state.order))
  }

  submit(){
    this.setState({ saving: true })
    let body = {
      title: this.state.title,
      order: this.state.order,
      public: true,
      global: this.state.global,
      dashboard: this.state.dashboard,
      project: this.state.project !==null ? this.state.project.id : null,
      filter: {
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
      },
    }
    rebase.addToCollection('/help-filters', body).then(()=> {
      this.setState({
        ...emptyFilter,
        global:false,
        dashboard:false,
        order: 0,
        roles: [],
        title: '',
        project: null,
        saving: false,
      });
    });
  }

  render(){
    if( !this.storageLoaded(this.props) ){
      return <Alert color="success">
        Loading data...
      </Alert>
    }
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <FormGroup> {/* Title */}
          <Label for="role">Filter name</Label>
          <Input
            name="name"
            id="name"
            type="text"
            placeholder="Enter role name"
            value={this.state.title}
            onChange={(e)=>{
              this.setState({title: e.target.value})
            }}
            />
        </FormGroup>

        <FormGroup>{/* Order */}
          <Label for="role">Filter order</Label>
          <Input
            name="name"
            id="name"
            type="number"
            placeholder="Enter filter order"
            value={this.state.order}
            onChange={(e)=>{
              this.setState({
                order: e.target.value})
              }}
              />
          </FormGroup>

          {/* Global */}
          <Checkbox
            className = "m-l-5 m-r-5"
            label = "Global (shown in all projects)"
            value = { this.state.global }
            onChange={(e)=>this.setState({global:!this.state.global })}
            />

          <div className="m-b-10">{/* Project */}
            <Label className="form-label">Projekt</Label>
            <Select
              placeholder="Vyberte projekt"
              value={this.state.project}
              isDisabled={this.state.global}
              onChange={(project)=> {
                this.setState({ project });
              }}
              options={filterProjectsByPermissions(this.props.projects, this.props.currentUser)}
              styles={selectStyle}
              />
          </div>

          {/* Dashboard */}
          <Checkbox
            className = "m-l-5 m-r-5"
            label = "Dashboard (shown in dashboard)"
            value = { this.state.dashboard }
            onChange={(e)=>this.setState({dashboard:!this.state.dashboard })}
            />

          <FormGroup>{/* Roles */}
            <Label className="">Roles</Label>
            <Select
              placeholder="Choose roles"
              value={this.state.roles}
              isMulti
              onChange={(newRoles)=>{
                if(newRoles.some((role) => role.id === 'all' )){
                  if( this.state.roles.length === roles.length ){
                    this.setState({ roles: [] })
                  }else{
                    this.setState({ roles: toSelArr(roles) })
                  }
                }else{
                  this.setState({roles: newRoles})
                }
              }}
              options={toSelArr([{id: 'all', title: this.state.roles.length === roles.length ? 'Clear' : 'All' }].concat(roles))}
              styles={selectStyle}
              />
          </FormGroup>


          <Label className="m-t-15">Filter attributes</Label>
          <hr className="m-t-5 m-b-10"/>

          <FormGroup>{/* Requester */}
            <label>Zadal</label>
            <Select
              id="select-requester"
              options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(this.props.users, 'email'))}
              onChange={ (requester) => this.setState({requester}) }
              value={this.state.requester}
              styles={selectStyle} />
          </FormGroup>

          <FormGroup>{/* Company */}
            <label>Firma</label>
            <Select
              options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(this.props.companies))}
              onChange={ (company) => this.setState({company}) }
              value={this.state.company}
              styles={selectStyle} />
          </FormGroup>

          <FormGroup>{/* Assigned */}
            <label>Riesi</label>
            <Select
              options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(this.props.users, 'email'))}
              onChange={(newValue)=>this.setState({assigned:newValue})}
              value={this.state.assigned}
              styles={selectStyle}
              />
          </FormGroup>

          <FormGroup>{/* Status Date */}
            <label>Status change</label>
            <div className="row public-filters">
              <DatePicker
                className="form-control"
                isClearable
                selected={this.state.statusDateFrom}
                onChange={(e)=>{
                  this.setState({statusDateFrom: e})}
                }
                placeholderText="No date"
                {...datePickerConfig}
                />
              <DatePicker
                className="form-control"
                isClearable
                selected={this.state.statusDateTo}
                onChange={(e)=>{
                  this.setState({statusDateTo:e})}
                }
                placeholderText="No date"
                {...datePickerConfig}
                />
            </div>
          </FormGroup>

          <FormGroup>{/* Pending Date */}
            <label>Pending date</label>
            <div className="row public-filters">
              <DatePicker
                className="form-control"
                isClearable
                selected={this.state.pendingDateFrom}
                onChange={(e)=>{
                  this.setState({pendingDateFrom:e})}
                }
                placeholderText="No date"
                {...datePickerConfig}
                />
              <DatePicker
                className="form-control"
                isClearable
                selected={this.state.pendingDateTo}
                onChange={(e)=>{
                  this.setState({pendingDateTo:e})}
                }
                placeholderText="No date"
                {...datePickerConfig}
                />
            </div>
          </FormGroup>

          <FormGroup>{/* Close Date */}
            <label>Close date</label>
            <div className="row public-filters">
              <DatePicker
                className="form-control"
                isClearable
                selected={this.state.closeDateFrom}
                onChange={(e)=>{
                  this.setState({closeDateFrom:e})}
                }
                placeholderText="No date"
                {...datePickerConfig}
                />
              <DatePicker
                className="form-control"
                isClearable
                selected={this.state.closeDateTo}
                onChange={(e)=>{
                  this.setState({closeDateTo:e})}
                }
                placeholderText="No date"
                {...datePickerConfig}
                />
            </div>
          </FormGroup>

          <FormGroup>{/* Deadline */}
            <label>Deadline</label>
            <div className="row public-filters">
              <DatePicker
                className="form-control m-r-5"
                isClearable
                selected={this.state.deadlineFrom}
                onChange={(e)=>{
                  this.setState({deadlineFrom:e})}
                }
                placeholderText="No date"
                {...datePickerConfig}
                />
              <DatePicker
                className="form-control"
                isClearable
                selected={this.state.deadlineTo}
                onChange={(e)=>{
                  this.setState({deadlineTo:e})}
                }
                placeholderText="No date"
                {...datePickerConfig}
                />
            </div>
          </FormGroup>

          <FormGroup>{/* Work Type */}
            <label htmlFor="example-input-small">Typ práce</label>
            <Select
              options={[{label:'Žiadny',value:null,id:null}].concat(toSelArr(this.props.taskTypes))}
              onChange={(newValue)=>this.setState({workType:newValue})}
              value={this.state.workType}
              styles={selectStyle} />
          </FormGroup>

          <FormGroup>{/* One Of */}
            <label htmlFor="example-input-small">Alebo - jedna splnená stačí</label>
            <Select
              options={oneOfOptions}
              onChange={(oneOf)=>this.setState({oneOf})}
              value={this.state.oneOf}
              isMulti
              styles={selectStyle} />
          </FormGroup>

          <Button className="btn" disabled={this.cantSaveFilter()} onClick={this.submit.bind(this)}>{this.state.saving?'Adding...':'Add filter'}</Button>
        </div>
      );
    }
  }

  const mapStateToProps = ({
    storageHelpFilters,
    storageHelpTaskTypes,
    storageUsers,
    storageCompanies,
    storageHelpProjects,
    userReducer
    }) => {
    const { filtersActive, filtersLoaded, filters } = storageHelpFilters;
    const { taskTypesActive, taskTypesLoaded, taskTypes } = storageHelpTaskTypes;
    const { usersActive, usersLoaded, users } = storageUsers;
    const { companiesActive, companiesLoaded, companies } = storageCompanies;
    const { projectsActive, projects, projectsLoaded } = storageHelpProjects;
    return {
      filtersActive, filtersLoaded, filters,
      taskTypesActive, taskTypesLoaded, taskTypes,
      usersActive, usersLoaded, users,
      companiesActive, companiesLoaded, companies,
      projectsActive, projects, projectsLoaded,
      currentUser:userReducer
    };
  };

  export default connect(mapStateToProps, {
    storageUsersStart,
    storageCompaniesStart,
    storageHelpTaskTypesStart,
    storageHelpProjectsStart,
  })(PublicFilterAdd);
