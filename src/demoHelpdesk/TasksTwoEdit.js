import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl } from 'react-bootstrap';
import Comments from './components/comments.js';
import Subtasks from './components/subtasks.js';
import Items from './components/items.js';
import Select from 'react-select';

const tableStyle = {
	border: 'none',
};

export default class TasksTwoEdit extends Component {
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
		const statuses = [
			{ value: 'new', label: 'New' },
			{ value: 'open', label: 'Open' },
			{ value: 'open', label: 'Pending' },
			{ value: 'pending', label: 'Closed' },
		];
		const projects = [
			{ value: 'hotline@lansystems.sk', label: 'hotline@lansystems.sk' },
			{ value: 'LanHelpdesk', label: 'LanHelpdesk' },
			{ value: 'www.otpreal.sk', label: 'www.otpreal.sk' },
		];

		const users = [
			{ value: 'Branislav Susta', label: 'Branislav Susta' },
			{ value: 'Janka Mantova', label: 'Janka Mantova' },
		];

		const companies = [
			{ value: 'LAN Systems s.r.o.', label: 'LAN Systems s.r.o.' },
			{ value: 'OTP Real s.r.o.', label: 'OTP Real s.r.o.' },

		];

		const times = [
			{ value: '10:00 12.2.2019', label: '10:00 12.2.2019' },

		];

		const sla = [
			{ value: 'Nie', label: 'Nie' },
			{ value: 'Ano', label: 'Ano' },

		];

		const repeat = [
			{ value: 'none', label: 'none' },
			{ value: 'every day', label: 'every day' },

		];

		const types = [
			{ value: 'Pausal', label: 'Pausal' },
			{ value: 'Projekt', label: 'Projekt' },
			{ value: 'Cenova ponuka', label: 'Cenova ponuka' },
			{ value: 'Reklamácia', label: 'Reklamácia' },
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
			<div>
				<div className="row" style={{}}>
					<div className="col-lg-12">
						<div class="card-box p-t-0" style={{ maxWidth: 1284, background: '#F9F9F9', borderRadius: 0, padding: "none" }}>
							<div class="d-flex flex-row">
								<div class="align-self-center" style={{}}>

									<h1># 143 Nefunguje klavesnica</h1>

								</div>
								<div class="ml-auto p-2 align-self-center">
									{' '}
									<button type="button" class="btn btn-link waves-effect">
										<i
											class="fas fa-trash"
											style={{
												color: '#4a81d4',
												fontSize: '1.2em',
											}}
										/>
									</button>
								</div>
							</div>
							<div class="row">

							</div>
							<div class="row">
								<div className="col-lg-12">
									<strong>Tagy: </strong>
									<span class="label label-info m-r-5">Po pracovných hodínach</span>
									<span class="label label-success m-r-5">Telefonovať</span>
								</div>
								<div className="col-lg-12 p-0">
									<div className="col-lg-6">
										<div class="m-t-20">
											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Status</label>
												<div className="col-7">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Projekt</label>
												<div className="col-7">
													<Select options={projects} styles={selectStyle} />
												</div>
											</div>
											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Zadal</label>
												<div className="col-7">
													<Select options={users} styles={selectStyle} />
												</div>
											</div>
											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Firma</label>
												<div className="col-7">
													<Select options={companies} styles={selectStyle} />
												</div>
											</div>
											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Riesi</label>
												<div className="col-7">
													<Select options={users} styles={selectStyle} />
												</div>
											</div>
										</div>
									</div>
									<div className="col-lg-6">
										<div class="m-t-20">
											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Pripomienka</label>
												<div className="col-7">
													<Select options={times} styles={selectStyle} />
												</div>
											</div>
											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Deadline</label>
												<div className="col-7">
													<Select options={times} styles={selectStyle} />
												</div>
											</div>
											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Opakovanie</label>
												<div className="col-7">
													<Select options={repeat} styles={selectStyle} />
												</div>
											</div>

											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Typ</label>
												<div className="col-7">
													<Select options={types} styles={selectStyle} />
												</div>
											</div>
											<div class="form-group m-b-0 row">
												<label className="col-5 col-form-label">Mimo pracovných hodín</label>
												<div className="col-7">
													<Select options={sla} styles={selectStyle} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<label class="m-t-5">Popis</label>
							<input type="text" id="simpleinput" class="form-control" />

							<Subtasks />
							<Items />
							<Comments />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
