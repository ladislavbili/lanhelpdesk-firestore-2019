import React, { Component } from 'react';
import { Navbar, Nav, DropdownButton, MenuItem, Glyphicon, Dropdown } from 'react-bootstrap';
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
		} else {
			return '/lanwiki';
		}
	}

	render() {
		return (
			<div className="pageHeader">

				<div className="d-flex bd-highlight">
					{/*
					<div className="p-2 align-self-center">
						<div className="input-group" style={{ width: 300, height: 30 }}>
							<input
								type="text"
								style={{ height: 30 }}
								className="form-control"
								placeholder="Global search task name"
							/>
							<div className="input-group-append">
								<button className="btn btn-white" type="button">
									<i className="fa fa-search" />
								</button>
							</div>
						</div>
					</div>
					 */}
					<div className="p-2 align-self-center">
						<Link className="" to={{ pathname: `/helpdesk/reports` }} style={{ color: 'white' }}>
							<i className="fa fa-file-pdf mr-1" />
							Vykazy
						</Link>
					</div>
					<div className="ml-auto p-2 align-self-center">
						<i
							className="headerIcons"
							style={{ backgroundColor: '#1976d2', borderWidth: 0, marginRight: 15, color: 'white' }}
						>
							<i className="fa fa fa-exclamation-triangle" />
						</i>
						<i
							className="headerIcons"
							style={{ backgroundColor: '#1976d2', borderWidth: 0, marginRight: 10, color: 'white' }}
						>
							<i className="fa fa-envelope" />
						</i>
						<Dropdown pullRight id="settings">
							<Dropdown.Toggle
								noCaret
								style={{ backgroundColor: '#1976d2', borderWidth: 0, marginRight: 10, color: 'white' }}
							>
								<Glyphicon glyph="cog" className="headerIcons mt-0" />
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/projects')}>Projects</MenuItem>
	              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/statuses')}>Statuses</MenuItem>
	              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/units')}>Units</MenuItem>
	              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/companies')}>Companies</MenuItem>
	              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/workTypes')}>Work Type</MenuItem>
	              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/users')}>Users</MenuItem>
	              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/pricelists')}>Prices</MenuItem>
	              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/suppliers')}>Supplier</MenuItem>
	              <MenuItem onClick={()=>this.props.history.push(this.getLocation()+'/settings/supplierInvoices')}>Invoices</MenuItem>
							</Dropdown.Menu>
						</Dropdown>
						<i
							className="headerIcons"
							style={{ backgroundColor: '#1976d2', borderWidth: 0, marginRight: 10, color: 'white' }}
						>
							<i className="fas fa-sign-out-alt" />
						</i>
					</div>
				</div>

				<Nav pullRight />
			</div>
		);
	}
}
