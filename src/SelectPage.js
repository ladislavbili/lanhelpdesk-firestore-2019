import React, { Component } from 'react';
import { Navbar, DropdownButton, MenuItem } from 'react-bootstrap';

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
							<MenuItem onClick={() => this.props.history.push('/helpdesk')}>helpdesk</MenuItem>
						</DropdownButton>
					</Navbar.Brand>
			</div>
		);
	}
}
