import React, { Component } from 'react';
import {getItemDisplayValue} from '../../helperFunctions';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
import { connect } from "react-redux";
import {setShowDataFilter } from '../../redux/actions';

class List extends Component {

	clearFilter(){
		if(window.confirm("Are you sure you want to clear the filter?")){
			let defaultFilter={};
			this.props.displayValues.forEach((display)=>{
				defaultFilter[display.value]=''
			})
			this.props.setShowDataFilter(this.props.filterName,defaultFilter);
		}
	}

	render() {
		let filter = this.props.filter[this.props.filterName];

		console.log(this.props);

		return (
				<div>
					<CommandBar {...this.props.commandBar} listName={this.props.listName}/>
					<div className="full-width scroll-visible fit-with-header-and-commandbar task-container">
						<ListHeader {...this.props.commandBar} listName={this.props.listName} statuses={this.props.statuses} setStatuses={this.props.setStatuses} allStatuses={this.props.allStatuses} />
						<table className="table">
							<thead>
									<tr>
										{
											this.props.displayValues.map((display,index)=> {
												if(display.type==='important'){
													return null;
												}
												return (
													<th
														style={(display.value === "createdAt" || display.value === "deadline" ? {textAlign: "right"} : {})}
														colSpan={((index===0 || this.props.displayValues[index-1].type!=='important') && display.value !== "deadline")?'1':'2'}
														key={display.value}
														width={display.value === 'title' ? "30%" : ((display.value === "id") ? "50px" : '')}>
														{display.label}
													</th>
												)
											}
										)}
									</tr>
								</thead>

								<tbody>
									<tr>
										{
											this.props.displayValues.map((display,index)=>{
												if(display.type==='important'){
													return null;
												}else{
													return <th key={display.value} colSpan={(index===0 || this.props.displayValues[index-1].type!=='important')?'1':'2'} >
														<div className={(display.value === "deadline" ? "row" : "")}>
															<div style={{width: "80%"}}>
																<input
																	type="text"
																	value={filter[display.value]}
																	className="form-control hidden-input"
																	style={{fontSize: "12px", marginRight: "10px"}}
																	onChange={(e) => {
																		let newFilterData={};
																		newFilterData[display.value]=e.target.value;
																		this.props.setShowDataFilter(this.props.filterName,newFilterData);
																	}}/>
																</div>
														{display.value === "deadline" &&
															<div>
																<button type="button" className="btn btn-link waves-effect" onClick={this.clearFilter.bind(this)}>
																	<i
																		className="fas fa-times commandbar-command-icon m-l-8 text-highlight"
																		/>
																</button>
															</div>
														}
													</div>
														</th>
												}
											}
										)}
									</tr>
									{
										this.props.data
										.filter((item) =>
										{
											return this.props.displayValues
														.every((display)=> {
															let value = getItemDisplayValue(item,display);
															if(display.value === "assignedTo"){
																value = item["assignedTo"].map(item => `${item.name} ${item.surname} (${item.email})`).toString();
															}
															if(display.value === "status"){
																value = item["status"] ? item["status"].title.toString() : "";
															}
															if(display.value === "tags"){
																value = item["tags"].map(item => `${item.title}`).toString();
															}
															if(display.value === "URL"){
																value = item["URL"];
															}
															if(display.value === "password"){
																value = item["password"];
															}
															if(display.value === 'important'){
																return true;
															}
															return value.toString().toLowerCase().includes(filter[display.value].toLowerCase());
														});
										}).map((item)=>
											<tr
												key={item.id}
												onClick={(e)=>{
													this.props.history.push(this.props.link+'/'+item.id);
												}}
												className="clickable">
												{ this.props.displayValues
													.map((display,index)=>
													<td
														colSpan={(index===this.props.displayValues.length-1)?"2":"1"}
														style={(display.value === "createdAt" || display.value === "deadline" ? {textAlign: "right"} : {})}
														key={display.value}
														className={display.value}
														>
														{getItemDisplayValue(item,display)}
													</td>
												)}
											</tr>
									)}
								</tbody>
							</table>
					</div>
				</div>
		);
	}
}

const mapStateToProps = ({ showDataReducer }) => {
	return { filter:showDataReducer.filter  };
};

export default connect(mapStateToProps, { setShowDataFilter })(List);
