import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Col } from 'react-bootstrap';

const tableStyle = {
	border: 'none',
};

const tableStyleCenter = {
	textAlign: 'center',
};

const tableStyleCenterNoBorder = {
	textAlign: 'center',
	border: 'none',
};

export default class Items extends Component {
	render() {
		return (
			<div class="">
				<div class="row">
					<div class="col-md-12">
						<div class="table-responsive">
							<table class="table table-centered table-borderless table-hover mb-0">
								<thead class="thead-light">
									<tr>
										<th style={tableStyle} width="5%">#</th>
										<th style={tableStyle} width="70%">Material</th>
										<th style={tableStyle}>Pocet</th>
										<th style={tableStyle}>Nakup/ks</th>
										<th style={tableStyle}>Marza</th>
										<th style={tableStyle}>Predaj/ks</th>
										<th style={tableStyleCenterNoBorder}>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th style={tableStyle} width="5%">1</th>
										<td style={tableStyle}>LCD</td>
										<td style={tableStyle}>1</td>
										<td style={tableStyle}>300</td>
										<td style={tableStyle}>10%</td>
										<td style={tableStyle}>330</td>
										<td style={tableStyleCenter}>
											<button class="btn btn-link waves-effect">
												<i class="fa fa-times" />
											</button>
										</td>
									</tr>
									<tr>
										<th style={tableStyle} width="5%"></th>
										<td style={tableStyle}>
											<input
												type="text"
												class="form-control mb-2"
												id="inlineFormInput"
												placeholder="Name"
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												class="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												class="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												class="form-control mb-2"
												id="inlineFormInput"
												placeholder="10"
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												class="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyleCenterNoBorder}>
											<button class="btn btn-link waves-effect">
												<i class="fa fa-plus" />
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="row justify-content-end">
							<div class="col-md-3">
								<p class="text-right m-b-0">
									<b>Sub-total:</b> 2930.00
								</p>

							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
