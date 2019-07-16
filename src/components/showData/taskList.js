import React, { Component } from 'react';
import {getItemDisplayValue} from '../../helperFunctions';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
export default class List extends Component {

	render() {
		return (
				<div className="row">
					<CommandBar {...this.props.commandBar} />
					<div className="full-width scrollable fit-with-header-and-commandbar">
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
										{
											this.props.data.map((item,index)=>
											<tr
												key={index}
												onClick={(e)=>{
													this.props.history.push(this.props.link+'/'+item.id);
												}}
												className="clickable">
												{ this.props.displayValues.map((display,index)=>
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
