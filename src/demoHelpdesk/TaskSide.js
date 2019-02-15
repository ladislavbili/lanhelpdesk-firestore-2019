import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Comments from './components/comments.js';
import Subtasks from './components/subtasks.js';
import Items from './components/items';

const tableStyle = {
	border: 'none',
};

export default class TaskSide extends Component {
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
			<div className="content-page">
				<div className="content">
					<div className="container-fluid">
						<div className="row">
							<div className="col-lg-8">
								<div class="card-box">
									<h1># 142 Nefunguje klavesnica</h1>
									<hr />

									<div className="m-b-20">
										<strong>Tagy: </strong>
										<span class="label label-info m-r-5">Mimo pracovných hodín</span>
										<span class="label label-success m-r-5">Telefonovať</span>
									</div>
									<label class="">Popis</label>
									<textarea class="form-control" rows="2" />
									<Subtasks />
									<Items />
									<Comments />
								</div>
							</div>
							<div className="col-lg-4">
								<div class="card-box">
									<div class="table-responsive">
										<table class="table">
											<tbody>
												<tr>
													<td style={tableStyle}>
														<strong>Status: </strong>
													</td>
													<td style={tableStyle}>
														<span class="label label-pink">New</span>
													</td>
												</tr>
												<tr>
													<td style={tableStyle}>
														<strong>Projekt: </strong>
													</td>
													<td style={tableStyle}>hotline@lansystems.sk</td>
												</tr>
												<tr>
													<td style={tableStyle}>
														<strong>Zadal: </strong>
													</td>
													<td style={tableStyle}>Branislav Šusta</td>
												</tr>
												<tr>
													<td style={tableStyle}>
														<strong>Projekt: </strong>
													</td>
													<td style={tableStyle}>hotline@lansystems.sk</td>
												</tr>
												<tr>
													<td style={tableStyle}>
														<strong>Riesi: </strong>
													</td>
													<td style={tableStyle}>Branislav Šusta</td>
												</tr>
												<tr>
													<td style={tableStyle}>
														<strong>Pripomienka: </strong>
													</td>
													<td style={tableStyle}>12:00 31.12.2018</td>
												</tr>
												<tr>
													<td style={tableStyle}>
														<strong>Deadline: </strong>
													</td>
													<td style={tableStyle}>12:00 31.12.2018</td>
												</tr>
												<tr>
													<td style={tableStyle}>
														<strong>Opakovanie: </strong>
													</td>
													<td style={tableStyle}>12:00 31.12.2018</td>
												</tr>
												<tr>
													<td style={tableStyle}>
														<strong>Pausal/Projekt: </strong>
													</td>
													<td style={tableStyle}>Pausal</td>
												</tr>
												<tr>
													<td style={tableStyle}>
														<strong>Práce mimo pracovných hodín: </strong>
													</td>
													<td style={tableStyle}>Nie</td>
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
