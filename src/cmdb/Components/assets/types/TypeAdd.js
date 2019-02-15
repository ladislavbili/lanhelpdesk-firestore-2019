import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class TypeAdd extends React.Component {

  constructor(props){
    super(props);
    this.addType.bind(this);
  }

  addType(){
    if (this.type.value.length < 1) return;
    const ID = Date.now();
    firebase.database()
            .ref(`cmdb-types/${ID}`)
            .set({
              id: ID,
              typeName : this.type.value,
            });
  }

  render() {
    return (
      <div className='content-page'>
        <div className="content">
          <div className="container-fluid">
            <div className='card-box'>

              <h4 class="page-title m-b-20">Server Edit</h4>

                <div className='form-group row'>
                  <ControlLabel className='col-3 col-form-label'>Type Name</ControlLabel>
                  <div className='col-9' >
                    <FormControl  inputRef={(input) => this.type = input} type="text" placeholder="Enter Type Name"/>
                  </div>
                </div>

                <Link to={{pathname : '/cmdb/types'}}>
                  <Button type="submit" onClick={ this.addType.bind(this)} bsStyle='success' >+ Add Type</Button>
                </Link>

              </div>
            </div>
          </div>
        </div>
        );
    }
}
