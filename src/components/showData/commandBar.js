import React, { Component } from 'react';


export default class CommandBar extends Component {

	render() {
		return (
			<div className={"commandbar " + (this.props.layout === 1 ? "" : "")}>

				<div className="center-hor">
					{
						this.props.useBreadcrums !== true &&
						<h4 className="font-24 text-slim">
							{this.props.listName?this.props.listName:""}
						</h4>
					}
					{this.props.useBreadcrums  &&
						<div className="flex-row">
							{
								this.props.breadcrumsData.filter((breadcrum)=>breadcrum.show).map((breadcrum)=>
								<h4 className="clickable" key={breadcrum.label} onClick={breadcrum.onClick}>
									{breadcrum.label + ' / '}
								</h4>
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
