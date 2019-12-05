import React, { Component } from 'react';


export default class Attachments extends Component {
	constructor(props){
		super(props);
		this.state={
		}
	}

	render() {
		return (
					<div className="full-width m-t-10 row">

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
									{
										this.props.attachments.map((attachment,index)=>
										<div key={index}  className="attachment">
													<a target="_blank" href={attachment.url} style={{cursor:'pointer', color: "black"}} rel="noopener noreferrer">
														{`${attachment.title} (${Math.round(parseInt(attachment.size)/1024)}kB)`}
													</a>
													{!this.props.disabled && <button className="btn-link-remove"
														disabled={this.props.disabled}
														onClick={()=>{
															if(window.confirm('Are you sure?')){
																this.props.removeAttachment(attachment);
															}
														}}>
														<i className="fa fa-times"  />
													</button>}
										</div>
										)
									}
						
					</div>

		);
	}
}
