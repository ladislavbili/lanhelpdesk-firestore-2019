import React, { Component } from 'react';
import Select from 'react-select';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { selectStyle, invisibleSelectStyle} from '../../scss/selectStyles';


export default class Subtasks extends Component {
	constructor(props){
		super(props);
		this.state={
			editedTitle: "",
			focused: null,
			activeTab: "1",

			newTitle:'',
			//newAssigned:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null
		}
		this.onFocus.bind(this);
	}

	onFocus(subtask){
		this.setState({
			editedTitle: subtask.title,
			focused: subtask.id
		});
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.taskID!==props.match.params.taskID){
			this.setState({
				newTitle:'',
			})
		}
		/*if(this.props.taskAssigned.length!==props.taskAssigned.length || (props.taskAssigned.length>0 && props.taskAssigned[0].id!==this.props.taskAssigned[0].id) ){
			if(!props.taskAssigned.some((item)=>item.id===(this.state.newAssigned?this.state.newAssigned.id:null))){
				if(props.taskAssigned.length>0){
					this.setState({newAssigned:props.taskAssigned[0]});
				}else{
					this.setState({newAssigned:null});
				}
			}
		}*/
	}

	render() {
		return (
			<div className="m-t-30">
				<div className="row">
					<div className="full-width">
						<Nav tabs className="b-0">
							<NavItem>
								<NavLink
									className={classnames({ active: this.state.activeTab === '1'}, "clickable", "form-tab-end")}
								>
									Podúlohy
								</NavLink>
							</NavItem>
						</Nav>
						<TabContent activeTab={this.state.activeTab}>
							<TabPane tabId="1">
								<div className="row">
									<div className="col-md-12">
										<div >
											<table className="table">
												<thead >
													<tr >
														<th width="25"></th>
														<th >Názov</th>
														{false && <th width="170">Rieši</th>}
														<th className="t-a-c" width="124">Action</th>
													</tr>
												</thead>
												<tbody>
													{
														this.props.subtasks.map((subtask)=>
														<tr key={subtask.id}>
															<td className="table-checkbox">
																<input type="checkbox" checked={subtask.done} onChange={()=>{
																		this.props.updateSubtask(subtask.id,{done:!subtask.done})
																	}} />
																</td>
																<td>
																	<div>
																		<input
																			className="form-control hidden-input"
																			value={
																				subtask.id === this.state.focused
																				? this.state.editedTitle
																				: subtask.title
																			}
																			onBlur={() => {
																				//submit
																				this.props.updateSubtask(subtask.id,{title:this.state.editedTitle})
																				this.setState({ focused: null });
																			}}
																			onFocus={() => this.onFocus(subtask)}
																			onChange={e =>{
																				this.setState({ editedTitle: e.target.value })}
																			}
																			/>
																	</div>
																</td>
																{false && <td>
																	<Select
																		value={subtask.assignedTo}
																		onChange={(assignedTo)=>{
																			this.props.updateSubtask(subtask.id,{assignedTo:assignedTo.id})
																		}}
																		options={this.props.taskAssigned}
																		styles={invisibleSelectStyle}
																		/>
																</td>}
																<td className="t-a-r">
																	<button className="btn btn-link waves-effect" onClick={()=>{
																			if(window.confirm('Are you sure?')){
																				this.props.removeSubtask(subtask.id);
																			}
																		}}>
																		<i className="fa fa-times"  />
																	</button>
																</td>
															</tr>
														)
													}

													<tr>
														<td>
														</td>
														<td>
															<input
																type="text"
																className="form-control"
																id="inlineFormInput"
																placeholder=""
																value={this.state.newTitle}
																onChange={(e)=>this.setState({newTitle:e.target.value})}
																/>
														</td>
														{false && <td>
															<Select
																value={this.state.newAssigned}
																onChange={(newAssigned)=>{
																	this.setState({newAssigned})
																}
															}
															options={this.props.taskAssigned}
															styles={selectStyle}
															/>
													</td>}
													<td className="t-a-r">
														<button className="btn btn-link waves-effect"
															disabled={this.state.newTitle===''}
															onClick={()=>{
																let body={
																	title:this.state.newTitle,
																	//assignedTo:this.state.newAssigned?this.state.newAssigned.id:null,
																	done:false
																}
																this.setState({
																	newTitle:'',
																	//assignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null
																});
																this.props.submitService(body);
															}
														}
														>
														<i className="fa fa-plus" />
													</button>
												</td>
												</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</TabPane>
						</TabContent>
					</div>
				</div>
			</div>

		);
	}
}
