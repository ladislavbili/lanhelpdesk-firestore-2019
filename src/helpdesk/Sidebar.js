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

const customSelect = {
	singleValue: (provided, state) => {
		return { ...provided, marginLeft:30 };
	},
	indicatorSeparator:(provided, state) => {
		return { ...provided, width:0 };
	},
	control:(provided, state) => {
		return { ...provided, borderRadius:50, borderColor:'#6c757d' };
	},
	input:(provided, state) => {
		return { ...provided, marginLeft:30 };
	},
	placeholder:(provided, state) => {
		return { ...provided, marginLeft:30 };
	},
}

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			activeTab:0,
			projects:[{id:null,title:'Dashboard',label:'Dashboard',value:null}],
			project:{id:null,title:'Dashboard',label:'Dashboard',value:null}
		};
	}

	componentWillMount(){
		this.ref = rebase.listenToCollection('/projects', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				projects:toSelArr([{id:null,title:'Dashboard'}].concat(content)),
				project:toSelArr([{id:null,title:'Dashboard'}].concat(content)).find((item)=>item.id===this.props.project)
			});
		},
		});
	}

	render() {
		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<div id="sidebar-menu" >
						<li className="menu-title" style={{ paddingBottom: '0px !important' }} >
							Project
							<span className="pull-right">
								<ProjectAdd />
							</span>
						</li>
						<li className="menu-title" style={{ paddingTop: '0px !important' }}>
							<Select
								className="fullWidth"
								options={this.state.projects}
								value={this.state.project}
								styles={customSelect}
								onChange={e => {
									this.setState({project:e});
									this.props.setProject(e.value);
								}}
								components={{DropdownIndicator: ({ innerProps, isDisabled }) =>  <i className="fa fa-folder-open" style={{position:'absolute', left:15}} /> }}
								/>
						</li>
							<TaskAdd history={this.props.history} />
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
											<Link to={{ pathname: `` }} onClick={()=>{
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
	const mapStateToProps = ({ filterReducer }) => {
    const { project } = filterReducer;
    return { project };
  };

  export default connect(mapStateToProps, { setProject,setFilter })(Sidebar);
