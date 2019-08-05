import React, { Component } from 'react';
import Select from 'react-select';
import {Button} from 'reactstrap';
import ReactToPrint from 'react-to-print';
import Comments from '../components/comments.js';
import Materials from '../components/materials';
import Subtasks from '../components/subtasks';

import TaskAdd from './taskAddContainer';

import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray, timestampToString} from '../../helperFunctions';
import {selectStyle, invisibleSelectStyleNoArrow} from '../../scss/selectStyles';

export default class TasksTwoEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		console.log(this.props.print);

		if (!this.props.print) {
			return (<div>
			</div>);
		}
		return (
						<div className="card-box scrollable fit-with-header-and-commandbar">
							<div className="d-flex p-2">
								<div className="row flex">
									<h1 className="center-hor text-extra-slim"># {this.props.match.params.taskID}</h1>
									<span className="center-hor">
							    	<input type="text" value={this.state.title} className="task-title-input text-extra-slim hidden-input"/>
									</span>
									<div className="ml-auto center-hor">
									<span className="label label-info" style={{backgroundColor:this.props.status && this.props.status.color?this.props.status.color:'white'}}>{this.state.status?this.state.status.title:'Neznámy status'}</span>
									</div>
								</div>
							</div>

							<hr/>

							<div className="row">
								<div className="col-lg-12 d-flex">
									<p className="text-muted">Created by Branislav Šusta at {this.props.createdAt?(timestampToString(this.props.createdAt)):''}</p>
									<p className="text-muted ml-auto">{this.props.statusChange?('Status changed at ' + timestampToString(this.props.statusChange)):''}</p>
								</div>

							</div>
							<div className="row">
								<div className="col-lg-12 row">
									<div className="center-hor text-slim">Tagy: </div>
									<div className="f-1">
										<Select
											value={this.props.tags}
											isMulti
											options={this.props.allTags}
											isDisabled={this.props.defaultFields.tags.fixed}
											styles={invisibleSelectStyleNoArrow}
											/>
									</div>
								</div>
								<div className="col-lg-12 row">
									<div className="center-hor text-slim">Assigned to: </div>
									<div className="f-1">
										<Select
											value={this.props.assignedTo}
											isMulti
											isDisabled={this.props.defaultFields.assignedTo.fixed}
											options={this.props.users}
											styles={invisibleSelectStyleNoArrow}
											/>
									</div>
								</div>
								<div className="col-lg-12">
									<div className="col-lg-6">
										<div className="p-r-20">
											<div className="row">
												<label className="col-5 col-form-label text-slim">Typ</label>
												<div className="col-7">
													<Select
					                  value={this.props.type}
														isDisabled={this.props.defaultFields.type.fixed}
														styles={invisibleSelectStyleNoArrow}
					                  options={this.props.taskTypes}
					                  />
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label text-slim">Projekt</label>
												<div className="col-7">
													<Select
														value={this.props.project}
														options={this.props.projects}
														styles={invisibleSelectStyleNoArrow}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label text-slim">Zadal</label>
												<div className="col-7">
													<Select
														value={this.props.requester}
														isDisabled={this.props.defaultFields.requester.fixed}
														options={this.props.users}
														styles={invisibleSelectStyleNoArrow}
														/>
												</div>
											</div>
										</div>
									</div>

									<div className="col-lg-6">
										<div className="">
											<div className="row">
												<label className="col-5 col-form-label text-slim">Firma</label>
												<div className="col-7">
													<Select
														value={this.props.company}
														isDisabled={this.props.defaultFields.company.fixed}
														options={this.props.companies}
														styles={invisibleSelectStyleNoArrow}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label text-slim">Deadline</label>
												<div className="col-7">
													{/*className='form-control hidden-input'*/}
													<input
														className='form-control'
														placeholder="Status change date"
														type="datetime-local"
														value={this.props.deadline}
														/>
												</div>
											</div>

											<div className="row">
												<label className="col-5 col-form-label text-slim">Opakovanie</label>
												<div className="col-7">
													<Select styles={invisibleSelectStyleNoArrow} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{false && <div className="form-group m-b-0 row">
								<label className="col-5 col-form-label text-slim">Mimo pracovných hodín</label>
								<div className="col-7">
									<Select
										value={this.props.overtime}
										styles={invisibleSelectStyleNoArrow}
										/>
								</div>
							</div>}
							{false && <div className="row">
								<label className="col-5 col-form-label text-slim">Pripomienka</label>
								<div className="col-7">
									{}
									<input
										className='form-control'
										placeholder="Status change date"
										type="datetime-local"
										value={this.props.reminder}
										/>
								</div>
							</div>}


							<label className="m-t-5  text-slim">Popis</label>
							<textarea className="form-control b-r-0" placeholder="Enter task description" value={this.props.description} />

						</div>
		);
	}
}
