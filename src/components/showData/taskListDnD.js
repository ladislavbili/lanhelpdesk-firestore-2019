import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
import classnames from 'classnames';

export default class TaskListDnD extends Component {

	constructor(props) {
		super(props);
		this.groupData.bind(this);
		this.groupRest.bind(this);
	}

	groupData(){
		let grouped=[];
		this.props.groupData.forEach((groupItem)=>grouped.push({
			groupItem:{...groupItem, title:groupItem.title?groupItem.title:'Undefined title', color: groupItem.color?groupItem.color:'#b8d9db'},
			data:this.props.data.filter((dataItem)=>dataItem[this.props.groupBy]!==undefined && dataItem[this.props.groupBy].id===groupItem.id)
		}));
		return grouped;
	}

	groupRest(){
		let ids=this.props.groupData.map((groupItem)=>groupItem.id);
		return this.props.data.filter((dataItem)=> dataItem[this.props.groupBy]===undefined || !ids.includes(dataItem[this.props.groupBy].id));
	}

	render() {
		return (
				<div>
					<CommandBar {...this.props.commandBar} />
					<div className="scroll-visible overflow-x fit-with-header-and-commandbar p-r-20 p-l-20">
						<ListHeader {...this.props.commandBar} listName={this.props.listName}  useBreadcrums={this.props.useBreadcrums} breadcrumsData={this.props.breadcrumsData}/>
						<div className="p-10">
							<div className="flex-row">
								{
									this.groupData().map((group)=>
									<Card className="flex-column dnd-column" key={group.groupItem.id}>
										<CardHeader style={{backgroundColor:group.groupItem.color}}>{group.groupItem.title}</CardHeader>
										<CardBody>
											{
												group.data.map((item)=>
												<ul
													className={classnames("taskList", "clickable", "list-unstyled")}
													onClick={(e)=>{
														this.props.history.push(this.props.link+'/'+item.id);
													}}
													key={item.id}>
													{this.props.displayCol(item)}
												</ul>
											)}
											{
												group.data.length===0 &&
												<div className="center-ver" style={{textAlign:'center'}}>
													Neboli nájdené žiadne výsledky pre tento filter
												</div>
											}
										</CardBody>
									</Card>
								)}
								{
									this.groupRest().length>0 &&
									<Card className="flex-column dnd-column" key="Undefined group">
										<CardHeader style={{backgroundColor:'#b8d9db'}}>Undefined group</CardHeader>
										<CardBody>
											{
												this.groupRest().map((item)=>
												<ul
													className={classnames("taskList", "clickable", "list-unstyled")}
													onClick={(e)=>{
														this.props.history.push(this.props.link+'/'+item.id);
													}}
													key={item.id}>
													{this.props.displayCol(item)}
												</ul>
											)}
										</CardBody>
									</Card>
								}
							</div>
						</div>
					</div>
				</div>
		);
	}
}
