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
			<div className="container-fluid" style={{paddingLeft:10,paddingRight:10, minWidth:450}}>
				<div className="d-flex flex-row align-items-center">
					<div className="center-hor">
						<div className="input-group">
							<input
								type="text"
								className="form-control commandbar-search"
								value={this.state.search}
								onKeyPress={(e)=>{
									if(e.key==='Enter'){
										this.props.setSearch(this.state.search)}
									}
								}
								onChange={(e)=>this.setState({search:e.target.value})}
								placeholder="Search"
							/>
							<div className="input-group-append">
								<button className="commandbar-btn-search" type="button" onClick={()=>this.props.setSearch(this.state.search)}>
									<i className="fa fa-search" />
								</button>
							</div>
						</div>
					</div>

					{ this.props.isTask &&
						<div className="p-2">
							<Button
								className="btn-link"
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
								Global search
							</Button>
						</div>
					}
					{false && <div className="ml-auto p-2 align-self-center">
						{this.props.extraCommands?this.props.extraCommands():null}
					</div>}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ filterReducer, appReducer }) => {
	return { search:filterReducer.search };
};

export default connect(mapStateToProps, { setSearch, setFilter })(TaskListContainer);
