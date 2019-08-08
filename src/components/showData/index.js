import React, { Component } from 'react';
import TaskCol from './taskCol';
import TaskList from './taskList';
import { connect } from "react-redux";
import {timestampToString} from '../../helperFunctions';
import {setSearch, setFilter, setLayout} from '../../redux/actions';
class ShowDataContainer extends Component {
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
					<div className="row m-0">
						{this.props.layout === 0 && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TaskCol
									commandBar={this.props}
									listName={this.props.listName}
									history={this.props.history}
									empty={this.props.empty}
									match={this.props.match}
									data={this.filterData()}
									displayValues={this.props.displayValues}
									itemID={this.props.itemID}
									listID={this.props.listID}
									link={this.props.link}
									displayCol={this.props.displayCol}
									edit={this.props.edit}/>
							</div>
						)}


						{this.props.layout === 1 && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								{this.props.itemID && <this.props.edit match={this.props.match} columns={false} history={this.props.history} />}
								{!this.props.itemID &&
									<TaskList
										commandBar={this.props}
										listName={this.props.listName}
										history={this.props.history}
										match={this.props.match} 
										data={this.filterData()}
										itemID={this.props.itemID}
										listID={this.props.listID}
										displayValues={this.props.displayValues}
										link={this.props.link}/>}
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

export default connect(mapStateToProps, { setSearch, setFilter, setLayout })(ShowDataContainer);
