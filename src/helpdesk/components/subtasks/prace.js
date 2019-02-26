import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Col, Tabs, Tab, } from 'react-bootstrap';
import Select from 'react-select';
import { rebase } from '../../../index';

const selectStyle = {
	control: base => ({
		...base,
		minHeight: 30,
		backgroundColor: 'inherit',
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
		backgroundColor: 'inherit',
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px',
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0,
		backgroundColor: 'inherit',
	}),
};

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

export default class Prace extends Component {
	constructor(props){
		super(props);
		this.state={
			editedSubtaskTitle: "",
			editedSubtaskQuantity: "0",
			editedSubtaskWorkType:null,
			focusedSubtask: null,
		}
	}

	render() {

		return (
			<div className="row">
				<div className="col-md-12">
					<div className="table-responsive">
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
									<th style={tableStyle}>
									</th>
									<th style={tableStyle} width="60%">Názov</th>
									<th style={tableStyle} width="25%">Typ</th>
									<th style={tableStyle}>Mn.</th>
									<th style={tableStyleCenterNoBorder}>Action</th>
								</tr>
							</thead>
							<tbody>
								{
									this.props.subtasks.map((subtask)=>
									<tr>
										<td style={tableStyle}>
											<input type="checkbox" checked={subtask.done} onClick={()=>{
												this.props.updateSubtask(subtask.id,{done:!subtask.done})
												rebase.updateDoc('taskWorks/'+subtask.id,{done:!subtask.done});
												}} />
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
												focusedSubtask: subtask.id
											});
										}}
										onChange={e =>{
											this.setState({ editedSubtaskQuantity: e.target.value })}
										}
										/>
									</td>
									<td style={tableStyleCenter}>
										<button className="btn btn-link waves-effect" onClick={()=>{
												if(window.confirm('Are you sure?')){
													rebase.removeDoc('taskWorks/'+subtask.id).then(()=>this.props.removeSubtask(subtask.id));
												}
											}}>
											<i className="fa fa-times"  />
											</button>
										</td>
									</tr>
								)
							}
						</tbody>
					</table>
				</div>
				<div className="row justify-content-end">
					<div className="col-md-3">
						<p className="text-right">
							<b>Sub-total:</b> 2930.00
							</p>

						</div>
					</div>
				</div>

			</div>
		);
	}
}
