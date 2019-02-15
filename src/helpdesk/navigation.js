import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import TaskList from './TaskList';
import TaskListSearch from './TaskListSearch';
import TaskTop from './TaskTop';
import TaskTop2 from './TaskTop2';
import TaskTop3 from './TaskTop3';
import TaskTop4 from './TaskTop4';
import TaskTopChiptask from './TaskTopChiptask';
import TaskSideLeft2 from './TaskSideLeft2';
import TaskSide from './TaskSide';
import TaskSide2 from './TaskSide2';
import TaskSide3 from './TaskSide3';
import TasksTwoEditRow from './TasksTwoEditRow';
import TaskSideLeft from './TaskSideLeft';
import CompaniesList from './settings/CompaniesList';
import CompanyEdit from './settings/CompanyEdit';
import UsersList from './settings/UsersList';
import UserEdit from './settings/UserEdit';
import ProjectsList from './settings/ProjectsList';
import ProjectEdit from './settings/ProjectEdit';
import RolesList from './settings/RolesList';
import RoleEdit from './settings/RoleEdit';
import TypesList from './settings/TypesList';
import TypeEdit from './settings/TypeEdit';
import UnitsList from './settings/UnitsList';
import UnitEdit from './settings/UnitEdit';
import StatusesList from './settings/StatusesList';
import StatusEdit from './settings/StatusEdit';
import Reports from './Reports';


export default class Navigation extends Component {
	render() {
		return (
			<div>
				<div>
					<Sidebar {...this.props} />
					<Route exact path="/helpdesk/taskList" component={TaskList} />
					<Route exact path="/helpdesk/taskListSearch" component={TaskListSearch} />
					<Route exact path="/helpdesk/taskTop" component={TaskTop} />
					<Route exact path="/helpdesk/taskTop2" component={TaskTop2} />
					<Route exact path="/helpdesk/taskTop3" component={TaskTop3} />
					<Route exact path="/helpdesk/taskTop4" component={TaskTop4} />
					<Route exact path="/helpdesk/TaskTopChiptask" component={TaskTopChiptask} />
					<Route exact path="/helpdesk/taskSide" component={TaskSide} />
					<Route exact path="/helpdesk/taskSide2" component={TaskSide2} />
					<Route exact path="/helpdesk/taskSide3" component={TaskSide3} />
					<Route exact path="/helpdesk/tasksTwoEditRow" component={TasksTwoEditRow} />
					<Route exact path="/helpdesk/taskSideLeft" component={TaskSideLeft} />
					<Route exact path="/helpdesk/taskSideLeft2" component={TaskSideLeft2} />
					<Route exact path="/helpdesk/settings/companies" component={CompaniesList} />
					<Route exact path="/helpdesk/settings/companyEdit" component={CompanyEdit} />
					<Route exact path="/helpdesk/settings/users" component={UsersList} />
					<Route exact path="/helpdesk/settings/userEdit" component={UserEdit} />
					<Route exact path="/helpdesk/settings/statuses" component={StatusesList} />
					<Route exact path="/helpdesk/settings/statusEdit" component={StatusEdit} />
					<Route exact path="/helpdesk/settings/projects" component={ProjectsList} />
					<Route exact path="/helpdesk/settings/projectEdit" component={ProjectEdit} />
					<Route exact path="/helpdesk/settings/roles" component={RolesList} />
					<Route exact path="/helpdesk/settings/roleEdit" component={RoleEdit} />
					<Route exact path="/helpdesk/settings/types" component={TypesList} />
					<Route exact path="/helpdesk/settings/typeEdit" component={TypeEdit} />
					<Route exact path="/helpdesk/settings/units" component={UnitsList} />
					<Route exact path="/helpdesk/settings/unitEdit" component={UnitEdit} />
					<Route exact path="/helpdesk/Reports" component={Reports} />
				</div>
			</div>
		);
	}
}
