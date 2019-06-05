import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import firebase from 'firebase';
import {deleteUserData} from '../redux/actions';

class PageHeader extends Component {
	constructor() {
		super();
		this.state = {
			companies: [],
		};
		this.getLocation.bind(this);
	}

	getLocation() {
		let url = this.props.history.location.pathname;
		if (url.includes('cmdb')) {
			return '/cmdb';
		} else if (url.includes('helpdesk')) {
			return '/helpdesk';
		} else if (url.includes('passmanager')) {
			return '/passmanager';
		} else if (url.includes('expenditures')) {
			return '/expenditures';
		} else if (url.includes('projects')) {
			return '/projects';
		} else {
			return '/lanwiki';
		}
	}

	render() {
		return (
			<div className="page-header">
				<div className="d-flex bd-highlight" style={{height:'100%'}}>
					<div className="center-hor">
						<Link to={{ pathname: `/helpdesk/taskList` }} className="pl-4" style={{ color: 'white' }}>
							Úlohy
						</Link>
						<Link to={{ pathname: `/lanwiki` }} className="pl-4" style={{ color: 'white' }}>
							Návody
						</Link>
						<Link to={{ pathname: `/cmdb/all` }} className="pl-4" style={{ color: 'white' }}>
							CMDB
						</Link>
						<Link to={{ pathname: `/passmanager` }} className="pl-4" style={{ color: 'white' }}>
							Heslá
						</Link>
						<Link to={{ pathname: `/expenditures` }} className="pl-4" style={{ color: 'white' }}>
							Náklady
						</Link>
						<Link to={{ pathname: `/helpdesk/reports` }} className="pl-4" style={{ color: 'white' }}>
								Vykazy
						</Link>
						<Link to={{ pathname: `/projects` }} className="pl-4" style={{ color: 'white' }}>
							Projekty
						</Link>
					</div>
					<div className="ml-auto row center-hor">
						<i className="headerIcons fa fa-exclamation-triangle"/>
						<i className="headerIcons fa fa-envelope" />
						<Dropdown isOpen={this.state.settingsOpen} toggle={()=>this.setState({settingsOpen:!this.state.settingsOpen})}>
			        <DropdownToggle style={{backgroundColor: 'inherit', borderWidth: 0, padding:0}}>
								<i className="headerIcons fa fa-cog"/>
			        </DropdownToggle>
			        <DropdownMenu right>
			          <DropdownItem header>Settings</DropdownItem>
			          <DropdownItem divider />
								{
									(this.props.settings?this.props.settings:[]).map((item,index)=>
									<DropdownItem key={index} onClick={()=>this.props.history.push(this.getLocation()+'/settings/'+item.link)}>{item.title}</DropdownItem>
								)}
			        </DropdownMenu>
			      </Dropdown>


						<i className="headerIcons clickable fas fa-sign-out-alt" style={{ borderWidth: 0, marginRight: 15, color: 'white' }} onClick={()=>{
								if(window.confirm('Are you sure you want to log out?')){
									this.props.deleteUserData();
									firebase.auth().signOut();
								}
							}} />
					</div>
				</div>
			</div>
		);
	}
}


const mapStateToProps = () => {
	return {  };
};

export default connect(mapStateToProps, { deleteUserData })(PageHeader);
