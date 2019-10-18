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
				<hr />
				<h3 className="m-t-20" style={{color: "red"}}> Prístupové práva </h3>
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
												checked={permission.read}
												onChange={()=>this.props.givePermission(permission.user,'read')}
											/>
										</td>

										<td className="table-checkbox t-a-c">
											<input
												type="checkbox"
												checked={permission.write}
												onChange={()=>this.props.givePermission(permission.user,'write')}
											/>
										</td>

										<td className="table-checkbox t-a-c">
											<input
												type="checkbox"
												checked={permission.delete}
												onChange={()=>this.props.givePermission(permission.user,'delete')}
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
