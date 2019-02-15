import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class StatusEdit extends React.Component {

  constructor(props){
    super(props);
      this.state = {
        name : null,
        id : null,
      }
      this.editStatus.bind(this);
  }

  componentDidMount(){
    const ID = this.props.match.params.id;
    const DB = firebase.database().ref(`cmdb-statuses/${ID}`);
    DB.on('value', snap =>
        this.setState({
          id : snap.val().id,
          name : snap.val().name
        })
      );

  }

  editStatus(){
    firebase.database()
            .ref(`cmdb-statuses/${this.state.id}`)
            .update({
              statusName : this.state.statusName,
            });
  }


  render() {
    return (
          <div className='form'>
            <FormGroup controlId="formGoupInput">
              <ControlLabel>Status Name</ControlLabel>
              <FormControl type="text" placeholder='Enter name' value={this.state.statusName} onChange={(e) => this.setState({ statusName: e.target.value })}/>
            </FormGroup>

            <Link to={{ pathname: '/cmdb/statuses'}}>
              <Button type="submit" onClick={this.editStatus.bind(this)} bsStyle='warning'>Edit this status</Button>
            </Link>
          </div>
        );
  }
}
