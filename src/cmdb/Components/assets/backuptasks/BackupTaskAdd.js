import React from 'react';
import base from '../../../../firebase';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl, Modal } from 'react-bootstrap';
import Select from 'react-select';

export default class BackupTaskAdd extends React.Component {

    constructor(props){
      super(props);
        this.state = {
          serverID : this.props.serverID,
          name : "",
          status : "",
          backupData : "",
          backupDataLocation : "",
          startOfBackup : "",
          backupRotation : "",
          notification : "",
          lastBT : "",
        }
        this.addBT.bind(this);
    }

    componentDidMount(){
      this.ref = base.bindToState(`cmdb-backup-tasks`, {
        context: this,
        state: 'lastBT',
        asArray: true,
        queries: {
          orderByChild: 'id',
          limitToLast: 1
        }
      });
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    addBT(){
      console.log('aaaaaaaaa');
      firebase.database()
              .ref(`cmdb-backup-tasks/${this.state.lastBT.length>0?this.state.lastBT[0].id+1:0}`)
              .set({
                id: this.state.lastBT.length>0?this.state.lastBT[0].id+1:0,
                serverID : this.state.serverID,
                name : this.state.name,
                status : this.state.status,
                backupData : this.state.backupData,
                backupDataLocation : this.state.backupDataLocation,
                startOfBackup : this.state.startOfBackup,
                backupRotation : this.state.backupRotation,
                notification : this.state.notification,
              });
      this.props.closeModal();
    }


    render() {
      return (
         <div className='form'>
            <FormGroup controlId="inputName">
                <ControlLabel>Task Name</ControlLabel>
                <FormControl type="text" placeholder='Enter name' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })}/>
            </FormGroup>

            <FormGroup controlId="selectplace">
              <ControlLabel>Select status</ControlLabel>
                <Select
                  options={[
                    {value: 1, label: 'ON'},
                    {value: 2, label: 'OFF'},
                    {value: 3, label: 'TEST'}
                    ]}
                  value={this.state.status}
                  onChange={e => this.setState({ status: e })}
                  />
            </FormGroup>

            <FormGroup controlId="textareaDescription" >
              <ControlLabel>Backup Data</ControlLabel>
              <FormControl componentClass="textarea" placeholder='Enter backup data' value={this.state.backupData} onChange={(e) => this.setState({ backupData: e.target.value })} />
            </FormGroup>

            <FormGroup controlId="inputName">
                <ControlLabel>Backup Data Location</ControlLabel>
                <FormControl type="text" placeholder='Enter location of backup data' value={this.state.backupDataLocation} onChange={(e) => this.setState({ backupDataLocation: e.target.value })}/>
            </FormGroup>

            <FormGroup controlId="inputName">
                <ControlLabel>Backup start</ControlLabel>
                <FormControl type="text" placeholder='Enter time of backup start' value={this.state.startOfBackup} onChange={(e) => this.setState({ startOfBackup: e.target.value })}/>
            </FormGroup>

            <FormGroup controlId="inputName">
                <ControlLabel>Backup Rotation</ControlLabel>
                <FormControl type="text" placeholder='Enter name' value={this.state.backupRotation} onChange={(e) => this.setState({ backupRotation: e.target.value })}/>
            </FormGroup>

            <FormGroup controlId="textareaDescription" >
              <ControlLabel>Notifications</ControlLabel>
              <FormControl componentClass="textarea" placeholder='Enter backupData' value={this.state.notification} onChange={(e) => this.setState({ notification: e.target.value })} />
            </FormGroup>

            <Button bsStyle='success' onClick={this.addBT.bind(this)}> Submit </Button>
            <Button onClick={() => this.props.closeModal()}> Close </Button>
          </div>
          );
      }
}
