import React, { Component } from 'react';

export default class TaskEmpty extends Component {

	render() {
		return (
			<div className="flex">
				<div className="container-fluid">
					<div className="d-flex flex-row align-items-center">
					</div>
				</div>
				<div className="card-box row fit-with-header-and-commandbar">
						<div className=" center-ver center-hor">
							Vyberte task zo zoznamu vlavo.
						</div>
				</div>
			</div>
		);
	}
}