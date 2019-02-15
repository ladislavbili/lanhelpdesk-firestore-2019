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
    base.fetch('settings-companies/'+this.props.match.params.companyID, {
      context: this,
      state:'company',
      then:(company)=>{this.setState({title:company.companyName})}
    });
  }

  submit(){
    let data={
      companyName:this.state.title,
      id:this.props.match.params.companyID
    }
    base.update(`settings-companies/`+data.id,{data});
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
            <Button onClick={this.submit.bind(this)} bsStyle="success">Save</Button>

          </div>
        </div>
      </div>
    );
  }
}
