import React, { Component } from 'react';
import Select from 'react-select';
import { selectStyle, invisibleSelectStyle} from '../selectStyles';

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

			newTitle:'',
			newWorkType:null,
			newQuantity:0,
			newExtraWork:false,
			newDiscount:0,
			newPrice:0,
		}
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.taskID!==props.match.params.taskID){
			this.setState({
				newTitle:'',
				newWorkType:null,
				newQuantity:0,
				newExtraWork:false,
				newDiscount:0
			})
		}
		if(((this.props.company===null && props.company!==null)|| (props.company===null && this.props.company!==null)|| (this.props.company!==null && this.props.company.id!==props.company.id)) && this.state.newWorkType ){
			let price = this.state.newWorkType.prices.find((item)=>props.company && item.pricelist===props.company.pricelist.id);
			if(price === undefined){
				price = 0;
			}else{
				price = price.price;
			}
			this.setState({newPrice:price})
		}
	}

	render() {
		//const afterHours= this.props.company && this.state.newExtraWork ? this.props.company.pricelist.afterHours : 0;
		//const unitPrice= this.state.newPrice?(this.state.newPrice/100*afterHours+this.state.newPrice):0;
		return (
			<div className="row">
				<div className="col-md-12">
					<div >
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
									<th style={tableStyle} width="25">
									</th>
									<th style={tableStyle}>Názov</th>
										<th style={tableStyle} width="100">Mn.</th>
									<th style={tableStyle} width="170">Typ</th>
									<th style={{...tableStyleCenterNoBorder}} width="124">Action</th>
								</tr>
							</thead>
							<tbody>
								{
									this.props.subtasks.map((subtask)=>
									<tr key={subtask.id}>
										<td style={tableStyle}>
											<input type="checkbox" checked={subtask.done} onChange={()=>{
												this.props.updateSubtask(subtask.id,{done:!subtask.done})
												}} />
										</td>
										<td style={tableStyle}>
											<div>
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
									<td style={tableStyle}>
										<Select
											value={subtask.workType}
											onChange={(workType)=>{
												let price = workType.prices.find((item)=>this.props.company && item.pricelist===this.props.company.pricelist.id);
												if(price === undefined){
														price = 0;
												}else{
													price = price.price;
												}
												this.props.updateSubtask(subtask.id,{workType:workType.id,price})
											}}
											options={this.props.workTypes}
											styles={invisibleSelectStyle}
											/>
									</td>
									<td style={tableStyleCenter}>
										<button className="btn btn-link waves-effect">
											<i className="fa fa-arrow-up"  />
										</button>
										<button className="btn btn-link waves-effect">
												<i className="fa fa-arrow-down"  />
										</button>
										<button className="btn btn-link waves-effect" onClick={()=>{
												if(window.confirm('Are you sure?')){
													this.props.removeSubtask(subtask.id);
												}
											}}>
											<i className="fa fa-times"  />
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
										value={this.state.newTitle}
										onChange={(e)=>this.setState({newTitle:e.target.value})}
										style={{ height: 30 }}
										/>
								</td>
								<td style={tableStyle}>
									<input
										type="number"
										value={this.state.newQuantity}
										onChange={(e)=>this.setState({newQuantity:e.target.value})}
										className="form-control mb-2"
										id="inlineFormInput"
										placeholder=""
										style={{ height: 30 }}
										/>
								</td>
								<td style={tableStyle} className="p-t-0">
									<Select
										value={this.state.workType}
										onChange={(workType)=>{
											let price=0;
											price = workType.prices.find((item)=>this.props.company && item.pricelist===this.props.company.pricelist.id);
											if(price === undefined){
												price = 0;
											}else{
												price = price.price;
											}
											this.setState({newWorkType:workType,newPrice:price})
											}
										}
										options={this.props.workTypes}
										styles={selectStyle}
										/>
								</td>
								<td style={tableStyleCenter}>
									<button className="btn btn-link waves-effect"
										disabled={this.state.newWorkType===null}
										onClick={()=>{
											let body={
												discount:this.state.newDiscount!==''?this.state.newDiscount:0,
												extraPrice:this.props.company?parseFloat(this.props.company.pricelist.afterHours) : 0,
												extraWork:this.state.newExtraWork,
												price:this.state.newPrice!==''?this.state.newPrice:0,
												quantity:this.state.newQuantity!==''?this.state.newQuantity:0,
												title:this.state.newTitle,
												workType: this.state.newWorkType.id
											}
											this.setState({
												newDiscount:0,
												newExtraWork:false,
												newQuantity:0,
												newTitle:'',
											});
											this.props.submitService(body);
											}
										}
										>
										<i className="fa fa-plus" />
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="row justify-content-end">
					<div className="col-md-3">
						<p className="text-right">
							<b>Sub-total:</b>
							{(this.props.subtasks.map((subtask)=>parseFloat(subtask.totalPrice)).reduce((acc, cur)=> acc+cur,0)).toFixed(2)}
						</p>

						</div>
					</div>
				</div>

			</div>
		);
	}
}
