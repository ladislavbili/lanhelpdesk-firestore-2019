import React, { Component } from 'react';

export default class Comments extends Component {
	render() {
		return (
			<div className="row">
				<div className="col-sm-12">
					<ul className="nav nav-tabs tabs" style={{ boxShadow: 'none', padding: 0, background: 'none' }}>
						<li className="nav-item tab" style={{ background: 'none'}} >
							<a href="#home-2" data-toggle="tab" aria-expanded="false" className="nav-link active show" style={{ background: 'none' }}>
								Add comment
							</a>
						</li>
						<li className="nav-item tab" style={{ background: 'none'}}>
							<a href="#profile-2" data-toggle="tab" aria-expanded="true" className="nav-link">
								Add mail
							</a>
						</li>
					</ul>

					<div className="tab-content" style={{ boxShadow: 'none', padding: 0, background: 'none' }}>
						<div className="tab-pane active" id="home-2">
							<textarea className="form-control m-b-10" rows="2" />
							<div className="checkbox form-check-inline" style={{ marginLeft:20 }}>
								<input type="checkbox" id="inlineCheckbox1" value="option1" />
								<label htmlFor="inlineCheckbox1"> Internal </label>
							</div>
							<button className="btn btn-success waves-effect waves-light btn-sm">Send</button>
						</div>
						<div className="tab-pane" id="profile-2">
							<textarea className="form-control" rows="2" />
							<button className="btn btn-success waves-effect waves-light btn-sm">Send</button>
						</div>
					</div>
					<div className="" style={{borderTop:"1px solid rgba(54, 64, 74, 0.05)", borderBottom:"1px solid rgba(54, 64, 74, 0.05)"}}>
						<div className="media m-b-30 m-t-30">
							<img
								className="d-flex mr-3 rounded-circle thumb-sm"
								src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
								alt="Generic placeholder XX"
							/>
							<div className="media-body">
								<span className="media-meta pull-right">07:23 AM</span>
								<h4 className="text-primary font-16 m-0">Jonathan Smith</h4>
								<small className="text-muted">From: jonathan@domain.com</small>
							</div>
						</div>

						<p>
							<b>Hi Bro...</b>
						</p>
						<p>
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
							Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
							ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
						</p>
						<p>
							Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate
							eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum
							felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper
							nisi.
						</p>
						<p>
							Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend
							ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra
							nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel
							augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus,
							tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed
							ipsum. Nam quam nunc, blandit vel, luctus pulvinar,
						</p>

						<hr />

						<h4 className="font-13">
							<i className="fa fa-paperclip m-r-10 m-b-10" /> Attachments <span>(0)</span>
						</h4>

						<div className="row" />
					</div>
				</div>
			</div>
		);
	}
}
