import React, { Component } from 'react';
import {NavItem, Nav} from 'reactstrap';
import Select from 'react-select';
import { connect } from "react-redux";
import {database} from '../../index';
import {setFilter} from '../../redux/actions';
import {toSelArr, snapshotToArray} from '../../helperFunctions';

const selectStyle = {
  control: base => ({
    ...base,
    minHeight: 30,
    backgroundColor: 'white',
  }),
  dropdownIndicator: base => ({
    ...base,
    padding: 4,
  }),
  clearIndicator: base => ({
    ...base,
    padding: 4,
  }),
  multiValue: base => ({
    ...base,
    backgroundColor: 'white',
  }),
  valueContainer: base => ({
    ...base,
    padding: '0px 6px',
  }),
  input: base => ({
    ...base,
    margin: 0,
    padding: 0,
    backgroundColor: 'white',
  }),
};

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses:[],
      users:[],
      companies:[],
      workTypes:[],
      status:[],
      requester:null,
      company:null,
      assigned:null,
      workType:null,
      statusDateFrom:'',
      statusDateTo:'',
      loading:true
    };
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

  fetchData(){
    Promise.all(
      [
        database.collection('statuses').get(),
        database.collection('users').get(),
        database.collection('companies').get(),
        database.collection('workTypes').get(),
      ]).then(([statuses,users, companies, workTypes])=>{
        this.setData(toSelArr(snapshotToArray(statuses)),toSelArr(snapshotToArray(users),'email'),toSelArr(snapshotToArray(companies)),toSelArr(snapshotToArray(workTypes)));
      });
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
      }
      this.props.setFilter(body);
    }

    render() {
      return (

        <Nav vertical>
          <NavItem>
            <div className="btn-group mb-2">
              <button type="button" className="btn btn-light btn-xs" onClick={this.applyFilter.bind(this)}>Apply</button>
              <button type="button" className="btn btn-light btn-xs">Save</button>
              <button type="button" className="btn btn-light btn-xs">Reset</button>
              <button type="button" className="btn btn-light btn-xs">Delete</button>
            </div>
          </NavItem>

          <NavItem>
            <div className="form-group mb-3">
              <label htmlFor="example-input-small">Status</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.statuses)}
                onChange={(newValue)=>this.setState({status:newValue})}
                value={this.state.status}
                styles={selectStyle} />
            </div>
          </NavItem>
          <NavItem>
            <div className="form-group mb-3">
              <label htmlFor="example-input-small">Zadal</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.users)}
                onChange={(newValue)=>this.setState({requester:newValue})}
                value={this.state.requester}
                styles={selectStyle} />
            </div>
          </NavItem>
          <NavItem>
            <div className="form-group mb-3">
              <label htmlFor="example-input-small">Firma</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.companies)}
                onChange={(newValue)=>this.setState({company:newValue})}
                value={this.state.company}
                styles={selectStyle} />
            </div>
          </NavItem>
          <NavItem>
            <div className="form-group mb-3">
              <label htmlFor="example-input-small">Riesi</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.users)}
                onChange={(newValue)=>this.setState({assigned:newValue})}
                value={this.state.assigned}
                styles={selectStyle} />
            </div>
          </NavItem>
          <NavItem>
            <div className="form-group mb-3">
              <label htmlFor="example-input-small">Status date from</label>
              <input
                type="datetime-local"
                value={this.state.statusDateFrom}
                onChange={(e)=>{
                  this.setState({statusDateFrom:e.target.value})}
                }
                className="form-control form-control-sm active"
                placeholder="Od" />
            </div>
          </NavItem>
          <NavItem>
            <div className="form-group mb-3">
              <label htmlFor="example-input-small">Status date to</label>
              <input
                type="datetime-local"
                value={this.state.statusDateTo}
                onChange={(e)=>{
                  this.setState({statusDateTo:e.target.value})}
                }
                className="form-control form-control-sm active"
                placeholder="Od" />
            </div>
          </NavItem>
          <NavItem>
            <div className="form-group mb-3">
              <label htmlFor="example-input-small">Typ práce</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.workTypes)}
                onChange={(newValue)=>this.setState({workType:newValue})}
                value={this.state.workType}
                styles={selectStyle} />
            </div>
          </NavItem>
        </Nav>
      )
    }
  }


  const mapStateToProps = ({ filterReducer }) => {
    const { filter } = filterReducer;
    return { filter };
  };

  export default connect(mapStateToProps, { setFilter })(Filter);
