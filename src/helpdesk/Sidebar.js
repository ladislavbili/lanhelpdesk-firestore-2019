import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink} from 'reactstrap';
import classnames from 'classnames';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../components/SelectPage';
import TaskAdd from './task/taskAdd';
import Filter from './components/filter';
import ProjectAdd from './projects/projectAdd';
import {rebase} from '../index';
import {toSelArr} from '../helperFunctions';
import {setProject, setFilter} from '../redux/actions';

import {sidebarSelectStyle, selectStyle} from '../scss/selectStyles';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			filters:[],
			search: '',
			activeTab:0,
			projects:[{id:null,title:'Dashboard',label:'Dashboard',value:null}],
			project:{id:null,title:'Dashboard',label:'Dashboard',value:null},
			filterID:null,
			filterData:null,
		};

	}

	componentWillMount(){
		this.ref = rebase.listenToCollection('/help-projects', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				projects:toSelArr([{id:null,title:'Dashboard'}].concat(content)),
				project:toSelArr([{id:null,title:'Dashboard'}].concat(content)).find((item)=>item.id===this.props.project)
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
		return (
			<div className="sidebar">
					<SelectPage />
				<div className="scrollable fit-with-header">
					<div>
						<TaskAdd history={this.props.history} />
						<hr/>
						<li>
							<Select
								options={this.state.projects}
								value={this.state.project}
								styles={sidebarSelectStyle}
								onChange={e => {
									this.setState({project:e});
									this.props.setProject(e.value);
								}}
								components={{
									DropdownIndicator: ({ innerProps, isDisabled }) =>
									<div style={{marginTop: "-15px"}}>
										<i className="fa fa-folder-open" style={{position:'absolute', left:15, color: "#0078D4"}}/>
										<i className="fa fa-chevron-down" style={{position:'absolute', right:15, color: "#0078D4"}}/>
									</div>,
								}}
								/>
						</li>
							<hr />
							<Nav tabs className="sidebar-edit">
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
							<TabContent activeTab={this.state.activeTab} className="sidebar-edit">
								<TabPane tabId={0} >
									<Nav vertical>
										<NavItem>
											<Link className="text-basic" to={{ pathname: `/helpdesk/taskList/i/all` }} onClick={()=>{
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
												<Link className="text-basic" to={{ pathname: `/helpdesk/taskList/i/`+item.id }} onClick={()=>{
														this.setState({filterID:item.id,filterData:item});
														this.props.setFilter({
															...item.filter,
															updatedAt:(new Date()).getTime()
														});
													}}>{item.title}</Link>
											</NavItem>

										)
										}

									</Nav>
								</TabPane>
								<TabPane tabId={1}>
									<Filter filterID={this.state.filterID} filterData={this.state.filterData} resetFilter={()=>this.setState({filterID:null,filterData:null})} />
								</TabPane>
							</TabContent>
							<hr />
							<li>
									<ProjectAdd />
							</li>
						</div>
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
