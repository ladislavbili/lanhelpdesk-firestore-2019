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
		return (
				<div className="row">
					<CommandBar {...this.props.commandBar} />
					<div className="full-width scroll-visible fit-with-header-and-commandbar p-r-20 p-l-20">
						<ListHeader {...this.props.commandBar} listName={this.props.listName}/>
						<div className="p-10">
							<table className="table">
								<thead>
										<tr>
											{
												this.props.displayValues.map((display)=> {
													return (
														<th key={display.value} width={display.value === 'title' ? "30%" : (display.value === "id" ? "50px" : "")}>
															{display.label}
														</th>
													)
												}
											)}
										</tr>
									</thead>

									<tbody>
										<tr style={{backgroundColor: "#F2F1F1"}}>
											{
												this.props.displayValues.map((display)=>
												<th key={display.value}>
													<input
														type="text"
														value={filter[display.value]}
														className="form-control"
														onChange={(e) => {
															let newFilterData={};
															newFilterData[display.value]=e.target.value;
															this.props.setShowDataFilter(this.props.filterName,newFilterData);
														}}
														placeholder={`${display.label}`} />
												</th>
											)}
											<th>
												<button type="button" className="btn btn-link waves-effect" onClick={this.clearFilter.bind(this)}>
													<i
														className="fas fa-times commandbar-command-icon"
														/>
												</button>
											</th>
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
																	value = item["status"].title.toString();
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
															key={display.value}
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
				</div>
		);
	}
}

const mapStateToProps = ({ showDataReducer }) => {
	return { filter:showDataReducer.filter };
};

export default connect(mapStateToProps, { setShowDataFilter })(List);
