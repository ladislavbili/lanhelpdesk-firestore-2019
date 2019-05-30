import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import firebase from 'firebase';
import {rebase} from './index';
import { connect } from "react-redux";
import {setUserID, setUserData} from './redux/actions';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'admin@admin.sk',
			password:'adminadmin',
			working:false
		};
	}
	render() {
		return (
			<div className="card center-hor center-ver" style={{backgroundColor:'white', borderRadius:6, padding:'10px 20px', width:'350px'}}>
				<FormGroup>
					<Label for="email">E-mail</Label>
					<Input type="email" name="email" id="email" placeholder="Enter e-mail" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
				</FormGroup>
				<FormGroup>
					<Label for="pass">Password</Label>
					<Input type="password" name="pass" id="pass" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} />
				</FormGroup>
			<Button color="primary" disabled={this.state.working} onClick={()=>{
					this.setState({error:false, working:true});
					firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((res)=>{
						this.setState({working:false})
						this.props.setUserID(res.user.uid);
						rebase.get('users/'+res.user.uid, {
			        context: this,
			      }).then((user)=>this.props.setUserData(user));
					}).catch(error=>{this.setState({error:true});console.log('error')});
				}}>Login</Button>
			{
				this.state.error && <Alert color="danger">
        Wrong username or password!
      </Alert>
			}
			</div>
		);
	}
}

const mapStateToProps = ({ userReducer }) => {
	const { id } = userReducer;
	return { id };
};

export default connect(mapStateToProps, { setUserID, setUserData })(Login);
