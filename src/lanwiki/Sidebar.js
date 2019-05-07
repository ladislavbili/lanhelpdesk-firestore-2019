import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink, ListGroup, ListGroupItem, Progress, Button} from 'reactstrap';
import { Glyphicon } from 'react-bootstrap';
import classnames from 'classnames';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../SelectPage';
import {rebaseFirestore} from '../index';
import {toSelArr} from '../helperFunctions';
import {setProject, setFilter} from '../redux/actions';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags : [],
			value: 0,
		};
	}

	componentWillMount(){
    this.setState({
      value: 0,
    });
    this.ref = rebaseFirestore.listenToCollection('/tags', {
      context: this,
      withIds: true,
      then: tags=>{this.setState({tags, value:100})},
    });
  }

  componentWillUnmount() {
    rebaseFirestore.removeBinding(this.ref);
  }

	render() {
		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<div className="commandbar">
						<Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>
						<Link className='link' to={{pathname: `/lanwiki/tags/add`}}  key={0}>
								Add tag +
						</Link>
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
						this.state.tags
						.map(asset =>
										<ListGroupItem
											className='sidebarItem'
											key={asset.id}
											active={window.location.pathname.includes(asset.id)}
											>
											<Link className='link' to={{pathname: `/lanwiki/notes/${asset.id}`}}  key={asset.id + "0"}>
												{asset.name}
											</Link>
											<Link className='link' to={{pathname: `/lanwiki/tags/${asset.id}`}} key={asset.id}>
													<Glyphicon glyph="cog"/>
											</Link>
										</ListGroupItem>
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
