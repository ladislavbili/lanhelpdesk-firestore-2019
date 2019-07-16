import React, { Component } from 'react';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
import classnames from "classnames";

export default class ColumnDisplay extends Component {
	render() {
		return (
			<div>
				<div className="row p-0 taskList-container">
					<div className="p-0">
					<CommandBar {...this.props.commandBar} />

					<div className="scrollable fit-header-commandBar">
						<ListHeader {...this.props.commandBar} listName={this.props.listName}/>

						{
							this.props.data.map((item, index)=>
							<ul
								className={classnames("taskList", "clickable", "list-unstyled", {'selected-item': this.props.itemID === item.id.toString(),'first-task':index===0})}
								id="upcoming"
								onClick={()=>{
									this.props.history.push(this.props.link+'/'+item.id);
								}}
								key={item.id}>
								{this.props.displayCol(item)}
							</ul>
						)
					}
					{
						this.props.data.length===0 &&
						<div className="center-ver" style={{textAlign:'center'}}>
							Neboli nájdené žiadne výsledky pre tento filter
						</div>
					}
					</div>
				</div>

						{
							this.props.itemID && this.props.itemID!=='add' && this.props.data.some((item)=>item.id+""===this.props.itemID) &&
								<this.props.edit match={this.props.match} columns={true} history={this.props.history} />
						}
						{
							(!this.props.itemID || !this.props.data.some((item)=>item.id+""===this.props.itemID)) &&
							(this.props.empty?<this.props.empty/>:null)
						}
				</div>
			</div>
		);
	}
}
