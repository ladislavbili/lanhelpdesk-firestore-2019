import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class CompanyEdit extends React.Component {

  constructor(props){
    super(props);
      this.state = {
        company : 0,
      }
      this.editCompany = this.editCompany.bind(this);
  }

  componentDidMount(){
    const SERVER_ID = this.props.match.params.id;
    const DB = firebase.database().ref(`settings-companies/${SERVER_ID}`);
    DB.on('value', snap =>
        this.setState({
          company : snap.val()
        })
      );

  }

  editCompany(){
    firebase.database()
            .ref(`settings-companies/${this.state.company.id}`)
            .update({
              companyName : this.company.value || this.state.company.companyName,
            });
  }


  render() {
    return (
          <div className='form'>
            <FormGroup controlId="formGoupInput">
              <ControlLabel>Server Name</ControlLabel>
              <FormControl  inputRef={(input) => this.company = input} type="text" placeholder={this.state.company.companyName}/>
            </FormGroup>

            <Link to={{ pathname: '/cmdb/companies'}}>
              <Button type="submit" onClick={this.editCompany.bind(this)} bsStyle='warning'>Edit this company</Button>
            </Link>
          </div>
        );
  }
}
