import React, { Component } from 'react';
import { rebase, database } from '../../index';
import { FormGroup, Label, Input } from 'reactstrap';
import { toSelArr, snapshotToArray } from '../../helperFunctions';
import Select from 'react-select';
import { selectStyle } from '../../scss/selectStyles';

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
      <div className="flex">
				<div className="container-fluid p-2">
				</div>
			</div>
    );
  }
}
