import React, { Component } from 'react';
import {NavItem, Nav, Button} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import {toSelArr} from '../helperFunctions';
import {setCompany, setFilter} from '../redux/actions';
import CompanyAdd from './settings/companies/companyAdd';

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
			sidebar:[]
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
		this.ref2 = rebase.listenToCollection('/cmdb-sidebar', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
					sidebar:content
				});
			},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
		rebase.removeBinding(this.ref2);
	}

	render() {
		return (
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<div className="commandbar"  >
						<CompanyAdd />
					</div>
					<li className="pb-0 menu-item" >
						Companies
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
					<Button
						color="success"
						style={{ width: '100%' }}
						onClick={()=>{this.props.history.push('/cmdb/add')}}
					> Add items
					</Button>
					<Nav vertical>
						{
							this.state.sidebar.map((item)=>
							<NavItem key={item.id} style={{flex:1, display:'flex'}}>
								<Link style={{width:'calc( 100% - 32px )'}} to={{ pathname: `/cmdb/i/`+item.url }}>{item.title}</Link>
									<button className="btn btn-link waves-effect" onClick={()=>{
											this.props.history.push('/cmdb/edit/'+item.id);
										}}>
											<i className="fa fa-cog" />
									</button>
							</NavItem>
						)
						}
					</Nav>
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
