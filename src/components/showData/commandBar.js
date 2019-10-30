import React, { Component } from 'react';
import {Button} from 'reactstrap';
import { connect } from "react-redux";
import {setSearch, setFilter} from '../../redux/actions';


class TaskListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: this.props.search
		};
	}

	render() {
		return (
			<div className={"commandbar " + (this.props.layout === 1 ? " commandbar-list-align" : "")}>
					<div className="commandbar-search">
							<input
								type="text"
								className="form-control commandbar-search-text"
								value={this.state.search}
								onKeyPress={(e)=>{
									if(e.key==='Enter'){
										this.props.setSearch(this.state.search)}
									}
								}
								onChange={(e)=>this.setState({search:e.target.value})}
								placeholder="Search"
							/>
							<button className="commandbar-search-btn" type="button" onClick={()=>this.props.setSearch(this.state.search)}>
								<i className="fa fa-search" />
							</button>
					</div>

					{ this.props.isTask &&
							<Button
								className="btn-link center-hor"
								onClick={()=>{
									let body={
										requester:null,
										company:null,
										assigned:null,
										workType:null,
										status:null,
										statusDateFrom:'',
										statusDateTo:'',
										updatedAt:(new Date()).getTime()
									}
									this.props.setFilter(body);
								}}
								>
								Global
							</Button>
					}
					{false && <div className="ml-auto p-2 align-self-center">
						{this.props.extraCommands?this.props.extraCommands():null}
					</div>}
			</div>
		);
	}
}

const mapStateToProps = ({ filterReducer, appReducer }) => {
	return { search:filterReducer.search };
};

export default connect(mapStateToProps, { setSearch, setFilter })(TaskListContainer);
