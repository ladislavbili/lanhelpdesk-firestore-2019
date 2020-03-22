import React, { Component } from 'react';
import classnames from 'classnames';

export default class CommandBar extends Component {

	render() {

		const FILTERED_BREADCRUMBS = ( this.props.breadcrumsData ? this.props.breadcrumsData.filter((breadcrum)=>breadcrum.show) : [] );
		let fontsize = "2.5rem";
		if (this.props.useBreadcrums){
			let text = FILTERED_BREADCRUMBS.map(crumb => crumb.label).join(" \\ ");
			if (text.length > 35){
				fontsize = "2rem";
			} else if (text.length > 50){
				fontsize = "1.5rem";
			} else if (text.length > 60){
				fontsize = "1rem";
			}
		}
		return (
			<div className={"commandbar " + (this.props.layout !== 0 ? "p-l-20" : "p-l-0")}>

				<div className="center-hor">
					{
						this.props.useBreadcrums !== true &&
						<div className="breadcrumbs">
							<h2>
								{this.props.listName?this.props.listName:""}
							</h2>
						</div>
					}
					{this.props.useBreadcrums  &&
						<div className="flex-row breadcrumbs"
							>
							{
								FILTERED_BREADCRUMBS.map((breadcrum, index)=>
									<h2
										className="clickable"
										key={breadcrum.label}
										style={{fontSize: fontsize}}
										onClick={breadcrum.onClick}>{breadcrum.label + ((FILTERED_BREADCRUMBS.length - 1 !== index) ? ` \\ ` : "")}</h2>
								)
							}
						</div>
					}
				</div>

					<div className="ml-auto p-2 align-self-center">
						<div className="d-flex flex-row">
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
					</div>
			</div>
		);
	}
}
