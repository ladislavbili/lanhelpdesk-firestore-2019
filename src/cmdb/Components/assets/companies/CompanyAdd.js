import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class CompanyAdd extends React.Component {

  constructor(props){
    super(props);

      this.addCompany = this.addCompany.bind(this);
  }

  addCompany(){
    if (this.company.value.length < 1) return;
    const ID = Date.now();
    firebase.database()
            .ref(`settings-companies/${ID}`)
            .set({
              id: ID,
              companyName : this.company.value,
            });
  }

  render() {
    return (

        <div className='form'>
          <FormGroup controlId="formGoupInput">
            <ControlLabel>Company Name</ControlLabel>
            <FormControl  inputRef={(input) => this.company = input} type="text" placeholder="Enter Company Name"/>
          </FormGroup>

          <Link to={{pathname : '/cmdb/companies'}}>
            <Button type="submit" onClick={ this.addCompany.bind(this)} bsStyle='success' >+ Add Company</Button>
          </Link>
        </div>
        );
    }
}
