import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink} from 'reactstrap';
import classnames from 'classnames';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../SelectPage';
import {rebase} from '../index';
import {toSelArr} from '../helperFunctions';
import {setCompany, setFilter} from '../redux/actions';
import CompanyAdd from './companies/companyAdd';
import ItemAdd from './sidebarItemAdd';

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
			companies:[{id:null,title:'All',label:'All',value:null}],
			company:{id:null,title:'All',label:'All',value:null},
			openAddItem:false,
			sidebarItems:[]
		};

	}

	componentWillMount(){
		this.ref = rebase.listenToCollection('/companies', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				companies:toSelArr([{id:null,title:'All'}].concat(content)),
				company:toSelArr([{id:null,title:'All'}].concat(content)).find((item)=>item.id===this.props.company)
				});
			},
		});
		this.ref1 = rebase.listenToCollection('/cmdb-sidebar', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				sidebarItems:content
				});
			},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
		rebase.removeBinding(this.ref1);
	}

	render() {
		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<div className="commandbar"  >
					</div>
					<li className="pb-0 menu-item" >
						Companies
						<span className="pull-right">
							<CompanyAdd />
						</span>
					</li>
					<li className="menu-item">
						<Select
							className="fullWidth"
							options={this.state.companies}
							value={this.state.company}
							styles={customSelect}
							onChange={e => {
								this.setState({company:e});
								this.props.setCompany(e.value);
							}}
							components={{DropdownIndicator: ({ innerProps, isDisabled }) =>  <i className="fa fa-folder-open" style={{position:'absolute', left:15}} /> }}
							/>
					</li>
					<Nav vertical>
						<NavItem>
							<Link key='all' to={{ pathname: `/cmdb/all` }}>IP list</Link>
							{
								this.state.sidebarItems.map((item)=>
								<Link key={item.id} to={{ pathname: `/cmdb/`+item.id }}>{item.title}</Link>
							)}
							<Link to={{ pathname: `` }} key='add' onClick={()=>{this.setState({openAddItem:true})}}>+Add new</Link>
						</NavItem>
					</Nav>
					<ItemAdd opened={this.state.openAddItem} toggle={()=>this.setState({openAddItem:false})} />
				</div>

			</div>
			);
		}
	}
	const mapStateToProps = ({ filterReducer }) => {
    const { company } = filterReducer;
    return { company };
  };

  export default connect(mapStateToProps, { setCompany,setFilter })(Sidebar);
