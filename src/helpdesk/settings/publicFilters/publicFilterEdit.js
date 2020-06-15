import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';

import { connect } from "react-redux";
import Checkbox from 'components/checkbox';
import DatePicker from 'react-datepicker';
import {setFilter, storageHelpTaskTypesStart, storageUsersStart, storageCompaniesStart } from 'redux/actions';
import {toSelArr, sameStringForms, toMomentInput, fromMomentToUnix } from 'helperFunctions';
import datePickerConfig from 'scss/datePickerConfig';

import Select from 'react-select';
import {selectStyle} from 'scss/selectStyles';


const FILTERS = [
  {label:'My tasks',value:1},
  {label:'All tasks',value:2},
  {label:'Assigned tasks',value:3},
];

const ROLES = [
  {label:'Guest',value:-1},
  {label:'User',value:0},
  {label:'Agent',value:1},
  {label:'Manager',value:2},
  {label:'Admin',value:3},
];

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

class PublicFilterEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      name: FILTERS.find(role => role.value.toString() === props.match.params.id).label,
      order: 0,
      roles: [],
    }
    console.log("aaaaaaaaa");
  }

  componentWillReceiveProps(props){
    if (this.props.match.params.id !== props.match.params.id){
      this.setState({
        name: ROLES.find(role => role.value.toString() === props.match.params.id).label,
      })
    }
  }

  componentWillMount(){
  }

  render(){
    console.log("hello");
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="role">Filter name</Label>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="Enter role name"
                value={this.state.name}
                onChange={(e)=>{
                  this.setState({
                    name: e.target.value})
              }}
              />
          </FormGroup>

          <FormGroup>
            <Label for="role">Filter order</Label>
              <Input
                name="name"
                id="name"
                type="number"
                placeholder="Enter role name"
                value={this.state.order}
                onChange={(e)=>{
                  this.setState({
                    order: e.target.value})
              }}
              />
          </FormGroup>

          <FormGroup>
            <Label className="">Roles </Label>
            <Select
              placeholder="Choode roles"
              value={this.state.roles}
              isMulti
              onChange={(roles)=>this.setState({roles})}
              options={ROLES}
              styles={selectStyle}
              />
          </FormGroup>


          <Label className="m-t-15">Filter attributes </Label>
          <hr className="m-t-5 m-b-10"/>

          <FormGroup>
            <label htmlFor="example-input-small">Zadal</label>
            <Select
              options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}]}
              onChange={(newValue)=>this.setState({requester:newValue})}
              value={this.state.requester}
              styles={selectStyle} />
          </FormGroup>

          <FormGroup>
            <label htmlFor="example-input-small">Firma</label>
            <Select
              options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}]}
              onChange={(company)=>this.setState({company})}
              value={this.state.company}
              styles={selectStyle} />
          </FormGroup>

          <FormGroup>
            <label htmlFor="example-input-small">Riesi</label>
            <Select
              options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}]}
              onChange={(newValue)=>this.setState({assigned:newValue})}
              value={this.state.assigned}
              styles={selectStyle} />
          </FormGroup>

          <FormGroup>
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

          <FormGroup>
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

          <FormGroup>
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

        <FormGroup>
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

        <FormGroup>
          <label htmlFor="example-input-small">Typ práce</label>
          <Select
            options={[{label:'Žiadny',value:null,id:null}]}
            onChange={(newValue)=>this.setState({workType:newValue})}
            value={this.state.workType}
            styles={selectStyle} />
        </FormGroup>

        <FormGroup>
          <label htmlFor="example-input-small">Alebo - jedna splnená stačí</label>
          <Select
            options={oneOfOptions}
            onChange={(oneOf)=>this.setState({oneOf})}
            value={this.state.oneOf}
            isMulti
            styles={selectStyle} />
        </FormGroup>

        <Button className="btn" disabled={true} onClick={()=>{}}>{this.state.saving?'Adding...':'Add role'}</Button>

        {this.props.close &&
        <Button className="btn-link"
          onClick={()=>{this.props.close()}}>Cancel</Button>
        }
      </div>
    );
  }
}


export default connect()(PublicFilterEdit);
