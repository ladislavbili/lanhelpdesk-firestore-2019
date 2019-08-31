import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from "react-redux";

import classnames from 'classnames';
import MailServerEditIndex from './mailServerEditIndex';
import Empty from '../empty';
import {rebase} from "../../index";

class MailServerList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			companies: [],
			search:'',

			filterByTitle: "",
			filterByCompany: "",
			filterByTestMail: "",
			filterByStatus: "",
			filterByLastResp: "",

			saving:false,
			openedID:null,

			editOpened:false
		};
	}

	componentWillMount(){
		this.ref1 = rebase.listenToCollection('monitoring-servers', {
    context: this,
		withIds: true,
    then(data) {
	     this.setState({
				 data
			 });
    },
    onFailure(err) {
      //handle error
    }
  });
		this.ref2 = rebase.listenToCollection('companies', {
		context: this,
		withIds: true,
		then(companies) {
			 this.setState({
				 companies
			 });
		},
		onFailure(err) {
			//handle error
		}
	});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
		rebase.removeBinding(this.ref2);
	}

	removeItem(id){
		rebase.removeDoc(`monitoring-servers/${id}`)
				.then(() => {
					this.props.history.push(`/monitoring/mail-servers`);
				}).catch(err => {
				//handle error
			});
	}

	render() {
		let ITEMS = this.state.data.map(datum => {
			let company = this.state.companies.find(comp => comp.id === datum.company);
			return {
				id: datum.id ? datum.id : "none",
				title: datum.title ? datum.title : "none",
				company: company ? company.title : "none",
				testEmail: datum.testEmail ? datum.testEmail : "none",
				status: datum.status ? datum.status : "none",
				lastResp: datum.lastResp ? datum.lastResp : "none",
			}
		}).filter(item =>
					item.title.toLowerCase().includes(this.state.filterByTitle.toLowerCase())
					&& item.company.toLowerCase().includes(this.state.filterByCompany.toLowerCase())
					&& item.testEmail.toLowerCase().includes(this.state.filterByTestMail.toLowerCase())
					&& item.status.toLowerCase().includes(this.state.filterByStatus.toLowerCase())
					&& item.lastResp.toLowerCase().includes(this.state.filterByLastResp.toLowerCase())
				);


			return (
			<div>
				<div className="container-fluid">
					<div className="d-flex flex-row align-items-center">
						<div className="p-2">
							<div className="input-group commandbar-search-case">
								<input
									type="text"
									value={this.state.search}
									className="form-control commandbar-search"
									onChange={(e)=>this.setState({search:e.target.value})}
									placeholder="Search" />
								<div className="input-group-append">
									<button className="commandbar-btn-search" type="button">
										<i className="fa fa-search" />
									</button>
								</div>
							</div>
						</div>
						<Button className="btn-link">Global</Button>

						<Button className="btn" onClick={() => this.props.history.push("/monitoring/mail-servers/add")}>
							<i className="fa fa-plus"/> Mail server
						</Button>

					</div>
				</div>
				<div className="fit-with-header-and-commandbar row">
					<div className="fit-with-header-and-commandbar p-20 scrollable golden-ratio-618" style={this.props.layout===1?{flex:'auto'}:{}}>

						<table className={classnames({ 'project-table-fixed': this.props.layout === 0, table:true })}>
								<thead>
									<tr>
										<th>Title</th>
										<th>Company</th>
										<th>Test email</th>
										<th>Status</th>
										<th>Last response</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<input
											type="text"
											value={this.state.filterByTitle}
											className="form-control commandbar-search"
											onChange={(e)=>this.setState({filterByTitle:e.target.value})}
											placeholder="Filter by title" />
										</td>
										<td>
											<input
											type="text"
											value={this.state.filterByCompany}
											className="form-control commandbar-search"
											onChange={(e)=>this.setState({filterByCompany:e.target.value})}
											placeholder="Filter by company" />
										</td>
										<td>
											<input
											type="text"
											value={this.state.filterByTestMail}
											className="form-control commandbar-search"
											onChange={(e)=>this.setState({filterByTestMail:e.target.value})}
											placeholder="Filter by test mail" />
										</td>
										<td>
											<input
											type="text"
											value={this.state.filterByStatus}
											className="form-control commandbar-search"
											onChange={(e)=>this.setState({filterByStatus:e.target.value})}
											placeholder="Filter by status" />
										</td>
										<td>
											<input
											type="text"
											value={this.state.filterByLastResp}
											className="form-control commandbar-search"
											onChange={(e)=>this.setState({filterByLastResp:e.target.value})}
											placeholder="Filter by last response" />
										</td>
										<td>
										</td>
									</tr>
									{
										ITEMS.map(item =>
													<tr
														className={classnames({ 'active': this.props.match.params.itemID === item.id.toString(), clickable:true })}
														key={item.id}
														onClick={()=>{
															if(this.props.layout===1){
																this.setState({editOpened:true, openedID:item.id});

															}else{
																this.props.history.push(`/monitoring/mail-servers/edit/${item.id}`);
																	this.setState({openedID:item.id});
															}
														}}>
														<td>{item.title}</td>
														<td>{item.company}</td>
														<td>{item.testEmail}</td>
														<td>{item.status}</td>
														<td>{item.lastResp}</td>
														<td>
															<Button className="btn-link" onClick={() => this.removeItem(item.id)}>
																<i className="fa fa-trash"/>
															</Button>
														</td>
													</tr>
												)
									}
								</tbody>
							</table>
					</div>

					{!this.state.openedID && this.props.layout === 0 && <Empty />}

					{this.state.openedID && this.props.layout === 0 && <MailServerEditIndex id={this.state.openedID} {...this.props} isModal={false}/>}

					</div>
					<Modal className="w-50" isOpen={this.state.editOpened} toggle={() => this.setState({editOpened:!this.state.editOpened})} >
		        <ModalBody>
		          <MailServerEditIndex id={this.state.openedID} isModal={true} />
		        </ModalBody>
		        <ModalFooter>
		          <Button className="btn-link mr-auto" onClick={() => this.setState({editOpened:!this.state.editOpened})}>
		            Close
		          </Button>
		        </ModalFooter>
		      </Modal>

				</div>
			);
		}
	}

	const mapStateToProps = ({ appReducer }) => {
		return { layout:appReducer.layout };
	};

	export default connect(mapStateToProps, { })(MailServerList);
