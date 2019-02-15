import React, { Component } from "react";
import firebase from 'firebase';
import AutoSuggest from 'react-bootstrap-autosuggest';
import Select from 'react-select';
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

export default class TasksEdit extends Component {

  constructor(props){
    super(props);
    this.state = {
      open: false,
      users : [],
      title: this.props.info.title,
      description: this.props.info.description,
      byName : this.props.info.by,
      solvesName : this.props.info.solves,
      status : this.props.info.status,
      chosenSolves : null,
      chosenBy : null,
      chosenStatus : null

    }

    this.setAny.bind(this);

    this.editTasks.bind(this);
    this.handleDelete.bind(this);

    const USERS = firebase.database().ref(`settings-users`);
    USERS.once('value')
          .then(snap =>
            {
              this.setState({
              users : {...snap.val()},
              });
            }
          );
  }

componentWillReceiveProps(props){
  if (props.info.id !== this.props.info.id){
    this.setState({
      title: props.info.title,
      description: props.info.description,
      byName : props.info.by,
      solvesName : props.info.solves,
      status : props.info.status,
    })
  }
}

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

  editTasks(){
    firebase.database()
            .ref(`cmdb-tasks/${this.props.info.id}`)
            .set({
              id : this.props.info.id,
              title : this.state.title,
              description : this.state.description,
              status : (this.state.chosenStatus ? this.state.chosenStatus.label : this.state.status),
              by : (this.state.chosenBy ? this.state.chosenBy.name : this.state.byName),
              solves : (this.state.chosenSolves ? this.state.chosenSolves.name : this.state.solvesName),
            });

      this.props.close();
  }

  handleDelete(){
    firebase.database()
            .ref(`cmdb-tasks/${this.props.info.id}`)
            .remove();
  }

  render() {
    if (this.props.info === null){
      return (<p className="taskEditNoTask">No task was chosen yet.</p>);
    }
    const USERS_OPTIONS = Object.values(this.state.users).map(r => {
      let user = {
        name : r.username,
        value : r.id,
        label : r.username
      }
      return user
    });
    return (

        <div >
          <div className="content">
            <div className="container-fluid">
              <div className='taskEdit'>
              <div className='card-box'>

                <h4 class="page-title m-b-20">Information about Task</h4>

                  <div className='form-group row'>
                    <ControlLabel className='col-2 col-form-label'>Title</ControlLabel>
                    <div className='col-10' >
                        <FormControl  inputRef={(input) => this.title = input} placeholder="Enter task's name" type="text" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })}/>
                        </div>
                      </div>

                      <div className='form-group row'>
                        <ControlLabel className='col-2 col-form-label'>Description</ControlLabel>
                        <div className='col-10' >
                        <FormControl  inputRef={(input) => this.description = input} componentClass="textarea" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} />
                        </div>
                      </div>

                      <div className='form-group row'>
                        <ControlLabel className='col-2 col-form-label'>Select status</ControlLabel>
                        <div className='col-10' >
                          <Select
                            options={STATUS_OPTIONS}
                            value={this.state.chosenStatus || STATUS_OPTIONS.filter(st =>
                              st.label === this.state.status
                            )}
                            onChange={(value) => this.setAnyFromSelect('chosenStatus', value)}
                            />
                        </div>
                      </div>

                      <div className='form-group row'>
                        <ControlLabel className='col-2 col-form-label'>Made by</ControlLabel>
                        <div className='col-10' >
                          <Select
                            options={USERS_OPTIONS}
                            value={this.state.chosenBy || USERS_OPTIONS.filter(st =>
                              st.name === this.state.byName
                            )}
                            onChange={(value) => this.setAnyFromSelect('chosenBy', value)}
                            />
                        </div>
                      </div>

                      <div className='form-group row'>
                        <ControlLabel className='col-2 col-form-label'>Solved by</ControlLabel>
                        <div className='col-10' >
                          <Select
                            options={USERS_OPTIONS}
                            value={this.state.chosenSolves || USERS_OPTIONS.filter(st =>
                              st.name === this.state.solvesName
                            )}
                            onChange={(value) => this.setAnyFromSelect('chosenSolves', value)}
                            />
                        </div>
                      </div>

                      <div className='form-group row'>
                        <div className="col-2.5">
                            <Button bsStyle='warning' bsSize='small' onClick={this.editTasks.bind(this)}>Edit Task</Button>
                        </div>
                          <div className="col-2">
                              <Button bsSize='small' bsStyle='danger' onClick={this.handleDelete.bind(this)}>Remove</Button>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

}
