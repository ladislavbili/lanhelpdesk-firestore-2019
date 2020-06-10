import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from "react-redux";
import { Label, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
//import CKEditor4 from 'ckeditor4-react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Attachments from '../components/attachments.js';
import Comments from '../components/comments.js';
//import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';

import VykazyTable from '../components/vykazyTable';

import UserAdd from '../settings/users/userAdd';
import CompanyAdd from '../settings/companies/companyAdd';

import TaskAdd from './taskAddContainer';
import TaskPrint from './taskPrint';
import classnames from "classnames";
import {rebase, database} from '../../index';
import firebase from 'firebase';
import ck5config from '../../scss/ck5config';
//import ck4config from '../../scss/ck4config';
import datePickerConfig from '../../scss/datePickerConfig';
import PendingPicker from '../components/pendingPicker';
import {toSelArr, snapshotToArray, timestampToString, sameStringForms} from '../../helperFunctions';
import { storageCompaniesStart, storageHelpPricelistsStart, storageHelpPricesStart,storageHelpProjectsStart, storageHelpStatusesStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageHelpTasksStart, storageHelpUnitsStart,storageHelpWorkTypesStart, storageMetadataStart, storageUsersStart, storageHelpMilestonesStart, storageHelpTripTypesStart } from '../../redux/actions';
import {invisibleSelectStyleNoArrow, invisibleSelectStyleNoArrowColored,invisibleSelectStyleNoArrowColoredRequired, invisibleSelectStyleNoArrowRequired} from '../../scss/selectStyles';
import { REST_URL } from 'config';

const noMilestone = {id:null,value:null,title:'None',label:'None',startsAt:null};
const booleanSelects = [{value:false,label:'No'},{value:true,label:'Yes'}];

const noDef={
	status:{def:false, fixed:false, value: null, show: true },
	tags:{def:false, fixed:false, value: [], show: true },
	assignedTo:{def:false, fixed:false, value: [], show: true },
	type:{def:false, fixed:false, value: null, show: true },
	requester:{def:false, fixed:false, value: null, show: true },
	company:{def:false, fixed:false, value: null, show: true },
	pausal:{def:false, fixed:false, value: booleanSelects[0], show: true },
	overtime:{def:false, fixed:false, value: booleanSelects[0], show: true },
}

class MultipleTaskEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layout: "1",

			saving:false,
			loading:true,
			addItemModal:false,
			tasks:[],

			users:[],
			companies:[],
			workTypes:[],
			statuses:[],
			projects:[],
			milestones:[noMilestone],
			units:[],
			allTags:[],
			taskTypes:[],
			tripTypes:[],
			defaultUnit:null,
			defaultFields:noDef,
			history:[],

			company:null,
			workHours:'0',
			requester:null,
			assignedTo:[],
			status:null,
			statusChange:null,
			deadline:null,
			closeDate:null,
			pendingDate:null,
			pendingChangable:false,
			invoicedDate:'',
			reminder:null,
			project:null,
			tags:[],
			pausal:booleanSelects[0],
			overtime:booleanSelects[0],
			type:null,
			createdAt:null,
			repeat:null,
			milestone:noMilestone,
			attachments:[],

			/////
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			openCopyModal: false,
			toggleTab:"1",
			pendingOpen:false,
			pendingStatus:null,
			important:false,

			openUserAdd: false,
			openCompanyAdd: false,
			viewOnly:true,
			print: false,
			showDescription:false,
			newHistoryEntery:null,
		};

//    this.fetchData(this.props.match.params.taskID);
	}

	//Renders
	render() {

		return (
			<div className="flex">
				<Button
					className="btn sidebar-btn"
					onClick={()=>{this.props.close()}}
				>  Cancel
				</Button>
			</div>
		);
	}


}

const mapStateToProps = ({ userReducer, storageCompanies, storageHelpPricelists, storageHelpPrices, storageHelpProjects, storageHelpStatuses, storageHelpTags, storageHelpTaskTypes, storageHelpTasks, storageHelpUnits, storageHelpWorkTypes, storageMetadata, storageUsers, storageHelpMilestones, storageHelpTripTypes }) => {
	const { companiesLoaded, companiesActive, companies } = storageCompanies;
	const { pricelistsLoaded, pricelistsActive, pricelists } = storageHelpPricelists;
	const { pricesLoaded, pricesActive, prices } = storageHelpPrices;
	const { projectsLoaded, projectsActive, projects } = storageHelpProjects;
	const { statusesLoaded, statusesActive, statuses } = storageHelpStatuses;
	const { tagsLoaded, tagsActive, tags } = storageHelpTags;
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { tasksLoaded, tasksActive, tasks } = storageHelpTasks;
	const { unitsLoaded, unitsActive, units } = storageHelpUnits;
	const { workTypesLoaded, workTypesActive, workTypes } = storageHelpWorkTypes;
	const { metadataLoaded, metadataActive, metadata } = storageMetadata;
	const { usersLoaded, usersActive, users } = storageUsers;
	const { milestonesLoaded, milestonesActive, milestones } = storageHelpMilestones;
  const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;

	return {
		currentUser:userReducer,
		companiesLoaded, companiesActive, companies,
		pricelistsLoaded, pricelistsActive, pricelists,
		pricesLoaded, pricesActive, prices,
		projectsLoaded, projectsActive, projects,
		statusesLoaded, statusesActive, statuses,
		tagsLoaded, tagsActive, tags,
		taskTypesLoaded, taskTypesActive, taskTypes,
		tasksLoaded, tasksActive, tasks,
		unitsLoaded, unitsActive, units,
		workTypesLoaded, workTypesActive, workTypes,
		metadataLoaded, metadataActive, metadata,
		usersLoaded, usersActive, users,
		milestonesLoaded, milestonesActive, milestones,
		tripTypesActive, tripTypes, tripTypesLoaded,
	 };
};

export default connect(mapStateToProps, { storageCompaniesStart, storageHelpPricelistsStart, storageHelpPricesStart,storageHelpProjectsStart, storageHelpStatusesStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageHelpTasksStart, storageHelpUnitsStart,storageHelpWorkTypesStart, storageMetadataStart, storageUsersStart, storageHelpMilestonesStart, storageHelpTripTypesStart })(MultipleTaskEdit);
