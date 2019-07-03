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
		this.filterData.bind(this);
	}

	filterData(){
		return this.props.data.filter((item)=>{
			let filterString="";
			this.props.filterBy.forEach((value)=>{
				if(!item[value.value]){
					return;
				}
				if(value.type==='object'){
					filterString+= item[value.value].title + " ";
				}else if(value.type==='text'){
					filterString+= item[value.value] + " ";
				}else if(value.type==='int'){
					filterString+= item[value.value] + " ";
				}else if(value.type==='list'){
					filterString+= item[value.value].reduce(value.func,'') + " ";
				}else if(value.type==='date'){
					filterString+= timestampToString(item[value.value]) + " ";
				}else if(value.type==='user'){
					filterString+= item[value.value].email+' '+item[value.value].name+' '+item[value.value].surname + " ";
				}
			});
			return filterString.toLowerCase().includes(this.props.search.toLowerCase());
		}).sort((item1,item2)=>{
			let val1 = this.getSortValue(item1);
			let val2 = this.getSortValue(item2);
			if(this.props.ascending){
				if(val1===null){
					return 1;
				}
				return val1 > val2? 1 : -1;
			}else{
				if(val2===null){
					return 1;
				}
				return val1 < val2? 1 : -1;
			}
		});
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
			<div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="container-fluid">
						<div className="d-flex flex-row align-items-center">
							<div className="p-2">
								<div className="input-group">
									<input
										type="text"
										className="form-control commandbar-search"
										value={this.state.search}
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
							<select value={this.props.orderBy} onChange={(e)=>this.props.setOrderBy(e.target.value)}>
								{
									this.props.orderByValues.map((item,index)=>
									<option value={item.value} key={index}>{item.label}</option>
								)
								}
							</select>
							{ !this.props.ascending &&
								<button type="button" className="btn btn-link waves-effect" onClick={()=>this.props.setAscending(true)}>
									<i
										className="fas fa-arrow-up commandbar-command-icon icon-M"
										/>
								</button>
							}

							{ this.props.ascending &&
								<button type="button" className="btn btn-link waves-effect" onClick={()=>this.props.setAscending(false)}>
									<i
										className="fas fa-arrow-down commandbar-command-icon icon-M"
										/>
								</button>
						}

							<div className="ml-auto p-2 align-self-center">
								{this.props.extraCommands?this.props.extraCommands():null}
								<div className="btn-group btn-group-toggle" data-toggle="buttons">
									<label
										className={
											'btn btn-link btn-outline-blue waves-effect waves-light' +
											(this.props.layout === 0 ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											onChange={() => this.props.setLayout(0)}
											checked={this.props.layout === 0}
										/>
										<i className="fa fa-columns" />
									</label>
									<label
										className={
											'btn btn-link btn-outline-blue waves-effect waves-light' +
											(this.props.layout === 1? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											checked={this.props.layout === 1}
											onChange={() => this.props.setLayout(1)}
										/>
										<i className="fa fa-list" />
									</label>
									<label
										className={
											'btn btn-link btn-outline-blue waves-effect waves-light' +
											(this.props.layout === 2 ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											onChange={() => this.props.setLayout(2)}
											checked={this.props.layout === 2}
										/>
										<i className="fa fa-map" />
									</label>
								</div>
							</div>
						</div>
					</div>

					<div className="row m-0">
						{this.props.layout === 0 && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TaskCol history={this.props.history} match={this.props.match} data={this.filterData()} displayValues={this.props.displayValues} itemID={this.props.itemID} listID={this.props.listID} link={this.props.link} displayCol={this.props.displayCol} edit={this.props.edit}/>
							</div>
						)}


						{this.props.layout === 1 && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								{this.props.itemID && <this.props.edit match={this.props.match} columns={false} history={this.props.history} />}
								{!this.props.itemID && <TaskList history={this.props.history} match={this.props.match} data={this.filterData()} itemID={this.props.itemID} listID={this.props.listID} displayValues={this.props.displayValues} link={this.props.link}/>}
							</div>
						)}

						{/*this.props.layout === 2 && false && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TaskBoard history={this.props.history} match={this.props.match} data={this.filterData()} displayValues={this.props.displayValues} link={this.props.link}/>
							</div>
						)*/}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ filterReducer, appReducer }) => {
	return { search:filterReducer.search, layout:appReducer.layout };
};

export default connect(mapStateToProps, { setSearch, setFilter, setLayout })(TaskListContainer);
