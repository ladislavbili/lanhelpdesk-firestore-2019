import React, { Component } from 'react';

export default class Attachments extends Component {
	constructor(props){
		super(props);
		this.state={
		}
	}

	render() {
		return (
					<div className="full-width m-t-10 m-b-10">
							{!this.props.disabled &&
								<div>
								<label htmlFor="uploadInput" className="btn-link-add">
									+ Attachment
								</label>
								<input type="file" id="uploadInput" multiple={true} style={{display:'none'}}
									onChange={(e)=>{
										if(e.target.files.length>0){
											let files = [...e.target.files];
											this.props.addAttachments(files);
										}
									}}/>
								</div>
							}
							<table>
							{
								this.props.attachments.map((attachment,index)=>
									<tr key={index}>
										<td className="p-r-5">
											{attachment.url && <a target="_blank" href={attachment.url} style={{cursor:'pointer', color: "black"}} rel="noopener noreferrer">
												{`${attachment.title} (${Math.round(parseInt(attachment.size)/1024)}kB)`}
											</a>}
											{!attachment.url &&
												<span style={{cursor:'pointer', color: "black"}}>{`${attachment.title} (${Math.round(parseInt(attachment.size)/1024)}kB)`}</span>
											}
										</td>
										<td>
											{attachment.url && !this.props.disabled && <button className="btn-link-remove"
												disabled={this.props.disabled}
												onClick={()=>{
													if(window.confirm('Are you sure?')){
														this.props.removeAttachment(attachment);
													}
												}}>
												<i className="fa fa-times"  />
											</button>}

											{!attachment.url && !this.props.disabled && <button className="btn-link-remove"
												disabled={this.props.disabled}
												onClick={()=>{
													if(window.confirm('Are you sure?')){
														this.props.removeAttachment(attachment);
													}
												}}>
												<i className="fa fa-times"  />
											</button>}
										</td>
									</tr>
								)
							}
						</table>
					</div>

		);
	}
}
