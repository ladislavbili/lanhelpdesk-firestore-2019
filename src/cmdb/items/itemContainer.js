import React, { Component } from 'react';
import ItemEdit from './itemEdit';
import ItemView from './itemView';

export default class ItemContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit:false,
			saving:false,
			delete:false
		};
	}

	render() {
		return (
			<div className="form-background scrollable fit-with-header" style={{padding:0,border:'none'}}>
				<div className="container-fluid">
					<div className="d-flex flex-row align-items-center ml-auto mr-auto" >
						<div className="p-2">
							{ !this.state.edit &&
								<button type="button" className="btn btn-link waves-effect" onClick={()=>this.setState({edit:true})}>
									<i
										className="fas fa-pen icon-M"
										/>
									{" Edit"}
								</button>
							}
							{ this.state.edit &&
								<button type="button" className="btn btn-link waves-effect" onClick={()=>this.setState({edit:false})}>
									<i
										className="fas fa-file-invoice icon-M"
										/>
									{" View"}
								</button>
							}
							{ this.state.edit &&
								<button type="button" className="btn btn-link waves-effect" onClick={()=>this.setState({saving:true})} disabled={this.state.saving}>
									<i
										className="fas fa-save icon-M"
										/>
									{this.state.saving?" Saving...":" Save"}
								</button>
							}
							<button type="button" className="btn btn-link waves-effect" onClick={()=>this.setState({delete:true})} disabled={this.state.delete}>
								<i
									className="fas fa-trash icon-M"
									/>
								{" Delete"}
							</button>
						</div>
					</div>
				</div>
				{
					this.state.edit &&
					<ItemEdit {...this.props} toView={() => this.setState({edit: false})} delete={this.state.delete} saving={this.state.saving} setDeleting={(deleting)=>this.setState({delete:deleting})} setSaving={(saving)=>this.setState({saving})} />
				}
				{
					!this.state.edit &&
					<ItemView {...this.props} delete={this.state.delete} setDeleting={(deleting)=>this.setState({delete:deleting})} />
				}
			</div>
			);
		}
	}
