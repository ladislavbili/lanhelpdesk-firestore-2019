import React, { Component } from 'react';
import {getItemDisplayValue} from '../../helperFunctions';

export default class TaskList extends Component {

	render() {
		return (
				<div className="row p-20">
					<div className="col-md-12">
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
											<tr	 key={index} className="clickable" onClick={()=>this.props.history.push(this.props.link+'/'+item.id)}>
												{this.props.displayValues.map((display,index)=>
													<td key={index}>{getItemDisplayValue(item,display)}</td>
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
