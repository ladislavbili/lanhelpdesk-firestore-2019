import React, { Component } from 'react';
import {ListGroupItem, Button, Row, Col} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { connect } from "react-redux";

import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import {setProject, setFilter} from '../redux/actions';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags : [],
			value: 0,
		};

		this.compare.bind(this);
	}

	componentWillMount(){
    this.setState({
      value: 0,
    });
    this.ref = rebase.listenToCollection('/lanwiki-tags', {
      context: this,
      withIds: true,
      then: tags=>{this.setState({tags, value:100})},
    });
  }

  componentWillUnmount() {
    rebase.removeBinding(this.ref);
  }

	compare(a,b) {
		if (a.name.toLowerCase() < b.name.toLowerCase())
			return -1;
		if (a.name.toLowerCase() > b.name.toLowerCase())
			return 1;
		return 0;
	}

	render() {

		let ORDERRED_TAGS = this.state.tags.sort(this.compare);

		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<div className="commandbar">
					{/*	<Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>*/}
							<Button
								block
								className='addTag'
								onClick={() => this.props.history.push(`/lanwiki/tags/add`)}
								>
								Add tag +
						</Button>
					</div>

					<Link className='link' to={{pathname: `/lanwiki/notes/all`}}  key={1}>
								<ListGroupItem
									className='sidebarItem'
									key={1}
									active={window.location.pathname.includes('/lanwiki/notes/all')}
									>
									All
								</ListGroupItem>
				</Link>

				{
						ORDERRED_TAGS
						.map(asset =>
							<Row>
								<Col xs={10}>
										<ListGroupItem
											className='sidebarItem'
											key={asset.id}
											active={window.location.pathname.includes(asset.id)}
											onClick={() => this.props.history.push(`/lanwiki/notes/${asset.id}`)}
											>
												{asset.name}
										</ListGroupItem>
								 </Col>
								 <Col xs={2}>
									 <ListGroupItem
										 className='sidebarItem'
										 key={asset.id}
										 active={window.location.pathname.includes(`/lanwiki/tags/${asset.id}`)}
										 onClick={() => this.props.history.push(`/lanwiki/tags/${asset.id}`)}
										 >
										 		<i className="fa fa-cog"/>
											</ListGroupItem>
									</Col>
								</Row>
								)
					}

				</div>
			</div>
			);
		}
	}
	const mapStateToProps = ({ filterReducer }) => {
    const { project } = filterReducer;
    return { project };
  };

  export default connect(mapStateToProps, { setProject,setFilter })(Sidebar);
