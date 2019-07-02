import React, { Component } from 'react';
import {getItemDisplayValue} from '../../helperFunctions';

export default class TaskList extends Component {

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<div className="card-box">
							<table className="table table-centered table-borderless table-hover mb-0">
								<thead className="thead-light">
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
				</div>
			</div>
		);
	}
}