import React, { Component } from 'react';
import {
	Button,
	Modal,
	Badge,
	InputGroup,
	Glyphicon,
	FormControl,
	DropdownButton,
	MenuItem,
	Nav,
	Dropdown,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';



export default class Reports extends Component {

	render() {
		return (
			<div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>

					<div className="container-fluid">

						<div className="row">
							<div class="col-md-12">
								<div class="card-box">
									<h2>Task</h2>
									<div class="table-responsive">
										<table class="table table-hover mails m-0">
											<thead>
												<tr>

													<th>
														ID

													</th>
													<th style={{ width: '35%' }}>
														Name{' '}

													</th>
													<th>
														Typ
													</th>

													<th>
														{' '}
														Zadal{' '}

													</th>
													<th>
														Firma{' '}

													</th>
													<th>
														Riesi{' '}

													</th>
													<th>
														Closed{' '}

													</th>
												</tr>
											</thead>

											<tbody>
												<tr class="">
													<td>152</td>

													<td>
														{' '}
														<Link className="" to={{ pathname: `/demoHelpdesk/taskTop3` }} style={{ color: "#1976d2" }}>
															Nasadenie novej tlaciarne
												</Link>
													</td>
													<td>Pausal</td>
													<td>Branislav Šusta</td>
													<td>LAN Systems s.r.o.</td>
													<td>Patrik Patoprsty</td>
													<td>15.04 2.10.2018</td>
												</tr>

											</tbody>
										</table>
										<h2>Služby</h2>
										<div class="table-responsive">
											<table class="table table-hover mails m-0">
												<thead>
													<tr>
														<th>
															ID
												<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th style={{ width: '35%' }}>
															Name{' '}
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Typ služby
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															{' '}
															Cena/Mn.
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Mn.
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Jednotka
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>

														<th>
															Zlava
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Spolu
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
													</tr>
												</thead>

												<tbody>
													<tr class="">
														<td>152</td>
														<td>
															{' '}
															<Link className="" to={{ pathname: `/demoHelpdesk/taskTop3` }} style={{ color: "#1976d2" }}>
																Instalacia tlaciarne
												</Link>
														</td>
														<td>Servis IT</td>
														<td>10</td>
														<td>1</td>
														<td>ks</td>
														<td>0</td>
														<td>10</td>
													</tr>

												</tbody>
											</table>
										</div>

										<h2>Material</h2>
										<div class="table-responsive">
											<table class="table table-hover mails m-0">
												<thead>
													<tr>
														<th>
															ID
												<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th style={{ width: '35%' }}>
															Name{' '}
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															{' '}
															Cena/Mn.
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Mn.
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Jednotka
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>

														<th>
															Zlava
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Spolu
															<span class="tableArrow">
																<i class="fa fa-arrow-down" />
															</span>
														</th>
													</tr>
												</thead>

												<tbody>
													<tr class="">
														<td>152</td>
														<td>
															{' '}
															<Link className="" to={{ pathname: `/demoHelpdesk/taskTop3` }} style={{ color: "#1976d2" }}>
																Tlaciaren
												</Link>
														</td>
														<td>10</td>
														<td>1</td>
														<td>ks</td>
														<td>0</td>
														<td>10</td>
													</tr>

												</tbody>
											</table>
										</div>

										<div class="d-flex justify-content-between">
											<div class="p-2">
												<p>Page 1 of 0 ｜ Task number: 0 </p>
											</div>
											<div class="p-2">
												<p>1</p>
											</div>
											<div class="p-2">
												<p>Items per page: 20</p>
											</div>
										</div>
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
