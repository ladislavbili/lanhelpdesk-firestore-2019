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
								className={"taskList list-unstyled clickable"+(this.props.match.params.taskID===item.id?' active selected-item':'')}
								id="upcoming"
								onClick={()=>{
									if(this.props.match.params.listID){
										this.props.history.push('/helpdesk/taskList/i/'+this.props.match.params.listID+'/'+item.id);
									}else{
										this.props.history.push('/helpdesk/taskList/'+item.id)}
									}
								}
								key={item.id}>
								{this.props.displayCol(item)}
							</ul>
						)
					}

					</div>
					<div className="col-lg-8 p-0">
						{
							this.props.match.params.taskID && this.props.match.params.taskID!=='add' && this.props.data.some((item)=>item.id+""===this.props.match.params.taskID) &&
							<this.props.edit match={this.props.match} columns={true} history={this.props.history} />
						}

					</div>
				</div>
			</div>
		);
	}
}
