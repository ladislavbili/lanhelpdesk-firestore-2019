import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Col, Tabs, Tab, } from 'react-bootstrap';
import Select from 'react-select';


const tableStyle = {
	border: 'none',
};

const tableStyleCenter = {
	textAlign: 'right',
	border: 'none',
};

const tableStyleCenterNoBorder = {
	textAlign: 'center',
	border: 'none',
};

export default class Rozpocet extends Component {

	render() {
		const types = [
			{ value: 'Servis IT', label: 'Servis IT' },
			{ value: 'Programovanie www', label: 'Programovanie www' },
		];

		const selectStyle = {
			control: base => ({
				...base,
				minHeight: 30,
				backgroundColor: 'white',
			}),
			dropdownIndicator: base => ({
				...base,
				padding: 4,
			}),
			clearIndicator: base => ({
				...base,
				padding: 4,
			}),
			multiValue: base => ({
				...base,
				backgroundColor: 'white',
			}),
			valueContainer: base => ({
				...base,
				padding: '0px 6px',
			}),
			input: base => ({
				...base,
				margin: 0,
				padding: 0,
				backgroundColor: 'white',
			}),
		};

		return (
			<div className="">
				<div className="row">
					<div className="col-md-12">
						<div className="table-responsive">
							<table className="table table-centered table-borderless table-hover mb-0">
								<thead className="thead-light">
									<tr>
										<th style={tableStyle} width="5%">
											<input type="checkbox" />
										</th>
										<th style={tableStyle} width="40%">Názov</th>
										<th style={tableStyle} width="20%">Typ</th>
										<th style={tableStyle}>Mn.</th>
										<th style={tableStyle}>Cena/Mn.</th>
										<th style={tableStyle}>Zlava</th>
										<th style={tableStyle}>Cena</th>
										<th style={tableStyleCenterNoBorder}>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td style={tableStyle}>
											<input type="checkbox" />
										</td>
										<td style={tableStyle}>
											<div style={{ background: '#dcf4f9', borderRadius: '5px', padding: 5 }}>
												Subtask 1 - treba zarovnať nalavo + drag&drop zmena poradia
											</div>
										</td>
										<td style={tableStyle}>
											Servis IT
										</td>
										<td style={tableStyle}>
											5
										</td>
										<td style={tableStyle}>
											22,90
										</td>
										<td style={tableStyle}>
											0 %
										</td>
										<td style={tableStyle}>
											22.9
										</td>
										<td style={tableStyleCenter}>
											<button className="btn btn-link waves-effect">
												<i className="fa fa-times" />
											</button>
										</td>
									</tr>
									<tr>
										<td style={tableStyle}>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle} className="p-t-0">
											<Select options={types} styles={selectStyle} />
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyleCenter}>
											<button className="btn btn-link waves-effect">
												<i className="fa fa-plus" />
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="row justify-content-end">
							<div className="col-md-6">
								<button type="button" className="btn btn-link waves-effect">
									<i
										className="fas fa-sync"
										style={{
											color: '#4a81d4',
											fontSize: '1em',
										}}
									/>
									<span style={{
										color: '#4a81d4',
										fontSize: '1em',
									}}> Aktualizovať ceny podla cenníka</span>
								</button>
							</div>
							<div className="col-md-6">
								<p className="text-right">
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
