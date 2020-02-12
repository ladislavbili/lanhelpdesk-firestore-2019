import React, { Component } from 'react';
import classnames from "classnames";
import {Input, Nav, NavItem, NavLink} from 'reactstrap';
import Select from 'react-select';
import {selectStyle, invisibleSelectStyle} from '../../scss/selectStyles';
import {sameStringForms} from '../../helperFunctions';

export default class Rozpocet extends Component {
	constructor(props){
		super(props);
		const newMargin= this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMargin : 0;
		const newUnit= this.props.units.find((item)=>item.id===this.props.defaultUnit);

		this.state={
			toggleTab: "1",

			//prace
			showAddSubtask:false,

			editedSubtaskTitle: "",
			editedSubtaskType:null,
			editedSubtaskQuantity: 0,
			editedSubtaskDiscount:0,
			focusedSubtask: null,
			selectedIDs:[],

			newSubtaskTitle:'',
			newSubtaskType:this.props.defaultType,
			newSubtaskAssigned:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
			newSubtaskQuantity:0,
			newSubtaskDiscount:0,

			//trips
			showAddTrip:false,

			focusedTrip:null,
			editedTripQuantity:0,
			editedTripDiscount:0,

			newTripType:this.props.tripTypes.length>0?this.props.tripTypes[0]:null,
			newTripAssignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
			newTripQuantity:1,
			newTripDiscount:0,

			//Materials
			showAddMaterial: false,

			editedMaterialTitle: "",
			editedMaterialQuantity: "0",
			editedMaterialUnit:null,
			editedMaterialMargin:null,
			editedMaterialPrice:null,
			focusedMaterial: null,
		//	selectedIDs:[],

			newTitle:'',
			newQuantity:1,
			newUnit:newUnit?newUnit:null,
			newMargin,
			newPrice:0,
			marginChanged:false,
		}
		this.getCreationError.bind(this);
		this.onFocusWorkTrip.bind(this);
		this.onFocusSubtask.bind(this);
		this.getPrice.bind(this);
		this.getTotalPrice.bind(this);
		this.getTotalDiscountedPrice.bind(this);
		this.getDPH.bind(this);
	}

