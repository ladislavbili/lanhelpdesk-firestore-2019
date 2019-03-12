import React, { Component } from 'react';
import { Link } from 'react-router-dom';



export default class Reports extends Component {

	render() {
		return (
			<div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>

					<div className="container-fluid">

						<div className="row">
							<div className="col-md-12">
								<div className="card-box">
									<h2>Task</h2>
									<div className="table-responsive">
										<table className="table table-hover mails m-0">
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
												<tr className="">
													<td>152</td>

													<td>
														{' '}
														<Link className="" to={{ pathname: `/helpdesk/taskTop3` }} style={{ color: "#1976d2" }}>
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
										<div className="table-responsive">
											<table className="table table-hover mails m-0">
												<thead>
													<tr>
														<th>
															ID
												<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th style={{ width: '35%' }}>
															Name{' '}
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Typ služby
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															{' '}
															Cena/Mn.
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Mn.
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Jednotka
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>

														<th>
															Zlava
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Spolu
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
													</tr>
												</thead>

												<tbody>
													<tr className="">
														<td>152</td>
														<td>
															{' '}
															<Link className="" to={{ pathname: `/helpdesk/taskTop3` }} style={{ color: "#1976d2" }}>
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
										<div className="table-responsive">
											<table className="table table-hover mails m-0">
												<thead>
													<tr>
														<th>
															ID
												<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th style={{ width: '35%' }}>
															Name{' '}
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															{' '}
															Cena/Mn.
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Mn.
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Jednotka
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>

														<th>
															Zlava
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
														<th>
															Spolu
															<span className="tableArrow">
																<i className="fa fa-arrow-down" />
															</span>
														</th>
													</tr>
												</thead>

												<tbody>
													<tr className="">
														<td>152</td>
														<td>
															{' '}
															<Link className="" to={{ pathname: `/helpdesk/taskTop3` }} style={{ color: "#1976d2" }}>
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

										<div className="d-flex justify-content-between">
											<div className="p-2">
												<p>Page 1 of 0 ｜ Task number: 0 </p>
											</div>
											<div className="p-2">
												<p>1</p>
											</div>
											<div className="p-2">
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
