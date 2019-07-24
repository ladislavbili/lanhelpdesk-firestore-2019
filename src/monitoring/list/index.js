import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import {timestampToString} from '../../helperFunctions';
import { connect } from "react-redux";
import classnames from 'classnames';
import TaskEdit from './taskEdit';
import Empty from './empty';

class TaskList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',

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

	/*
	ked sa klikne na reports nech sa ukaye modal*/


	render() {
		return (
			<div>
				<div className="container-fluid">
					<div className="d-flex flex-row align-items-center">
						<div className="p-2">
							<div className="input-group">
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
						<Button className="btn-link">Global search</Button>
						<Button className="btn" onClick={() => this.props.history.push("/monitoring/mail-servers/add")}>
							<i className="fa fa-plus"/> Mail server
						</Button>
					</div>
				</div>
				<div className="fit-with-header-and-commandbar row">
					<div className="fit-with-header-and-commandbar p-20 scrollable" style={this.props.layout===1?{flex:'auto'}:{}}>

						<table className={classnames({ 'project-table-fixed': this.props.layout === 0, table:true })}>
								<thead>
									<tr>
										<th>Name</th>
										<th>Test email</th>
										<th>Status</th>
										<th>last response</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr className={classnames({ 'active': this.props.match.params.itemID === 0, clickable:true })}
									key={0}
									onClick={()=>{
										if(this.props.layout===1){
											this.setState({editOpened:true, openedID:0});
										}else{
											this.props.history.push('/monitoring/mail-servers/edit/0')
										}
								}}>
										<td>lansystems.sk</td>
										<td>mail.test@lansystems.sk</td>
										<td>OK</td>
										<td>5 min.</td>
										<td>
											<Button className="btn-link" onClick={() => {}}>
												<i className="fa fa-trash"/>
											</Button>
										</td>
									</tr>

									<tr className={classnames({ 'active': this.props.match.params.itemID === 1, clickable:true })}
									key={1}
									onClick={()=>{
										if(this.props.layout===1){
											this.setState({editOpened:true, openedID:1});
										}else{
											this.props.history.push('/monitoring/mail-servers/edit/1')
										}
								}}>
										<td>lansystems.sk</td>
											<td>mail.test@essco.sk</td>
											<td>OK</td>
											<td>10 min.</td>
												<td>
													<Button className="btn-link" onClick={() => {}}>
														<i className="fa fa-trash"/>
													</Button>
												</td>
									</tr>
								</tbody>
							</table>
					</div>

					{!this.props.match.params.itemID && this.props.layout === 0 && <Empty />}

					{this.props.match.params.itemID && this.props.layout === 0 && <TaskEdit {...this.props} id={this.props.match.params.itemID} toggle={()=>{}}/>}



					</div>
				</div>
			);
		}
	}

	const mapStateToProps = ({ appReducer }) => {
		return { layout:appReducer.layout };
	};

	export default connect(mapStateToProps, { })(TaskList);
