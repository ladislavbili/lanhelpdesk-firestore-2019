import React, { Component } from 'react';
import { Row, Col, Modal, Button, NavItem, Nav} from 'reactstrap';
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
						<Button
							className="btn-link t-a-l sidebar-menu-item"
							onClick={()=>{this.props.history.push('/passmanager/add')}}
							>
							<i className="fa fa-plus clickable pr-2"  />
							Náklad
						</Button>
						<Row>
							<Col xs={10}>
								<Nav vertical>
									{	this.state.folders.map((item)=>
										<NavItem key={item.id}>
											<Link className="text-basic" to={{ pathname: `/passmanager/i/`+item.id }}>{item.title}</Link>
										</NavItem>
									)}
								</Nav>
							</Col>
							<Col xs={2}>
								{	this.state.folders.map((item)=>
									<Button
										key={item.id}
										className='btn-link t-a-l'
										style={{height:41}}
										onClick={() => {this.setState({folderEdit: item, openedEdit: true})}}
										>
										<i className="fa fa-cog"/>
									</Button>
								)}
							</Col>
						</Row>

						<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
							<FolderEdit folder={this.state.folderEdit} close={this.toggleEdit.bind(this)}/>
						</Modal>

				</div>

			</div>
			);
		}
	}
