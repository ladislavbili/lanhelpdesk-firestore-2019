import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink} from 'reactstrap';
import classnames from 'classnames';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<div className="">
				<div className="commandbar">

				</div>
				<div className="row">
					<div className="fit-with-header scrollable col-lg-4">
						List
					</div>
					<div className="fit-with-header scrollable col-lg-8">
						Content
					</div>
				</div>
			</div>
			);
		}
	}
