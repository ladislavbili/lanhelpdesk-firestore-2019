import React, { Component } from 'react';

export default class TaskCol extends Component {
	render() {
		return (
			<div>
				<div className="row p-0 taskList-container">
					<div className="col-lg-4 p-0 scrollable fit-with-header-and-command-bar">
						{
							this.props.data.map((item)=>
							<ul
								className={"taskList list-unstyled clickable"+(this.props.itemID===item.id?' active selected-item':'')}
								id="upcoming"
								onClick={()=>{
									this.props.history.push(this.props.link+'/'+item.id);
								}}
								key={item.id}>
								{this.props.displayCol(item)}
							</ul>
						)
					}

					</div>
					<div className="col-lg-8 p-0">
						{
							this.props.itemID && this.props.itemID!=='add' && this.props.data.some((item)=>item.id+""===this.props.itemID) &&
							<this.props.edit match={this.props.match} columns={true} history={this.props.history} />
						}

					</div>
				</div>
			</div>
		);
	}
}
