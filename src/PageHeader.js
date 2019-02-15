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
			<div className="topbar" style={{ backgroundColor: '#1976d2' }}>
				<div className="topbar-left" style={{ backgroundColor: '#1976d2' }}>
					<Navbar.Brand>
						<DropdownButton
							id="pageSelector"
							title="Lan Systems"
							noCaret
							style={{
								backgroundColor: '#1976d2',
								borderWidth: 0,
								borderRadius: 0,
								marginLeft: 10,
								color: 'white',
								fontSize: 20,
							}}
						>
							<MenuItem onClick={() => this.props.history.push('/demohelpdesk')}>DemoHelpdesk</MenuItem>
						</DropdownButton>
					</Navbar.Brand>
				</div>

				<div class="d-flex bd-highlight">
					{/*
					<div class="p-2 align-self-center">
						<div class="input-group" style={{ width: 300, height: 30 }}>
							<input
								type="text"
								style={{ height: 30 }}
								class="form-control"
								placeholder="Global search task name"
							/>
							<div class="input-group-append">
								<button class="btn btn-white" type="button">
									<i class="fa fa-search" />
								</button>
							</div>
						</div>
					</div>
					 */}
					<div class="p-2 align-self-center">
						<Link className="" to={{ pathname: `/demoHelpdesk/reports` }} style={{ color: 'white' }}>
							<i class="fa fa-file-pdf mr-1" />
							Vykazy
						</Link>
					</div>
					<div class="ml-auto p-2 align-self-center">
						<i
							class="headerIcons"
							style={{ backgroundColor: '#1976d2', borderWidth: 0, marginRight: 15, color: 'white' }}
						>
							<i class="fa fa fa-exclamation-triangle" />
						</i>
						<i
							class="headerIcons"
							style={{ backgroundColor: '#1976d2', borderWidth: 0, marginRight: 10, color: 'white' }}
						>
							<i class="fa fa-envelope" />
						</i>
						<Dropdown pullRight id="settings">
							<Dropdown.Toggle
								noCaret
								style={{ backgroundColor: '#1976d2', borderWidth: 0, marginRight: 10, color: 'white' }}
							>
								<Glyphicon glyph="cog" className="headerIcons mt-0" />
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<MenuItem onClick={() => this.props.history.push('/demoHelpdesk/settings/companies')}>
									Companies
								</MenuItem>
								<MenuItem onClick={() => this.props.history.push('/demoHelpdesk/settings/users')}>
									Users
								</MenuItem>
								<MenuItem onClick={() => this.props.history.push('/demoHelpdesk/settings/statuses')}>
									Statuses
								</MenuItem>
								<MenuItem onClick={() => this.props.history.push('/demoHelpdesk/settings/types')}>
									Types
								</MenuItem>
								<MenuItem onClick={() => this.props.history.push('/demoHelpdesk/settings/roles')}>
									Roles
								</MenuItem>
								<MenuItem onClick={() => this.props.history.push('/demoHelpdesk/settings/units')}>
									Units
								</MenuItem>
								<MenuItem onClick={() => this.props.history.push('/demoHelpdesk/settings/projects')}>
									projects
								</MenuItem>
							</Dropdown.Menu>
						</Dropdown>
						<i
							class="headerIcons"
							style={{ backgroundColor: '#1976d2', borderWidth: 0, marginRight: 10, color: 'white' }}
						>
							<i class="fas fa-sign-out-alt" />
						</i>
					</div>
				</div>

				<Nav pullRight />
			</div>
		);
	}
}
