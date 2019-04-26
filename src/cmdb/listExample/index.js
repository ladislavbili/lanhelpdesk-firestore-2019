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
			<div>
				<div className="commandbar">

				</div>
				<div className="fit-with-header scrollable">
					Content
				</div>
			</div>
			);
		}
	}
