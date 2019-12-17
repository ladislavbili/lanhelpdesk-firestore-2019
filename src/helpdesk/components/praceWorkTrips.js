import React, { Component } from 'react';
import {Input } from 'reactstrap';
import Select from 'react-select';
import { selectStyle, invisibleSelectStyle} from '../../scss/selectStyles';
import { sameStringForms} from '../../helperFunctions';

export default class Prace extends Component {
	constructor(props){
		super(props);
		let newSubtaskPrice = 0;

		if(props.company && props.defaultType){
			newSubtaskPrice = this.props.defaultType.prices.find((item)=>item.pricelist===props.company.pricelist.id).price;
		}
		this.state={
			showAddSubtask:false,

			editedSubtaskTitle: "",
			editedSubtaskQuantity: "0",
			editedSubtaskDiscount:0,
			editedSubtaskWorkType:null,
			focusedSubtask: null,
			editedSubtaskPrice: 0,
			selectedIDs:[],

			newSubtaskTitle:'',
			newSubtaskPrice,
			newSubtaskWorkType:this.props.defaultType,
			newSubtaskQuantity:0,
			newSubtaskExtraWork:false,
			newSubtaskDiscount:0,
			newSubtaskAssigned:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,

			//trips
			showAddTrip:false,

			focusedTrip:null,
			editedTripQuantity:0,
			editedTripDiscount:0,
			editedTripPrice:0,

			newTripType:this.props.tripTypes.length>0?this.props.tripTypes[0]:null,
			newTripAssignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
			newTripQuantity:1,
			newTripPrice:this.props.tripTypes.length>0 && props.company?this.props.tripTypes[0].prices.find((price)=>price.pricelist===props.company.pricelist.id).price:0,
			newTripDiscount:0,
		}
		this.onFocusWorkTrip.bind(this);
		this.onFocusSubtask.bind(this);
	}

	componentWillReceiveProps(props){
		if(this.props.taskID!==props.taskID){
			let newSubtaskPrice = this.state.newSubtaskPrice;
			if(props.defaultType){
				newSubtaskPrice = props.defaultType.prices.find((item)=>props.company && item.pricelist===props.company.pricelist.id);
				if(newSubtaskPrice === undefined){
					newSubtaskPrice = 0;
				}else{
					newSubtaskPrice = newSubtaskPrice.price;
				}
			}
			this.setState({
				showAddSubtask:false,
				newSubtaskTitle:'',
				newSubtaskWorkType:props.defaultType,
				newSubtaskQuantity:0,
				newSubtaskExtraWork:false,
				newSubtaskDiscount:0,
				newSubtaskPrice,
				newSubtaskAssigned:null,

				focusedTrip:null,
				editedTripQuantity:0,
				editedTripDiscount:0,
				newTripPrice:props.tripTypes.length>0 && props.company?props.tripTypes[0].prices.find((price)=>price.pricelist===props.company.pricelist.id).price:0,
				newTripType:props.tripTypes.length>0?props.tripTypes[0]:null,
				newTripAssignedTo:props.taskAssigned.length>0?props.taskAssigned[0]:null,
				newTripQuantity:1,
				newTripDiscount:0,
				showAddTrip:false,
			})
		}else if(!sameStringForms(this.props.defaultType,props.defaultType)){
			if(props.defaultType){
				let price = props.defaultType.prices.find((item)=>props.company && item.pricelist===props.company.pricelist.id);
				if(price === undefined){
					price = 0;
				}else{
					price = price.price;
				}
				this.setState({
					newSubtaskWorkType:props.defaultType,
					newSubtaskPrice:price,
				})
			}else{
				this.setState({
					newSubtaskWorkType:props.defaultType,
				})
			}
	}

		if(!sameStringForms(this.props.taskAssigned,props.taskAssigned)){
			if(!props.taskAssigned.some((item)=>item.id===(this.state.newSubtaskAssigned?this.state.newSubtaskAssigned.id:null))){
				if(props.taskAssigned.length>0){
					this.setState({newSubtaskAssigned:props.taskAssigned[0],newTripAssignedTo:props.taskAssigned[0] });
				}else{
					this.setState({newSubtaskAssigned:null, newTripAssignedTo:null });
				}
			}
		}

		if(this.state.newSubtaskWorkType &&
			!sameStringForms(this.props.company,props.company) &&
			props.company
			){
			let price = this.state.newSubtaskWorkType.prices.find((item)=>item.pricelist===props.company.pricelist.id);
			if(price === undefined){
				price = 0;
			}else{
				price = price.price;
			}
			this.setState({newSubtaskPrice:price})
		}
		if(this.state.newTripType &&
			!sameStringForms(this.props.company,props.company) &&
			props.company
			){
			let price = this.state.newTripType.prices.find((item)=>item.pricelist===props.company.pricelist.id);
			if(price === undefined){
				price = 0;
			}else{
				price = price.price;
			}
			this.setState({newTripPrice:price})
		}
	}

