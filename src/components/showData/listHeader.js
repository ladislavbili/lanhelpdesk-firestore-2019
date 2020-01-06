import React, { Component } from 'react';
import Search from './search';

export default class ListHeader extends Component {
	render() {
		return (
				<div className="d-flex m-t-10 m-b-10 m-l-20 m-r-20 flex-row">
					<Search {...this.props}/>
					<div className="d-flex flex-row align-items-center ml-auto">
						<div className="text-basic m-r-5 m-l-5">
							Sort by
						</div>

							<select
								value={this.props.orderBy}
								className="invisible-select text-bold text-highlight"
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
