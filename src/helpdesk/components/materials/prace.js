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
			editedMaterialTitle: "",
			editedMaterialQuantity: "0",
			editedMaterialWorkType:null,
			focusedMaterial: null,
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
									<th style={tableStyle}>Mn.</th>
									<th style={tableStyleCenterNoBorder}>Action</th>
								</tr>
							</thead>
							<tbody>
								{
									this.props.materials.map((material)=>
									<tr key={material.id}>
										<td style={tableStyle}>
											<input type="checkbox" checked={material.done} onClick={()=>{
												this.props.updateMaterial(material.id,{done:!material.done})
												rebase.updateDoc('taskMaterials/'+material.id,{done:!material.done});
												}} />
										</td>
										<td style={tableStyle}>
											<div style={{ background: '#dcf4f9', borderRadius: '5px', padding: 5 }}>
												<input
													className="invisible-input"
													value={material.title}
													disabled={true}
												/>
										</div>
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
												editedMaterialQuantity: material.quantity?material.quantity:'',
												focusedMaterial: material.id
											});
										}}
										onChange={e =>{
											this.setState({ editedMaterialQuantity: e.target.value })}
										}
										/>
									</td>
									<td style={tableStyleCenter}>
										<button className="btn btn-link waves-effect" onClick={()=>{
												if(window.confirm('Are you sure?')){
													rebase.removeDoc('taskMaterials/'+material.id).then(()=>this.props.removeMaterial(material.id));
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
							<b>Sub-total:</b>
							{this.props.materials.map((material)=>parseFloat(material.totalPrice)).reduce((acc, cur)=> acc+cur,0)}
						</p>

						</div>
					</div>
				</div>

			</div>
		);
	}
}
