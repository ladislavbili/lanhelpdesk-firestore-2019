import React, { Component } from 'react';
import Select from 'react-select';
import { selectStyle, invisibleSelectStyle} from '../../../scss/selectStyles';

export default class Rozpocet extends Component {
	constructor(props){
		super(props);
		const newMargin= this.props.company? this.props.company.pricelist.materialMargin : 0;
		const newUnit= this.props.units.find((item)=>item.id===this.props.defaultUnit);
		this.state={
			editedMaterialTitle: "",
			editedMaterialQuantity: "0",
			editedMaterialUnit:null,
			editedMaterialMargin:null,
			editedMaterialPrice:null,
			focusedMaterial: null,
			selectedIDs:[],

			newTitle:'',
			newQuantity:1,
			newUnit:newUnit?newUnit:null,
			newMargin,
			newPrice:0,
			marginChanged:false,
		}
		this.getDPH.bind(this);
	}

	componentWillReceiveProps(props){
		if((this.props.company===null && props.company!==null) ||
		(this.props.company && props.company && props.company.id!==this.props.company.id)){
			this.setState({newMargin:props.company.pricelist.materialMargin});
		}
		if(this.props.units && props.units && this.props.units.length!==props.units.length){
			let newUnit= props.units[0];
			if(props.defaultUnit!==null){
				newUnit=props.units.find((item)=>item.id===props.defaultUnit)
			}
			this.setState({newUnit});
		}
		if(this.props.match.params.taskID!==props.match.params.taskID){
			let newUnit= props.units[0];
			if(props.defaultUnit!==null){
				newUnit=props.units.find((item)=>item.id===props.defaultUnit)
			}
			this.setState({
				newTitle:'',
				newQuantity:1,
				newUnit,
				newMargin:props.company? props.company.pricelist.materialMargin : 0,
				newPrice:0,
				marginChanged:false,
			})
		}
	}

	getDPH(){
		let dph = 20;
		if(this.props.company && this.props.company.dph > 0){
			dph = this.props.company.dph;
		}
		return (100+dph)/100;
	}

	render() {
		console.log(this.props);
		const unitPrice= this.state.newPrice?(this.state.newPrice*(this.state.newMargin/100+1)):0;
		let editedFinalUnitPrice = 0;
		if(this.state.focusedMaterial!==null){
			editedFinalUnitPrice = (parseFloat(this.state.editedMaterialPrice)*(1+parseFloat(this.state.editedMaterialMargin)/100))
		}
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<div>
							<table className="table">
								<thead>
									<tr>
										{false &&
											<th>
											<input type="checkbox"
												disabled={this.props.disabled}
												checked={this.props.materials.length===this.state.selectedIDs.length}
												onChange={()=>this.setState({selectedIDs:(this.props.materials.length===this.state.selectedIDs.length?[]:this.props.materials.map((item)=>item.id))})} />
										</th>}
										<th className="col-form-label">Materiál</th>
										<th style={{fontSize: "12px", fontFamily: "Segoe UI", fontWeight: "500", color: "#333"}} width="100">Mn.</th>
										<th width="100">Jednotka</th>
										<th width="100">Cena</th>
										<th width="100" className="table-highlight-background">Nákup</th>
										<th width="100" className="table-highlight-background">Marža</th>
										{false && <th width="124">Predajná cena</th>}
										<th className="t-a-c" width="130"></th>
									</tr>
								</thead>
								<tbody>
									{
										this.props.materials.map((material)=>
										<tr key={material.id}>
											{false &&
												<td className="table-checkbox">
												<input
													disabled={this.props.disabled}
													type="checkbox"
													checked={this.state.selectedIDs.includes(material.id)}
													onChange={()=>{
														if(!this.state.selectedIDs.includes(material.id)){
															this.setState({selectedIDs:[...this.state.selectedIDs,material.id]})
														}else{
															let newSelectedIDs=[...this.state.selectedIDs];
															newSelectedIDs.splice(newSelectedIDs.findIndex((item)=>item.id===material.id),1);
															this.setState({selectedIDs:newSelectedIDs})
														}
													}
												} />
											</td>}
											<td>
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
											</td>
											<td>
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
											</td>
											<td>
												<Select
													isDisabled={this.props.disabled}
													value={material.unit}
													onChange={(unit)=>{
														this.props.updateMaterial(material.id,{unit})
													}}
													options={this.props.units}
													styles={invisibleSelectStyle}
													/>
											</td>
											<td>
												<div className="p-t-5">
												{
													(
													(parseFloat(material.id === this.state.focusedMaterial
															? editedFinalUnitPrice
															: material.finalUnitPrice))*
													parseInt(material.id === this.state.focusedMaterial?(this.state.editedMaterialQuantity===''?0:this.state.editedMaterialQuantity):material.quantity)
													)
													.toFixed(2)
												}
											</div>
											</td>
											<td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
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
											</td>
											<td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
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
														/>
											</td>
									{	false && 	<td>
												{parseFloat(material.id === this.state.focusedMaterial
														? editedFinalUnitPrice
														: material.finalUnitPrice).toFixed(2)
													}
											</td>}




											<td className="t-a-r">
												<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
														<i className="fa fa-sync-alt" onClick={()=>{
																if(parseInt(material.price) <= 50){
																	this.props.updateMaterial(material.id,{margin:(this.props.company && this.props.company.pricelist)?parseInt(this.props.company.pricelist.materialMargin):material.margin})
																}else{
																	this.props.updateMaterial(material.id,{margin:(this.props.company && this.props.company.pricelist)?parseInt(this.props.company.pricelist.materialMarginExtra):material.margin})
																}
															}} />
												</button>
												<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
													<i className="fa fa-arrow-up"  />
												</button>
												<button className="btn btn-link waves-effect" disabled={this.props.disabled}>
														<i className="fa fa-arrow-down"  />
												</button>

												<button className="btn btn-link waves-effect"
													disabled={this.props.disabled}
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeMaterial(material.id);
														}
													}}>
													<i className="fa fa-times" />
												</button>
											</td>

