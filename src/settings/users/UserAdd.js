import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import base from '../../firebase';

export default class StatusAdd extends Component {

  constructor(props){
    super(props);
    this.state = {
      username:'',
      user:null
    }
    this.submit.bind(this);
  }

  componentWillMount(){
      this.ref = base.bindToState(`settings-users`, {
        context: this,
        state: 'user',
        asArray: true,
        queries: {
          orderByChild: 'id',
          limitToLast: 1
        }
      });
    }

  componentWillUnmount() {
      base.removeBinding(this.ref);
  }

  submit(){
    let data={
      username:this.state.username,
      id:(this.state.user.length>0?this.state.user[0].id+1:0)
    }
    base.post(`settings-users/`+data.id,{data});
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
              <Button onClick={this.submit.bind(this)} bsStyle="primary">+ Add</Button>
          </div>
        </div>
      </div>
    );
}}
