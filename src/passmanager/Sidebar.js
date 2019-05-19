import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink} from 'reactstrap';
import classnames from 'classnames';
import { NavLink as Link } from 'react-router-dom';
import Select from "react-select";
import { connect } from "react-redux";

import SelectPage from '../components/SelectPage';
import {rebase} from '../index';
import {toSelArr} from '../helperFunctions';
import FolderAdd from './folders/folderAdd';

const customSelect = {
	singleValue: (provided, state) => {
		return { ...provided, marginLeft:30 };
	},
	indicatorSeparator:(provided, state) => {
		return { ...provided, width:0 };
	},
	control:(provided, state) => {
		return { ...provided, borderRadius:50, borderColor:'#6c757d' };
	},
	input:(provided, state) => {
		return { ...provided, marginLeft:30 };
	},
	placeholder:(provided, state) => {
		return { ...provided, marginLeft:30 };
	},
}

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			folders:[]
		};

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

	render() {
		return (
			<div className="left side-menu">
				<SelectPage />
				<div className="scrollable fit-with-header">
					<FolderAdd />
					<Nav vertical>
						<NavItem>
							{
								this.state.folders.map((item)=>
								<Link key={item.id} to={{ pathname: `/passmanager/`+item.id }}>{item.title}</Link>
							)}
						</NavItem>
					</Nav>
				</div>

			</div>
			);
		}
	}
	const mapStateToProps = ({  }) => {
    return {  };
  };

  export default connect(mapStateToProps, { })(Sidebar);
