import React, { Component } from 'react';
import TaskCol from './taskCol';
import TaskList from './taskList';
//import TaskBoard from './taskList';
import {Button} from 'reactstrap';
import { connect } from "react-redux";
import {timestampToString} from '../../helperFunctions';
import {setSearch, setFilter, setLayout} from '../../redux/actions';


class TaskListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: this.props.search
		};
	}

	getSortValue(item){
		let value = this.props.orderByValues.find((val)=>val.value===this.props.orderBy);
		if(value.type==='object'){
			return item[value.value]?item[value.value].title.toLowerCase():null;
		}else if(value.type==='text'){
			return item[value.value].toLowerCase();
		}else if(value.type==='int'){
			return item[value.value];
		}else if(value.type==='list'){
			return item[value.value].reduce(value.func,'').toLowerCase();
		}else if(value.type==='date'){
			return parseInt(item[value.value]?item[value.value]:null);
		}else if(value.type==='user'){
			return (item[value.value].surname+' '+item[value.value].name).toLowerCase();
		}
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="d-flex flex-row align-items-center">
					<div className="p-2">
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

					<div className="text-basic m-r-5 m-l-5">
					Sort by
				</div>
					<select
						value={this.props.orderBy}
						className="invisible-select"
						onChange={(e)=>this.props.setOrderBy(e.target.value)}>
						{
							this.props.orderByValues.map((item,index)=>
							<option value={item.value} key={index}>{item.label}</option>
						)
						}
					</select>

					{ !this.props.ascending &&
						<button type="button" className="btn btn-link btn-outline-blue waves-effect" onClick={()=>this.props.setAscending(true)}>
							<i
								className="fas fa-arrow-up icon-M"
								/>
						</button>
					}

					{ this.props.ascending &&
						<button type="button" className="btn btn-link btn-outline-blue waves-effect" onClick={()=>this.props.setAscending(false)}>
							<i
								className="fas fa-arrow-down icon-M"
								/>
						</button>
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
