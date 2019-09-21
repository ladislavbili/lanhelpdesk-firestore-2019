import React, { Component } from 'react';

const LIST = ["picture.jpg", "task-description.pdf", "specification.pdf"];

export default class Subtasks extends Component {
	constructor(props){
		super(props);
		this.state={
		}
	}

	render() {
		return (
			<div className="m-t-10">
				<div className="row">
					<div className="full-width">
							<table className="table">
								<thead >
									<tr  className="tr-no-lines">
										<th style={{fontSize: "14px", fontFamily: "Segoe UI Bold", color: "#333"}}>Attachment</th>
										<th className="t-a-r" width="124">
										</th>
									</tr>
								</thead>
								<tbody>
									{
										LIST.map((subtask)=>
										<tr key={subtask}  className="tr-no-lines">

												<td>
													<button className="btn btn-link-reversed waves-effect" onClick={()=>{
														}}>
														{subtask}
													</button>
												</td>

												<td className="t-a-r">
													<button className="btn btn-link-reversed waves-effect" onClick={()=>{
															if(window.confirm('Are you sure?')){

															}
														}}>
														<i className="fa fa-times"  />
													</button>
												</td>
											</tr>
										)
									}

								</tbody>
							</table>

							<button className="btn waves-effect" onClick={()=>{
									this.setState({showAddItem: false})
								}}>
								+ Add New Attachment
							</button>

					</div>
				</div>
			</div>

		);
	}
}
