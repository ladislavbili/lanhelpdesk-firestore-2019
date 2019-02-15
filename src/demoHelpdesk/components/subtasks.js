import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Select from 'react-select';
import Prace from './prace';
import Rozpocet from './rozpocet';


const tableStyle = {
	border: 'none',
};

const tableStyleCenter = {
	textAlign: 'right',
	border: 'none',
};

const tableStyleCenterNoBorder = {
	textAlign: 'center',
	border: 'none',
};

export default class Subtasks extends Component {

	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1'
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	render() {
		const types = [
			{ value: 'Servis IT', label: 'Servis IT' },
			{ value: 'Programovanie www', label: 'Programovanie www' },
		];

		const selectStyle = {
			control: base => ({
				...base,
				minHeight: 30,
				backgroundColor: 'white',
			}),
			dropdownIndicator: base => ({
				...base,
				padding: 4,
			}),
			clearIndicator: base => ({
				...base,
				padding: 4,
			}),
			multiValue: base => ({
				...base,
				backgroundColor: 'white',
			}),
			valueContainer: base => ({
				...base,
				padding: '0px 6px',
			}),
			input: base => ({
				...base,
				margin: 0,
				padding: 0,
				backgroundColor: 'white',
			}),
		};

		return (
			<div className="m-t-30">
				<div className="row">
					<div className="col-md-12">

						<Nav tabs>
							<NavItem>
								<NavLink
									className={classnames({ active: this.state.activeTab === '1' })}
									onClick={() => { this.toggle('1'); }}
								>
									Sluzby
            </NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: this.state.activeTab === '2' })}
									onClick={() => { this.toggle('2'); }}
								>
									Rozpocet
            </NavLink>
							</NavItem>
						</Nav>
						<TabContent activeTab={this.state.activeTab} style={{ padding: "0", backgroundColor: "rgb(249, 249, 249)" }}>
							<TabPane tabId="1">
								<Prace />
							</TabPane>
							<TabPane tabId="2">
								<Rozpocet />
							</TabPane>
						</TabContent>
					</div>
				</div>
			</div>
		);
	}
}
