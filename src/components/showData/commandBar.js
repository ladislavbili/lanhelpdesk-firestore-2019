import React, { Component } from 'react';


export default class CommandBar extends Component {

	render() {
		const FILTERED_BREADCRUMBS = ( this.props.breadcrumsData ? this.props.breadcrumsData.filter((breadcrum)=>breadcrum.show) : [] );

		return (
			<div className={"commandbar " + (this.props.layout === 1 ? "" : "")}>

				<div className="center-hor">
					{
						this.props.useBreadcrums !== true &&
						<div className="breadcrumbs">
							<h4 className="text-slim">
								{this.props.listName?this.props.listName:""}
							</h4>
						</div>
					}
					{this.props.useBreadcrums  &&
						<div className="flex-row breadcrumbs">
							{
								FILTERED_BREADCRUMBS.map((breadcrum, index)=>
									<h4
										className="clickable"
										style={{marginRight:'0.3em'}}
										key={breadcrum.label}
										onClick={breadcrum.onClick}>{breadcrum.label + ((FILTERED_BREADCRUMBS.length - 1 !== index) ? ` \\` : "")}</h4>
								)
							}
						</div>
					}
				</div>

					{false && <div className="ml-auto p-2 align-self-center">
						{this.props.extraCommands?this.props.extraCommands():null}
					</div>}
			</div>
		);
	}
}
