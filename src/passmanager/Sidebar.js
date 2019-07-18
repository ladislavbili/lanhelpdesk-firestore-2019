import React, { Component } from 'react';
import { Modal, Button, NavItem, Nav} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import FolderAdd from './folders/folderAdd';
import FolderEdit from './folders/folderEdit';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			folders:[],
			openedEdit: false,
		};
		this.toggleEdit.bind(this);
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

	toggleEdit(){
		this.setState({openedEdit:!this.state.openedEdit})
	}

	render() {
		return (
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<FolderAdd />
					<hr/>
					<Button
						className="btn-link t-a-l sidebar-menu-item"
						onClick={()=>{this.props.history.push('/passmanager/add')}}
						>
						<i className="fa fa-plus sidebar-icon-center"  /> Heslo
					</Button>
					<hr/>
						<Nav vertical>
							{	this.state.folders.map((item)=>
							<NavItem key={item.id}  className="sidebar-link">
								<Link className="text-basic sidebar-align sidebar-menu-item-link" to={{ pathname: `/passmanager/i/`+item.id }}>{item.title}</Link>
								<div className='sidebar-menu-item-btn'>
									<Button
										key={item.id}
										className='hidden-button full-width full-height'
										onClick={() => {this.setState({folderEdit: item, openedEdit: true})}}
										>
										<i className="fa fa-cog"/>
									</Button>
								</div>
							</NavItem>
							)}
						</Nav>

						<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
							<FolderEdit folder={this.state.folderEdit} close={this.toggleEdit.bind(this)}/>
						</Modal>

				</div>

			</div>
			);
		}
	}
