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
			search:'',

			filterByTitle: "",
			filterByCompany: "",
			filterByTestMail: "",
			filterByStatus: "",
			filterByLastResponse: "",

			saving:false,
			openedID:null,

			editOpened:false
		};
	}

	componentWillMount(){
		rebase.listenToCollection('monitoring-servers', {
    context: this,
		withIds: true,
    then(data) {
	     this.setState({
				 data: data.map(datum => {
					 return {
						 id: datum.id,
						 title: datum.title ? datum.title : "no title",
						 company: datum.company ? datum.company.label : "no company",
						 testEmail: datum.testEmail ? datum.testEmail : "no test mail",
	 					 lastResponse: "12.08.2019",
						 status: "OK"
					 }
				 	}),
			 });
    },
    onFailure(err) {
      //handle error
    }
  	});
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
											value={this.state.filterByLastResponse}
											className="form-control commandbar-search"
											onChange={(e)=>this.setState({filterByLastResponse:e.target.value})}
											placeholder="Filter by last response" />
										</td>
										<td>
										</td>
									</tr>
									{
										this.state.data
												.filter(item =>
													item.title.toLowerCase().includes(this.state.filterByTitle.toLowerCase())
													&& item.company.toLowerCase().includes(this.state.filterByCompany.toLowerCase())
													&& item.testEmail.toLowerCase().includes(this.state.filterByTestMail.toLowerCase())
													&& item.status.toLowerCase().includes(this.state.filterByStatus.toLowerCase())
													&& item.lastResponse.toLowerCase().includes(this.state.filterByLastResponse.toLowerCase())
												).map(item =>
													<tr
														className={classnames({ 'active': this.props.match.params.itemID === item.id.toString(), clickable:true })}
														key={item.id}
														onClick={()=>{
															if(this.props.layout===1){
																this.setState({editOpened:true, openedID:item.id});
															}else{
																this.props.history.push(`/monitoring/mail-servers/edit/${item.id}`)
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

					{!this.props.match.params.itemID && this.props.layout === 0 && <Empty />}

					{this.props.match.params.itemID && this.props.layout === 0 && <MailServerEditIndex {...this.props} isModal={false}/>}

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
