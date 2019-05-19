import React, { Component } from 'react';
import { Nav, MenuItem, Glyphicon, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class PageHeader extends Component {
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
		} else {
			return '/lanwiki';
		}
	}

	render() {
		return (
			<div className="pageHeader">
				<div className="d-flex bd-highlight" style={{height:'100%'}}>
					<div className="center-hor">
						<Link className="" to={{ pathname: `/helpdesk/taskList` }} className="pl-4" style={{ color: 'white' }}>
							<i className="fa fa-file-pdf mr-1" />
							Úlohy
						</Link>
						<Link className="" to={{ pathname: `/lanwiki` }} className="pl-4" style={{ color: 'white' }}>
							<i className="fa fa-file-pdf mr-1" />
							Návody
						</Link>
						<Link className="" to={{ pathname: `/cmdb/all` }} className="pl-4" style={{ color: 'white' }}>
							<i className="fa fa-file-pdf mr-1" />
							CMDB
						</Link>
						<Link className="" to={{ pathname: `/passmanager` }} className="pl-4" style={{ color: 'white' }}>
							<i className="fa fa-file-pdf mr-1" />
							Heslá
						</Link>
						<Link className="" to={{ pathname: `/expenditures` }} className="pl-4" style={{ color: 'white' }}>
							<i className="fa fa-file-pdf mr-1" />
							Náklady
						</Link>
						<Link className="" to={{ pathname: `/helpdesk/reports` }} className="pl-4" style={{ color: 'white' }}>
							<i className="fa fa-file-pdf mr-1" />
							Vykazy
						</Link>
					</div>
					<div className="ml-auto row center-hor">
						<i className="headerIcons fa fa-exclamation-triangle"/>
						<i className="headerIcons fa fa-envelope" />
						<Dropdown isOpen={this.state.settingsOpen} toggle={()=>this.setState({settingsOpen:!this.state.settingsOpen})}>
			        <DropdownToggle style={{backgroundColor: '#1976d2', borderWidth: 0, padding:0}}>
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


						<i className="headerIcons fas fa-sign-out-alt" style={{ backgroundColor: '#1976d2', borderWidth: 0, marginRight: 15, color: 'white' }} />
					</div>
				</div>

				<Nav pullRight />
			</div>
		);
	}
}
