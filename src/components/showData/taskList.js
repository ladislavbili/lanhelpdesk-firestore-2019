import React, { Component } from 'react';
import {timestampToString} from '../../helperFunctions';

export default class TaskList extends Component {

	getItemDisplayValue(item,value){
		if(!item[value.value]){
			return 'Neexistuje';
		}
		if(value.type==='object'){
			return item[value.value].title;
		}else if(value.type==='text'){
			return item[value.value];
		}else if(value.type==='list'){
			return value.func(item[value.value]);
		}else if(value.type==='date'){
			return timestampToString(item[value.value]);
		}else if(value.type==='user'){
			return item[value.value].name+' '+item[value.value].surname + ' ('+item[value.value].email+')';
		}else{
			return 'Error'
		}
	}


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
													<td key={index}>{this.getItemDisplayValue(item,display)}</td>
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
