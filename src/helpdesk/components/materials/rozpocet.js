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
		const newMargin= this.props.company? this.props.company.pricelist.materialMargin : 0;
		this.state={
			editedMaterialTitle: "",
			editedMaterialQuantity: "0",
			editedMaterialDiscount:0,
			editedMaterialUnit:null,
			editedMaterialMargin:null,
			editedMaterialPrice:null,
			focusedMaterial: null,
			selectedIDs:[],

			newTitle:'',
			newQuantity:1,
			newDiscount:0,
			newUnit:null,
			newMargin,
			newPrice:0,
		}
	}

	componentWillReceiveProps(props){
		if((this.props.company===null && props.company!==null) ||
		(props.company!==null && props.company!==null && props.company.id!==this.props.company.id)){
			this.setState({newMargin:props.company.pricelist.materialMargin});
		}
		if((this.props.units.length!==props.units.length)){
			this.setState({newUnit:props.units[0]});
		}
	}

	render() {
		const unitPrice= this.state.newPrice?(this.state.newPrice*(this.state.newMargin/100+1)):0;
		let editedFinalUnitPrice = 0;
		if(this.state.focusedMaterial!==null){
			editedFinalUnitPrice = (parseFloat(this.state.editedMaterialPrice)*(1+parseFloat(this.state.editedMaterialMargin)/100))
		}
		return (
			<div className="">
				<div className="row">
					<div className="col-md-12">
						<div className="table-responsive">
							<table className="table table-centered table-borderless table-hover mb-0">
								<thead className="thead-light">
									<tr>
										<th style={tableStyle}>
											<input type="checkbox"
												checked={this.props.materials.length===this.state.selectedIDs.length}
												onClick={()=>this.setState({selectedIDs:(this.props.materials.length===this.state.selectedIDs.length?[]:this.props.materials.map((item)=>item.id))})} />
										</th>
										<th style={tableStyle} width="30%">Názov</th>
											<th style={tableStyle}>Cena</th>
										<th style={tableStyle}>Mn.</th>
										<th style={tableStyle} width="10%">Unit</th>
										<th style={tableStyle}>Margin</th>
										<th style={tableStyle}>Cena/Mn.</th>
										<th style={tableStyle}>Zlava</th>
										<th style={tableStyle}>Cena</th>
										<th style={tableStyleCenterNoBorder}>Action</th>
									</tr>
								</thead>
								<tbody>
									{
										this.props.materials.map((material)=>
										<tr key={material.id}>
											<td style={tableStyle}>
												<input
													type="checkbox"
													checked={this.state.selectedIDs.includes(material.id)}
													onClick={()=>{
														if(!this.state.selectedIDs.includes(material.id)){
															this.setState({selectedIDs:[...this.state.selectedIDs,material.id]})
														}else{
															let newSelectedIDs=[...this.state.selectedIDs];
															newSelectedIDs.splice(newSelectedIDs.findIndex((item)=>item.id===material.id),1);
															this.setState({selectedIDs:newSelectedIDs})
														}
													}
												} />
											</td>
											<td style={tableStyle}>
												<div style={{ background: '#dcf4f9', borderRadius: '5px', padding: 5 }}>
													<input
														className="invisible-input"
														value={
															material.id === this.state.focusedMaterial
															? this.state.editedMaterialTitle
															: material.title
														}
														onBlur={() => {
															//submit
															this.props.updateMaterial(material.id,{title:this.state.editedMaterialTitle})
															rebase.updateDoc('taskMaterials/'+material.id,{title:this.state.editedMaterialTitle});
															this.setState({ focusedMaterial: null });
														}}
														onFocus={() => {
															this.setState({
																editedMaterialTitle:material.title,
																editedMaterialQuantity:material.quantity,
																editedMaterialDiscount:material.discount,
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
												</div>
											</td>
											<td style={tableStyle}>
												<input
													type="number"
													className="invisible-input"
													value={
														material.id === this.state.focusedMaterial
														? this.state.editedMaterialPrice
														: material.price
													}
													onBlur={() => {
														//submit
														this.props.updateMaterial(material.id,{price:this.state.editedMaterialPrice})
														rebase.updateDoc('taskMaterials/'+material.id,{price:this.state.editedMaterialPrice});
														this.setState({ focusedMaterial: null });
													}}
													onFocus={() => {
														this.setState({
															editedMaterialTitle:material.title,
															editedMaterialQuantity:material.quantity,
															editedMaterialDiscount:material.discount,
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
											</td>
											<td style={tableStyle}>
												<input
													type="number"
													className="invisible-input"
													value={
														material.id === this.state.focusedMaterial
														? this.state.editedMaterialQuantity
														: material.quantity
													}
													onBlur={() => {
														//submit
														this.props.updateMaterial(material.id,{quantity:this.state.editedMaterialQuantity})
														rebase.updateDoc('taskMaterials/'+material.id,{quantity:this.state.editedMaterialQuantity});
														this.setState({ focusedMaterial: null });
													}}
													onFocus={() => {
														this.setState({
															editedMaterialTitle:material.title,
															editedMaterialQuantity:material.quantity,
															editedMaterialDiscount:material.discount,
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
											</td>
											<td style={tableStyle}>
												<Select
													value={material.unit}
													onChange={(unit)=>{
														this.props.updateMaterial(material.id,{unit})
														rebase.updateDoc('taskMaterials/'+material.id,{unit:unit.id});
													}}
													options={this.props.units}
													styles={selectStyle}
													/>
											</td>
											<td style={tableStyle}>
												<input
													type="number"
													className="invisible-input"
													value={
														parseInt(material.id === this.state.focusedMaterial
															? this.state.editedMaterialMargin
															: material.margin)
														}
														onBlur={() => {
															this.props.updateMaterial(material.id,{margin:this.state.editedMaterialMargin})
															rebase.updateDoc('taskMaterials/'+material.id,{margin:this.state.editedMaterialMargin});
															this.setState({ focusedMaterial: null });
														}}
														onFocus={() => {
															this.setState({
																editedMaterialTitle:material.title,
																editedMaterialQuantity:material.quantity,
																editedMaterialDiscount:material.discount,
																editedMaterialUnit:material.unit,
																editedMaterialMargin:material.margin,
																editedMaterialPrice:material.price,
																focusedMaterial: material.id
															});
														}}
														onChange={e =>{
															this.setState({ editedMaterialMargin: e.target.value })}
														}
														/>
											</td>

											<td style={tableStyle}>
												{parseFloat(material.id === this.state.focusedMaterial
														? editedFinalUnitPrice
														: material.finalUnitPrice)
													}
											</td>
											<td style={tableStyle}>
												<input
													type="number"
													className="invisible-input"
													value={
														parseInt(material.id === this.state.focusedMaterial
															? this.state.editedMaterialDiscount
															: material.discount)
														}
														onBlur={() => {
															this.props.updateMaterial(material.id,{discount:this.state.editedMaterialDiscount})
															rebase.updateDoc('taskMaterials/'+material.id,{discount:this.state.editedMaterialDiscount});
															this.setState({ focusedMaterial: null });
														}}
														onFocus={() => {
															this.setState({
																editedMaterialTitle:material.title,
																editedMaterialQuantity:material.quantity,
																editedMaterialDiscount:material.discount,
																editedMaterialUnit:material.unit,
																editedMaterialMargin:material.margin,
																editedMaterialPrice:material.price,
																focusedMaterial: material.id
															});
														}}
														onChange={e =>{
															this.setState({ editedMaterialDiscount: e.target.value })}
														}
														/>
												</td>
												<td style={tableStyle}>
													{
														(
														(parseFloat(material.id === this.state.focusedMaterial
																? editedFinalUnitPrice
																: material.finalUnitPrice)
														-
														parseFloat(material.id === this.state.focusedMaterial
																? editedFinalUnitPrice
																: material.finalUnitPrice)*
														parseInt(material.id === this.state.focusedMaterial?(this.state.editedMaterialDiscount===''?0:this.state.editedMaterialDiscount):material.discount)
														/100)*
														parseInt(material.id === this.state.focusedMaterial?(this.state.editedMaterialQuantity===''?0:this.state.editedMaterialQuantity):material.quantity)
														)
														.toFixed(2)
													}
												</td>
												<td style={tableStyleCenter}>
													<button className="btn btn-link waves-effect" onClick={()=>{
															if(window.confirm('Are you sure?')){
																rebase.removeDoc('taskMaterials/'+material.id).then(()=>this.props.removeMaterial(material.id));
															}

														}}>
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
												value={this.state.newTitle}
												onChange={(e)=>this.setState({newTitle:e.target.value})}
												style={{ height: 30 }}
												/>
										</td>
										<td style={tableStyle}>
											<input
												type="number"
												value={this.state.newPrice}
												onChange={(e)=>this.setState({newPrice:e.target.value})}
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
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
												value={this.state.newUnit}
												onChange={(newUnit)=>{
													this.setState({newUnit})
												}
											}
											options={this.props.units}
											styles={selectStyle}
											/>
									</td>
									<td style={tableStyle}>
										<input
											type="number"
											value={this.state.newMargin}
											onChange={(e)=>this.setState({newMargin:e.target.value})}
											className="form-control mb-2"
											id="inlineFormInput"
											placeholder=""
											style={{ height: 30 }}
											/>
									</td>
										<td style={tableStyle}>
											{unitPrice.toFixed(2)}
										</td>
										<td style={tableStyle}>
											<input
												type="number"
												value={this.state.newDiscount}
												onChange={(e)=>this.setState({newDiscount:e.target.value})}
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
												/>
										</td>
										<td style={tableStyle}>
											{
												((unitPrice-unitPrice*0.01*this.state.newDiscount)*this.state.newQuantity).toFixed(2)
											}
										</td>
										<td style={tableStyleCenter}>
											<button className="btn btn-link waves-effect"
												disabled={this.state.newUnit===null}
												onClick={()=>{
													let body={
														discount:this.state.newDiscount!==''?this.state.newDiscount:0,
											      margin:this.state.newMargin!==''?this.state.newMargin:0,
											      price:this.state.newPrice!==''?this.state.newPrice:0,
											      quantity:this.state.newQuantity!==''?this.state.newQuantity:0,
											      title:this.state.newTitle,
											      unit:this.state.newUnit.id
													}
													this.setState({
														newTitle:'',
														newQuantity:1,
														newDiscount:0,
														newMargin:0,
														newPrice:0,
													});
													this.props.submitMaterial(body);
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
							<div className="col-md-6">
								<p className="text-right">
									<b>Sub-total:</b>
									{this.props.materials.map((material)=>parseFloat(material.totalPrice)).reduce((acc, cur)=> acc+cur,0)}
								</p>
								</div>
							</div>
						</div>

					</div>
				</div>
			);
		}
	}
