import React, { Component } from 'react';
import { connect } from "react-redux";
import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray, sameStringForms } from '../../helperFunctions';
import { Modal, ModalBody, Button } from 'reactstrap';
import TaskAdd from './taskAdd';
import {storageHelpStatusesStart, storageHelpProjectsStart, storageUsersStart, storageCompaniesStart, storageHelpWorkTypesStart, storageHelpUnitsStart, storageHelpPricesStart, storageHelpPricelistsStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageMetadataStart} from '../../redux/actions';

class TaskAddContainer extends Component{
  constructor(props){
    super(props);
    this.state={
			openAddTaskModal: false,
      loading: true,

      statuses: [],
      projects: [],
      users: [],
      companies: [],
      workTypes: [],
      taskTypes: [],
      allTags: [],
      units: [],

      defaultUnit: null,
    }
    this.setData.bind(this);
  }

  componentWillReceiveProps(props){
		if(!sameStringForms(props.statuses,this.props.statuses)||
      !sameStringForms(props.projects,this.props.projects)||
      !sameStringForms(props.users,this.props.users)||
      !sameStringForms(props.companies,this.props.companies)||
      !sameStringForms(props.workTypes,this.props.workTypes)||
      !sameStringForms(props.units,this.props.units)||
      !sameStringForms(props.prices,this.props.prices)||
      !sameStringForms(props.pricelists,this.props.pricelists)||
      !sameStringForms(props.tags,this.props.tags)||
      !sameStringForms(props.taskTypes,this.props.taskTypes)||
      !sameStringForms(props.metadata,this.props.metadata)
    ){
      this.setData();
		}
	}

  componentWillMount(){
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }

    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }

    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }

    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }

    if(!this.props.workTypesActive){
      this.props.storageHelpWorkTypesStart();
    }

    if(!this.props.unitsActive){
      this.props.storageHelpUnitsStart();
    }

    if(!this.props.pricesActive){
      this.props.storageHelpPricesStart();
    }

    if(!this.props.priceListsActive){
      this.props.storageHelpPricelistsStart();
    }

    if(!this.props.tagsActive){
      this.props.storageHelpTagsStart();
    }

    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    if(!this.props.metadataActive){
      this.props.storageMetadataStart();
    }
    this.setData();
  }

    setData(){
      let statuses = toSelArr(this.props.statuses);
      let projects = toSelArr(this.props.projects);
      let users = toSelArr(this.props.users,'email');
      let companies = toSelArr(this.props.companies);
      let workTypes = toSelArr(this.props.workTypes);
      let units = toSelArr(this.props.units);
      let prices = this.props.prices;
      let pricelists = this.props.pricelists;
      let tags = toSelArr(this.props.tags);
      let taskTypes = toSelArr(this.props.taskTypes);
      let defaultUnit = this.props.metadata?this.props.metadata.defaultUnit:null;
      if(defaultUnit===null){
        return;
      }
      let newCompanies=companies.map((company)=>{
        let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
        return newCompany;
      });
      let newWorkTypes=workTypes.map((workType)=>{
        let newWorkType = {...workType, prices:prices.filter((price)=>price.workType===workType.id)}
        return newWorkType;
      });

      this.setState({
        statuses,
        projects,
        users,
        companies:newCompanies,
        workTypes:newWorkTypes,
        taskTypes,
        allTags:tags,

        units,

        loading:false,

        defaultUnit
      });
    }

  render(){
	  return (
			<div className="display-inline">
			{
				!this.props.task &&
				<Button
					className="btn sidebar-btn"
					onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}
				>  Add task
				</Button>
			}

			{
				this.props.task &&
				<button
					type="button"
					className="btn btn-link waves-effect"
					disabled={this.props.disabled}
					onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}>
					<i
						className="far fa-copy"
						/> Copy
				</button>
			}


			<Modal size="width-1000"  isOpen={this.state.openAddTaskModal} toggle={()=>{this.setState({openAddTaskModal:!this.state.openAddTaskModal})}} >
					<ModalBody>
            {  this.state.openAddTaskModal &&
						   <TaskAdd {...this.props}
                 loading={this.state.loading}
                 statuses={this.state.statuses}
                 projects={this.state.projects}
                 users={this.state.users}
                 companies={this.state.companies}
                 workTypes={this.state.workTypes}
                 taskTypes={this.state.taskTypes}
                 allTags={this.state.allTags}
                 units={this.state.units}
                 defaultUnit={this.state.defaultUnit}
                 closeModal={ () => this.setState({openAddTaskModal: false,})}
                 />
            }
					</ModalBody>
				</Modal>
		</div>
    );
  }
}

const mapStateToProps = ({ filterReducer, taskReducer, storageHelpStatuses, storageHelpProjects,storageUsers,storageCompanies,storageHelpWorkTypes,storageHelpUnits,storageHelpPrices,storageHelpPricelists,storageHelpTags,storageHelpTaskTypes, storageMetadata }) => {
	const { project, filter } = filterReducer;
	const { orderBy, ascending } = taskReducer;

  const { statusesActive, statuses } = storageHelpStatuses;
  const { projectsActive, projects } = storageHelpProjects;
  const { usersActive, users } = storageUsers;
  const { companiesActive, companies } = storageCompanies;
  const { workTypesActive, workTypes } = storageHelpWorkTypes;
  const { unitsActive, units } = storageHelpUnits;
  const { pricesActive, prices } = storageHelpPrices;
  const { pricelistsActive, pricelists } = storageHelpPricelists;
  const { tagsActive, tags } = storageHelpTags;
  const { taskTypesActive, taskTypes } = storageHelpTaskTypes;
  const { metadataActive, metadata } = storageMetadata;

	return { project, filter,orderBy,ascending, statusesActive, statuses, projectsActive, projects, usersActive, users, companiesActive, companies, workTypesActive, workTypes, unitsActive, units, pricesActive, prices, pricelistsActive, pricelists, tagsActive, tags, taskTypesActive, taskTypes, metadataActive, metadata };
};

export default connect(mapStateToProps, { storageHelpStatusesStart, storageHelpProjectsStart, storageUsersStart, storageCompaniesStart, storageHelpWorkTypesStart, storageHelpUnitsStart, storageHelpPricesStart, storageHelpPricelistsStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageMetadataStart})(TaskAddContainer);
