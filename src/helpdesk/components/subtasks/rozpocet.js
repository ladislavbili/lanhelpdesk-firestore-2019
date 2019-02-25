import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Col, Tabs, Tab, } from 'react-bootstrap';
import Select from 'react-select';
import { rebase } from '../../../index';


const tableStyle = {
	border: 'none',
};

const tableStyleCenter = {
	textAlign: 'right',
	border: 'none',
};

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

const tableStyleCenterNoBorder = {
	textAlign: 'center',
	border: 'none',
};

export default class Rozpocet extends Component {
	constructor(props){
		super(props);
		this.state={
			editedSubtaskTitle: "",
			editedSubtaskQuantity: "0",
			editedSubtaskDiscount:0,
			editedSubtaskWorkType:null,
			focusedSubtask: null,
		}
	}

	render() {

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
									{
										this.props.subtasks.map((subtask)=>
										<tr>
										<td style={tableStyle}>
											<input type="checkbox" />
										</td>
										<td style={tableStyle}>
											<div style={{ background: '#dcf4f9', borderRadius: '5px', padding: 5 }}>
												<input
													className="invisible-input"
													value={
														subtask.id === this.state.focusedSubtask
														? this.state.editedSubtaskTitle
														: subtask.title
													}
													onBlur={() => {
													//submit
													this.props.updateSubtask(subtask.id,{title:this.state.editedSubtaskTitle})
													rebase.updateDoc('taskWorks/'+subtask.id,{title:this.state.editedSubtaskTitle});
													this.setState({ focusedSubtask: null });
												}}
												onFocus={() => {
													this.setState({
														editedSubtaskTitle: subtask.title,
														editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
														editedSubtaskWorkType: subtask.workType,
														editedSubtaskDiscount: subtask.discount,
														focusedSubtask: subtask.id
													});
												}}
												onChange={e =>{
													this.setState({ editedSubtaskTitle: e.target.value })}
												}
												/>
											</div>
										</td>
										<td style={tableStyle}>
											<Select
												value={subtask.workType}
												onChange={(workType)=>{
													this.props.updateSubtask(subtask.id,{workType})
													rebase.updateDoc('taskWorks/'+subtask.id,{workType:workType.id});
												}}
												options={this.props.workTypes}
												styles={selectStyle}
												/>
										</td>
										<td style={tableStyle}>
											<input
												type="number"
												className="invisible-input"
												value={
													subtask.id === this.state.focusedSubtask
													? this.state.editedSubtaskQuantity
													: subtask.quantity
												}
												onBlur={() => {
												//submit
												this.props.updateSubtask(subtask.id,{quantity:this.state.editedSubtaskQuantity})
												rebase.updateDoc('taskWorks/'+subtask.id,{quantity:this.state.editedSubtaskQuantity});
												this.setState({ focusedSubtask: null });
											}}
											onFocus={() => {
												this.setState({
													editedSubtaskTitle: subtask.title,
													editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
													editedSubtaskWorkType: subtask.workType,
													editedSubtaskDiscount: subtask.discount,
													focusedSubtask: subtask.id
												});
											}}
											onChange={e =>{
												this.setState({ editedSubtaskQuantity: e.target.value })}
											}
											/>
										</td>
										<td style={tableStyle}>
											{subtask.price}
										</td>
										<td style={tableStyle}>
											<input
												type="number"
												className="invisible-input"
												value={
													parseInt(subtask.id === this.state.focusedSubtask
													? this.state.editedSubtaskDiscount
													: subtask.discount)
												}
												onBlur={() => {
													console.log(subtask);
													console.log(this.state);
												this.props.updateSubtask(subtask.id,{discount:this.state.editedSubtaskDiscount})
												rebase.updateDoc('taskWorks/'+subtask.id,{discount:this.state.editedSubtaskDiscount});
												this.setState({ focusedSubtask: null });
											}}
											onFocus={() => {
												this.setState({
													editedSubtaskTitle: subtask.title,
													editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
													editedSubtaskWorkType: subtask.workType,
													editedSubtaskDiscount: subtask.discount,
													focusedSubtask: subtask.id
												});
											}}
											onChange={e =>{
												this.setState({ editedSubtaskDiscount: e.target.value })}
											}
											/>
										</td>
										<td style={tableStyle}>
											{
												parseFloat(subtask.price)
												-
												parseFloat(subtask.price)*parseInt(subtask.id === this.state.focusedSubtask?(this.state.editedSubtaskDiscount===''?0:this.state.editedSubtaskDiscount):subtask.discount)/100
											}
										</td>
										<td style={tableStyleCenter}>
											<button className="btn btn-link waves-effect">
												<i className="fa fa-times" />
											</button>
										</td>
									</tr>
								)
								}


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
