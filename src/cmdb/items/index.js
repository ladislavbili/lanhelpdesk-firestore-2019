import React, { Component } from 'react';
import {Button} from 'reactstrap';
import { connect } from "react-redux";
import {rebase} from '../../index';
import {setCompany, setCMDBAscending, setCMDBOrderBy} from '../../redux/actions';

class ItemList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			activeSearch:'',
			items:[],
			companies:[],
			statuses:[],
			sidebarItem:null
		};
		this.fetchData.bind(this);
		this.getSortValue.bind(this);
	}

	fetchData(id){
		rebase.get('cmdb-sidebar', {
			context: this,
			query: (ref) => ref.where('url', '==', ""+id),
		}).then((sidebarItem)=>this.setState({sidebarItem:sidebarItem[0]}));
		if(this.ref){
			rebase.removeBinding(this.ref);
		}
		this.ref = rebase.listenToCollection('/cmdb-items', {
			context: this,
			withIds: true,
			query: (ref) => ref.where('sidebarID', '==', ""+id),
			then:content=>{this.setState({items:content})},
		});
	}

	componentWillReceiveProps(props){
		if(props.match.params.sidebarID!==this.props.match.params.sidebarID){
			this.fetchData(props.match.params.sidebarID)
		}
	}

	componentWillMount(){
		this.fetchData(this.props.match.params.sidebarID);
		this.ref2 = rebase.listenToCollection('/cmdb-statuses', {
			context: this,
			withIds: true,
			then:content=>{this.setState({statuses:content})},
		});
		this.ref3 = rebase.listenToCollection('/companies', {
			context: this,
			withIds: true,
			then:content=>{this.setState({companies:content})},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
		rebase.removeBinding(this.ref2);
		rebase.removeBinding(this.ref3);
	}

	getSortValue(item){
		switch (this.props.orderBy) {
			case 'IP': return item.IP.reduce(((ac,item)=>ac+= item+' '),'');
			case 'company': return item.status?item.status.title:null;
			case 'title': return item.title;
			case 'status': return item.status?item.status.title:null;
			default:

		}
	}

	getData(){
		let newItems= this.state.items.map((item)=>{
			let newItem={...item};
				newItem.company = this.state.companies.find((company)=>company.id===item.company);
				newItem.status = this.state.statuses.find((status)=>status.id===item.status);
			return newItem;
		});
		return newItems.filter((item)=>
			(item.title.toLowerCase().includes(this.state.activeSearch.toLowerCase()))||
			(item.IP.reduce(((ac,item)=>ac+= item+' '),'').toLowerCase().includes(this.state.activeSearch.toLowerCase()))||
			(item.company && item.company.title.toLowerCase().includes(this.state.activeSearch.toLowerCase()))||
			(item.status && item.status.title.toLowerCase().includes(this.state.activeSearch.toLowerCase()))
		).filter((item)=>this.props.company===null|| this.props.company === (item.company?item.company.id:'')
		).sort((item1,item2)=>{
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
		})
	}


	render() {
		return (
			<div>
				{/*COMMAND BAR*/}
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
											this.setState({activeSearch:this.state.search})
										}
									}}
									onChange={(e)=>this.setState({search:e.target.value})}
									placeholder="Search"
								/>
								<div className="input-group-append">
									<button className="commandbar-btn-search" type="button" onClick={()=>this.setState({activeSearch:this.state.search})}>
										<i className="fa fa-search" />
									</button>
								</div>
							</div>
						</div>
						<div className="p-2">
							<Button
								className="btn-link"
								onClick={()=>{
									this.props.setCompany(null);
								}}
								>
								Global search
							</Button>
						</div>
						<div className="p-2">
							<Button
								className="btn-link"
								onClick={()=>{
									this.props.history.push('/cmdb/i/'+this.props.match.params.sidebarID+'/i/add');
								}}
								> <i className="fa fa-plus sidebar-icon-center"/>
								{(this.state.sidebarItem?this.state.sidebarItem.title:'item')}
							</Button>
						</div>

						<div className="text-basic m-r-5 m-l-5">
						Sort by
					</div>
						<select
							value={this.props.orderBy}
							className="invisible-select"
							onChange={(e)=>this.props.setCMDBOrderBy(e.target.value)}>
							{
								[{value:'title',label:'Title'},{value:'company',label:'Company'},{value:'IP',label:'IP'},{value:'status',label:'Status'}].map((item,index)=>
								<option value={item.value} key={index}>{item.label}</option>
							)
							}
						</select>

						{ !this.props.ascending &&
							<button type="button" className="btn btn-link btn-outline-blue waves-effect" onClick={()=>this.props.setCMDBAscending(true)}>
								<i
									className="fas fa-arrow-up icon-M"
									/>
							</button>
						}

						{ this.props.ascending &&
							<button type="button" className="btn btn-link btn-outline-blue waves-effect" onClick={()=>this.props.setCMDBAscending(false)}>
								<i
									className="fas fa-arrow-down icon-M"
									/>
							</button>
					}
					</div>
				</div>
					{/*COMMAND BAR*/}



				<div className="fit-header-commandBar scrollable">
					<div className="p-20 full-width">
					<h1>{this.state.sidebarItem?this.state.sidebarItem.title:'Item'}</h1>
					<hr />
						<table className="table">
							<thead>
								<tr>
										<th>Name</th>
										<th>Company</th>
										<th>IP</th>
										<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{
									this.getData().map((item)=>
										<tr key={item.id} className="clickable" onClick={()=>this.props.history.push('/cmdb/i/'+this.props.match.params.sidebarID+'/'+item.id)}>
												<td>{item.title}</td>
												<td>{item.company?item.company.title:'Žiadna'}</td>
												<td>{item.IP.map((item2)=><span key={item2}>{item2}  </span>)}</td>
												<td>{item.status?item.status.title:'Žiadny'}</td>
										</tr>
									)
								}
							</tbody>
						</table>
						</div>
				</div>
			</div>
			);
		}
	}


	const mapStateToProps = ({ filterReducer, cmdbReducer }) => {
		const { company } = filterReducer;
		const { ascending, orderBy } = cmdbReducer;
		return { ascending, orderBy,company };
	};

	export default connect(mapStateToProps, { setCompany, setCMDBAscending, setCMDBOrderBy})(ItemList);
