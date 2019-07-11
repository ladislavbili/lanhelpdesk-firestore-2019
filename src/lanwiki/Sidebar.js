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
	}

	componentWillMount(){
    this.ref = rebase.listenToCollection('/lanwiki-tags', {
      context: this,
      withIds: true,
      then: tags=>{this.setState({tags});},
    });
  }

  componentWillUnmount() {
    rebase.removeBinding(this.ref);
  }

	render() {
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

					<hr/>
					<Row>
						<Col xs={10}>
							<Nav vertical>
								<NavItem>
									<Link  className = "text-basic sidebar-align sidebar-menu-item" to={{ pathname: `/lanwiki/i/all` }}>All</Link>
								</NavItem>
								{	this.state.tags.sort((item1,item2)=>item1.title.toLowerCase()>item2.title.toLowerCase()?1:-1).map((item)=>
									<NavItem key={item.id}>
										<Link className = "text-basic sidebar-align sidebar-menu-item" to={{ pathname:`/lanwiki/i/`+item.id}}>{item.title}</Link>
									</NavItem>
								)}
							</Nav>
						</Col>
						<Col xs={2} style={{marginTop:40}}>
							{	this.state.tags.sort((item1,item2)=>item1.title.toLowerCase()>item2.title.toLowerCase()?1:-1).map((item)=>
								<Button
									key={item.id}
									className='btn-link t-a-l'
									style={{height:40}}
									onClick={() => this.props.history.push('/lanwiki/i/'+item.id)}
									>
									<i className="fa fa-cog"/>
								</Button>
							)}
						</Col>
					</Row>


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
