import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class TasksRow2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
		};
	}
	render() {
		return (
			<div>
				<div className="row">
					<div class="col-md-12">
						<div class="card-box">
							<div class="table-responsive">
								<table class="table table-hover mails m-0">
									<thead>
										<tr>
											<th>
												<div class="checkbox checkbox-primary checkbox-single m-r-15">
													<input id="action-checkbox" type="checkbox" />
													<label for="action-checkbox" />
												</div>
											</th>
											<th>
												ID
												<span class="tableArrow">
													<i class="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Status{' '}
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
												Zadal{' '}
												<span class="tableArrow">
													<i class="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Firma{' '}
												<span class="tableArrow">
													<i class="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Riesi{' '}
												<span class="tableArrow">
													<i class="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Created{' '}
												<span class="tableArrow">
													<i class="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Deadline{' '}
												<span class="tableArrow">
													<i class="fa fa-arrow-down" />
												</span>
											</th>
										</tr>
									</thead>

									<tbody>
										<tr class="">
											<td>
												<div class="checkbox checkbox-primary checkbox-single m-r-15">
													<input id="checkbox2" type="checkbox" checked="" />
													<label for="checkbox2" />
												</div>
											</td>
											<td>152</td>
											<td>New</td>
											<td>
												{' '}
												<Link className="" to={{ pathname: `/demoHelpdesk/taskTop3` }} style={{color:"#1976d2"}}>
												Task top two collums whit inline labels and grey background
												</Link>
											</td>
											<td>Branislav Šusta</td>
											<td>LAN Systems s.r.o.</td>
											<td>Patrik Patoprsty</td>
											<td>15.04 2.10.2018</td>
											<td>15.05 2.11.2018</td>
										</tr>
										<tr class="">
											<td>
												<div class="checkbox checkbox-primary checkbox-single m-r-15">
													<input id="checkbox2" type="checkbox" checked="" />
													<label for="checkbox2" />
												</div>
											</td>
											<td>152</td>
											<td>New</td>
											<td>
												{' '}
												<Link className="" to={{ pathname: `/demoHelpdesk/taskSide3` }} style={{color:"#1976d2"}}>
													Editácia task z atribútmi na lavom boku
												</Link>
											</td>
											<td>Branislav Šusta</td>
											<td>LAN Systems s.r.o.</td>
											<td>Patrik Patoprsty</td>
											<td>15.04 2.10.2018</td>
											<td>15.05 2.11.2018</td>
										</tr>
										<tr class="">
											<td>
												<div class="checkbox checkbox-primary checkbox-single m-r-15">
													<input id="checkbox2" type="checkbox" checked="" />
													<label for="checkbox2" />
												</div>
											</td>
											<td>152</td>
											<td>New</td>
											<td>
												{' '}
												<Link className="" to={{ pathname: `/demoHelpdesk/TaskTopChiptask` }} style={{color:"#1976d2"}}>
													Editácia tasku ako chiptask
												</Link>
											</td>
											<td>Branislav Šusta</td>
											<td>LAN Systems s.r.o.</td>
											<td>Patrik Patoprsty</td>
											<td>15.04 2.10.2018</td>
											<td>15.05 2.11.2018</td>
										</tr>
									</tbody>
								</table>
								<div class="d-flex justify-content-between">
									<div class="p-2">
										<p>Page 1 of 0 ｜ Task number: 0 </p>
									</div>
									<div class="p-2">
										<p>0</p>
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
		);
	}
}
