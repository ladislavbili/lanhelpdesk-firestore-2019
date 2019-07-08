import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import firebase from 'firebase';
import {deleteUserData, setLayout} from '../redux/actions';

class PageHeader extends Component {
	constructor() {
		super();
		this.state = {
			companies: [],
		};
		this.getLocation.bind(this);
	}

	getLocation() {
		let url = this.props.history.location.pathname;
		if (url.includes('cmdb')) {
			return '/cmdb';
		} else if (url.includes('helpdesk')) {
			return '/helpdesk';
		} else if (url.includes('passmanager')) {
			return '/passmanager';
		} else if (url.includes('expenditures')) {
			return '/expenditures';
		} else if (url.includes('projects')) {
			return '/projects';
		} else {
			return '/lanwiki';
		}
	}

	getLayoutIcon(){
		switch (this.props.layout) {
			case 0:
				return "fa-columns";
			case 1:
				return "fa-list";
			case 2:
				return "fa-map";
			default:
				return "fa-cog";
		}
	}

	render() {
		const URL = this.props.history.location.pathname;
		return (
			<div className="page-header">
				<div className="d-flex full-height">
					<div className="center-hor">
						<Link to={{ pathname: `/helpdesk/taskList/i/all` }} className={"header-link" + (URL.includes("helpdesk/taskList") ? " header-link-active" : "")}>
							Úlohy
						</Link>
						<Link to={{ pathname: `/lanwiki` }} className={"header-link" + (URL.includes("lanwiki") ? " header-link-active" : "")}>
							Návody
						</Link>
						<Link to={{ pathname: `/cmdb/all` }} className={"header-link" + (URL.includes("cmdb") ? " header-link-active" : "")}>
							CMDB
						</Link>
						<Link to={{ pathname: `/passmanager` }} className={"header-link" + (URL.includes("passmanager") ? " header-link-active" : "")}>
							Heslá
						</Link>
						<Link to={{ pathname: `/expenditures` }} className={"header-link" + (URL.includes("expenditures") ? " header-link-active" : "")}>
							Náklady
						</Link>
						<Link to={{ pathname: `/helpdesk/reports` }} className={"header-link" + (URL.includes("helpdesk/reports") ? " header-link-active" : "")}>
								Vykazy
						</Link>
						<Link to={{ pathname: `/projects` }} className={"header-link" + (URL.includes("projects") ? " header-link-active" : "")}>
							Projekty
						</Link>
					</div>
					<div className="ml-auto center-hor row">
						{this.props.showLayoutSwitch && <Dropdown className="center-hor" isOpen={this.state.layoutOpen} toggle={()=>this.setState({layoutOpen:!this.state.layoutOpen})}>
							<DropdownToggle className="header-dropdown">
								<i className={"header-icon fa "+this.getLayoutIcon()}/>
							</DropdownToggle>
							<DropdownMenu right>
								<div className="btn-group-vertical" data-toggle="buttons">
									<label
										className={
											'btn btn-link btn-outline-blue waves-effect waves-light' +
											(this.props.layout === 0 ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											onChange={() => this.props.setLayout(0)}
											checked={this.props.layout === 0}
										/>
										<i className="fa fa-columns" />
									</label>
									<label
										className={
											'btn btn-link btn-outline-blue waves-effect waves-light' +
											(this.props.layout === 1? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											checked={this.props.layout === 1}
											onChange={() => this.props.setLayout(1)}
										/>
										<i className="fa fa-list" />
									</label>
									<label
										className={
											'btn btn-link btn-outline-blue waves-effect waves-light' +
											(this.props.layout === 2 ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											onChange={() => this.props.setLayout(2)}
											checked={this.props.layout === 2}
										/>
										<i className="fa fa-map" />
									</label>
								</div>
							</DropdownMenu>
						</Dropdown>}

						<i className="header-icon fa fa-exclamation-triangle center-hor"/>
						<i className="header-icon fa fa-envelope center-hor" />
						<Dropdown className="center-hor" isOpen={this.state.settingsOpen} toggle={()=>this.setState({settingsOpen:!this.state.settingsOpen})}>
			        <DropdownToggle className="header-dropdown">
								<i className="header-icon fa fa-cog"/>
			        </DropdownToggle>
			        <DropdownMenu right>
			          <DropdownItem header>Settings</DropdownItem>
			          <DropdownItem divider />
								{
									(this.props.settings?this.props.settings:[]).map((item,index)=>
									<DropdownItem key={index} onClick={()=>this.props.history.push(this.getLocation()+'/settings/'+item.link)}>{item.title}</DropdownItem>
								)}
			        </DropdownMenu>
			      </Dropdown>
						<i className="header-icon clickable fa fa-sign-out-alt center-hor" onClick={()=>{
								if(window.confirm('Are you sure you want to log out?')){
									this.props.deleteUserData();
									firebase.auth().signOut();
								}
							}} />
					</div>
				</div>
			</div>
		);
	}
}


const mapStateToProps = ({appReducer}) => {
	return { layout:appReducer.layout };
};

export default connect(mapStateToProps, { deleteUserData, setLayout })(PageHeader);
