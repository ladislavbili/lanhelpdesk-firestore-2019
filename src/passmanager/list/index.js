import React, { Component } from 'react';
import { Button, Input} from 'reactstrap';
import {rebase} from '../../index';

//const attributes=[{title:'Server name',id:'title'},{title:'IP',id:'IP'},{title:'Status',id:'status'},{title:'Company',id:'company'}];

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			passwords:[],
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
		this.ref = rebase.listenToCollection('/pass-passwords', {
			context: this,
			withIds: true,
			query: (ref) => ref.where('folder', '==', id),
			then:content=>{this.setState({passwords:content.map((item)=>{return {...item, shown:false}})})},
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
	}

	getData(){

		return this.state.passwords.filter((item)=>
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
							this.props.history.push('/passmanager/'+this.props.match.params.id+'/add');
						}}>
						<i className="fa fa-plus clickable pr-2"/>
						Password
					</Button>
				</div>
				<div className="fit-with-header scrollable">
					<h1>Pass</h1>
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
									<th>Title</th>
									<th>URL</th>
									<th>Login</th>
									<th>Password</th>
								</tr>
							</thead>
							<tbody>
								{
									this.getData().map((item)=>
										<tr key={item.id}>
											<td className="clickable" onClick={()=>this.props.history.push('/passmanager/'+this.props.match.params.id+'/edit/'+item.id)}>{item.title}</td>
											<td><a href={item.URL} target="_blank" without rel="noopener noreferrer">{item.URL}</a></td>
											<td className="clickable" onClick={()=>this.props.history.push('/passmanager/'+this.props.match.params.id+'/edit/'+item.id)}>{item.login}</td>
											<td className="row">
												{
													item.shown &&
													<Input type="text" placeholder="No pass" style={{width:'auto'}} className="mb-auto mt-auto" id={'input'+item.id}	value={item.password} disabled={true} />
												}
												{
													!item.shown &&
													<Button color="primary" className="mb-auto mt-auto" onClick={()=>{
															let newPasswords = [...this.state.passwords];
															newPasswords.find((item2)=>item.id===item2.id).shown=true;
															this.setState({passwords:newPasswords});
														}}>
														Show password
													</Button>
												}
												<Button color="warning" className="mb-auto mt-auto" onClick={()=>{
														navigator.clipboard.writeText(item.password);
													}}>
													Copy
												</Button>
											</td>
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
