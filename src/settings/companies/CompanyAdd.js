import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import base from '../../firebase';

export default class StatusAdd extends Component {

  constructor(props){
    super(props);
    this.state = {
      title:'',
      company:null
    }
    this.submit.bind(this);
  }

  componentWillMount(){
      this.ref = base.bindToState(`settings-companies`, {
        context: this,
        state: 'company',
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
      companyName:this.state.title,
      id:(this.state.company.length>0?this.state.company[0].id+1:0)
    }
    base.post(`settings-companies/`+data.id,{data});
    this.props.history.goBack();
  }

  render() {
      return (
        <div className='content-page'>
          <div className="content">
            <div className="container-fluid">
              <FormGroup bsSize="large" controlId="inputName">
              <label><h2>Company name</h2></label>
                <FormControl type="text"
                  onChange={e => {
                    this.setState({ title: e.target.value });
                  }}
                 value={this.state.title}/>
              </FormGroup>
                <Button onClick={this.submit.bind(this)} bsStyle="primary">Add</Button>
          </div>
        </div>
      </div>
    );
}}