											</tr>
										)
									}

									{!this.state.showAddItem && !this.props.disabled &&
										<tr >
										<td>
											<button className="btn btn-table-add-item"
												onClick={()=>{
												 this.setState({showAddItem: true});
												}}>
												+ Materiál
											</button>
										</td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td>
										</td>
									</tr>
									}

								{this.state.showAddItem && !this.props.disabled &&
									<tr>
										<td>
											<input
												disabled={this.props.disabled}
												type="text"
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
												value={this.state.newTitle}
												onChange={(e)=>this.setState({newTitle:e.target.value})}
												/>
										</td>
										<td >
											<input
												disabled={this.props.disabled}
												type="number"
												value={this.state.newQuantity}
												onChange={(e)=>this.setState({newQuantity:e.target.value})}
												className="form-control h-30"
												id="inlineFormInput"
												placeholder=""
												/>
										</td>
										<td>
											<Select
												isDisabled={this.props.disabled}
												value={this.state.newUnit}
												onChange={(newUnit)=>{
													this.setState({newUnit})
												}
											}
											options={this.props.units}
											styles={selectStyle}
											/>
									</td>
									<td>
										<div className="p-t-5">
										{
											(unitPrice*this.state.newQuantity).toFixed(2)
										}
										</div>
									</td>
									<td className="table-highlight-background">
										<input
											disabled={this.props.disabled}
											type="number"
											value={this.state.newPrice}
											onChange={(e)=>{
												let newPrice = e.target.value;
												if(!this.state.marginChanged){
													if(newPrice==='' || parseFloat(newPrice) < 50 ){
														this.setState({newPrice,newMargin:(this.props.company? this.props.company.pricelist.materialMargin : 0)});
													}else{
														this.setState({newPrice,newMargin:(this.props.company? this.props.company.pricelist.materialMarginExtra : 0)});
													}
												}else{
													this.setState({newPrice});
												}
											}}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
									<td className="table-highlight-background">
										<input
											disabled={this.props.disabled}
											type="number"
											value={this.state.newMargin}
											onChange={(e)=>this.setState({newMargin:e.target.value,marginChanged:true})}
											className="form-control h-30"
											id="inlineFormInput"
											placeholder=""
											/>
									</td>
							{false &&	<td>
										{unitPrice.toFixed(2)}
									</td>}

										<td className="t-a-r">
											<button className="btn btn-link waves-effect"
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
														showAddItem: false,
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
											<button className="btn btn-link waves-effect"
												disabled={this.props.disabled}
												onClick={()=>{
													this.setState({showAddItem: false})
												}}>
												<i className="fa fa-times"  />
												</button>
										</td>
									</tr> }
								</tbody>
							</table>
						</div>
						<div className="text-right">
								<b>Cena bez DPH: </b>
								{this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseInt(cur.totalPrice))? 0 : parseInt(cur.totalPrice)),0).toFixed(2)}
						</div>
						<div className="text-right">
								<b>DPH: </b>
								{this.getDPH()}
						</div>
						<div className="text-right">
								<b>Cena s DPH: </b>
								{this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseInt(cur.totalPrice))? 0 : (parseInt(cur.totalPrice)*this.getDPH())),0).toFixed(2)}
						</div>
						{false &&
						<div className="row justify-content-end">
							<div className="col-md-6">
								<p className="text-right" style={{marginTop: ((this.state.showAddItem||this.props.disabled) ? "" : "-45px")}}>
									<b>Sub-total:</b>
									{(this.props.materials.map((material)=>parseFloat(material.totalPrice)).reduce((acc, cur)=> acc+cur,0)).toFixed(2)}
								</p>

								</div>
							</div>
							}
						</div>

					</div>
				</div>
			);
		}
	}
