import React, { Component } from 'react';
import {getItemDisplayValue, sameStringForms} from '../../helperFunctions';
import CommandBar from './commandBar';
import ListHeader from './listHeader';

export default class List extends Component {

	constructor(props) {
		super(props);
		let search={};
		props.displayValues.forEach((display)=>{
			search[display.value]=''
		})
		this.state = {
			search,
		};
	}

	componentWillReceiveProps(props){
		if (!sameStringForms(this.props,props)){
			let search={};
			props.displayValues.forEach((display)=>{
				search[display.value]=''
			})
			this.setState({
				search,
			});
		}
	}

	render() {
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
														value={this.state.search[display.value]}
														className="form-control"
														onChange={(e) => {
																let newSearch = this.state.search;
																newSearch[display.value] = e.target.value;
																this.setState({
																	search: newSearch,
																});
															}
														}
														placeholder={`${display.label}`} />
												</th>
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
																return value.toString().toLowerCase().includes(this.state.search[display.value].toLowerCase());
															});
											}).map((item)=>
												<tr
													key={item.id}
													onClick={(e)=>{
														this.props.history.push(this.props.link+'/'+item.id);
													}}
													className="clickable">
													{ this.props.displayValues
														.map((display)=>
														<td
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
