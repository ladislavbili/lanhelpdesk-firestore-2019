import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../components/SelectPage';
import TaskAdd from './task/taskAddContainer';
import Filter from './components/filter';
import ProjectEdit from './components/projects/projectEdit';
import ProjectAdd from './components/projects/projectAdd';
import MilestoneEdit from './components/milestones/milestoneEdit';
import MilestoneAdd from './components/milestones/milestoneAdd';
import {toSelArr, sameStringForms,testing} from '../helperFunctions';
import {setProject, setMilestone, setFilter, storageHelpFiltersStart, storageHelpProjectsStart, storageHelpMilestonesStart} from '../redux/actions';

import {sidebarSelectStyle} from '../scss/selectStyles';

let settings=[
{title:'Users',link:'users'},
{title:'Companies',link:'companies'},
{title:'Projects',link:'projects'},
{title:'Statuses',link:'statuses'},
{title:'Units',link:'units'},
{title:'Work Type',link:'workTypes'},
{title:'Prices',link:'pricelists'},
{title:'Supplier',link:'suppliers'},
{title:'Tags',link:'tags'},
{title:'Invoices',link:'supplierInvoices'},
{title:'Task types',link:'taskTypes'},
{title:'Imaps',link:'imaps'},
{title:'SMTPs',link:'smtps'},
]

