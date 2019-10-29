import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import firebase from 'firebase';
import {rebase} from './index';
import { connect } from "react-redux";
import {setUserID, setUserData} from './redux/actions';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'',
			password:'',
			working: false,
			error: false,
		};
	}
	render() {
		return (
			<div style={{height:'100vh',display: 'flex'}}>
			<div className="card" style={{backgroundColor:'white', borderRadius:6, padding:'10px 20px', width:'350px',margin:'auto'}}>

				<FormGroup>
					<Label for="email">E-mail</Label>
					<Input type="email" name="email" id="email" placeholder="Enter e-mail" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value, working: false})} />
				</FormGroup>
				<FormGroup>
					<Label for="pass">Password</Label>
					<Input type="password" name="pass" id="pass" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value, working: false})} />
				</FormGroup>
				{
					this.state.error &&
					<div className="warning-general">
							Wrong username or password!
					</div>
				}
			<Button color="primary" disabled={this.state.working} onClick={()=>{
					this.setState({error:false, working:true});
					firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((res)=>{
						this.setState({working:false})
						this.props.setUserID(res.user.uid);
						rebase.get('users/'+res.user.uid, {
			        context: this,
			      }).then((user)=>this.props.setUserData(user));
					}).catch(error=>{
						this.setState({
							error:true});
						console.log(error)}
					);
				}}>Login</Button>


			</div>
		</div>
		);
	}
}

const mapStateToProps = ({ userReducer }) => {
	const { id } = userReducer;
	return { id };
};

export default connect(mapStateToProps, { setUserID, setUserData })(Login);
