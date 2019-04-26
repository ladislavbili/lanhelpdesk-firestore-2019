import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink} from 'reactstrap';
import classnames from 'classnames';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../SelectPage';
import {rebase} from '../index';
import {toSelArr} from '../helperFunctions';
import {setProject, setFilter} from '../redux/actions';
import ProjectAdd from './projects/projectAdd';

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
			projects:[{id:null,title:'All',label:'All',value:null}],
			project:{id:null,title:'All',label:'All',value:null},
			openAddItem:false
		};
	}

	componentWillMount(){
		this.ref = rebase.listenToCollection('/cmdb-projects', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				projects:toSelArr([{id:null,title:'All'}].concat(content)),
				project:toSelArr([{id:null,title:'All'}].concat(content)).find((item)=>item.id===this.props.project)
			});
		},
		});
	}

	render() {
		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<div className="commandbar"  >
					</div>
					<li className="pb-0 menu-item" >
						Project
						<span className="pull-right">
							<ProjectAdd />
						</span>
					</li>
					<li className="menu-item">
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
					<Nav vertical>
						<NavItem>
							<Link to={{ pathname: `/cmdb/all` }}>IP list</Link>
							<Link to={{ pathname: `/cmdb/0` }}>Servers</Link>
							<Link to={{ pathname: `/cmdb/1` }}>Routers</Link>
							<Link to={{ pathname: `/cmdb/2` }}>PCs</Link>
							<Link to={{ pathname: `/cmdb/3` }}>Domains</Link>
							<Link to={{ pathname: `/cmdb/4` }}>E-mails</Link>
							<Link to={{ pathname: `` }} onClick={()=>{this.setState({openAddItem:true})}}>+Add new</Link>
						</NavItem>
					</Nav>
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
