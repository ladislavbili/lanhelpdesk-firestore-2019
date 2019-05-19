import React, { Component } from 'react';
import {NavItem, Nav } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import FolderAdd from './folders/folderAdd';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			folders:[]
		};

	}

	componentWillMount(){
		this.ref1 = rebase.listenToCollection('/pass-folders', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				folders:content
				});
			},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
	}

	render() {
		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<FolderAdd />
					<Nav vertical>
						<NavItem>
							{
								this.state.folders.map((item)=>
								<Link key={item.id} to={{ pathname: `/passmanager/`+item.id }}>{item.title}</Link>
							)}
						</NavItem>
					</Nav>
				</div>

			</div>
			);
		}
	}
