import React, { Component } from 'react';
import {Button, Row, Col, NavItem, Nav} from 'reactstrap';
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
		};

		this.compare.bind(this);
	}

	componentWillMount(){
    this.ref = rebase.listenToCollection('/lanwiki-tags', {
      context: this,
      withIds: true,
      then: tags=>{this.setState({tags})},
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
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<Button
						block
						className="btn-link t-a-l sidebar-menu-item"
						onClick={() => this.props.history.push(`/lanwiki/tags/add`)}
						>
						<i className="fa fa-plus sidebar-icon-center"/> Add tag
					</Button>

						<hr />

									<Nav>
										<NavItem  key={1} className={window.location.pathname.includes('/lanwiki/notes/all') ? "text-basic t-a-l sidebar-menu-item sidebar-item-active" : "text-basic sidebar-menu-item t-a-l "}>
											<Link to={{ pathname: `/lanwiki/notes/all` }} >All</Link>
										</NavItem>
									</Nav>
									{
										ORDERRED_TAGS.map((item)=>
										<Row>
											<Col xs={10}>
												<Nav>
												<NavItem key={item.id} className={window.location.pathname.includes(`/lanwiki/notes/${item.id}`) ? "text-basic t-a-l sidebar-menu-item sidebar-item-active" : "text-basic t-a-l sidebar-menu-item"}>
													<Link to={{pathname: `/lanwiki/notes/${item.id}`}}>
														{item.name}
													</Link>
												</NavItem>
											</Nav>
											</Col>
											<Col xs={2}>
												<Nav>
													<NavItem key={item.id} className={window.location.pathname.includes(`/lanwiki/tags/${item.id}`) ? "text-basic t-a-l full-width m-r-5 sidebar-item-active" : "text-basic t-a-l full-width m-r-5"}>
														<Link className="pull-right" to={{pathname: `/lanwiki/tags/${item.id}`}}>
															<i className="fa fa-cog"/>
														</Link>
													</NavItem>
												</Nav>
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
