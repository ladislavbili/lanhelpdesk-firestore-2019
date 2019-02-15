import React from "react";
import firebase from 'firebase';
import Select from 'react-select';
import Modal from 'react-responsive-modal';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const STATUS_OPTIONS = [
  {
    label:'NEW',
    value : 1
  }, {
    label:'In progress',
    value : 2
  }, {
    label:'Solved',
    value : 3
  }, {
    label:'On hold',
    value : 4
  }
];

export default class TasksAddModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      open: false,
      users : [],
      chosenSolves : null,
      chosenBy : null,
      chosenStatus : null
    }

    this.setModalOpen.bind(this);
    this.addTasks.bind(this);

    this.setAny.bind(this);


    const USERS = firebase.database().ref(`settings-users`);
    USERS.once('value')
          .then(snap =>
            {
              this.setState({
              users : snap.val(),
              });
            }
          );
  }

  setModalOpen = (open) => {
    this.setState({ open });
  };

  setAny(key, value){
    let newState={};
    newState[key]=value;
    this.setState(newState);
  }

  setAnyFromSelect(key, value){
    let newState={};
    newState[key]=value;
    this.setState(newState);
  }

  addTasks(){
    const ID = Date.now();
    firebase.database()
            .ref(`cmdb-tasks/${ID}`)
            .set({
              id : ID,
              title : this.title.value || "",
              description : this.description.value || "",
              status : (this.state.chosenStatus ? this.state.chosenStatus.label : ""),
              by : (this.state.chosenBy ? this.state.chosenBy.name : ""),
              solves : (this.state.chosenSolves ? this.state.chosenSolves.name : ""),
            });

    this.setModalOpen(false);
  }

  render() {

    const USERS_OPTIONS = Object.values(this.state.users).map(r => {
      let user = {
        name : r.username,
        value : r.id,
        label : r.username
      }
      return user
    });
    return (
      <div>
        <Button bsStyle='success' className='DataTableAddButton' onClick={() => this.setModalOpen(true)}>+ Add Task</Button>
        <Modal
          open={this.state.open}
          onClose={() => {}}
          center
          closeOnEsc
          closeOnOverlayClick
          >
          <h2>Information about Task</h2>

            <FormGroup controlId="formGoupInputTasks">
                <ControlLabel>Title</ControlLabel>
                <FormControl  inputRef={(input) => this.title = input} type="text" placeholder="Enter title"/>
            </FormGroup>

            <FormGroup controlId="formGoupInputIPAddress">
                <ControlLabel>Description</ControlLabel>
                <FormControl  inputRef={(input) => this.description = input} componentClass="textarea" placeholder='Enter task description' />
            </FormGroup>

            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Select status</ControlLabel>
                  <Select
                    options={STATUS_OPTIONS}
                    value={this.state.chosenStatus}
                    onChange={(value) => this.setAnyFromSelect('chosenStatus', value)}
                    />
            </FormGroup>

            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Made by</ControlLabel>
                  <Select
                    options={USERS_OPTIONS}
                    value={this.state.chosenBy}
                    onChange={(value) => this.setAnyFromSelect('chosenBy', value)}
                    />
            </FormGroup>

            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Solved by</ControlLabel>
                  <Select
                    options={USERS_OPTIONS}
                    value={this.state.chosenSolves}
                    onChange={(value) => this.setAnyFromSelect('chosenSolves', value)}
                    />
            </FormGroup>

            <Button bsStyle='success' onClick={this.addTasks.bind(this)}>+ Add Task</Button>

            <Button onClick={() => this.setModalOpen(false)}>Close</Button>

        </Modal>
      </div>
    );
  }

}
