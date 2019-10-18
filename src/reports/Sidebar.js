import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../components/SelectPage';
import Filter from './components/filter';
import ProjectEdit from './components/projects/projectEdit';
import ProjectAdd from './components/projects/projectAdd';
import MilestoneAdd from './components/milestones/milestoneAdd';
import {toSelArr, sameStringForms} from '../helperFunctions';
import {setProject, setMilestone, setFilter, storageHelpFiltersStart, storageHelpProjectsStart, storageHelpMilestonesStart} from '../redux/actions';

import {sidebarSelectStyle} from '../scss/selectStyles';

let settings=[{title:'Projects',link:'projects'},
{title:'Statuses',link:'statuses'},
{title:'Units',link:'units'},
{title:'Companies',link:'companies'},
{title:'Work Type',link:'workTypes'},
{title:'Users',link:'users'},
{title:'Prices',link:'pricelists'},
{title:'Supplier',link:'suppliers'},
{title:'Tags',link:'tags'},
{title:'Invoices',link:'supplierInvoices'},
{title:'Task types',link:'taskTypes'},
{title:'Imaps',link:'imaps'},
{title:'SMTPs',link:'smtps'},
]

const dashboard = {id:null,title:'Dashboard', label:'Dashboard',value:null};
const addProject = {id:-1,title:'+ Add project', label:'+ Add project',value:null};
const allMilestones = {id:null,title:'Any', label:'Any',value:null};
const addMilestone = {id:-1,title:'+ Add milestone', label:'+ Add milestone',value:null};

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
			projects:[dashboard,addProject],
			project:dashboard,
			milestones:[allMilestones,addMilestone],
			milestone:allMilestones,
			filterID:null,
			filterData:null,

			projectChangeDate:(new Date()).getTime(),
		};
	}

	componentWillReceiveProps(props){
		if(!sameStringForms(props.filters,this.props.filters)){
			this.setState({filters:props.filters})
		}
		if(!sameStringForms(props.projects,this.props.projects)){
			let project = toSelArr([dashboard].concat(props.projects)).find((item)=>item.id===props.project);
			this.setState({
				projects:toSelArr([dashboard].concat(props.projects).concat([addProject])),
				project:project?project:dashboard
			});
		}
		if(!sameStringForms(props.milestones,this.props.milestones)){
			let milestone = toSelArr([allMilestones].concat(props.milestones)).find((item)=>item.id===props.milestone);
			this.setState({
				milestones:toSelArr([allMilestones].concat(props.milestones).concat([addMilestone])),
				milestone:milestone?milestone:dashboard
			});
		}
	}

	componentWillMount(){
		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		this.setState({
			projects:toSelArr([dashboard].concat(this.props.projects).concat([addProject])),
			project:toSelArr([dashboard].concat(this.props.projects)).find((item)=>item.id===this.props.project)
		});

		if(!this.props.milestonesActive){
			this.props.storageHelpMilestonesStart();
		}
		this.setState({
			milestones:toSelArr([allMilestones].concat(this.props.milestones).concat([addMilestone])),
			milestone:toSelArr([allMilestones].concat(this.props.milestones)).find((item)=>item.id===this.props.milestone)
		});


		if(!this.props.filtersActive){
			this.props.storageHelpFiltersStart();
		}
		this.setState({filters:this.props.filters});
	}

/*
<Button className="btn-link full-width t-a-l"  onClick={()=>{
		this.setState({opened:true});
	}} >
<i className="fa fa-plus" /> Project
</Button>

*/
	render() {
		let showSettings= this.props.history.location.pathname.includes('settings');
		return (
			<div className="sidebar">
					<SelectPage />
				<div className="sidebar-content scrollable fit-with-header">
					{!showSettings && <div>
						<div>
						<li>
							<Select
								options={this.state.projects}
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
									</div>,
								}}
								/>
						</li>
						<hr/>
							{ this.props.project!==null && this.props.project!==-1 && <li>
								<Select
									options={this.state.milestones.filter((milestone)=> milestone.id===-1|| milestone.id===null|| milestone.project===this.props.project)}
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
						{ this.state.openProjectAdd &&
								<ProjectAdd close={() => this.setState({openProjectAdd: false})}/>
						}
						{ this.state.project.id &&
							this.state.projects.map((item)=>item.id).includes(this.state.project.id) &&
							<ProjectEdit item={this.state.project} triggerChange={()=>{this.setState({projectChangeDate:(new Date()).getTime()})}}/>
						}
						{ this.state.openMilestoneAdd &&
							<MilestoneAdd close={() => this.setState({openMilestoneAdd: false})}/>
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
												to={{ pathname: `/reports/i/all` }} onClick={()=>{
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
													to={{ pathname: `/reports/i/`+item.id }} onClick={()=>{
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
							<hr/>
							<div>
								<Nav vertical>
									<NavItem>
										<Link
											className="text-basic sidebar-align sidebar-menu-item"
											to={{ pathname: `/reports/monthly/companies` }}>Mesačné firmy</Link>
									</NavItem>
									<NavItem>
										<Link
											className="text-basic sidebar-align sidebar-menu-item"
											to={{ pathname: `/reports/monthly/requester` }}>Mesačný agenti</Link>
									</NavItem>
								</Nav>
							</div>
						</div>
					</div>}
					{showSettings &&
						<Nav vertical>
							{settings.map((setting)=>
								<NavItem key={setting.link}>
									<Link className="text-basic sidebar-align sidebar-menu-item"
										to={{ pathname:'/reports/settings/'+setting.link }}>{setting.title}</Link>
								</NavItem>
							)}
						</Nav>
					}
					</div>
				</div>
			);
		}
	}
	const mapStateToProps = ({ filterReducer,storageHelpFilters, storageHelpProjects, storageHelpMilestones }) => {
    const { project } = filterReducer;
		const { filtersActive, filters } = storageHelpFilters;
		const { projectsActive, projects } = storageHelpProjects;
		const { milestonesActive, milestones } = storageHelpMilestones;
    return { project,filtersActive,filters,projectsActive,projects, milestonesActive, milestones };
  };

  export default connect(mapStateToProps, { setProject, setMilestone, setFilter, storageHelpFiltersStart, storageHelpProjectsStart, storageHelpMilestonesStart })(Sidebar);
