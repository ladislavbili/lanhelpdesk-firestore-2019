import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink} from 'reactstrap';
import classnames from 'classnames';
import { NavLink as Link } from 'react-router-dom';
import SelectPage from '../SelectPage';
import TaskAdd from './task/taskAdd';
import Filter from './components/filter';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			activeTab:0
		};
	}
	render() {
		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<div id="sidebar-menu">
						<li className="menu-title" style={{ paddingBottom: '0px !important' }}>
							Project
							<span className="pull-right">
								<i className="fa fa-plus" />
							</span>
						</li>
						<li className="menu-title" style={{ paddingTop: '0px !important' }}>
							<button
								type="button"
								className="btn btn-outline-secondary btn-rounded waves-effect"
								style={{ width: 210, textAlign: 'left' }}
								>
								<i className="fa fa-folder-open" /> ALL PROJECTS
								</button>
							</li>
							<TaskAdd />
							<hr />
							<Nav tabs>
								<NavItem>
									<NavLink
										className={classnames({ active: this.state.activeTab === 0 })}
										onClick={() => this.setState({activeTab:0})}
										>
										FILTERS
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										className={classnames({ active: this.state.activeTab === 1 })}
										onClick={() => this.setState({activeTab:1})}
										>
										EDIT
									</NavLink>
								</NavItem>
							</Nav>
							<TabContent activeTab={this.state.activeTab} style={{ padding: 20 }}>
								<TabPane tabId={0}>
									<Nav vertical>
										<NavItem>
											<Link to={{ pathname: `` }}>Všetky</Link>
										</NavItem>

									</Nav>
								</TabPane>
								<TabPane tabId={1}>
									<Filter />
								</TabPane>
							</TabContent>
						</div>
					</div>
				</div>
			);
		}
	}