const dashboard = {id:null,title:'Dashboard', label:'Dashboard',value:null};
const addProject = {id:-1,title:'+ Add project', label:'+ Add project',value:-1};
const allMilestones = {id:null,title:'Any', label:'Any',value:null};
const addMilestone = {id:-1,title:'+ Add milestone', label:'+ Add milestone',value:-1};

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			openProjectAdd: false,
			openMilestoneAdd: false,
			isColumn: false,
			filters:[],
			search: '',
			activeTab:0,
			projects:this.props.currentUser.userData.isAgent?[dashboard,addProject]:[dashboard],
			project:dashboard,
			milestones:[allMilestones],
			milestone:allMilestones,
			filterID:null,
			filterData:null,

			projectChangeDate:(new Date()).getTime(),
			milestoneChangeDate:(new Date()).getTime(),
		};
	}

	componentWillReceiveProps(props){
		if(!sameStringForms(props.filters,this.props.filters)){
			this.setState({filters:props.filters})
		}
		if(!sameStringForms(props.projects,this.props.projects)||!sameStringForms(this.props.currentUser,props.currentUser)){
			let project = toSelArr([dashboard].concat(props.projects)).find((item)=>item.id===props.project);
			this.setState({
				projects:toSelArr([dashboard].concat(props.projects).concat(props.currentUser.userData.isAgent?[addProject]:[])),
				project:project?project:dashboard
			});
		}
		if(!sameStringForms(props.milestones,this.props.milestones)||!sameStringForms(this.props.currentUser,props.currentUser)){
			let milestone = toSelArr([allMilestones].concat(props.milestones)).find((item)=>item.id===props.milestone);
			this.setState({
				milestones:toSelArr([allMilestones].concat(props.milestones)),
				milestone:milestone?milestone:dashboard
			});
		}
	}

	componentWillMount(){
		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		this.setState({
			projects:toSelArr([dashboard].concat(this.props.projects).concat(this.props.currentUser.userData.isAgent?[addProject]:[])),
			project:toSelArr([dashboard].concat(this.props.projects)).find((item)=>item.id===this.props.project)
		});

		if(!this.props.milestonesActive){
			this.props.storageHelpMilestonesStart();
		}
		this.setState({
			milestones:toSelArr([allMilestones].concat(this.props.milestones)),
			milestone:toSelArr([allMilestones].concat(this.props.milestones)).find((item)=>item.id===this.props.milestone)
		});

		if(!this.props.filtersActive){
			this.props.storageHelpFiltersStart();
		}
		this.setState({filters:this.props.filters});
	}

	render() {
		let showSettings= this.props.history.location.pathname.includes('settings')&&(this.props.currentUser.userData.isAdmin||testing);
		let managesProjects = this.state.project.id!==null && this.state.project.id!==-1 && (
			this.props.currentUser.userData.isAgent || testing ||
			(this.state.project.permissions.find((permission)=>permission.user===this.props.currentUser.id)!==undefined && this.state.project.permissions.find((permission)=>permission.user===this.props.currentUser.id).isAdmin)
		);
		let addsMilestones = this.state.project.id!==null && this.state.project.id!==-1 && (
			this.props.currentUser.userData.isAgent || testing ||
			(this.state.project.permissions.find((permission)=>permission.user===this.props.currentUser.id)!==undefined && this.state.project.permissions.find((permission)=>permission.user===this.props.currentUser.id).write)
		);
		return (
			<div className="sidebar">
					<SelectPage />
				<div className="sidebar-content scrollable fit-with-header">
					{!showSettings && <div>
						<div>
						<li>
							<Select
								options={this.state.projects.filter((project)=>{
									let curr = this.props.currentUser;
									if((curr.userData && curr.userData.isAgent)||(project.id===-1||project.id===null)){
										return true;
									}
									let permission = project.permissions.find((permission)=>permission.user===curr.id);
									return permission && permission.read;
								})}
								value={this.state.project}
								styles={sidebarSelectStyle}
								onChange={e => {
									if (e.id === -1) {
										this.setState({openProjectAdd: true})
									} else {
										this.setState({project:e,milestone:allMilestones});
										this.props.setProject(e.value);
										this.props.setMilestone(null);
									}
								}}
								components={{
									DropdownIndicator: ({ innerProps, isDisabled }) =>
									<div style={{marginTop: "-15px"}}>
										<i className="fa fa-folder-open" style={{position:'absolute', left:15, color: "#212121"}}/>
										<i className="fa fa-chevron-down" style={{position:'absolute', right:15, color: "#212121"}}/>
									</div>
								}}
								/>
						</li>
						<hr/>
							{ this.props.project!==null && this.props.project!==-1 && <li>
								<Select
									options={this.state.milestones.concat(addsMilestones?[addMilestone]:[])
										.filter((milestone)=> milestone.id===-1|| milestone.id===null|| milestone.project===this.props.project)}
									value={this.state.milestone}
									styles={sidebarSelectStyle}
									onChange={e => {
										if (e.id === -1) {
											this.setState({openMilestoneAdd: true})
										} else {
											this.setState({milestone:e});
											this.props.setMilestone(e.value);
										}
									}}
									components={{
										DropdownIndicator: ({ innerProps, isDisabled }) =>
										<div style={{marginTop: "-15px"}}>
											<i className="fa fa-folder-open" style={{position:'absolute', left:15, color: "#212121"}}/>
											<i className="fa fa-chevron-down" style={{position:'absolute', right:15, color: "#212121"}}/>
										</div>,
									}}
									/>
							</li>}

						<TaskAdd history={this.props.history} project={this.state.projects.map((item)=>item.id).includes(this.state.project.id)?this.state.project.id:null} triggerDate={this.state.projectChangeDate} />
							{ this.state.openProjectAdd &&
								<ProjectAdd close={() => this.setState({openProjectAdd: false})}/>
							}
							{ managesProjects &&
								<ProjectEdit item={this.state.project} triggerChange={()=>{this.setState({projectChangeDate:(new Date()).getTime()})}}/>
							}
							{ this.state.openMilestoneAdd &&
								<MilestoneAdd close={() => this.setState({openMilestoneAdd: false})}/>
							}
							{ this.state.milestone.id &&
								this.state.milestones.map((item)=>item.id).includes(this.state.milestone.id) &&
								<MilestoneEdit item={this.state.milestone} triggerChange={()=>{this.setState({milestoneChangeDate:(new Date()).getTime()})}}/>
							}


						<div
							className="sidebar-btn"
							>
							<div
								onClick={() => this.setState({activeTab: (this.state.activeTab === 0 ? 1 : 0)})}>
								<i className="fa fa-plus pull-right m-r-5 m-t-5 clickable" />
							</div>
						 	<div><i className="fas fa-filter sidebar-icon-center" ></i>Filters</div>
						</div>

							<TabContent activeTab={this.state.activeTab}>
								<TabPane tabId={0} >
									<Nav vertical>
										<NavItem>
											<Link
												className="text-basic sidebar-align sidebar-menu-item"
												to={{ pathname: `/helpdesk/taskList/i/all` }} onClick={()=>{
													this.setState({filterID:null,filterData:null});
													this.props.setFilter({
														status:[],
														requester:null,
														company:null,
														assigned:null,
														workType:null,
														statusDateFrom:'',
														statusDateTo:'',
														updatedAt:(new Date()).getTime()
													});
												}}>Všetky</Link>
										</NavItem>
										{
											this.state.filters.map((item)=>
											<NavItem key={item.id}>
												<Link
													className = "text-basic sidebar-align sidebar-menu-item"
													to={{ pathname: `/helpdesk/taskList/i/`+item.id }} onClick={()=>{
														this.setState({filterID:item.id,filterData:item});
														this.props.setFilter({
															...item.filter,
															updatedAt:(new Date()).getTime()
														});
													}}>{item.title}</Link>
											</NavItem>

										)}

									</Nav>
								</TabPane>
								<TabPane tabId={1}>
									<Filter filterID={this.state.filterID} filterData={this.state.filterData} resetFilter={()=>this.setState({filterID:null,filterData:null})} close={ () => this.setState({activeTab: 0})}/>
								</TabPane>
							</TabContent>

						</div>
					</div>}
					{showSettings &&
						<Nav vertical>
							{settings.map((setting)=>
								<NavItem key={setting.link}>
									<Link className="text-basic sidebar-align sidebar-menu-item"
										to={{ pathname:'/helpdesk/settings/'+setting.link }}>{setting.title}</Link>
								</NavItem>
							)}
						</Nav>
					}
					</div>
				</div>
			);
		}
	}
	const mapStateToProps = ({ filterReducer,storageHelpFilters, storageHelpProjects, storageHelpMilestones, userReducer }) => {
    const { project, milestone } = filterReducer;
		const { filtersActive, filters } = storageHelpFilters;
		const { projectsActive, projects } = storageHelpProjects;
		const { milestonesActive, milestones } = storageHelpMilestones;
    return { project, milestone, filtersActive,filters,projectsActive,projects, milestonesActive, milestones, currentUser:{...userReducer, userData:{...(userReducer.userData?userReducer.userData:{isAdmin:false,isAgent:false})}} };
  };

  export default connect(mapStateToProps, { setProject, setMilestone, setFilter, storageHelpFiltersStart, storageHelpProjectsStart, storageHelpMilestonesStart })(Sidebar);
