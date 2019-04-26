import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink} from 'reactstrap';
import classnames from 'classnames';
import {rebase} from '../../index';
import StatusAdd from './statusAdd';
import StatusEdit from './statusEdit';

export default class Statuses extends Component {
	constructor(props){
    super(props);
    this.state={
      statuses:[],
			search:'',
			openEdit:false,
			openID:null
    }
		this.getStatuses.bind(this);
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/cmdb-statuses', {
      context: this,
      withIds: true,
      then:content=>{this.setState({statuses:content, statusFilter:''})},
    });
  }

	getStatuses(){
		return this.state.statuses.filter((item)=>item.title.toLowerCase().includes(this.state.search.toLowerCase()))
	}

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
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
					<div className="commandbar-item ml-2">
						<StatusAdd/>
					</div>
				</div>
				<div className="fit-with-header scrollable">
						<table className="table table-centered table-borderless table-hover mb-0">
							<thead className="thead-light">
								<tr>
									<th>
										Status name
									</th>
								</tr>
							</thead>
							<tbody style={{backgroundColor:'white'}}>
								{
									this.getStatuses().map((status)=>
									<tr
										key={status.id}
										className="clickable"
										onClick={()=>{
											this.setState({openEdit:true,openID:status.id})
										}}
										>
										<td>
											{status.title}
										</td>
									</tr>)
								}
							</tbody>
						</table>
				</div>
				<StatusEdit id={this.state.openID} opened={this.state.openEdit} toggle={()=>this.setState({openEdit:false,openID:null})} />
			</div>
			);
		}
	}
