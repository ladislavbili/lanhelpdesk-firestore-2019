import React, { Component } from 'react';
import {NavItem, Nav, Modal, Button} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import ProjectAdd from './projects/projectAdd';
import ProjectEdit from './projects/projectEdit';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects:[],
			projectEdit: null,
			openedEdit: false,
		};
		this.toggleEdit.bind(this);
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

	toggleEdit(){
		this.setState({openedEdit:!this.state.openedEdit})
	}

	render() {
		return (
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<ProjectAdd />
					<Nav vertical>
						<NavItem>
							<Link
								className="text-basic sidebar-align sidebar-menu-item"
								to={{ pathname: `/projects/all` }}>
								All
							</Link>
						</NavItem>
							{
								this.state.projects.map((item)=>
								<NavItem key={item.id}  className="sidebar-link">
									<Link
										className="text-basic sidebar-align sidebar-menu-item"
										key={item.id}
										to={{ pathname: `/projects/`+item.id }}>
										{item.title}
									</Link>
								<div className='sidebar-menu-item-btn  sidebar-menu-item'>
										<Button
											key={item.id}
											className='hidden-button full-width full-height'
											onClick={() => {this.setState({projectEdit: item, openedEdit: true})}}
											>
											<i className="fa fa-cog"/>
										</Button>
									</div>
								</NavItem>
							)}
					</Nav>

					<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
						<ProjectEdit project={this.state.projectEdit} close={this.toggleEdit.bind(this)}/>
					</Modal>

				</div>

			</div>
			);
		}
	}
