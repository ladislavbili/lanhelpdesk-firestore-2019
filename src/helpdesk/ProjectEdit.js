import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import base from '../firebase';

export default class StatusAdd extends Component {

  constructor(props){
    super(props);
    this.state = {
      title:'',
      project:null
    }
    this.submit.bind(this);
  }

  componentWillMount(){
    base.fetch('hd-projects/'+this.props.id, {
      context: this,
      state:'project',
      then:(project)=>{this.setState({title:project.title})}
    });
  }

  submit(){
    let data={
      title:this.state.title,
      id:this.props.id
    }
    base.update(`hd-projects/`+data.id,{data});
    this.props.closeModal();
  }

  render() {
    return (
      <div style={{padding:10}}>
        <FormGroup bsSize="large" controlId="inputName">
          <label>Project name</label>
          <FormControl type="text"
            onChange={e => {
              this.setState({ title: e.target.value });
            }}
            value={this.state.title}/>
        </FormGroup>
        <Button onClick={this.submit.bind(this)} bsStyle="success">Save</Button>
      </div>
    );
  }
}
