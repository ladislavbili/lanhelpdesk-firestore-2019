import React, { Component } from 'react';
import {Button, NavItem, Nav, Modal} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { connect } from "react-redux";

import SelectPage from '../components/SelectPage';
import TagAdd from './Tags/TagAdd';
import TagEdit from './Tags/TagEdit';
import {rebase} from '../index';
import {setProject, setFilter} from '../redux/actions';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags : [],
			tagEdit: null,
			openedAdd: false,
			openedEdit: false,
		};
		this.toggleEdit.bind(this);
		this.toggleAdd.bind(this);
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

	toggleAdd(){
		this.setState({openedAdd:!this.state.openedAdd})
	}

	toggleEdit(){
		this.setState({openedEdit:!this.state.openedEdit})
	}

	render() {
		return (
			<div className="sidebar">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<Button
						block
						className="btn-link t-a-l sidebar-menu-item"
						onClick={()=>{this.setState({openedAdd:true})}}
						>
						<i className="fa fa-plus sidebar-icon-center"/> Add tag
					</Button>


					<Nav vertical>
						<NavItem>
							<Link  className = "text-basic sidebar-align sidebar-menu-item" to={{ pathname: `/lanwiki/i/all` }}>All</Link>
						</NavItem>

						{
							this.state.tags
							.sort((item1,item2)=>item1.title.toLowerCase()>item2.title.toLowerCase()?1:-1)
							.map((item)=>
								<NavItem key={item.id}  className="sidebar-link">
									<Link className= "text-basic sidebar-align sidebar-menu-item-link" to={{ pathname:`/lanwiki/i/`+item.id}}>{item.title}</Link>
									<div className='sidebar-menu-item-btn'>
										<Button
											key={item.id}
											className='hidden-button full-width full-height'
											onClick={() => {this.setState({tagEdit: item, openedEdit: true})}}
											>
											<i className="fa fa-cog"/>
										</Button>
									</div>
								</NavItem>
							)
						}

				</Nav>

					<Modal isOpen={this.state.openedAdd} toggle={this.toggleAdd.bind(this)}>
						<TagAdd close={this.toggleAdd.bind(this)}/>
					</Modal>

					<Modal isOpen={this.state.openedEdit} toggle={this.toggleEdit.bind(this)}>
						<TagEdit tag={this.state.tagEdit} close={this.toggleEdit.bind(this)}/>
					</Modal>

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
