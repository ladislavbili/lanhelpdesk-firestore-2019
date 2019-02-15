import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import avatar from '../../assets/images/users/avatar-1.jpg';

export default class Comments extends Component {
	render() {
		return (
			<div class="row">
				<div class="col-sm-12">
					<ul class="nav nav-tabs tabs" style={{ boxShadow: 'none', padding: 0, background: 'none' }}>
						<li class="nav-item tab" style={{ background: 'none'}} >
							<a href="#home-2" data-toggle="tab" aria-expanded="false" class="nav-link active show" style={{ background: 'none' }}>
								Add comment
							</a>
						</li>
						<li class="nav-item tab" style={{ background: 'none'}}>
							<a href="#profile-2" data-toggle="tab" aria-expanded="true" class="nav-link">
								Add mail
							</a>
						</li>
					</ul>

					<div class="tab-content" style={{ boxShadow: 'none', padding: 0, background: 'none' }}>
						<div class="tab-pane active" id="home-2">
							<textarea class="form-control m-b-10" rows="2" />
							<div class="checkbox form-check-inline" style={{ marginLeft:20 }}>
								<input type="checkbox" id="inlineCheckbox1" value="option1" />
								<label for="inlineCheckbox1"> Internal </label>
							</div>
							<button class="btn btn-success waves-effect waves-light btn-sm">Send</button>
						</div>
						<div class="tab-pane" id="profile-2">
							<textarea class="form-control" rows="2" />
							<button class="btn btn-success waves-effect waves-light btn-sm">Send</button>
						</div>
					</div>
					<div class="" style={{borderTop:"1px solid rgba(54, 64, 74, 0.05)", borderBottom:"1px solid rgba(54, 64, 74, 0.05)"}}>
						<div class="media m-b-30 m-t-30">
							<img
								class="d-flex mr-3 rounded-circle thumb-sm"
								src={avatar}
								alt="Generic placeholder image"
							/>
							<div class="media-body">
								<span class="media-meta pull-right">07:23 AM</span>
								<h4 class="text-primary font-16 m-0">Jonathan Smith</h4>
								<small class="text-muted">From: jonathan@domain.com</small>
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

						<h4 class="font-13">
							{' '}
							<i class="fa fa-paperclip m-r-10 m-b-10" /> Attachments <span>(0)</span>{' '}
						</h4>

						<div class="row" />
					</div>
				</div>
			</div>
		);
	}
}