	componentWillReceiveProps(props){
		if(this.props.taskID!==props.taskID){
			let newUnit= props.units[0];
			if(props.defaultUnit!==null){
				newUnit=props.units.find((item)=>item.id===props.defaultUnit)
			}
			this.setState({
				focusedSubtask:null,
				showAddSubtask:false,
				newSubtaskTitle:'',
				newSubtaskType:props.defaultType,
				newSubtaskQuantity:0,
				newSubtaskDiscount:0,
				newSubtaskAssigned:props.taskAssigned.length>0?props.taskAssigned[0]:null,

				focusedTrip:null,
				showAddTrip:false,
				newTripType:props.tripTypes.length>0?props.tripTypes[0]:null,
				newTripAssignedTo:props.taskAssigned.length>0?props.taskAssigned[0]:null,
				newTripQuantity:1,
				newTripDiscount:0,

				newTitle:'',
				newQuantity:1,
				newUnit,
				newMargin: props.company && props.company.pricelist ? props.company.pricelist.materialMargin : 0,
				newPrice:0,
				marginChanged:false,
			})
		}else if(!sameStringForms(this.props.defaultType,props.defaultType)){
			this.setState({
				newSubtaskType:props.defaultType,
			})
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

		if((this.props.company===null && props.company!==null) ||
		(this.props.company && props.company && props.company.id!==this.props.company.id)){
			this.setState({newMargin: (props.company && props.company.pricelist ? props.company.pricelist.materialMargin : 0)});
		}

		if(this.props.units && props.units && this.props.units.length!==props.units.length){
			let newUnit= props.units[0];
			if(props.defaultUnit!==null){
				newUnit=props.units.find((item)=>item.id===props.defaultUnit)
			}
			this.setState({newUnit});
		}
	}

	getCreationError(){
		let noType = this.state.newSubtaskType===null;
		let noAssigned = this.state.newSubtaskAssigned===null;
		let noCompany = this.props.company===null;
		if(!noType && !noAssigned && !noCompany){
			return ''
		}
		if(noType && noAssigned && noCompany){
			return 'First assign the task to someone, pick task type and company!';
		}
		if(!noType && noAssigned && noCompany){
			return 'First assign the task to someone and pick company!';
		}
		if(!noType && !noAssigned && noCompany){
			return 'First pick company!';
		}
		if(!noType && noAssigned && !noCompany){
			return 'First assign the task to someone!';
		}
		if(noType && !noAssigned && noCompany){
			return 'First pick task type and company!';
		}
		if(noType && !noAssigned && !noCompany){
			return 'First pick task type!';
		}
		if(noType && noAssigned && !noCompany){
			return 'First assign the task to someone and pick task type!';
		}
	}

	onFocusWorkTrip(trip){
		this.setState({
			editedTripQuantity:trip.quantity,
			editedTripDiscount:trip.discount,
			focusedTrip:trip.id
		})
	}

	onFocusSubtask(subtask){
		this.setState({
			editedSubtaskTitle: subtask.title,
			editedSubtaskQuantity: subtask.quantity?subtask.quantity:'',
			editedSubtaskType: subtask.type,
			editedSubtaskDiscount: subtask.discount,
			focusedSubtask: subtask.id
		});
	}

	getPrice(type){
		if(!type){
			return NaN;
		}
		let price = (this.props.company.pricelist ? type.prices.find((price)=>price.pricelist===this.props.company.pricelist.id) : undefined);
		if(price === undefined){
			price = NaN;
		}else{
			price = price.price;
		}
		return parseFloat(parseFloat(price).toFixed(2));
	}

	getTotalPrice(item){
		return parseFloat(this.getPrice(item.type)*parseInt(item.quantity).toFixed(2))
	}

	getTotalDiscountedPrice(item){
		return parseFloat(parseFloat(this.getTotalPrice(item)*(100-parseInt(item.discount))/100).toFixed(2))
	}

	getDPH(){
		let dph = 20;
		if(this.props.company && this.props.company.dph > 0){
			dph = this.props.company.dph;
		}
		return (100+dph)/100;
	}

	render() {
		const unitPrice= this.state.newPrice?(this.state.newPrice*(this.state.newMargin/100+1)):0;
		let editedFinalUnitPrice = 0;
		if(this.state.focusedMaterial!==null){
			editedFinalUnitPrice = (parseFloat(this.state.editedMaterialPrice)*(1+parseFloat(this.state.editedMaterialMargin)/100))
		}
		return (
			<div className="vykazyTable">
					<div className="" style={{color: "#FF4500", height: "20px"}}>
						{this.getCreationError()}
					</div>
					<table className="table">
						<thead>
							<tr>
								<th colSpan={this.props.showColumns.includes(0) ? 2 : 1}>
										<Nav tabs className="b-0 m-0">
										<NavItem>
											<NavLink
												className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
												onClick={() => { this.setState({toggleTab:'1'}); }}
											>
												Výkaz
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink>
												|
											</NavLink>
										</NavItem>
											<NavItem>
											<NavLink
												className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
												onClick={() => { this.setState({toggleTab:'2'}); }}
											>
												Rozpočet
											</NavLink>
										</NavItem>
									</Nav>
								</th>
								{this.props.showColumns.includes(5) && this.state.toggleTab === "1" && <th width="70" className="table-highlight-background t-a-r">Nákup</th> }
								{this.props.showColumns.includes(7) && this.state.toggleTab === "1" && <th width="70" className="table-highlight-background t-a-r">Cena</th> }
								{this.props.showColumns.includes(2) && <th width="130">Rieši</th> }
								{this.props.showColumns.includes(3) && <th width="130">Typ</th> }
								{this.props.showColumns.includes(4) && <th width="50" className="t-a-r">Mn.</th> }
								{this.props.showColumns.includes(5) && this.state.toggleTab === "2" && <th width="70" className="table-highlight-background t-a-r">Cenník/Nákup</th> }
								{this.props.showColumns.includes(6) && this.state.toggleTab === "2" && <th width="70" className="table-highlight-background t-a-r">Zľava/Marža</th> }
								{this.props.showColumns.includes(7) && this.state.toggleTab === "2" && <th width="70" className="table-highlight-background t-a-r">Cena</th>}
								{this.props.showColumns.includes(8) && this.state.toggleTab === "2" && <th width="70" className="table-highlight-background t-a-r">Spolu</th> }
								{this.props.showColumns.includes(9) && <th width={this.props.materials.length === 0 ? "90" : "120"}></th> }
							</tr>
						</thead>
						<tbody>
							{
								this.props.subtasks.map((subtask)=>
								<tr key={subtask.id}>
									{this.props.showColumns.includes(0) &&
										<td className="table-checkbox p-l-0">
											<label className="custom-container">
												<Input type="checkbox"
													checked={subtask.done}
													disabled={this.props.disabled}
													onChange={()=>{
														this.props.updateSubtask(subtask.id,{done:!subtask.done})
														}} />
												<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
											</label>
									</td>}
									{this.props.showColumns.includes(1) &&
										<td className=""> {/* //name*/}
										<input
											disabled={this.props.disabled}
											className="form-control hidden-input"
											value={
												subtask.id === this.state.focusedSubtask
												? this.state.editedSubtaskTitle
												: subtask.title
											}
											onBlur={() => {
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
									</td>}

									{this.props.showColumns.includes(5) &&
										this.state.toggleTab === "1" &&
										<td></td>}	{/* //nákup - cennik/nakup*/}

										{this.props.showColumns.includes(7) &&
											this.state.toggleTab === "1" &&
											<td className="p-t-15 p-l-8"> {/* //cena*/}
										</td>}

									{this.props.showColumns.includes(2) &&
										<td> 	{/* //riesi*/}
										<Select
											isDisabled={this.props.disabled}
											value={subtask.assignedTo}
											onChange={(assignedTo)=>{
												this.props.updateSubtask(subtask.id,{assignedTo:assignedTo.id})
											}}
											options={this.props.taskAssigned}
											styles={invisibleSelectStyle}
											/>
									</td>}
									{this.props.showColumns.includes(3) &&
										<td>{/* 	//typ*/}
										<Select
											isDisabled={this.props.disabled}
											value={subtask.type}
											onChange={(type)=>{
												this.props.updateSubtask(subtask.id,{type:type.id})
											}}
											options={this.props.workTypes}
											styles={invisibleSelectStyle}
											/>
									</td>}

									{this.props.showColumns.includes(4) &&
										<td>{/* 	//mn.*/}
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
												this.props.updateSubtask(subtask.id,{quantity:isNaN(parseInt(this.state.editedSubtaskQuantity))?0:parseInt(this.state.editedSubtaskQuantity)})
												this.setState({ focusedSubtask: null });
											}}
											onFocus={() => {
												this.onFocusSubtask(subtask);
											}}
											onChange={e =>{
												this.setState({ editedSubtaskQuantity: e.target.value })}
											}
											/>
									</td>}

									{this.props.showColumns.includes(5) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background"></td>}	{/* //nákup - cennik/nakup*/}

									{this.props.showColumns.includes(6) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background"> {/* //zlava/marza*/}
											<span className="text p-l-8">-<input
												disabled={this.props.disabled}
												style={{display: "inline", width: "60%"}}
												type="number"
												className="form-control hidden-input h-30"
												value={
													parseInt(subtask.id === this.state.focusedSubtask ?
														this.state.editedSubtaskDiscount :
														subtask.discount)
												}
												onBlur={() => {
													this.props.updateSubtask(subtask.id,{discount:isNaN(parseInt(this.state.editedSubtaskDiscount))?0:parseInt(this.state.editedSubtaskDiscount)})
													this.setState({ focusedSubtask: null });
												}}
												onFocus={() => {
													this.onFocusSubtask(subtask);
												}}
												onChange={e =>{
													this.setState({ editedSubtaskDiscount: e.target.value })}
												}
											/>%</span>
										</td>
									}
									{this.props.showColumns.includes(7) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background p-t-15 p-l-8 p-r-8 t-a-r"> {/* //cena*/}
										{
												isNaN(this.getPrice(subtask.type))
												? 'No price'
												: this.getPrice(subtask.type) + " €"
										}
									</td>}


								{this.props.showColumns.includes(8) &&
									this.state.toggleTab === "2" &&
									<td className="table-highlight-background p-t-15 p-l-8 p-r-8 t-a-r">{/*  //spolu*/}
										{isNaN(this.getTotalDiscountedPrice(subtask))?
											'   No price'
											:
											this.getTotalDiscountedPrice(subtask) + " €"}
									</td>
								}

								{this.props.showColumns.includes(9) &&
									<td className="t-a-r">	{/* //akcie*/}
										<button className="btn waves-effect" disabled={this.props.disabled}>
											<i className="fa fa-arrow-up"  />
										</button>
										<button className="btn waves-effect" disabled={this.props.disabled}>
												<i className="fa fa-arrow-down"  />
										</button>
										<button className="btn waves-effect" disabled={this.props.disabled}
											onClick={()=>{
												if(window.confirm('Are you sure?')){
													this.props.removeSubtask(subtask.id);
												}
											}}>
											<i className="fa fa-times" />
										</button>
									</td>}
								</tr>
								)
							}
							{/* END OF GENERATED Works*/}
							{
								this.props.workTrips.map((trip)=>
								<tr key={trip.id}>
									{this.props.showColumns.includes(0) &&
										<td className="table-checkbox">
										<label className="custom-container">
											<Input type="checkbox"
												checked={trip.done}
												disabled={this.props.disabled}
												onChange={()=>{
													this.props.updateTrip(trip.id,{done:!trip.done})
													}} />
												<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
										</label>
									</td>}
									{this.props.showColumns.includes(1) &&
										<td className="">{/* 	//name*/}
										<Select
											isDisabled={this.props.disabled}
											value={trip.type}
											onChange={(type)=>{
												this.props.updateTrip(trip.id,{type:type.id})
											}}
											options={this.props.tripTypes}
											styles={invisibleSelectStyle}
											/>
									</td>}

									{this.props.showColumns.includes(5) &&
										this.state.toggleTab === "1" &&
										<td></td>}	{/* //nákup - cennik/nakup*/}

									{this.props.showColumns.includes(7) &&
										this.state.toggleTab === "1" &&
										<td className=" p-t-15 p-l-8 p-r-8 t-a-r">	{/* //cena*/}
										</td>}

									{this.props.showColumns.includes(2) &&
										<td>{/* 	//riesi*/}
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

									{this.props.showColumns.includes(3) &&
										<td className="p-l-8 p-t-15">Výjazd</td>}{/* 	//typ*/}

											{this.props.showColumns.includes(4) &&
												<td>{/* 	//mn.*/}
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
												this.props.updateTrip(trip.id,{quantity:isNaN(parseInt(this.state.editedTripQuantity))?0:parseInt(this.state.editedTripQuantity)})
												this.setState({ focusedTrip: null });
											}}
											onFocus={() => {
												this.onFocusWorkTrip(trip);
											}}
											onChange={e =>{
												this.setState({ editedTripQuantity: e.target.value })}
											}
											/>
									</td>}

									{this.props.showColumns.includes(5) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background"></td>}	{/* //nákup - cennik/nakup*/}

									{this.props.showColumns.includes(6) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background"> {/* //zlava/marza*/}
												<span className="text p-l-8">-<input
												disabled={this.props.disabled}
												type="number"
												style={{display: "inline", width: "60%"}}
												className="form-control hidden-input h-30"
												value={
													trip.id === this.state.focusedTrip
													? this.state.editedTripDiscount
													: trip.discount
												}
												onBlur={() => {
													this.props.updateTrip(trip.id,{discount:isNaN(parseInt(this.state.editedTripDiscount))?0:parseInt(this.state.editedTripDiscount)})
													this.setState({ focusedTrip: null });
												}}
												onFocus={() => {
													this.onFocusWorkTrip(trip);
												}}
												onChange={e =>{
													this.setState({ editedTripDiscount: e.target.value })}
												}
												/>%</span>
										</td>
									}
									{this.props.showColumns.includes(7) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background p-t-15 p-l-8 p-r-8 t-a-r">	{/* //cena*/}
										{isNaN(this.getPrice(trip.type))
											? 'No price'
											: this.getPrice(trip.type) + " €"
										}
										</td>}

										{this.props.showColumns.includes(8) &&
											this.state.toggleTab === "2" &&
											<td className="table-highlight-background p-l-8 p-t-15 p-r-8 t-a-r"> {/* //spolu*/}
												{isNaN(this.getTotalDiscountedPrice(trip))?
													'No price'
													:
													this.getTotalDiscountedPrice(trip) + " €"}
											</td>
										}

										{this.props.showColumns.includes(9) &&
  										<td className="t-a-r">	{/* //akcie*/}
										<button className="btn waves-effect" disabled={this.props.disabled}>
											<i className="fa fa-arrow-up"  />
										</button>
										<button className="btn waves-effect" disabled={this.props.disabled}>
												<i className="fa fa-arrow-down"  />
										</button>
										<button className="btn waves-effect" disabled={this.props.disabled}
											onClick={()=>{
												if(window.confirm('Are you sure?')){
													this.props.removeTrip(trip.id);
												}
											}}>
											<i className="fa fa-times" />
										</button>
									</td>}
								</tr>
							)}
							{/* END OF GENERATED Work trips*/}
							{
								this.props.materials.map((material)=>
								<tr key={material.id}>
									{this.props.showColumns.includes(0) &&
										<td></td>}
									{this.props.showColumns.includes(1) &&
										<td className="">{/* 	//name*/}
											<input
												disabled={this.props.disabled}
												className="form-control hidden-input"
												value={
													material.id === this.state.focusedMaterial
													? this.state.editedMaterialTitle
													: material.title
												}
												onBlur={() => {
													//submit
													this.props.updateMaterial(material.id,{title:this.state.editedMaterialTitle})
													this.setState({ focusedMaterial: null });
												}}
												onFocus={() => {
													this.setState({
														editedMaterialTitle:material.title,
														editedMaterialQuantity:material.quantity,
														editedMaterialUnit:material.unit,
														editedMaterialMargin:material.margin,
														editedMaterialPrice:material.price,
														focusedMaterial: material.id
													});
												}}
												onChange={e =>{
													this.setState({ editedMaterialTitle: e.target.value })}
												}
												/>
										</td>}

										{this.props.showColumns.includes(5) &&
											this.state.toggleTab === "1" &&
											<td className="table-highlight-background">	{/* //nákup - cennik/nakup*/}
											<span className="text">
												<input
												disabled={this.props.disabled}
												type="number"
												style={{display: "inline", width: "60%"}}
												className="form-control hidden-input h-30"
												value={
													material.id === this.state.focusedMaterial
													? this.state.editedMaterialPrice
													: material.price
												}
												onBlur={() => {
													//submit
													this.props.updateMaterial(material.id,{price:this.state.editedMaterialPrice})
													this.setState({ focusedMaterial: null });
												}}
												onFocus={() => {
													this.setState({
														editedMaterialTitle:material.title,
														editedMaterialQuantity:material.quantity,
														editedMaterialUnit:material.unit,
														editedMaterialMargin:material.margin,
														editedMaterialPrice:material.price,
														focusedMaterial: material.id
													});
												}}
												onChange={e =>{
													this.setState({ editedMaterialPrice: e.target.value })}
												}
												/>€</span>
											</td>}

									{this.props.showColumns.includes(7) &&
										this.state.toggleTab === "1" &&
										<td className="table-highlight-background p-l-8 p-t-15 p-r-8 t-a-r">{/* 	//cena*/}
											{
												(
												(parseFloat(material.id === this.state.focusedMaterial
														? editedFinalUnitPrice
														: material.finalUnitPrice))*
												parseInt(material.id === this.state.focusedMaterial?(this.state.editedMaterialQuantity===''?0:this.state.editedMaterialQuantity):material.quantity)
												)
												.toFixed(2) + " €"
											}
									</td>}

										{this.props.showColumns.includes(2) &&
												<td>	{/* //riesi*/}
										</td>}

										{this.props.showColumns.includes(3) &&
											<td className="p-l-8 p-t-15">	{/* //typ*/}
											Materiál
										</td>}

										{this.props.showColumns.includes(4) &&
											<td>	{/* //mn.*/}
										<input
											disabled={this.props.disabled}
											type="number"
											className="form-control hidden-input h-30"
											value={
												material.id === this.state.focusedMaterial
												? this.state.editedMaterialQuantity
												: material.quantity
											}
											onBlur={() => {
												//submit
												this.props.updateMaterial(material.id,{quantity:this.state.editedMaterialQuantity})
												this.setState({ focusedMaterial: null });
											}}
											onFocus={() => {
												this.setState({
													editedMaterialTitle:material.title,
													editedMaterialQuantity:material.quantity,
													editedMaterialUnit:material.unit,
													editedMaterialMargin:material.margin,
													editedMaterialPrice:material.price,
													focusedMaterial: material.id
												});
											}}
											onChange={e =>{
												this.setState({ editedMaterialQuantity: e.target.value })}
											}
											/>
									</td>}

									{this.props.showColumns.includes(5) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background p-l-8">	{/* //nákup - cennik/nakup*/}
										<span className="text" style={{float: "right"}}>
											<div style={{float: "right"}} className="p-t-8 p-r-8">
												€
										</div>
												<input
												disabled={this.props.disabled}
												type="number"
												style={{display: "inline", width: "70%", float: "right"}}
												className="form-control hidden-input h-30"
												value={
													material.id === this.state.focusedMaterial
													? this.state.editedMaterialPrice
													: material.price
												}
												onBlur={() => {
													//submit
													this.props.updateMaterial(material.id,{price:this.state.editedMaterialPrice})
													this.setState({ focusedMaterial: null });
												}}
												onFocus={() => {
													this.setState({
														editedMaterialTitle:material.title,
														editedMaterialQuantity:material.quantity,
														editedMaterialUnit:material.unit,
														editedMaterialMargin:material.margin,
														editedMaterialPrice:material.price,
														focusedMaterial: material.id
													});
												}}
												onChange={e =>{
													this.setState({ editedMaterialPrice: e.target.value })}
												}
												/>

									</span>
										</td>}
									{this.props.showColumns.includes(6) &&
										this.state.toggleTab === "2" &&

										<td className="table-highlight-background p-l-8"> {/* //zlava/marza*/}
											<span className="text">+
											<input
												disabled={this.props.disabled}
												type="number"
												style={{display: "inline", width: "60%"}}
												className="form-control hidden-input h-30"
												value={
													parseInt(material.id === this.state.focusedMaterial
														? this.state.editedMaterialMargin
														: material.margin)
													}
													onBlur={() => {
														this.props.updateMaterial(material.id,{margin:this.state.editedMaterialMargin})
														this.setState({ focusedMaterial: null });
													}}
													onFocus={() => {
														this.setState({
															editedMaterialTitle:material.title,
															editedMaterialQuantity:material.quantity,
															editedMaterialUnit:material.unit,
															editedMaterialMargin:material.margin,
															editedMaterialPrice:material.price,
															focusedMaterial: material.id
														});
													}}
													onChange={e =>{
														this.setState({ editedMaterialMargin: e.target.value })}
													}
													/>%</span>
										</td>
									}
									{this.props.showColumns.includes(7) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background p-l-8 p-t-15 p-r-8 t-a-r">{/* 	//cena*/}
											{
												(
												(parseFloat(material.id === this.state.focusedMaterial
														? editedFinalUnitPrice
														: material.finalUnitPrice))*
												parseInt(material.id === this.state.focusedMaterial?(this.state.editedMaterialQuantity===''?0:this.state.editedMaterialQuantity):material.quantity)
												)
												.toFixed(2) + " €"
											}
									</td>}


									{this.props.showColumns.includes(8) &&
										this.state.toggleTab === "2" &&
										<td className="p-l-8 p-t-15 table-highlight-background p-r-8 t-a-r"> {/* //spolu*/}
											{this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseInt(cur.totalPrice))? 0 : parseInt(cur.totalPrice)),0).toFixed(2) + " €"}
										</td>
									}

									{this.props.showColumns.includes(9) && <td className="t-a-r">	{/* //akcie*/}
										<button className="btn  waves-effect" disabled={this.props.disabled}>
												<i className="fa fa-sync-alt" onClick={()=>{
														if(parseInt(material.price) <= 50){
															this.props.updateMaterial(material.id,{margin:(this.props.company && this.props.company.pricelist)?parseInt(this.props.company.pricelist.materialMargin):material.margin})
														}else{
															this.props.updateMaterial(material.id,{margin:(this.props.company && this.props.company.pricelist)?parseInt(this.props.company.pricelist.materialMarginExtra):material.margin})
														}
													}} />
										</button>
										<button className="btn waves-effect" disabled={this.props.disabled}>
											<i className="fa fa-arrow-up"  />
										</button>
										<button className="btn waves-effect" disabled={this.props.disabled}>
												<i className="fa fa-arrow-down"  />
										</button>

										<button className="btn waves-effect"
											disabled={this.props.disabled}
											onClick={()=>{
												if(window.confirm('Are you sure?')){
													this.props.removeMaterial(material.id);
												}
											}}>
											<i className="fa fa-times" />
										</button>
									</td>}
									{/* END OF GENERATED Materials*/}
									</tr>
								)
							}

							{/* ADD work form*/}
							{this.state.showAddSubtask && !this.props.disabled &&
								<tr>
									{this.props.showColumns.includes(1) &&
										<td colSpan={2} className="p-r-8"> {/*className*/}
										<input
											disabled={this.props.disabled}
											type="text"
											className="form-control"
											id="inlineFormInput"
											placeholder=""
											value={this.state.newSubtaskTitle}
											onChange={(e)=>this.setState({newSubtaskTitle:e.target.value})}
											/>
									</td>}

									{this.props.showColumns.includes(5) &&
										this.state.toggleTab === "1" &&
										<td></td>} {/*cennik/nakup*/}

									{this.props.showColumns.includes(7) &&
										this.state.toggleTab === "1" &&
										<td className="p-t-15 p-l-8 p-r-8 t-a-r"> {/*cena*/}
									</td>}

									{this.props.showColumns.includes(2) &&
										<td className="p-l-8">{/*riesi*/}
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
											 {this.props.showColumns.includes(3) &&
												 <td className="p-l-8">{/*typ*/}
												<Select
													isDisabled={this.props.disabled}
													value={this.state.newSubtaskType}
													options={this.props.workTypes}
													onChange={(type)=>{
														this.setState({newSubtaskType:type})
														}
													}
													styles={selectStyle}
													/>
											</td>}
										{this.props.showColumns.includes(4) &&
											<td className="p-l-8 p-r-8"> {/*mn.*/}
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newSubtaskQuantity}
												onChange={(e)=>this.setState({newSubtaskQuantity:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
												/>
										</td>}

									{this.props.showColumns.includes(5) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background"></td>} {/*cennik/nakup*/}

									{this.props.showColumns.includes(6) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background p-r-8 p-l-8"> {/*zlava*/}
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
									{this.props.showColumns.includes(7) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background p-t-15 p-l-8 p-r-8 t-a-r"> {/*cena*/}
										{
											isNaN(this.getPrice(this.state.newSubtaskType))
											?'No price'
											:this.getPrice(this.state.newSubtaskType) + " €"
										}
									</td>}
									{this.props.showColumns.includes(8) &&
										this.state.toggleTab === "2" &&
										<td className="table-highlight-background p-r-8 p-l-8 p-t-15 p-r-8 t-a-r"> {/*spolu*/}
										{isNaN(this.getTotalDiscountedPrice({discount:this.state.newSubtaskDiscount,quantity:this.state.newSubtaskQuantity,type:this.state.newSubtaskType}))?
											'No price'
											:
											this.getTotalDiscountedPrice({discount:this.state.newSubtaskDiscount,quantity:this.state.newSubtaskQuantity,type:this.state.newSubtaskType})+ " €"
										}
									</td>}
									{this.props.showColumns.includes(9) &&
										<td className="t-a-r">  {/*actions*/}
									<button className="btn waves-effect"
										disabled={this.state.newSubtaskType===null||this.props.disabled|| this.state.newSubtaskAssigned===null}
										onClick={()=>{
											let body={
												done:false,
												title:this.state.newSubtaskTitle,
												type: this.state.newSubtaskType.id,
												quantity:this.state.newSubtaskQuantity!==''?parseInt(this.state.newSubtaskQuantity):0,
												discount:this.state.newSubtaskDiscount!==''?parseInt(this.state.newSubtaskDiscount):0,
												assignedTo:this.state.newSubtaskAssigned?this.state.newSubtaskAssigned.id:null
											}
											this.setState({
												newSubtaskTitle:'',
												newSubtaskQuantity:0,
												newSubtaskDiscount:0,
												assignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
												showAddSubtask: false,
											});
											this.props.submitService(body);
											}
										}
										>
										<i className="fa fa-plus" />
									</button>
									<button className="btn waves-effect"
										disabled={this.props.disabled}
										onClick={()=>{
											this.setState({showAddSubtask: false})
										}}>
										<i className="fa fa-times"  />
										</button>
								</td>}
								</tr>
							}
							{/* ADD trip form*/}
							{this.state.showAddTrip && !this.props.disabled &&
								<tr>
									{this.props.showColumns.includes(1) &&
											<td colSpan={2} className="p-r-8"> {/*name*/}
										<Select
											isDisabled={this.props.disabled}
											value={this.state.newTripType}
											onChange={(newTripType)=>{
													this.setState({newTripType})
												}
											}
											options={this.props.tripTypes}
											styles={selectStyle}
											/>
									</td>}

									{this.props.showColumns.includes(5) &&
										this.state.toggleTab === "1" &&
										<td></td>} {/*cennik*/}

	 									{this.props.showColumns.includes(7) &&
											this.state.toggleTab === "1" &&
											 <td> {/*cena*/}
									 	 </td>}

									{this.props.showColumns.includes(2) &&
											<td> {/*riesi*/}
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
								 </td>}

								 {this.props.showColumns.includes(3) &&
 									 <td className="p-t-15 p-l-8">Výjazd</td>} {/*typ*/}

										 {this.props.showColumns.includes(4) &&
		 									 <td className="p-l-8 p-r-8"> {/*mn.*/}
									 <input
										 disabled={this.props.disabled}
										 type="number"
										 value={this.state.newTripQuantity}
										 onChange={(e)=>this.setState({newTripQuantity:e.target.value})}
										 className="form-control h-30"
										 id="inlineFormInput"
										 placeholder="Quantity"
										 />
								 </td>}

								 {this.props.showColumns.includes(5) &&
									 this.state.toggleTab === "2" &&
									 <td className="table-highlight-background"></td>} {/*cennik*/}

 								{this.props.showColumns.includes(6) &&
									this.state.toggleTab === "2" &&
 									<td className="table-highlight-background p-l-8 p-r-8"> {/*zlava/marza*/}
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
									{this.props.showColumns.includes(7) &&
										this.state.toggleTab === "2" &&
											<td className="table-highlight-background p-l-8 p-t-15 p-r-8 t-a-r"> {/*cena*/}
 										{
											isNaN(this.getPrice(this.state.newTripType))
											? 'No price'
 											: this.getPrice(this.state.newTripType)+ " €"
 										}
 									</td>}
									{this.props.showColumns.includes(8) &&
										this.state.toggleTab === "2" &&
											<td className="table-highlight-background p-t-15 p-l-8 p-r-8 t-a-r"> {/*spolu*/}
											{isNaN(this.getTotalDiscountedPrice({discount:this.state.newTripDiscount,quantity:this.state.newTripQuantity,type:this.state.newTripType}))?
												'No price'
												:
												this.getTotalDiscountedPrice({discount:this.state.newTripDiscount,quantity:this.state.newTripQuantity,type:this.state.newTripType})+ " €"
											}
										</td>}
										{this.props.showColumns.includes(9) &&
												<td className="t-a-r"> {/*actions*/}
										<button className="btn waves-effect"
											disabled={this.state.newTripType===null||isNaN(parseInt(this.state.newTripQuantity))||this.props.disabled|| this.state.newTripAssignedTo===null}
											onClick={()=>{
												let body={
													type:this.state.newTripType?this.state.newTripType.id:null,
													assignedTo: this.state.newTripAssignedTo?this.state.newTripAssignedTo.id:null,
													quantity: this.state.newTripQuantity!==''?this.state.newTripQuantity:0,
													discount: this.state.newTripDiscount!==''?this.state.newTripDiscount:0,
													done: false,
												}

												this.setState({
													newTripAssignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
													newTripQuantity:1,
													newTripDiscount:0,
													showAddTrip:false
												});
												this.props.submitTrip(body);
												}
											}
											>
											<i className="fa fa-plus" />
										</button>
										<button className="btn waves-effect"
											disabled={this.props.disabled}
											onClick={()=>{
												this.setState({showAddTrip: false,showAddSubtask:false})
											}}>
											<i className="fa fa-times"  />
											</button>
									</td>}
								</tr>}
								{/* ADD materials form*/}
								{this.state.showAddMaterial && !this.props.disabled &&
									<tr>
										{this.props.showColumns.includes(1) &&
											<td  colSpan={2} className="p-r-8"> {/*name*/}
											<input
												disabled={this.props.disabled}
												type="text"
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
												value={this.state.newTitle}
												onChange={(e)=>this.setState({newTitle:e.target.value})}
												/>
										</td>}

										{this.props.showColumns.includes(5) &&
											this.state.toggleTab === "1" &&
												<td className="table-highlight-background p-l-8 p-r-8">  {/* nakup*/}
												<input
													disabled={this.props.disabled}
													type="number"
													value={this.state.newPrice}
													onChange={(e)=>{
														let newPrice = e.target.value;
														if(!this.state.marginChanged){
															if(newPrice==='' || parseFloat(newPrice) < 50 ){
																this.setState({newPrice,newMargin:(this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMargin : 0)});
															}else{
																this.setState({newPrice,newMargin:(this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMarginExtra : 0)});
															}
														}else{
															this.setState({newPrice});
														}
													}}
													className="form-control h-30"
													id="inlineFormInput"
													placeholder=""
													/>
											</td>}

											{this.props.showColumns.includes(7) &&
												this.state.toggleTab === "1" &&
													<td className="table-highlight-background">  {/* cena*/}
												<div className="p-t-15 p-l-8 p-r-8 t-a-r">
												{
													(unitPrice*this.state.newQuantity).toFixed(2)+ " €"
												}
												</div>
											</td>}

										{this.props.showColumns.includes(2) &&
												<td></td> }{/*riesi*/}
													{this.props.showColumns.includes(3) &&
														<td className="p-t-15 p-l-8">Material</td>} {/*typ*/}
															{this.props.showColumns.includes(4) &&
																	<td className="p-r-8 p-l-8"> {/* mn.*/}
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newQuantity}
												onChange={(e)=>this.setState({newQuantity:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
												/>
										</td>}
										{this.props.showColumns.includes(5) &&
											this.state.toggleTab === "2" &&
												<td className="table-highlight-background p-l-8 p-r-8">  {/* nakup*/}
												<input
													disabled={this.props.disabled}
													type="number"
													value={this.state.newPrice}
													onChange={(e)=>{
														let newPrice = e.target.value;
														if(!this.state.marginChanged){
															if(newPrice==='' || parseFloat(newPrice) < 50 ){
																this.setState({newPrice,newMargin:(this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMargin : 0)});
															}else{
																this.setState({newPrice,newMargin:(this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMarginExtra : 0)});
															}
														}else{
															this.setState({newPrice});
														}
													}}
													className="form-control h-30"
													id="inlineFormInput"
													placeholder=""
													/>
											</td>}
											{this.props.showColumns.includes(6) &&
												this.state.toggleTab === "2" &&	<td className="table-highlight-background p-r-8">  {/* zlava/marza*/}
												<input
													disabled={this.props.disabled}
													type="number"
													value={this.state.newMargin}
													onChange={(e)=>this.setState({newMargin:e.target.value,marginChanged:true})}
													className="form-control h-30"
													id="inlineFormInput"
													placeholder=""
													/>
											</td>}
											{this.props.showColumns.includes(7) &&
												this.state.toggleTab === "2" &&
													<td className="table-highlight-background p-l-8 p-t-15 p-r-8 t-a-r">  {/* cena*/}
												{
													(unitPrice*this.state.newQuantity).toFixed(2)+ " €"
												}
											</td>}
											{this.props.showColumns.includes(8) &&
												this.state.toggleTab === "2" &&
												<td className="p-l-8 p-t-15 table-highlight-background"> {/* //spolu*/}
													{this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseInt(cur.totalPrice))? 0 : parseInt(cur.totalPrice)),0).toFixed(2) + " €"}
												</td>
											}
											{this.props.showColumns.includes(9) &&
													<td className="t-a-r"> {/*actions*/}
											<button className="btn waves-effect"
												disabled={this.state.newUnit===null||this.props.disabled}
												onClick={()=>{
													let body={
											      margin:this.state.newMargin!==''?this.state.newMargin:0,
											      price:this.state.newPrice!==''?this.state.newPrice:0,
											      quantity:this.state.newQuantity!==''?this.state.newQuantity:0,
											      title:this.state.newTitle,
											      unit:this.state.newUnit.id
													}
													this.setState({
														showAddMaterial: false,
														newTitle:'',
														newQuantity:1,
														newMargin:0,
														newPrice:0,
														marginChanged:false
													});
													this.props.submitMaterial(body);
													}
												}
												>
												<i className="fa fa-plus" />
											</button>
											<button className="btn waves-effect"
												disabled={this.props.disabled}
												onClick={()=>{
													this.setState({showAddMaterial: false})
												}}>
												<i className="fa fa-times"  />
												</button>
										</td>}
									</tr> }
									{!this.state.showAddSubtask && !this.state.showAddTrip && !this.state.showAddMaterial && !this.props.disabled &&
										<tr >
											<td colSpan={(this.state.toggleTab === 1 ? 8 : 10)}>
												{!this.state.showAddSubtask &&
													<button className="btn"
													disabled={this.props.disabled}
													onClick={()=>{
														this.setState({showAddSubtask: true});
													}}>
													+ Práca
												</button>}
												{!this.state.showAddTrip &&
													<button className="btn"
													disabled={this.props.disabled}
													onClick={()=>{
														this.setState({showAddTrip: true});
													}}>
													+ Výjazd
												</button>}
												{!this.state.showAddTrip &&
												<button className="btn"
													onClick={()=>{
													 this.setState({showAddMaterial: true});
													}}>
													+ Materiál
												</button>}
											</td>
										</tr>
									}
						</tbody>
					</table>
						{(this.props.workTrips.length + this.props.subtasks.length + this.props.materials.length > 0) &&
						<div className="row">
							<div className="text-right ml-auto m-r-5">
								<b>Cena bez DPH: </b>
								{(this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalPrice(cur))?0:this.getTotalPrice(cur)),0)
									+ this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseInt(cur.totalPrice))? 0 : parseInt(cur.totalPrice)),0)).toFixed(2)}
							</div>
							<div className="text-right m-r-5">
								<b>DPH: </b>
								{this.getDPH()}
							</div>
							<div className="text-right">
								<b>Cena s DPH: </b>
								{(this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalPrice(cur))?0:this.getTotalPrice(cur)*this.getDPH()),0)
									+ this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseInt(cur.totalPrice))? 0 : (parseInt(cur.totalPrice)*this.getDPH())),0)).toFixed(2)}
							</div>
						</div>}
				</div>
			);
		}
	}
