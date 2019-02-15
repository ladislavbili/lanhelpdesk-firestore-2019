import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const sortTypes = [{ id: 0, name: 'ID' }, { id: 1, name: 'Name' }, { id: 2, name: 'email' }, { id: 3, name: 'Active' }];

export default class UsersList extends Component {
	constructor(props) {
		super(props);
		this.state = { sortType: 0 };
	}
	render() {
		return (
			<div className="content-page">
				<div className="content">
					<div className="container-fluid">
						<h4 className="page-title">Users</h4>
						<div className="row m-t-10 m-b-10 m-l-5 m-r-5">
							<div class="d-flex flex-row align-items-center">
								<div className="p2">
									<button
										class="btn btn-success waves-effect waves-light btn-sm"
										onClick={() => this.setState({ filterView: !this.state.filterView })}
									>
										Filter
									</button>
								</div>
								<div class="p-2">
									<div class="input-group">
										<input type="text" class="form-control" placeholder="Search" />
										<div class="input-group-append">
											<button class="btn btn-white" type="button">
												<i class="fa fa-search" />
											</button>
										</div>
									</div>
								</div>
							</div>
							<div class="p-2 ml-auto">
								<span class="font-16 m-r-10">Sort By:</span>
								<DropdownButton
									id="pageSelector"
									title={sortTypes.find(item => item.id === this.state.sortType).name}
									noCaret
									style={{
										backgroundColor: 'black',
										borderWidth: 0,
										borderRadius: 0,
										marginLeft: 20,
									}}
								>
									{sortTypes.map(item => (
										<MenuItem onClick={() => this.setState({ sortType: item.id })}>
											{item.name}
										</MenuItem>
									))}
								</DropdownButton>
							</div>
						</div>
						<div className="row">
							<div class="col-md-12">
								<div class="card-box">
									<div class="table-responsive">
										<table class="table table-hover mails m-0">
											<thead>
												<tr>
													<th>ID</th>
													<th style={{ width: '40%' }}>Name</th>
													<th>email</th>
													<th>Company</th>
													<th>Active</th>
													<th>Akcie</th>
												</tr>
											</thead>

											<tbody>
												<tr class="">
													<td>152</td>

													<td>
														{' '}
														<Link
															className=""
															to={{ pathname: `/demoHelpdesk/settings/userEdit` }}
														>
															Branislav Šusta{' '}
														</Link>
													</td>
													<td>susta@lansystems.sk</td>
													<td>LAN Systems</td>
													<td>Yes</td>
													<td>
														<Link
															className="table-action-btn"
															to={{ pathname: `/demoHelpdesk/settings/userEdit` }}
														>
															<i class="md md-edit" />
														</Link>
														<a href="#" className="table-action-btn">
															<i class="md md-close" />
														</a>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
