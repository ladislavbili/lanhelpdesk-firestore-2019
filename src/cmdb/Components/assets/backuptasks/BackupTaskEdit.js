import React from 'react';
import base from '../../../../firebase';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel, FormControl, Modal } from 'react-bootstrap';
import Select from 'react-select';

export default class PlaceEdit extends React.Component {

      constructor(props){
        super(props);
          this.state = {
            id : this.props.bt.id,
            serverID : this.props.bt.serverID,
            name : this.props.bt.name,
            status : this.props.bt.status,
            backupData : this.props.bt.backupData,
            backupDataLocation : this.props.bt.backupDataLocation,
            startOfBackup : this.props.bt.startOfBackup,
            backupRotation : this.props.bt.backupRotation,
            notification : this.props.bt.notification,
          }
          this.editBT.bind(this);
          this.removeBT.bind(this);
      }

        editBT(){
          let data={
            name : this.state.name,
            status : this.state.status,
            backupData : this.state.backupData,
            backupDataLocation : this.state.backupDataLocation,
            startOfBackup : this.state.startOfBackup,
            backupRotation : this.state.backupRotation,
            notification : this.state.notification,
          }
          base.update(`cmdb-backup-tasks/${this.state.id}`,{data});
        }

        removeBT(){
          if (window.confirm("Are you sure you want to delete this backup task?")) {
            base.remove(`cmdb-backup-tasks/${this.state.id}`);
          } else {
            return;
          }
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

                <Button bsStyle='warning' onClick={this.editBT.bind(this)}> Save changes </Button>
                <Button bsStyle='danger' onClick={this.removeBT.bind(this)}> Remove backup task</Button>
              </div>
              );
          }
}
