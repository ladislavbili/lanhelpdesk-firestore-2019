import React, { Component } from 'react';
import Search from './search';
import classnames from "classnames";

export default class ListHeader extends Component {
	render() {
		return (
				<div className="d-flex m-b-10 flex-row">
					<Search {...this.props}/>
					<div className={classnames({"m-r-20": (this.props.link.includes("settings")
																								|| (this.props.link.includes("lanwiki") && this.props.layout === 1)
																								|| (this.props.link.includes("passmanager") && this.props.layout === 1)
																								|| (this.props.link.includes("expenditures") && this.props.layout === 1)
																								|| (this.props.link.includes("helpdesk") && !this.props.link.includes("settings") && this.props.layout !== 0))},

																		 {"m-r-5": (this.props.link.includes("helpdesk") && !this.props.link.includes("settings") && this.props.layout === 0)
																			 					|| (this.props.link.includes("passmanager") && this.props.layout === 0)
																			 					|| (this.props.link.includes("expenditures") && this.props.layout === 0)
																								|| (this.props.link.includes("lanwiki") && this.props.layout === 0)},

																		 "d-flex", "flex-row", "align-items-center", "ml-auto")}>
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
