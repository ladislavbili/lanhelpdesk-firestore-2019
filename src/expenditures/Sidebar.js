import React, { Component } from 'react';
import {Modal, Button, NavItem, Nav} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import FolderAdd from './folders/folderAdd';
import FolderEdit from './folders/folderEdit';

import classnames from "classnames";

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			folders: [],
			openedAdd: false,
			openedEdit: false,
		};
		this.toggleEdit.bind(this);
		this.toggleAdd.bind(this);
	}

	componentWillMount(){
		this.ref1 = rebase.listenToCollection('/expenditures-folders', {
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

	toggleAdd(){
		this.setState({openedAdd:!this.state.openedAdd})
	}

	toggleEdit(){
		this.setState({openedEdit:!this.state.openedEdit})
	}

	render() {
		return (
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<Button
						className="btn-link t-a-l sidebar-btn-link"
						onClick={()=>{this.setState({openedAdd:true})}}
						>
						<i className="fa fa-plus m-r-5 m-l-5 m-t-5"  /> Folder
					</Button>

					<Button
						className="btn-link t-a-l sidebar-btn-link"
						onClick={()=>{this.props.history.push('/expenditures/add')}}
						>
						<i className="fa fa-plus m-r-5 m-l-5 m-t-5"  /> Náklad
					</Button>

					<Nav vertical>
						{	this.state.folders.map((item)=>
							<NavItem key={item.id} className="row">
								<Link className="sidebar-menu-item" to={{ pathname: `/expenditures/i/`+item.id }}>{item.title}</Link>
								<div className={classnames("sidebar-icon", {"active" : this.props.location.pathname.includes(item.id)})}
									onClick={() => {this.setState({folderEdit: item, openedEdit: true})}}>
										<i className="fa fa-cog"/>
								</div>
						</NavItem>
						)}
					</Nav>

					<Modal isOpen={this.state.openedAdd} toggle={this.toggleAdd.bind(this)}>
						<FolderAdd close={this.toggleAdd.bind(this)}/>
					</Modal>

					<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
						<FolderEdit folder={this.state.folderEdit} close={this.toggleEdit.bind(this)}/>
					</Modal>
				</div>

			</div>
		);
	}
}
