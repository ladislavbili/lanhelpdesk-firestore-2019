import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink} from 'reactstrap';
import classnames from 'classnames';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:''
		};
	}

	render() {
		return (
			<div>
				<div className="commandbar row">
					<div className="commandbar-item ml-2">
						<input
							type="text"
							value={this.state.search}
							className="form-control command-search"
							onChange={(e)=>this.setState({search:e.target.value})}
							placeholder="Search" />
					</div>
				</div>
				<div className="fit-with-header scrollable">
					<h1>Active</h1>
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
									<th>
										Server name
									</th>
									<th>
										Company
									</th>
									<th>
										IP
									</th>
									<th>
										Status
									</th>
								</tr>
							</thead>
						</table>
				</div>
			</div>
			);
		}
	}
