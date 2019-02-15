import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import base from '../../firebase';

export default class UserEdit extends Component {

  constructor(props){
    super(props);
    this.state = {
      username:'',
      user:null
    }
    this.submit.bind(this);
  }

  componentWillMount(){
    base.fetch('settings-users/'+this.props.match.params.userID, {
      context: this,
      state:'user',
      then:(user)=>{this.setState({username:user.username})}
    });
  }

  submit(){
    let data={
      username:this.state.username,
      id:this.props.match.params.userID
    }
    base.update(`settings-users/`+data.id,{data});
    this.props.history.goBack();
  }

  render() {
    return (
      <div className='content-page'>
        <div className="content">
          <div className="container-fluid">
            <FormGroup bsSize="large" controlId="inputName">
              <label><h2>User name</h2></label>
              <FormControl type="text"
                onChange={e => {
                  this.setState({ username: e.target.value });
                }}
                value={this.state.username}/>
            </FormGroup>
            <Button onClick={this.submit.bind(this)} bsStyle="success">Save</Button>
          </div>
        </div>
      </div>
    );
  }
}
