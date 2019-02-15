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
					<Route exact path="/demoHelpdesk/taskList" component={TaskList} />
					<Route exact path="/demoHelpdesk/taskListSearch" component={TaskListSearch} />
					<Route exact path="/demoHelpdesk/taskTop" component={TaskTop} />
					<Route exact path="/demoHelpdesk/taskTop2" component={TaskTop2} />
					<Route exact path="/demoHelpdesk/taskTop3" component={TaskTop3} />
					<Route exact path="/demoHelpdesk/taskTop4" component={TaskTop4} />
					<Route exact path="/demoHelpdesk/TaskTopChiptask" component={TaskTopChiptask} />
					<Route exact path="/demoHelpdesk/taskSide" component={TaskSide} />
					<Route exact path="/demoHelpdesk/taskSide2" component={TaskSide2} />
					<Route exact path="/demoHelpdesk/taskSide3" component={TaskSide3} />
					<Route exact path="/demoHelpdesk/tasksTwoEditRow" component={TasksTwoEditRow} />
					<Route exact path="/demoHelpdesk/taskSideLeft" component={TaskSideLeft} />
					<Route exact path="/demoHelpdesk/taskSideLeft2" component={TaskSideLeft2} />
					<Route exact path="/demoHelpdesk/settings/companies" component={CompaniesList} />
					<Route exact path="/demoHelpdesk/settings/companyEdit" component={CompanyEdit} />
					<Route exact path="/demoHelpdesk/settings/users" component={UsersList} />
					<Route exact path="/demoHelpdesk/settings/userEdit" component={UserEdit} />
					<Route exact path="/demoHelpdesk/settings/statuses" component={StatusesList} />
					<Route exact path="/demoHelpdesk/settings/statusEdit" component={StatusEdit} />
					<Route exact path="/demoHelpdesk/settings/projects" component={ProjectsList} />
					<Route exact path="/demoHelpdesk/settings/projectEdit" component={ProjectEdit} />
					<Route exact path="/demoHelpdesk/settings/roles" component={RolesList} />
					<Route exact path="/demoHelpdesk/settings/roleEdit" component={RoleEdit} />
					<Route exact path="/demoHelpdesk/settings/types" component={TypesList} />
					<Route exact path="/demoHelpdesk/settings/typeEdit" component={TypeEdit} />
					<Route exact path="/demoHelpdesk/settings/units" component={UnitsList} />
					<Route exact path="/demoHelpdesk/settings/unitEdit" component={UnitEdit} />
					<Route exact path="/demoHelpdesk/Reports" component={Reports} />
				</div>
			</div>
		);
	}
}
