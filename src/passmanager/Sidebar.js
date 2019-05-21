import React, { Component } from 'react';
import {Row, Col, ListGroupItem, Modal } from 'reactstrap';

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
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<FolderAdd />
							{
								this.state.folders.map((item)=>
									<Row>
										<Col xs={10}>
												<ListGroupItem
													className='sidebarItem'
													key={item.id}
													active={window.location.pathname.includes(item.id)}
													onClick={() => this.props.history.push(`/passmanager/${item.id}`)}
													>
														{item.title}
												</ListGroupItem>
										 </Col>
										 <Col xs={2}>
											 <ListGroupItem
												 className='sidebarItem'
												 key={item.id}
												 onClick={() => {this.setState({folderEdit: item, openedEdit: true})}}
												 >
														<i className="fa fa-cog"/>
													</ListGroupItem>
											</Col>
										</Row>
						)}

						<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
							<FolderEdit folder={this.state.folderEdit} close={this.toggleEdit.bind(this)}/>
						</Modal>

				</div>

			</div>
			);
		}
	}
