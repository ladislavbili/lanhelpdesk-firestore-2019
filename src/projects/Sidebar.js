import React, { Component } from 'react';
import {NavItem, Nav, Modal, Button} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import ProjectAdd from './projects/projectAdd';
import ProjectEdit from './projects/projectEdit';
import MilestoneEdit from './milestones/milestoneEdit';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects:[],
			milestones: [],
			projectEdit: null,
			openedEdit: false,
			milestoneEdit: null,
			openMilestoneEdit: false,
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
		this.ref2 = rebase.listenToCollection('/proj-milestones', {
			context: this,
			withIds: true,
			then:content=>{
				this.setState({
				milestones:content
				});
			},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
		rebase.removeBinding(this.ref2);
	}

	toggleEdit(){
		this.setState({openedEdit:!this.state.openedEdit})
	}

	toggleMilestoneEdit(){
		this.setState({openMilestoneEdit:!this.state.openMilestoneEdit})
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
								to={{ pathname: `/projects/all/all` }}>
								All
							</Link>
						</NavItem>						
							{
								this.state.projects.map((project)=>
								<div key={project.id}>
									<NavItem key={project.id}  className="sidebar-link">
										<Link
											className="text-basic sidebar-align sidebar-menu-item p-t-9"
											key={project.id}
											to={{ pathname: `/projects/${project.id}/all` }}>
											{project.title}
										</Link>
									<div className='sidebar-menu-item-btn  sidebar-menu-item'>
											<Button
												key={project.id}
												className='hidden-button full-width full-height'
												onClick={() => {this.setState({projectEdit: project, openedEdit: true})}}
												>
												<i className="fa fa-cog"/>
											</Button>
										</div>
									</NavItem>
									{
										this.props.location.pathname.split("/")[2] === project.id &&
										this.state.milestones.map((mil) => {
												if (mil.project === project.id){
													return (
														<NavItem key={mil.id}  className="sidebar-link" >
															<Link
																className="text-basic sidebar-menu-item sidebar-subset p-t-9"
																key={mil.id}
																to={{ pathname: `/projects/${project.id}/${mil.id}` }}>
																{mil.title}
															</Link>
															<div className='sidebar-menu-item-btn  sidebar-menu-item'>
																<Button
																	key={mil.id}
																	className='hidden-button full-width full-height'
																	onClick={() => {this.setState({milestoneEdit: mil, openMilestoneEdit: true})}}
																	>
																	<i className="fa fa-cog"/>
																</Button>
															</div>
														</NavItem>
												)
												}
										})
									}
								</div>
							)}
					</Nav>

					<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
						<ProjectEdit project={this.state.projectEdit} {...this.props} close={this.toggleEdit.bind(this)}/>
					</Modal>

					<Modal isOpen={this.state.openMilestoneEdit} toggle={this.toggleMilestoneEdit.bind(this)}>
						<MilestoneEdit milestone={this.state.milestoneEdit} {...this.props} close={this.toggleMilestoneEdit.bind(this)}/>
					</Modal>

				</div>

			</div>
			);
		}
	}
