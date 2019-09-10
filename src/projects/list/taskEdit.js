import React, { Component } from 'react';
import { rebase, database } from '../../index';
import { FormGroup, Label, Input } from 'reactstrap';
import { toSelArr, snapshotToArray } from '../../helperFunctions';
import Select from 'react-select';
import { taskEditModalSelectStyle } from '../../scss/selectStyles';
import Subtasks from './newDesign/subtasks';
import Comments from './newDesign/comments';
import Attachements from './newDesign/attachements';

const statuses = [{ id: 0, title: 'New', color: '#1087e2' }, { id: 1, title: 'Open', color: '#155724' }, { id: 2, title: 'Pending', color: '#f3ba0d' }, { id: 3, title: 'Closed', color: '#e2e3e5' }]


export default class TaskEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      project: null,
      hours: 0,
      assignedBy: null,
      assignedTo: null,
      deadline: '',
      description: '',
      status: 0,
      tags: [],
      attachements: [],

      saving: false,
      loading: true,
      projects: [],
      allTags: [],
      users: []
    }
    this.submitTask.bind(this);
    this.canSave.bind(this);
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData(this.props.id);
  }

  getData(id) {
    Promise.all([
      rebase.get('proj-tasks/' + id, {
        context: this,
      }),
      database.collection('proj-projects').get(),
      database.collection('users').get(),
      database.collection('proj-tags').get(),
    ])
      .then(([task, projects, users, tags]) => {
        this.setData(task, toSelArr(snapshotToArray(projects)), toSelArr(snapshotToArray(users), 'email'), toSelArr(snapshotToArray(tags)), id);
      });
  }

  setData(task, projects, users, allTags, id) {
    let project = projects.find((item) => item.id === task.project);
    if (project === undefined) {
      project = null;
    }
    let assignedBy = users.find((item) => item.id === task.assignedBy);
    if (assignedBy === undefined) {
      assignedBy = null;
    }
    let assignedTo = users.find((item) => item.id === task.assignedTo);
    if (assignedTo === undefined) {
      assignedTo = null;
    }

    let tags = allTags.filter((item) => (task.tags !== undefined ? task.tags : []).includes(item.id));
    this.setState({
      title: task.title,
      project,
      hours: task.hours ? task.hours : 0,
      assignedBy,
      assignedTo,
      deadline: task.deadline ? new Date(task.deadline).toISOString().replace('Z', '') : '',
      description: task.description ? task.description : '',
      status: task.status,
      attachements: task.attachements ? task.attachements : [],
      tags,

      loading: false,
      users,
      projects,
      allTags
    });
  }

  canSave() {
    return this.state.title !== '' && this.state.project !== null && !this.state.loading
  }

  submitTask() {
    if (!this.canSave()) {
      return;
    }
    this.setState({ saving: true });
    let body = {
      title: this.state.title,
      project: this.state.project.id,
      hours: this.state.hours,
      assignedBy: this.state.assignedBy ? this.state.assignedBy.id : null,
      assignedTo: this.state.assignedTo ? this.state.assignedTo.id : null,
      deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : (new Date(this.state.deadline).getTime()),
      tags: this.state.tags.map((item) => item.id),
      description: this.state.description,
      status: this.state.status,
      attachements: this.state.attachements,
    }

    rebase.updateDoc('/proj-tasks/' + this.props.id, body).then(() => this.setState({ saving: false }));
  }

  render() {
    return (
      <div className="task-edit-modal-projects">
        {/*TOOLBAR*/}

          <div>
            <Label className="label m-r-5 center-hor center-ver pull-right"
              style={{ marginRight: "80px", marginTop: "-24px", paddingTop: "30px", color: "white", height: "60px", width: "100px", fontSize: "20px", fontWeight: "500", backgroundColor: statuses.find((item) => item.id === this.state.status).color }}
              >
              {statuses.find((item) => item.id === this.state.status).title}
            </Label>
          </div>

        <div className="row m-b-10" style={{marginLeft: "80px"}}>

          <div style={{border: "2px solid #578FFB", borderRadius: "5px", marginRight: "5px"}}>
            <button type="button"
              className="btn-link"
              style={{padding: "0px 25px", fontSize: "20px", fontWeight: "500", color: "#578FFB"}}
              onClick={() => { this.setState({ status: 1 }, this.submitTask.bind(this)) }}
            > OPEN
              </button>
          </div>

          <div style={{border: "2px solid #578FFB", borderRadius: "5px", marginRight: "5px"}}>
            <button type="button" className="btn-link"
              style={{padding: "0px 25px", fontSize: "20px", fontWeight: "500", color: "#578FFB"}}
              onClick={() => { this.setState({ status: 2 }, this.submitTask.bind(this)) }}
            > PENDING
              </button>
          </div>

          <div style={{border: "2px solid #578FFB", borderRadius: "5px", marginRight: "5px"}}>
            <button type="button" className="btn-link"
            style={{padding: "0px 25px", fontSize: "20px", fontWeight: "500", color: "#578FFB"}}
              onClick={() => { this.setState({ status: 3 }, this.submitTask.bind(this)) }}
            > CLOSED
              </button>
          </div>

          {
            this.state.saving &&
            <div style={{border: "2px solid #578FFB", borderRadius: "5px", marginRight: "5px"}}>
              <button type="button" className="btn-link"
              style={{padding: "0px 25px", fontSize: "20px", fontWeight: "500", color: "#578FFB"}}>
                Saving
                </button>
            </div>
          }

        {false &&  <div style={{border: "2px solid #578FFB", borderRadius: "5px", marginRight: "5px"}}>
            <button type="button" className="btn-link"
            style={{padding: "0px 25px", fontSize: "20px", fontWeight: "500", color: "#578FFB"}}
              onClick={() => {
                if (window.confirm('Are you sure?')) {
                  rebase.removeDoc('/proj-tasks/' + this.props.id).then(() => {
                    this.props.toggle ? this.props.toggle() : this.props.history.goBack();
                  });
                }
              }}
            >
              Delete
            </button>
          </div>}
        </div>

        {/*MAIN*/}
        <div>
          <FormGroup className="row" style={{marginLeft: "80px"}}>
            <p className="task-title-input" style={{paddingTop:9, color: "black"}}># 100</p>
            <div className="">
              <Input type="text" placeholder="Task name"
                style={{color: "black"}} className="task-title-input text-extra-slim hidden-input m-0" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value }, this.submitTask.bind(this))} />
            </div>
          </FormGroup>



          <FormGroup className="row m-b-5" style={{marginLeft: "80px", marginTop: "30px"}}>
            <Label className="w-100px">Tags</Label>
            <div className="w-40">
              <Select
                styles={taskEditModalSelectStyle}
                options={this.state.allTags}
                value={this.state.tags}
                onChange={(tags) => this.setState({ tags }, this.submitTask.bind(this))}
                isMulti
              />
            </div>
          </FormGroup>

            <FormGroup className="row m-b-5" style={{marginLeft: "80px"}}>
              <Label className="w-100px">Project</Label>
              <div className="w-40">
                <Select
                  styles={taskEditModalSelectStyle}
                  options={this.state.projects}
                  value={this.state.project}
                  onChange={e => { this.setState({ project: e }, this.submitTask.bind(this)); }}
                />
              </div>
            </FormGroup>

            <FormGroup className="row m-b-5" style={{marginLeft: "80px"}}>
              <Label className="w-100px">Task type</Label>
              <div className="w-40">
                <Select
                  styles={taskEditModalSelectStyle}
                  options={this.state.users}
                  value={this.state.assignedBy}
                  onChange={e => { this.setState({ assignedBy: e }, this.submitTask.bind(this)); }}
                />
            </div>
            </FormGroup>

            <FormGroup className="row m-b-5"style={{marginLeft: "80px"}}>
              <Label className="w-100px">Requester</Label>
              <div className="w-40">
              <Select
                styles={taskEditModalSelectStyle}
                options={this.state.users}
                value={this.state.assignedBy}
                onChange={e => { this.setState({ assignedBy: e }, this.submitTask.bind(this)); }}
              />
            </div>
            </FormGroup>

          <FormGroup className="row m-b-5" style={{marginLeft: "80px"}}>
            <Label className="w-100px">Assigned to</Label>
            <div className="w-40">
              <Select
                styles={taskEditModalSelectStyle}
                options={this.state.users}
                value={this.state.assignedTo}
                onChange={e => { this.setState({ assignedTo: e }, this.submitTask.bind(this)); }}
              />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-5" style={{marginLeft: "80px"}}>
            <Label className="w-100px">Deadline</Label>
            <div className="w-40">
              <Input style={{borderRadius: "3px"}} type="datetime-local" placeholder="Enter deadline" value={this.state.deadline} onChange={(e) => this.setState({ deadline: e.target.value }, this.submitTask.bind(this))} />
            </div>
          </FormGroup>

          <FormGroup className="row m-b-5" style={{marginLeft: "80px"}}>
            <Label className="w-100px">Hours</Label>
            <div className="w-40">
              <Input style={{borderRadius: "3px"}} type="number" placeholder="Enter hours" value={this.state.hours} onChange={(e) => this.setState({ hours: e.target.value }, this.submitTask.bind(this))} />
            </div>
          </FormGroup>

          <FormGroup style={{marginLeft: "80px", marginRight: "80px"}}>
            <Label className="">Description</Label>
            <div>
            <Input type="textarea" placeholder="Description" style={{fontWeight: 400, borderRadius: "3px"}} value={this.state.description} onChange={(e) => this.setState({ description: e.target.value }, this.submitTask.bind(this))} />
            </div>
        </FormGroup>

        <div  style={{marginLeft: "80px", marginRight: "80px"}}>
          <Subtasks id={this.props.id} />
        </div>
        <div  style={{marginLeft: "80px", marginRight: "80px"}}>
          <Attachements id={this.props.id} attachements={this.state.attachements} onChange={(attachements) => this.setState({ attachements }, this.submitTask.bind(this))} />
        </div>
        <div>
          <Comments id={this.props.id} users={this.state.users} />
        </div>

        </div>
      </div>
    );
  }
}
