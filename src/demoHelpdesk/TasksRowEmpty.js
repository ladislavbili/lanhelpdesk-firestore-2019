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
											<td />
											<td />
											<td />
											<td style={{ color: 'red' }}>Vyhľadávaniu nezodpovedajú žiadne úlohy.</td>
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