	getCreationError(){
		if(this.props.extended || (this.state.newSubtaskWorkType!==null && this.state.newSubtaskAssigned!==null)){
			return ''
		}else if(this.state.newSubtaskWorkType===null && this.state.newSubtaskAssigned===null){
			return 'You must first assign the task to someone and pick task type!'
		}else if(this.state.newSubtaskWorkType===null){
			return 'You must first pick task type!'
		}else{
			return 'You must first assign the task to someone!'
		}
	}

	onFocusWorkTrip(trip){
		this.setState({
			editedTripQuantity:trip.quantity,
			editedTripDiscount:trip.discount,
			editedTripPrice:trip.price,
			focusedTrip:trip.id
		})
	}

	onFocusSubtask(subtask){
		this.setState({
			editedSubtaskTitle: subtask.title,
			editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
			editedSubtaskWorkType: subtask.workType,
			editedSubtaskDiscount: subtask.discount,
			editedSubtaskPrice: subtask.price,
			focusedSubtask: subtask.id
		});
	}

	render() {
		//const afterHours= this.props.company && this.state.newExtraWork ? this.props.company.pricelist.afterHours : 0;
		return (
				<div className="row m-b-30 m-t-20">
					<div className="col-md-12">
						<div>
							<table className="table m-t--30">
								<thead>
									<tr>
										<th width="25" className="col-form-label">
											Práce
										</th>
										<th style={{color: "#FF4500"}}>
											{this.getCreationError()}
										</th>
										{this.props.extended &&  <th style={{fontSize: "12px", fontFamily: "Segoe UI", fontWeight: "500", color: "#333"}} width="170">Rieši</th>}
										{this.props.extended &&  <th width="100">Typ</th>}
										<th width="100">Mn.</th>
										{this.props.showAll && <th width="100" className="table-highlight-background">Cena/Mn.</th>}
										{this.props.showAll && <th width="100" className="table-highlight-background">Zlava</th>}
										{false && <th width="130">Spolu</th>}
										<th className="t-a-c" width="100"></th>
									</tr>
								</thead>
								<tbody>
									{
										this.props.subtasks.map((subtask)=>
										<tr key={subtask.id}>
											<td className="table-checkbox">
												<label className="custom-container">
													<Input type="checkbox"
														checked={subtask.done}
														disabled={this.props.disabled}
														onChange={()=>{
															this.props.updateSubtask(subtask.id,{done:!subtask.done})
															}} />
														<span className="checkmark" style={{ marginTop: "-3px", marginLeft:"-8px"}}> </span>
												</label>
											</td>
											<td>
												<div>
													<input
														disabled={this.props.disabled}
														className="form-control hidden-input"
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
															this.onFocusSubtask(subtask);
														}}
														onChange={e =>{
															this.setState({ editedSubtaskTitle: e.target.value })}
														}
														/>
												</div>
											</td>
											{ this.props.extended && <td>
												<Select
													isDisabled={this.props.disabled}
													value={subtask.assignedTo}
													onChange={(assignedTo)=>{
														this.props.updateSubtask(subtask.id,{assignedTo:assignedTo.id})
													}}
													options={this.props.taskAssigned}
													styles={invisibleSelectStyle}
													/>
											</td>
											}

											{ this.props.extended && <td >
												<Select
													isDisabled={this.props.disabled}
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
											</td>}

											<td>
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
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
														this.onFocusSubtask(subtask);
													}}
													onChange={e =>{
														this.setState({ editedSubtaskQuantity: e.target.value })}
													}
													/>
											</td>

