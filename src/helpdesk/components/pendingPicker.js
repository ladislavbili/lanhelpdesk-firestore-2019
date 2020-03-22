import React, { Component } from 'react';
import Select from 'react-select';
import { Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import DatePicker from 'react-datepicker';
import {invisibleSelectStyleNoArrow} from '../../scss/selectStyles';
import Checkbox from '../../components/checkbox';
import datePickerConfig from '../../scss/datePickerConfig';
import moment from 'moment';

export default class PendingPicker extends Component{
  constructor(props){
    super(props);
    this.state={
      pendingDate:null,
      milestoneActive:false,
      milestone:null,
    }
  }

  componentWillReceiveProps(props){
    if(!this.props.open&&props.open){
      this.setState({
        pendingDate: props.pendingDate || (moment()).add(1,'day'),
        milestone: props.milestones.some((milestone)=>props.prefferedMilestone && milestone.id===props.prefferedMilestone.id)?props.prefferedMilestone:null,
        milestoneActive: props.milestones.some((milestone)=>props.prefferedMilestone && milestone.id===props.prefferedMilestone.id)
      })
    }
	}

  render(){
    return (
        <Modal isOpen={this.props.open} >
            <ModalHeader>
              Edit company
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Pending until</Label>
                <DatePicker
                  selected={this.state.pendingDate}
                  disabled={this.state.milestoneActive}
                  onChange={date => {
                    this.setState({ pendingDate: date });
                  }}
                  placeholderText="No pending date"
                  {...datePickerConfig}
                />
              </FormGroup>

              <Checkbox
                className = "m-l-5 m-r-5"
                label = "From milestone"
                value = { this.state.milestoneActive }
                onChange={(e)=>this.setState({milestoneActive:!this.state.milestoneActive })}
                />

              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Milestone</Label>
                <div className="col-9">
                  <Select
                    placeholder="Vyberte milestone"
                    value={this.state.milestone}
                    isDisabled={!this.state.milestoneActive}
                    onChange={(milestone)=> {
                      this.setState({milestone});
                    }}
                    options={this.props.milestones}
                    styles={invisibleSelectStyleNoArrow}
                    />
                </div>
              </div>

              </ModalBody>
              <ModalFooter>
              <Button className="mr-auto btn-link" onClick={this.props.closeModal}>
                Close
              </Button>


              <Button
                className="btn"
                disabled={this.state.milestoneActive?(this.state.milestone===null):(this.state.pendingDate===null)}
                onClick={()=>{
                  this.props.savePending({...this.state})
                }}>Save pending</Button>
            </ModalFooter>
          </Modal>
    );
  }
}
