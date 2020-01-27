import React, { Component } from 'react';
import {Button} from 'reactstrap';
import { connect } from "react-redux";
import {setSearch, setFilter} from '../../redux/actions';
import classnames from "classnames";


class TaskListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: this.props.search
		};
	}

	render() {
		return (
			<div className={classnames({"m-l-0": (this.props.link.includes("settings")
																						|| (this.props.link.includes("lanwiki") && this.props.layout === 0)
																						|| (this.props.link.includes("passmanager") && this.props.layout === 0)
																						|| (this.props.link.includes("expenditures") && this.props.layout === 0) )},

																 {"m-l-10": this.props.link.includes("helpdesk") && !this.props.link.includes("settings") && this.props.layout === 0},

																 {"m-l-20": ((this.props.link.includes("helpdesk") && !this.props.link.includes("settings") && this.props.layout !== 0)
													 									 || (this.props.link.includes("lanwiki") && this.props.layout === 1)
													 									 || (this.props.link.includes("passmanager") && this.props.layout === 1)
													 									 || (this.props.link.includes("expenditures") && this.props.layout === 1) )},
																 "search-row")}>
					<div className="search">
						<button className="search-btn" type="button" onClick={()=>this.props.setSearch(this.state.search)}>
							<i className="fa fa-search flip" />
						</button>
						<input
							type="text"
							className="form-control search-text"
							value={this.state.search}
							onKeyPress={(e)=>{
								if(e.key==='Enter'){
									this.props.setSearch(this.state.search)}
								}
							}
							onChange={(e)=>this.setState({search:e.target.value})}
							placeholder="Search"
						/>
					</div>

					{ this.props.isTask &&
							<Button
								className="btn-link-reversed center-hor"
								onClick={()=>{
									let body={
										requester:null,
										company:null,
										assigned:null,
										workType:null,
										status:[],
										statusDateFrom:null,
										statusDateTo:null,
										updatedAt:(new Date()).getTime()
									}
									this.props.setSearch(this.state.search);
									this.props.history.push('/helpdesk/taskList/i/all');
									this.props.setFilter(body);
								}}
								>
								Global
							</Button>
					}
			</div>
		);
	}
}

const mapStateToProps = ({ filterReducer, appReducer }) => {
	return { search:filterReducer.search };
};

export default connect(mapStateToProps, { setSearch, setFilter })(TaskListContainer);