											{ this.props.showAll && <td className="table-highlight-background">
											<input
												disabled={this.props.disabled}
												type="number"
												className="form-control hidden-input h-30"
												value={
													subtask.id === this.state.focusedSubtask
													? this.state.editedSubtaskPrice
													: subtask.price
												}
												onBlur={() => {
													//submit
													this.props.updateSubtask(subtask.id,{price:this.state.editedSubtaskPrice})
													this.setState({ focusedSubtask: null });
												}}
												onFocus={() => {
													this.onFocusSubtask(subtask);
												}}
												onChange={e =>{
													this.setState({ editedSubtaskPrice: e.target.value })}
												}
												/>
											</td>}
											{ this.props.showAll && <td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														parseInt(subtask.id === this.state.focusedSubtask
															? this.state.editedSubtaskDiscount
															: subtask.discount)
														}
														onBlur={() => {
															this.props.updateSubtask(subtask.id,{discount:this.state.editedSubtaskDiscount})
															this.setState({ focusedSubtask: null });
														}}
														onFocus={() => {
															this.onFocusSubtask(subtask);
														}}
														onChange={e =>{
															this.setState({ editedSubtaskDiscount: e.target.value })}
														}
														/>
												</td>}
												{false &&
													<td className="table-highlight-background">
													{
														(
														(parseFloat(subtask.id === this.state.focusedSubtask?(this.state.editedSubtaskPrice===''?0:this.state.editedSubtaskPrice):subtask.finalUnitPrice)
														-
														parseFloat(subtask.id === this.state.focusedSubtask?(this.state.editedSubtaskPrice===''?0:this.state.editedSubtaskPrice):subtask.finalUnitPrice)*
														parseInt(subtask.id === this.state.focusedSubtask?(this.state.editedSubtaskDiscount===''?0:this.state.editedSubtaskDiscount):subtask.discount)
														/100)*
														parseInt(subtask.id === this.state.focusedSubtask?(this.state.editedSubtaskQuantity===''?0:this.state.editedSubtaskQuantity):subtask.quantity)
														)
														.toFixed(2)
													}
												</td>}
												<td className="t-a-r">
													<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
														<i className="fa fa-arrow-up"  />
													</button>
													<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
															<i className="fa fa-arrow-down"  />
													</button>
													<button className="btn btn-link waves-effect" disabled={this.props.disabled}
														onClick={()=>{
															if(window.confirm('Are you sure?')){
																this.props.removeSubtask(subtask.id);
															}
														}}>
														<i className="fa fa-times" />
													</button>
												</td>
											</tr>
										)
									}
									{/* END OF GENERATED Works*/}
									{
										this.props.workTrips.map((trip)=>
										<tr key={trip.id}>
											<td className="table-checkbox">
												<label className="custom-container">
													<Input type="checkbox"
														checked={trip.done}
														disabled={this.props.disabled}
														onChange={()=>{
															this.props.updateTrip(trip.id,{done:!trip.done})
															}} />
														<span className="checkmark" style={{ marginTop: "-3px", marginLeft:"-8px"}}> </span>
												</label>
											</td>
											<td>
												<Select
													isDisabled={this.props.disabled}
													value={trip.type}
													onChange={(type)=>{
														this.props.updateTrip(trip.id,{type:type.id})
													}}
													options={this.props.tripTypes}
													styles={invisibleSelectStyle}
													/>
											</td>

											{this.props.showAll && <td>
												<Select
													isDisabled={this.props.disabled}
													value={trip.assignedTo}
													onChange={(assignedTo)=>{
														this.props.updateTrip(trip.id,{assignedTo:assignedTo.id})
													}}
													options={this.props.taskAssigned}
													styles={invisibleSelectStyle}
													/>
											</td>}
											{this.props.showAll && <td>Výjazd</td>}
											<td>
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														trip.id === this.state.focusedTrip
														? this.state.editedTripQuantity
														: trip.quantity
													}
													onBlur={() => {
														this.props.updateTrip(trip.id,{quantity:isNaN(parseFloat(this.state.editedTripQuantity))?0:this.state.editedTripQuantity})
														this.setState({ focusedTrip: null });
													}}
													onFocus={() => {
														this.onFocusWorkTrip(trip);
													}}
													onChange={e =>{
														this.setState({ editedTripQuantity: e.target.value })}
													}
													/>
											</td>
											{this.props.showAll && <td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														trip.id === this.state.focusedTrip
														? this.state.editedTripPrice
														: trip.price
													}
													onBlur={() => {
														this.props.updateTrip(trip.id,{price:isNaN(parseFloat(this.state.editedTripPrice))?0:this.state.editedTripPrice})
														this.setState({ focusedTrip: null });
													}}
													onFocus={() => {
														this.onFocusWorkTrip(trip);
													}}
													onChange={e =>{
														this.setState({ editedTripPrice: e.target.value })}
													}
													/>
											</td>}
											{this.props.showAll && <td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														trip.id === this.state.focusedTrip
														? this.state.editedTripDiscount
														: trip.discount
													}
													onBlur={() => {
														this.props.updateTrip(trip.id,{discount:isNaN(parseFloat(this.state.editedTripDiscount))?0:this.state.editedTripDiscount})
														this.setState({ focusedTrip: null });
													}}
													onFocus={() => {
														this.onFocusWorkTrip(trip);
													}}
													onChange={e =>{
														this.setState({ editedTripDiscount: e.target.value })}
													}
													/>
											</td>}
											<td className="t-a-r">
												<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
													<i className="fa fa-arrow-up"  />
												</button>
												<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
														<i className="fa fa-arrow-down"  />
												</button>
												<button className="btn btn-link waves-effect" disabled={this.props.disabled}
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeTrip(trip.id);
														}
													}}>
													<i className="fa fa-times" />
												</button>
											</td>
										</tr>
									)}
									{/* END OF GENERATED Work trips*/}
									{this.state.showAddSubtask && !this.props.disabled &&
										<tr>
										<td colSpan="2">
											<input
												disabled={this.props.disabled}
												type="text"
												className="form-control"
												id="inlineFormInput"
												placeholder=""
												value={this.state.newSubtaskTitle}
												onChange={(e)=>this.setState({newSubtaskTitle:e.target.value})}
												/>
										</td>
										{ this.props.extended && <td>
											<Select
												isDisabled={this.props.disabled}
												value={this.state.newSubtaskAssigned}
												onChange={(newSubtaskAssigned)=>{
													this.setState({newSubtaskAssigned})
													}
												}
												options={this.props.taskAssigned}
												styles={selectStyle}
												/>
										</td>}
										{ this.props.extended && <td>
											<Select
												isDisabled={this.props.disabled}
												value={this.state.newSubtaskWorkType}
												options={this.props.workTypes}
												onChange={(workType)=>{
													let price=0;
													price = workType.prices.find((item)=>this.props.company!==null && item.pricelist===this.props.company.pricelist.id);
													if(price === undefined){
														price = 0;
													}else{
														price = price.price;
													}
													this.setState({newSubtaskWorkType:workType,newSubtaskPrice:price})
													}
												}
												styles={selectStyle}
												/>
										</td>}
										<td>
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newSubtaskQuantity}
												onChange={(e)=>this.setState({newSubtaskQuantity:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
												/>
										</td>
										{ this.props.showAll && <td className="table-highlight-background">
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newSubtaskPrice}
												onChange={(e)=>this.setState({newSubtaskPrice:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
											/>
										</td>}
										{ this.props.showAll && <td className="table-highlight-background">
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newSubtaskDiscount}
												onChange={(e)=>this.setState({newSubtaskDiscount:e.target.value})}
												className="form-control input h-30"
												id="inlineFormInput"
												placeholder=""
												/>
										</td>}
										{false &&
											<td className="table-highlight-background">
											{
												((this.state.newSubtaskPrice-this.state.newSubtaskPrice*0.01*this.state.newSubtaskDiscount)*this.state.newSubtaskQuantity).toFixed(2)
											}
										</td>}
										<td className="t-a-r">
											<button className="btn btn-link waves-effect"
												disabled={this.state.newSubtaskWorkType===null||this.props.disabled|| this.state.newSubtaskAssigned===null}
												onClick={()=>{
													let body={
														discount:this.state.newSubtaskDiscount!==''?this.state.newSubtaskDiscount:0,
														extraPrice:this.props.company?parseFloat(this.props.company.pricelist.afterHours) : 0,
														extraWork:this.state.newSubtaskExtraWork,
														price:this.state.newSubtaskPrice!==''?this.state.newSubtaskPrice:0,
														quantity:this.state.newSubtaskQuantity!==''?this.state.newSubtaskQuantity:0,
														title:this.state.newSubtaskTitle,
														workType: this.state.newSubtaskWorkType.id,
														assignedTo:this.state.newSubtaskAssigned?this.state.newSubtaskAssigned.id:null
													}
													this.setState({
														showAddSubtask: false,
														newSubtaskDiscount:0,
														newSubtaskExtraWork:false,
														newSubtaskQuantity:0,
														newSubtaskTitle:'',
														assignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null
													});
													this.props.submitService(body);
													}
												}
												>
												<i className="fa fa-plus" />
											</button>
											<button className="btn btn-link waves-effect"
												disabled={this.props.disabled}
												onClick={()=>{
													this.setState({showAddSubtask: false})
												}}>
												<i className="fa fa-times"  />
												</button>
										</td>
									</tr>}
									{this.state.showAddTrip && !this.props.disabled &&
										<tr>
										<td colSpan="2">
											<Select
												isDisabled={this.props.disabled}
												value={this.state.newTripType}
												onChange={(newTripType)=>{
													if(this.props.company){
														let newTripPrice = newTripType.prices.find((price)=>price.pricelist===this.props.company.pricelist.id);
														if(newTripPrice === undefined){
															newTripPrice = 0;
														}else{
															newTripPrice = newTripPrice.price;
														}
														this.setState({newTripType, newTripPrice})
													}else{
														this.setState({newTripType})
													}
													}
												}
												options={this.props.tripTypes}
												styles={selectStyle}
												/>
										</td>
										{this.props.showAll && <td>
											<Select
												isDisabled={this.props.disabled}
												value={this.state.newTripAssignedTo}
												onChange={(newTripAssignedTo)=>{
													this.setState({newTripAssignedTo})
													}
												}
												options={this.props.taskAssigned}
												styles={selectStyle}
												/>
										</td>
										}
										{this.props.showAll && <td>Výjazd</td>}
										<td>
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newTripQuantity}
												onChange={(e)=>this.setState({newTripQuantity:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder="Quantity"
												/>
										</td>
										{this.props.showAll && <td className="table-highlight-background">
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newTripPrice}
												onChange={(e)=>this.setState({newTripPrice:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder="Discount"
												/>
										</td>}
										{this.props.showAll && <td className="table-highlight-background">
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newTripDiscount}
												onChange={(e)=>this.setState({newTripDiscount:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder="Discount"
												/>
										</td>}
										<td className="t-a-r">
											<button className="btn btn-link waves-effect"
												disabled={this.state.newTripType===null||isNaN(parseInt(this.state.newTripQuantity))||this.props.disabled|| this.state.newTripAssignedTo===null}
												onClick={()=>{
													let body={
														type:this.state.newTripType?this.state.newTripType.id:null,
														assignedTo: this.state.newTripAssignedTo?this.state.newTripAssignedTo.id:null,
														quantity: this.state.newTripQuantity!==''?this.state.newTripQuantity:0,
														discount: this.state.newTripDiscount!==''?this.state.newTripDiscount:0,
														price:this.state.newTripPrice!==''?this.state.newTripPrice:0,
														done: false,
														extraPrice:this.props.company?parseFloat(this.props.company.pricelist.afterHours) : 0,
													}
													let newTripType = this.props.tripTypes.length>0?this.props.tripTypes[0]:null;
													let price = 0;
													if(newTripType){
														price = newTripType.prices.find((item)=>item.pricelist===this.props.company.pricelist.id);
														if(price === undefined){
															price = 0;
														}else{
															price = price.price;
														}
													}

													this.setState({
														newTripType,
														newTripAssignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
														newTripQuantity:1,
														newTripPrice:price,
														newTripDiscount:0,
														showAddTrip:false
													});
													this.props.submitTrip(body);
													}
												}
												>
												<i className="fa fa-plus" />
											</button>
											<button className="btn btn-link waves-effect"
												disabled={this.props.disabled}
												onClick={()=>{
													this.setState({showAddTrip: false,showAddSubtask:false})
												}}>
												<i className="fa fa-times"  />
												</button>
										</td>
									</tr>}

									{!this.state.showAddSubtask && !this.state.showAddTrip && !this.props.disabled &&
										<tr >
											<td colSpan={this.props.showAll?"8":"4"}>
												{!this.state.showAddSubtask && <button className="btn btn-table-add-item"
													disabled={this.props.disabled}
													onClick={()=>{
														this.setState({showAddSubtask: true});
													}}>
													+ Práca
												</button>}
												{!this.state.showAddTrip && <button className="btn btn-table-add-item"
													disabled={this.props.disabled}
													onClick={()=>{
														this.setState({showAddTrip: true});
													}}>
													+ Výjazd
												</button>}
											</td>
										</tr>
									}
								</tbody>
							</table>
						</div>
						<div>
							<p className="text-right" style={{marginTop: (((this.state.showAddSubtask||this.state.showAddTrip) || this.props.disabled) ? "" : "")}}>
								<b>Work sub-total:</b>
								{(this.props.subtasks.reduce((acc, cur)=> acc+parseFloat(cur.totalPrice),0)).toFixed(2)}
							</p>
						</div>
						<div>
							<p className="text-right" style={{marginTop: (((this.state.showAddSubtask||this.state.showAddTrip) || this.props.disabled) ? "" : "")}}>
								<b>Trips sub-total:</b>
								{(this.props.workTrips.reduce((acc, cur)=> acc+parseFloat(cur.totalPrice),0)).toFixed(2)}
							</p>
						</div>

						<div className="row justify-content-end">
							<div className="col-md-6">
							{false &&
									<button
										disabled={this.props.disabled}
										type="button"
										className="btn btn-link waves-effect"
										onClick={()=>this.props.updatePrices(this.state.selectedIDs)}
										>
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
										}}
										> Aktualizovať ceny podla cenníka</span>
								</button>}
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
