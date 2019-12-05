import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { connect } from "react-redux";
import { storageHelpMilestonesStart, storageHelpTasksStart, storageHelpStatusesStart} from '../../../redux/actions';
import {rebase} from '../../../index';

class MilestoneEdit extends Component{
  constructor(props){
    super(props);
		this.state={
      title: '',
			description: '',
			startsAt:null,
			endsAt:null,

      saving: false,
      opened: false
    }
  }

	storageLoaded(props){
		return props.milestonesLoaded &&
    props.tasksLoaded &&
    props.statusesLoaded
	}

  componentWillReceiveProps(props){
    if (this.props.item.id !== props.item.id || (this.storageLoaded(props) && !this.storageLoaded(this.props))){
			this.setData(props);
    }
  }

	componentWillMount(){

		if(!this.props.milestonesActive){
			this.props.storageHelpMilestonesStart();
		}
    if(!this.props.tasksActive){
			this.props.storageHelpTasksStart();
		}
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }
    this.setData(this.props);
	}

	setData(props){
		if(!this.storageLoaded(props)){
			return;
		}
		let milestone = props.milestones.find((milestone)=>milestone.id===props.item.id);
		this.setState({
			title: milestone.title,
			description: milestone.description,
			startsAt:milestone.startsAt!==null?moment(milestone.startsAt):null,
			endsAt:milestone.endsAt!==null?moment(milestone.endsAt):null,
		});

	}

  toggle(){
    if(!this.state.opened){
			this.setData(this.props);
    }
    this.setState({opened: !this.state.opened})
  }

	deleteMilestone(){
		let ID = this.props.item.id;
		if(window.confirm("Are you sure?")){
			rebase.removeDoc('/help-milestones/'+ID).then(()=>{
				this.toggle();
				this.props.setProject(null);
			});
		}
	}

  render(){
    return (
			<div>
				<Button
					className='btn-link sidebar-menu-item t-a-l'
					onClick={this.toggle.bind(this)}
					>
					<i className="fa fa-cog m-r-5 m-l-5 m-t-5 "/> Milestone settings
				</Button>
          <Modal isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
            <ModalBody>
              <FormGroup>
                <Label for="title">Milestone title</Label>
                <Input type="text" id="title" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              <FormGroup>
    						<Label htmlFor="description">Popis</Label>
    						<Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
    					</FormGroup>
            </ModalBody>

						<DatePicker
							selected={this.state.startsAt}
							onChange={date => {
								this.setState({ startsAt: date });
							}}
							locale="en-gb"
							placeholderText="No starting date"
							showTimeSelect
							className="form-control hidden-input"
							todayButton="Today"
							timeFormat="HH:mm"
							timeIntervals={15}
							dateFormat="HH:mm DD.MM.YYYY"
						/>

						<DatePicker
							selected={this.state.endsAt}
							onChange={date => {
								this.setState({ endsAt: date });
							}}
							locale="en-gb"
							placeholderText="No ending date"
							showTimeSelect
							className="form-control hidden-input"
							todayButton="Today"
							timeFormat="HH:mm"
							timeIntervals={15}
							dateFormat="HH:mm DD.MM.YYYY"
						/>

            <ModalFooter>
              <Button className="btn mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>

              <Button className="btn"
                disabled={this.state.saving||this.state.title===""}
                onClick={()=>{
                  this.setState({saving:true});
                  let body = {
                    title: this.state.title,
                    description: this.state.description,
										startsAt:this.state.startsAt!==null?this.state.startsAt.unix()*1000:null,
										endsAt:this.state.endsAt!==null?this.state.endsAt.unix()*1000:null,
										project:this.props.project
                  };
                  rebase.updateDoc(`/help-milestones/${this.props.item.id}`, body)
									.then(()=>{
                    if(body.startsAt){
                      let milestoneTasks = this.props.tasks.map((task)=>{return {...task,status:this.props.statuses.find((status)=>status.id===task.status)}}).filter((task)=>task.milestone === this.props.item.id && task.status.action==='pending');
                      milestoneTasks.map((task)=>rebase.updateDoc(`/help-tasks/${task.id}`, {pendingDate:body.startsAt}))
                    }
										this.setState({saving:false, opened: false})
										this.props.triggerChange();
										});
                }}>
                {this.state.saving?'Saving...':'Save milestone'}
              </Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}

const mapStateToProps = ({ storageHelpMilestones,storageHelpTasks, storageHelpStatuses, filterReducer }) => {
	const { milestonesActive, milestones, milestonesLoaded } = storageHelpMilestones;
	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
  const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { project } = filterReducer;
	return { milestonesActive, milestones, milestonesLoaded, tasksActive, tasks, tasksLoaded, statusesActive, statuses, statusesLoaded ,project };
};

export default connect(mapStateToProps, { storageHelpMilestonesStart, storageHelpTasksStart, storageHelpStatusesStart })(MilestoneEdit);
