import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { connect } from "react-redux";
import {storageUsersStart} from '../../../redux/actions';
import Select from "react-select";
import {selectStyle} from "../../../scss/selectStyles";
import {toSelArr} from '../../../helperFunctions';

class Permissions extends Component {
	constructor(props) {
		super();
		this.state = {
			users: [],
			chosenUser: null,
		};
	}

	componentWillMount(){
		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		this.setState({users:toSelArr(this.props.users,'email')})
	}


	componentWillReceiveProps(props){
	  if(props.usersLoaded && !this.props.usersLoaded){
	    this.setState({users:toSelArr(props.users,'email')})
	  }
	}

	render() {
		return (
			<div >
				<h3 className="m-t-20"> Prístupové práva </h3>
				<div className="row">
					<div className="m-r-10 center-hor">
						<label className="">
							Používateľ
						</label>
					</div>
					<div className="flex m-r-10">
						<Select
							value={this.state.chosenUser}
							styles={selectStyle}
							onChange={(e)=> this.setState({chosenUser: e})}
							options={this.state.users.filter((user)=>!this.props.permissions.map((permission)=>permission.user.id).includes(user.id))}
							/>
					</div>
					<div>
						<Button className="btn" disabled={this.state.chosenUser===null} onClick={() => {this.props.addUser(this.state.chosenUser);this.setState({chosenUser:null})}}>Pridať</Button>
					</div>
				</div>

				{	this.props.permissions.length > 0
					&&
					<table className="table">
						<thead>
							<tr>
								<th > Username </th>
								<th className="t-a-c"> Read </th>
								<th className="t-a-c"> Write </th>
								<th className="t-a-c"> Delete</th>
								<th className="t-a-c"> Admin</th>
							</tr>
						</thead>

						<tbody>
							{
								this.props.permissions.map(permission =>
								<tr key={permission.user.id}>
									<td> {permission.user.email} </td>
										<td className="table-checkbox t-a-c">
											<input
												type="checkbox"
												disabled={this.props.userID===permission.user.id && !this.props.isAdmin}
												checked={permission.read}
												onChange={()=>{
													let permissions = null;
													if(permission.read){
														permissions={read:false, write:false, delete:false, isAdmin:false}
													}else{
														permissions={read:true, write:false, delete:false, isAdmin:false}
													}
													this.props.givePermission(permission.user,permissions);
												}}
											/>
										</td>

										<td className="table-checkbox t-a-c">
											<input
												type="checkbox"
												disabled={this.props.userID===permission.user.id && !this.props.isAdmin}
												checked={permission.write}
												onChange={()=>{
													let permissions = null;
													if(permission.write){
														permissions={read:true, write:false, delete:false, isAdmin:false}
													}else{
														permissions={read:true, write:true, delete:false, isAdmin:false}
													}
													this.props.givePermission(permission.user,permissions);
												}}
											/>
										</td>

										<td className="table-checkbox t-a-c">
											<input
												type="checkbox"
												disabled={this.props.userID===permission.user.id && !this.props.isAdmin}
												checked={permission.delete}
												onChange={()=>{
													let permissions = null;
													if(permission.delete){
														permissions={read:true, write:true, delete:false, isAdmin:false}
													}else{
														permissions={read:true, write:true, delete:true, isAdmin:false}
													}
													this.props.givePermission(permission.user,permissions);
												}}
											/>
										</td>
										<td className="table-checkbox t-a-c">
											<input
												type="checkbox"
												disabled={this.props.userID===permission.user.id && !this.props.isAdmin}
												checked={permission.isAdmin}
												onChange={()=>{
													let permissions = null;
													if(permission.isAdmin){
														permissions={read:true, write:true, delete:true, isAdmin:false}
													}else{
														permissions={read:true, write:true, delete:true, isAdmin:true}
													}
													this.props.givePermission(permission.user,permissions);
												}}
											/>
										</td>
								</tr>
							)
							}
						</tbody>
					</table>
				}

			</div>
		);
	}
}


const mapStateToProps = ({ storageUsers}) => {
  const { usersActive, users, usersLoaded } = storageUsers;
  return { usersActive, users, usersLoaded };
};

export default connect(mapStateToProps, { storageUsersStart })(Permissions);
