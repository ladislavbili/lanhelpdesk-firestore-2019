import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class StatusAdd extends React.Component {

  constructor(props){
    super(props);
    this.addStatus.bind(this);
  }

  addStatus(){
    if (this.status.value.length < 1) return;
    const ID = Date.now();
    firebase.database()
            .ref(`cmdb-statuses/${ID}`)
            .set({
              id: ID,
              statusName : this.status.value,
            });
  }

  render() {
    return (

        <div className='form'>
          <FormGroup controlId="formGoupInput">
            <ControlLabel>Status Name</ControlLabel>
            <FormControl  inputRef={(input) => this.status = input} type="text" placeholder="Enter Status Name"/>
          </FormGroup>

          <Link to={{pathname : '/cmdb/statuses'}}>
            <Button type="submit" onClick={ this.addStatus.bind(this)} bsStyle='success' >+ Add Status</Button>
          </Link>
        </div>
        );
    }
}
