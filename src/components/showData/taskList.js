import React, { Component } from 'react';
import {getItemDisplayValue} from '../../helperFunctions';
import CommandBar from './commandBar';
import ListHeader from './listHeader';

export default class List extends Component {

	constructor(props) {
		super(props);
		this.state = {
			search: props.displayValues.map((display, index) => ""),
		};
	}

	componentWillReceiveProps(props){
		if (this.props !== props){
			let newSearch = props.displayValues.map((display, index) => "");
			this.setState({
				search: newSearch,
			});
		}
	}

	render() {
		console.log(this.props);

		return (
				<div className="row">
					<CommandBar {...this.props.commandBar} />
					<div className="full-width scrollable fit-with-header-and-commandbar p-r-20 p-l-20">
						<ListHeader {...this.props.commandBar} listName={this.props.listName}/>
						<div className="p-10">
							<table className="table">
								<thead>
										<tr>
											{
												this.props.displayValues.map((display,index)=>
												<th key={index}>
													{display.label}
												</th>
											)}
										</tr>
									</thead>

									<tbody>
										<tr>
											{
												this.props.displayValues.map((display,index)=>
												<th key={index}>
													<input
														type="text"
														value={this.state.search[index]}
														className="form-control commandbar-search"
														onChange={(e) => {
																let newSearch = this.state.search;
																newSearch[index] = e.target.value;
																this.setState({
																	search: newSearch,
																});
															}
														}
														placeholder={`Filter by ${display.label}`} />
												</th>
											)}
										</tr>
										{
											this.props.data
											.filter((item, index) =>
											{
												return this.props.displayValues
															.filter((display,index)=> {
																let value = getItemDisplayValue(item,display);
																if(display.value === "assignedTo"){
																	value = item["assignedTo"].map(item => `${item.name} ${item.surname} (${item.email})`).toString();
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
																return value.toString().toLowerCase().includes(this.state.search[index]);
															}).length === this.props.displayValues.length;
											}).map((item,index)=>
												<tr
													key={index}
													onClick={(e)=>{
														this.props.history.push(this.props.link+'/'+item.id);
													}}
													className="clickable">
													{ this.props.displayValues
														.map((display,index)=>
														<td
															key={index}
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
