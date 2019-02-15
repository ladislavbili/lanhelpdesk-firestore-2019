import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';


export default class Comments extends Component{
  
  render(){
    return (
      <div className='mainContainer'>
        <FormGroup controlId="textareaDescription">
          <ControlLabel><h2> Comments </h2></ControlLabel>
          <FormControl componentClass="textarea" placeholder='Add a comment' />
        </FormGroup>
      </div>
    );
  }
}
