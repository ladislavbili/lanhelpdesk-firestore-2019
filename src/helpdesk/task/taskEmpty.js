import React, { Component } from 'react';

export default class TaskEmpty extends Component {

	render() {
		return (
			<div className="flex">
				<div className="card-box row scrollable fit-with-header">
						<div className=" center-ver center-hor">
							Vyberte task zo zoznamu vlavo.
						</div>
				</div>
			</div>
		);
	}
}
