import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class PlaceAdd extends React.Component {

  constructor(props){
    super(props);

    this.addPlace.bind(this);
  }

  addPlace(){
    if (this.room.length < 1 && this.street.length < 1 && this.city.length < 1 && this.stateX.length < 1) return;
    const ID = Date.now();
    firebase.database()
            .ref(`cmdb-places/${ID}`)
            .set({
              id: ID,
               room  : this.room.value,
               street : this.street.value,
               city : this.city.value,
               state : this.stateX.value,
            });
  }

  render() {
    return (

      <div className='content-page'>
        <div className="content">
          <div className="container-fluid">
            <div className='card-box'>

              <h4 class="page-title m-b-20">Place Edit</h4>
          <div className='form-group row'>
            <ControlLabel className='col-2 col-form-label'>Room</ControlLabel>
            <div className='col-10' >
            <FormControl  inputRef={(input) => this.room = input} type="text" placeholder="Enter Place room"/>
            </div>
          </div>

          <div className='form-group row'>
            <ControlLabel className='col-2 col-form-label'>Street</ControlLabel>
            <div className='col-10' >
            <FormControl  inputRef={(input) => this.street = input} type="text" placeholder="Enter Place street"/>
            </div>
          </div>

          <div className='form-group row'>
            <ControlLabel className='col-2 col-form-label'>City</ControlLabel>
            <div className='col-10' >
            <FormControl  inputRef={(input) => this.city = input} type="text" placeholder="Enter Place city"/>
            </div>
          </div>

          <div className='form-group row'>
            <ControlLabel className='col-2 col-form-label'>State</ControlLabel>
            <div className='col-10' >
            <FormControl  inputRef={(input) => this.stateX = input} type="text" placeholder="Enter Place state"/>
            </div>
          </div>

          <Link to={{pathname : '/cmdb/places'}}>
            <Button type="submit" onClick={ this.addPlace.bind(this)} bsStyle='success' >+ Add Place</Button>
          </Link>
        </div>
          </div>
            </div>
              </div>
        );
    }
}
