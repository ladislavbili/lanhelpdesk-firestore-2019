import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../components/SelectPage';
import TaskAdd from './task/taskAddContainer';
import Filter from './components/filter';
import ProjectEdit from './projects/projectEdit';
import ProjectAdd from './projects/projectAdd';
import {rebase} from '../index';
import {toSelArr} from '../helperFunctions';
import {setProject, setFilter} from '../redux/actions';

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

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			openProjectAdd: false,
			isColumn: false,
			filters:[],
			search: '',
			activeTab:0,
			projects:[{id:-1,title:'+ Add project',body:'add', label:'+ Add project',value:null},{id:null,title:'Dashboard',body:'dashboard', label:'Dashboard',value:null}],
			project:{id:null,title:'Dashboard',body:'dashboard', label:'Dashboard',value:null},
			filterID:null,
			filterData:null,

			projectChangeDate:(new Date()).getTime(),
		};
	}

	componentWillMount(){
		this.ref = rebase.listenToCollection('/help-projects', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				projects:toSelArr([{id:-1,title:'+ Add project',body:'add', label:'+ Add project',value:null}, {id:null,title:'Dashboard', body:'dashboard',}].concat(content)),
				project:toSelArr([{id:null,title:'Dashboard', body:'dashboard',}].concat(content)).find((item)=>item.id===this.props.project)
			});
		},
		});

		this.ref2 = rebase.listenToCollection('/help-filters', {
			context: this,
			withIds: true,
			then:content=>{
					this.setState({filters:content})
			}
		});
	}

	componentWillUnmount() {
		rebase.removeBinding(this.ref);
			rebase.removeBinding(this.ref2);
	}
/*
<Button className="btn-link full-width t-a-l"  onClick={()=>{
		this.setState({opened:true});
	}} >
<i className="fa fa-plus" /> Project
</Button>

*/
	render() {
		let isReport = this.props.history.location.pathname.includes('reports');
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
										this.setState({project:e});
										this.props.setProject(e.value);
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

						<TaskAdd history={this.props.history} project={this.state.project.id} triggerDate={this.state.projectChangeDate} />

						{ this.state.openProjectAdd &&
								<ProjectAdd close={() => this.setState({openProjectAdd: false})}/>
						}

						{ this.state.project.id
							&&
							<ProjectEdit item={this.state.project} triggerChange={()=>{this.setState({projectChangeDate:(new Date()).getTime()})}}/>
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
												to={{ pathname: isReport?'/helpdesk/reports/all':`/helpdesk/taskList/i/all` }} onClick={()=>{
													this.setState({filterID:null,filterData:null});
													this.props.setFilter({
														status:null,
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
													to={{ pathname: isReport?'/helpdesk/reports/'+item.id:`/helpdesk/taskList/i/`+item.id }} onClick={()=>{
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
									<Filter filterID={this.state.filterID} filterData={this.state.filterData} resetFilter={()=>this.setState({filterID:null,filterData:null})} />
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
	const mapStateToProps = ({ filterReducer }) => {
    const { project } = filterReducer;
    return { project };
  };

  export default connect(mapStateToProps, { setProject,setFilter })(Sidebar);
