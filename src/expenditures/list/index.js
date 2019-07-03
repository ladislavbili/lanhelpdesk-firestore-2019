import React, { Component } from 'react';
import {rebase} from '../../index';
import { connect } from "react-redux";
import ShowData from '../../components/showData';
import EditExpenditure from './editExpenditure';
import {timestampToString} from '../../helperFunctions';
import {setExpendituresOrderBy, setExpendituresAscending} from '../../redux/actions';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			instances:[],
		};
		this.ref=null;
		this.fetchData.bind(this);
		this.fetchData(this.props.match.params.listID);
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.listID!==props.match.params.listID){
			this.fetchData(props.match.params.listID);
		}
	}

	fetchData(id){
		if(this.ref!==null){
			rebase.removeBinding(this.ref);
		}
		this.ref = rebase.listenToCollection('/expenditures-instances', {
			context: this,
			withIds: true,
			query: (ref) => ref.where('folder', '==', id),
			then:instances=>{this.setState({instances})},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
	}

	getData(){
		return this.state.instances.filter((item)=>
			(item.title.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.URL.toLowerCase().includes(this.state.search.toLowerCase()))||
			(item.login.toLowerCase().includes(this.state.search.toLowerCase()))
		)
	}



	render() {
		let link='';
		if(this.props.match.params.hasOwnProperty('listID')){
			link = '/expenditures/i/'+this.props.match.params.listID;
		}else{
			link = '/expenditures'
		}
		return(
			<ShowData
				data={this.state.instances}
				filterBy={[
					{value:'title',type:'text'},
					{value:'startDate',type:'date'},
					{value:'repeat',type:'text'},
					{value:'price',type:'text'},
				]}
				displayCol={(expenditure)=>
					<li className="" >
						<div className="m-b-0">
							<label>{expenditure.title}</label>
							<div className="m-t-5">
								<p className="pull-right m-b-0 font-13">
									<i className="fa fa-clock-o" /> <span>Start: {expenditure.startDate?timestampToString(expenditure.startDate):'None'}</span>
								</p>
								<p className="text-muted m-b-0 font-13">
									<span className="">Opakovanie: {expenditure.repeat?expenditure.repeat:'Žiadne'}</span>
								</p>
								<p className="text-muted m-b-0 font-13">
									<span className="">Cena: {expenditure.price?expenditure.price:'Nezadaná'}</span>
								</p>
							</div>
						</div>
					</li>
				}
				displayValues={[
					{value:'startDate',label:'Start date',type:'date'},
					{value:'title',label:'Title',type:'text'},
					{value:'repeat',label:'Repeat',type:'text'},
					{value:'price',label:'Price',type:'text'},
				]}
				orderByValues={[
					{value:'startDate',label:'Start Date',type:'date'},
					{value:'title',label:'Title',type:'text'},
					{value:'repeat',label:'Repeat',type:'text'},
					{value:'price',label:'Price',type:'text'},
				]}
				link={link}
				history={this.props.history}
				orderBy={this.props.orderBy}
				setOrderBy={this.props.setExpendituresOrderBy}
				ascending={this.props.ascending}
				setAscending={this.props.setExpendituresAscending}
				itemID={this.props.match.params.expID}
				listID={this.props.match.params.listID}
				match={this.props.match}
				edit={EditExpenditure}
				 />
		)
		}
	}

	const mapStateToProps = ({ filterReducer, expenditureReducer }) => {
		const { project, filter } = filterReducer;
		const { orderBy, ascending } = expenditureReducer;
		return { project, filter,orderBy,ascending };
	};

	export default connect(mapStateToProps, { setExpendituresOrderBy, setExpendituresAscending })(List);
