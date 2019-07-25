import React, { Component } from 'react';
import {Row, Col,NavItem, Nav, Button} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import {toSelArr} from '../helperFunctions';
import {setCompany, setFilter} from '../redux/actions';
import CompanyAdd from './settings/companies/companyAdd';
import CompanyEdit from './settings/companies/companyEdit';
import {sidebarSelectStyle} from '../scss/selectStyles';

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
					<li>
						<Select
							options={this.state.companies}
							value={this.state.company}
							styles={sidebarSelectStyle}
							onChange={e => {
								this.setState({company:e});
								this.props.setCompany(e.value);
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
					<Button
						className="btn-link t-a-l sidebar-menu-item"
						onClick={()=>{this.props.history.push('/cmdb/add')}}
						> <i className="fa fa-plus sidebar-icon-center"/> Item
					</Button>

					<CompanyAdd />
					{ this.state.company.id
						&&
						<CompanyEdit item={this.state.company}/>
					}
						<Row>
							<Col xs={10}>
								<Nav vertical>
									{	this.state.sidebar.map((item)=>
										<NavItem key={item.id}>
											<Link className="text-basic sidebar-align sidebar-menu-item" to={{ pathname: `/cmdb/i/`+item.url }}>{item.title}</Link>
										</NavItem>
									)}
								</Nav>
							</Col>
							<Col xs={2}>
								{	this.state.sidebar.map((item)=>
									<Button
										key={item.id}
										className='btn-link sidebar-menu-item'
										onClick={() => this.props.history.push('/cmdb/edit/'+item.id)}
										>
										<i className="fa fa-cog"/>
									</Button>
								)}
							</Col>
						</Row>


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
