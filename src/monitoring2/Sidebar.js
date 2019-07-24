import React, { Component } from 'react';
import {Row, Col,NavItem, Nav, Button, Modal} from 'reactstrap';
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

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openedEditServers: false,
		};
		this.toggleEdit.bind(this);
	}

	componentWillMount(){
	}

	componentWillUnmount(){
	}

	toggleEdit(){
		this.setState({openedEditServers:!this.state.openedEditServers})
	}

	render() {
		return (
			<div className="sidebar">
		{/*		<SelectPage />
				<div className="scrollable fit-with-header">

					<hr/>

					<Nav vertical>
						<NavItem>
							<Link  className = "text-basic sidebar-align sidebar-menu-item" to={{ pathname: `/monitoring/i/all` }}>All</Link>
						</NavItem>


						<NavItem key={0}  className="sidebar-link">
							<Link className= "text-basic sidebar-align sidebar-menu-item-link" to={{ pathname:`/monitoring/i/`+item.id}}>Backup tasks</Link>
							<div className='sidebar-menu-item-btn'>
								<Button
									key={0}
									className='hidden-button full-width full-height'
									onClick={() => {/*this.setState({openedEdit: true})*//*}}
									>
									<i className="fa fa-cog"/>
								</Button>
							</div>
						</NavItem>

						<NavItem key={1}  className="sidebar-link">
							<Link className= "text-basic sidebar-align sidebar-menu-item-link" to={{ pathname:`/monitoring/i/`+item.id}}>Mail servers</Link>
							<div className='sidebar-menu-item-btn'>
								<Button
									key={1}
									className='hidden-button full-width full-height'
									onClick={() => {this.setState({openedEditServers: true})}}
									>
									<i className="fa fa-cog"/>
								</Button>
							</div>
						</NavItem>

				</Nav>

					<Modal isOpen={this.state.openedEditServers} toggle={this.toggleEdit.bind(this)}>
						<TagEdit close={this.toggleEdit.bind(this)}/>
					</Modal>

				</div>*/}
			</div>
			);
		}
	}
