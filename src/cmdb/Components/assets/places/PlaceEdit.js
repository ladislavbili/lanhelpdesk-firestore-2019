import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class PlaceEdit extends React.Component {

  constructor(props){
    super(props);
      this.state = {
        room : null,
        street : null,
        city : null,
        state : null
      }
      this.editPlace.bind(this);
  }

  componentDidMount(){
    const SERVER_ID = this.props.match.params.id;
    const DB = firebase.database().ref(`cmdb-places/${SERVER_ID}`);
    DB.on('value', snap =>
        this.setState({
          id : snap.val().id,
          room : snap.val().room,
          street : snap.val().street,
          city : snap.val().city,
          state : snap.val().state,
        })
      );

  }

  editPlace(){
    firebase.database()
            .ref(`cmdb-places/${this.state.id}`)
            .update({
              room  : this.state.room,
              street  : this.state.street,
              city  : this.state.city,
              state  : this.state.state,
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
                  <FormControl type="text" placeholder='Enter room' value={this.state.room} onChange={(e) => this.setState({ room: e.target.value })}/>
                  </div>
                </div>

                <div className='form-group row'>
                  <ControlLabel className='col-2 col-form-label'>Street</ControlLabel>
                  <div className='col-10' >
              <FormControl type="text"placeholder='Enter street' value={this.state.street} onChange={(e) => this.setState({ street: e.target.value })}/>
              </div>
            </div>

            <div className='form-group row'>
              <ControlLabel className='col-2 col-form-label'>City</ControlLabel>
              <div className='col-10' >
              <FormControl type="text" placeholder='Enter city' value={this.state.city} onChange={(e) => this.setState({ city: e.target.value })}/>
              </div>
            </div>

            <div className='form-group row'>
              <ControlLabel className='col-2 col-form-label'>State</ControlLabel>
              <div className='col-10' >
              <FormControl type="text" placeholder='Enter state' value={this.state.state} onChange={(e) => this.setState({ state: e.target.value })}/>
              </div>
            </div>

            <Link to={{ pathname: '/cmdb/companies'}}>
              <Button type="submit" onClick={this.editPlace.bind(this)} bsStyle='warning'>Edit this company</Button>
            </Link>
          </div>
          </div>
          </div>
          </div>
        );
  }
}
