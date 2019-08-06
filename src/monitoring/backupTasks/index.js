import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from "react-redux";

import classnames from 'classnames';
import BackupTaskEditIndex from './backupTaskEditIndex';
import Empty from '../empty';

const ITEMS =[
		{
			id: 0,
			name: "lansystems.sk",
			customer: "LAN SYSTEMS",
			lastReport: "27.06.2019 13:14:25",
			status: "OK",
			},
		{
			id: 1,
			name: "essco.sk",
			customer: "ESSCO",
			lastReport: "07.06.2019 13:14:25",
			status: "OK",
		}
]

class BackupTaskList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',

			filterByName: "",
			filterByCustomer: "",
			filterByStatus: "",
			filterByLastReport: "",

			saving:false,
			openedID:null,

			editOpened:false
		};

		this.fetchData.bind(this);
		this.addTask.bind(this);
	}

	componentWillReceiveProps(props){
	}

	fetchData(id){
	}

	componentWillUnmount(){
	}

	addTask(){
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
						<Button className="btn" onClick={() => this.props.history.push("/monitoring/mail-notifications/add")}>
							<i className="fa fa-plus"/> mail notification
						</Button>
					</div>
				</div>
				<div className="fit-with-header-and-commandbar row">
					<div className="fit-with-header-and-commandbar p-20 scrollable golden-ratio-618" style={this.props.layout===1?{flex:'auto'}:{}}>

						<table className={classnames({ 'project-table-fixed': this.props.layout === 0, table:true })}>
								<thead>
									<tr>
										<th>Name</th>
										<th>Customer</th>
										<th>Status</th>
										<th>Last report</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<input
											type="text"
											value={this.state.filterByName}
											className="form-control commandbar-search"
											onChange={(e)=>this.setState({filterByName:e.target.value})}
											placeholder="Filter by name" />
										</td>
										<td>
											<input
											type="text"
											value={this.state.filterByCustomer}
											className="form-control commandbar-search"
											onChange={(e)=>this.setState({filterByCustomer:e.target.value})}
											placeholder="Filter by customer" />
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
											value={this.state.filterByLastReport}
											className="form-control commandbar-search"
											onChange={(e)=>this.setState({filterByLastReport:e.target.value})}
											placeholder="Filter by last report" />
										</td>
										<td>
										</td>
									</tr>
									{
										ITEMS
										.filter(item =>
																item.name.toLowerCase().includes(this.state.filterByName.toLowerCase())
																&& item.customer.toLowerCase().includes(this.state.filterByCustomer.toLowerCase())
																&& item.status.toLowerCase().includes(this.state.filterByStatus.toLowerCase())
																&& item.lastReport.toLowerCase().includes(this.state.filterByLastReport.toLowerCase())
										).map(item =>
											<tr className={classnames({ 'active': this.props.match.params.itemID === item.id.toString(), clickable:true })}
												key={item.id}
												onClick={()=>{
													if(this.props.layout===1){
														this.setState({editOpened:true, openedID:item.id});
													}else{
														this.props.history.push(`/monitoring/mail-notifications/edit/${item.id}`)
													}
												}}>
												<td>{item.name}</td>
												<td>{item.customer}</td>
												<td>{item.status}</td>
												<td>{item.lastReport}</td>
												<td>
													<Button className="btn-link" onClick={() => {}}>
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

					{this.props.match.params.itemID && this.props.layout === 0 && <BackupTaskEditIndex {...this.props} isModal={false}/>}

					</div>
					<Modal className="w-50" isOpen={this.state.editOpened} toggle={() => this.setState({editOpened:!this.state.editOpened})} >
		        <ModalBody>
		          <BackupTaskEditIndex id={this.state.openedID} isModal={true} />
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

	export default connect(mapStateToProps, { })(BackupTaskList);
