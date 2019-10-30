import React, { Component } from 'react';


export default class ListHeader extends Component {
	render() {
		return (
				<div className="m-r-5 m-l-5 d-flex flex-row align-items-center">
					<div className="p-2 p-l-10">
						<h4 className="font-24 text-slim">
							{this.props.listName?this.props.listName:""}
						</h4>
					</div>
				<div className="d-flex flex-row align-items-center ml-auto">
					<div className="text-basic m-r-5 m-l-5">
						Sort by
					</div>
					
						<select
							value={this.props.orderBy}
							className="invisible-select text-bold"
							onChange={(e)=>this.props.setOrderBy(e.target.value)}>
							{
								this.props.orderByValues.map((item,index)=>
								<option value={item.value} key={index}>{item.label}</option>
							)
							}
						</select>

						{ !this.props.ascending &&
							<button type="button" className="btn btn-link btn-outline-blue waves-effect" onClick={()=>this.props.setAscending(true)}>
								<i
									className="fas fa-arrow-up"
									/>
							</button>
						}

						{ this.props.ascending &&
							<button type="button" className="btn btn-link btn-outline-blue waves-effect" onClick={()=>this.props.setAscending(false)}>
								<i
									className="fas fa-arrow-down"
									/>
							</button>
						}
				</div>
			</div>
		);
	}
}
