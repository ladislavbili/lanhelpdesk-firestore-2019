import React, { Component } from 'react';
import {Button} from 'reactstrap';
import {rebase} from '../../index';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			instances:[],
		};
		this.ref=null;
		this.fetchData.bind(this);
		this.fetchData(this.props.match.params.id);
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.id!==props.match.params.id){
			this.fetchData(props.match.params.id);
		}
	}

	fetchData(id){
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
		return (
			<div>
				<div className="commandbar row">
					<div className="commandbar-item ml-2">
						<input
							type="text"
							value={this.state.search}
							className="form-control command-search"
							onChange={(e)=>this.setState({search:e.target.value})}
							placeholder="Search" />
					</div>
					<Button color="primary" className="mb-auto mt-auto" onClick={()=>{
							this.props.history.push('/expenditures/'+this.props.match.params.id+'/add');
						}}>
						<i className="fa fa-plus clickable pr-2"/>
						Náklad
					</Button>
				</div>
				<div className="fit-with-header scrollable">
					<h1>Náklady</h1>
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
									<th>Dátum</th>
									<th>Názov</th>
									<th>Opakovanie</th>
									<th>Cena</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.instances
									.filter(i => i.title.toLowerCase().includes(this.state.search.toLowerCase())
															|| i.repeat.toLowerCase().includes(this.state.search.toLowerCase())
														 	|| i.price.toLowerCase().includes(this.state.search.toLowerCase())
															|| i.startDate.toLowerCase().includes(this.state.search.toLowerCase()))
									.map((item)=>
										<tr key={item.id} className="clickable" onClick={()=>this.props.history.push('/expenditures/'+this.props.match.params.id+'/edit/'+item.id)}>
											<td >{item.startDate}</td>
											<td>{item.title}</td>
											<td>{item.repeat}</td>
											<td>{item.price}</td>
										</tr>
									)
								}
							</tbody>
						</table>
				</div>
			</div>
			);
		}
	}
