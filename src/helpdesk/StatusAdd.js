import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import base from '../firebase';

export default class StatusAdd extends Component {

  constructor(props){
    super(props);
    this.state = {
      title:'',
      status:null
    }
    this.submit.bind(this);
  }

  componentWillMount(){
      this.ref = base.bindToState(`hd-statuses`, {
        context: this,
        state: 'status',
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
      title:this.state.title,
      id:(this.state.status.length>0?this.state.status[0].id+1:0)
    }
    base.post(`hd-statuses/`+data.id,{data});
    this.props.closeModal();
  }

  render() {
      return (
      <div style={{padding:10}}>
        <FormGroup bsSize="large" controlId="inputName">
        <label>Status name</label>
          <FormControl type="text"
            onChange={e => {
              this.setState({ title: e.target.value });
            }}
           value={this.state.title}/>
        </FormGroup>
          <Button onClick={this.submit.bind(this)} bsStyle="primary">Add</Button>
      </div>
    );
}}
