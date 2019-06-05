import React, { Component } from 'react';
import {NavItem, Nav } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import ProjectAdd from './projectAdd';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects:[]
		};

	}

	componentWillMount(){
		this.ref1 = rebase.listenToCollection('/proj-projects', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				projects:content
				});
			},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
	}

	render() {
		return (
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<ProjectAdd />
					<Nav vertical>
						<NavItem>
							<Link to={{ pathname: `/projects/all` }}>All</Link>
							{
								this.state.projects.map((item)=>
								<Link key={item.id} to={{ pathname: `/projects/`+item.id }}>{item.title}</Link>
							)}
						</NavItem>
					</Nav>
				</div>

			</div>
			);
		}
	}
