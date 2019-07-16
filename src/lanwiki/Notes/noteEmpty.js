import React, { Component } from 'react';

export default class NoteEmpty extends Component {

	render() {
		return (
			<div className="flex">
				<div className="card-box row fit-with-header">
						<div className=" center-ver center-hor">
							Vyberte poznámku zo zoznamu vlavo.
						</div>
				</div>
			</div>
		);
	}
}
