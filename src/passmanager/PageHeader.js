import React, { Component } from 'react';
import { Nav, MenuItem, Glyphicon, Dropdown } from 'react-bootstrap';
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
		} else {
			return '/lanwiki';
		}
	}

	render() {
		return (
			<div className="pageHeader">

				<div className="d-flex bd-highlight">
					<div className="p-2 align-self-center">
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
						<Link className="" to={{ pathname: `/helpdesk/reports` }} className="pl-4" style={{ color: 'white' }}>
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
