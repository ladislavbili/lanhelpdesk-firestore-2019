import React, { Component } from 'react';
import Select from 'react-select';
import { Modal, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';
import { connect } from "react-redux";
import {storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart, storageHelpProjectsStart, setProject, storageHelpTasksStart} from '../../../redux/actions';
import {rebase, database} from '../../../index';
import firebase from 'firebase';
import {toSelArr, sameStringForms, snapshotToArray,testing} from '../../../helperFunctions';
import {invisibleSelectStyle} from '../../../scss/selectStyles';
import Permissions from "./permissions";

const booleanSelects = [{value:false,label:'No'},{value:true,label:'Yes'}];

const noDef={
	status:{def:false, fixed:false, value: null, show: true },
	tags:{def:false, fixed:false, value: [], show: true },
	assignedTo:{def:false, fixed:false, value: [], show: true },
	type:{def:false, fixed:false, value: null, show: true },
	requester:{def:false, fixed:false, value: null, show: true },
	company:{def:false, fixed:false, value: null, show: true },
	pausal:{def:false, fixed:false, value: booleanSelects[0], show: true },
	overtime:{def:false, fixed:false, value: booleanSelects[0], show: true },
}

class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title: '',
      description: '',
      statuses:[],
      allTags:[],
      users:[],
      types:[],
      companies:[],
			permissions:[],

      ...noDef,
      saving: false,
			loaded: false,
      opened: false
    }
  }

	storageLoaded(props){
		return props.statusesLoaded &&
			props.tagsLoaded &&
			props.usersLoaded &&
			props.taskTypesLoaded &&
			props.companiesLoaded &&
			props.projectsLoaded &&
			props.tasksLoaded
	}

  componentWillReceiveProps(props){
    if (this.props.item.id !== props.item.id){
			this.setProjectsData(props);
    }

		if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
			this.setData(props);
			this.setProjectsData(props);
		}

		if(!sameStringForms(props.statuses,this.props.statuses) &&
			!sameStringForms(props.tags,this.props.tags) &&
			!sameStringForms(props.users,this.props.users) &&
			!sameStringForms(props.taskTypes,this.props.taskTypes) &&
			!sameStringForms(props.companies,this.props.companies) &&
			!sameStringForms(props.projects,this.props.projects) &&
			!sameStringForms(props.tasks,this.props.tasks)
		){
				this.setData(props);
			}
  }

	componentWillMount(){
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}

		if(!this.props.tagsActive){
			this.props.storageHelpTagsStart();
		}

		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}

		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}

		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}

		if(!this.props.tasksActive){
			this.props.storageHelpTasksStart();
		}

		if(!this.props.projectsActive){
			this.props.storageHelpProjectsStart();
		}
		this.setData(this.props);
		this.setProjectsData(this.props);
	}

	setProjectsData(props){
		if(!this.storageLoaded(props)){
			return;
		}

		let project = props.projects.find((project)=>project.id===props.item.id);
		let statuses = toSelArr(props.statuses);
		let allTags = toSelArr(props.tags);
		let users = toSelArr(props.users,'email');
		let types = toSelArr(props.taskTypes);
		let companies = toSelArr(props.companies);

		let status = statuses.find(item=> project.def && item.id===project.def.status.value);
		let tags = allTags.filter(item=> project.def && project.def.tags.value.includes(item.id));
		let assignedTo = users.filter(item=> project.def && project.def.assignedTo.value.includes(item.id));
		let type = types.find(item=> project.def && item.id===project.def.type.value);
		let requester = users.find(item=> project.def && item.id===project.def.requester.value);
		let company = companies.find(item=> project.def && item.id===project.def.company.value);
		let pausal = booleanSelects.find(item=> project.def && project.def.pausal && item.value===project.def.pausal.value);
		let overtime = booleanSelects.find(item=> project.def && project.def.overtime && item.value===project.def.overtime.value);
		let permissions = project.permissions?project.permissions:[];
		permissions = permissions.map((permission)=>{
			return {
				...permission,
				user:users.find((user)=>user.id===permission.user)
			}
		})
		let def = project.def;

		this.setState({
			title:project.title,
			description:project.description?project.description:'',
			permissions,

			status:status?				{...def.status,value:status}					:{def:false, fixed:false, value: null, show:true },
			tags:def?							{...def.tags,value:tags}							:{def:false, fixed:false, value: [], show:true },
			assignedTo:def?				{...def.assignedTo,value:assignedTo}	:{def:false, fixed:false, value: [], show:true },
			type:type?						{...def.type,value:type}							:{def:false, fixed:false, value: null, show:true },
			requester:requester?	{...def.requester,value:requester}		:{def:false, fixed:false, value: null, show:true },
			company:company?			{...def.company,value:company}				:{def:false, fixed:false, value: null, show:true },
			pausal:pausal?				{...def.pausal,value:pausal}					:{def:false, fixed:false, value: booleanSelects[0], show: true },
			overtime:overtime?		{...def.overtime,value:overtime}			:{def:false, fixed:false, value: booleanSelects[0], show: true },
		});
	}

	setData(props){
		if(!this.storageLoaded(props)){
			return;
		}

		this.setState({
      statuses:toSelArr(props.statuses),
      allTags: toSelArr(props.tags),
      users: toSelArr(props.users,'email'),
      types: toSelArr(props.taskTypes),
      companies: toSelArr(props.companies),
    });
	}

  toggle(){
    if(!this.state.opened){
			this.setProjectsData(this.props);
    }
    this.setState({opened: !this.state.opened})
  }

	deleteProject(){
		let projectID = this.props.item.id;
		if(window.confirm("Are you sure?")){
			this.props.tasks.filter((task)=>task.project===projectID).map((task)=>this.deleteTask(task));
			rebase.removeDoc('/help-projects/'+projectID).then(()=>{
				this.toggle();
				this.props.setProject(null);
			});
		}
	}

	deleteTask(task){
		let taskID = task.id;
		Promise.all(
			[
				database.collection('help-task_materials').where("task", "==", taskID).get(),
				database.collection('help-task_works').where("task", "==", taskID).get(),
				database.collection('help-repeats').doc(taskID).get(),
				database.collection('help-comments').where("task", "==", taskID).get()
		]).then(([taskMaterials, taskWorks,repeat,comments])=>{

			let storageRef = firebase.storage().ref();
			task.attachments.map((attachment)=>storageRef.child(attachment.path).delete());

			rebase.removeDoc('/help-tasks/'+taskID);
			snapshotToArray(taskMaterials).forEach((material)=>rebase.removeDoc('/help-task_materials/'+material.id))
			snapshotToArray(taskWorks).forEach((work)=>rebase.removeDoc('/help-task_works/'+work.id))
			if(repeat.exists){
				rebase.removeDoc('/help-repeats/'+taskID);
			}
			snapshotToArray(comments).forEach((item)=>rebase.removeDoc('/help-comments/'+item.id));
			database.collection('help-calendar_events').where("taskID", "==", taskID).get()
			.then((data)=>{
				snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-calendar_events/'+item.id));
			});
		});
	}

  render(){
		let canReadUserIDs = this.state.permissions.map((permission)=>permission.user.id);
		let canBeAssigned = this.state.users.filter((user)=>canReadUserIDs.includes(user.id));

    return (
      <div className='p-l-15 p-r-15'>
				<hr className='m-t-10 m-b-10'/>
	        <Button
	          className='btn-link p-0'
	          onClick={this.toggle.bind(this)}
	          >
	          Project settings
	        </Button>
        <Modal isOpen={this.state.opened} size="width-1000" toggle={this.toggle.bind(this)} >
            <ModalBody>
							<h2  className='m-t-20'>Project edit</h2>
							<hr className='m-t-10 m-b-10' />
              <FormGroup>
                <Label>Project name</Label>
                <Input type="text" className="from-control" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="body">Popis</Label>
                <Input type="textarea" className="form-control" id="body" placeholder="Zadajte text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
              </FormGroup>

              <Permissions
								addUser={(user)=>{
									this.setState({
										permissions:[...this.state.permissions,{user,read:true,write:false,delete:false,internal:false,isAdmin:false}]
									})
								}}
								givePermission={(user,permission)=>{
									let permissions=[...this.state.permissions];
									let index = permissions.findIndex((permission)=>permission.user.id===user.id);
									let item = permissions[index];
									item.read=permission.read;
									item.write=permission.write;
									item.delete=permission.delete;
									item.internal=permission.internal;
									item.isAdmin=permission.isAdmin;
									if(!item.read){
										permissions.splice(index,1);
										this.setState({permissions,assignedTo:{...this.state.assignedTo,value:this.state.assignedTo.value.filter((user)=>user.id!==item.user.id)}});
									}else{
										this.setState({permissions});
									}
								}}
								permissions={this.state.permissions}
								userID={this.props.currentUser.id}
								isAdmin={this.props.currentUser.userData.role.value===3||testing}
								/>
							{/*TO DELETE*/}

              <h3 className="m-t-20"> Default values </h3>

                <table className="table">
                  <thead>
                    <tr>
                      <th ></th>
                      <th width="10">Def.</th>
                      <th width="10">Fixed</th>
                      <th width="10">Show</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Status</label>
                          <div className="col-9">
                            <Select
                              value={this.state.status.value}
                              onChange={(status)=>this.setState({status:{...this.state.status,value:status}})}
                              options={this.state.statuses}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.status.def} onChange={(e)=>this.setState({status:{...this.state.status,def:!this.state.status.def}})} disabled={this.state.status.fixed || !this.state.status.show} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.status.fixed} onChange={(e)=>this.setState({status:{...this.state.status,fixed:!this.state.status.fixed, def: !this.state.status.fixed ? true : this.state.status.def }})} disabled={!this.state.status.show} />
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.status.show} onChange={(e)=>this.setState({status:{...this.state.status, show:!this.state.status.show, def: true, fixed: true }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Tags</label>
                          <div className="col-9">
                            <Select
                              isMulti
                              value={this.state.tags.value}
                              onChange={(tags)=>this.setState({tags:{...this.state.tags,value:tags}})}
                              options={this.state.allTags}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.tags.def} onChange={(e)=>this.setState({tags:{...this.state.tags,def:!this.state.tags.def}})} disabled={this.state.tags.fixed} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.tags.fixed} onChange={(e)=>this.setState({tags:{...this.state.tags,fixed:!this.state.tags.fixed, def: !this.state.tags.fixed ? true : this.state.tags.def }})} />
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.tags.show} onChange={(e)=>this.setState({tags:{...this.state.tags, show:!this.state.tags.show }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Assigned</label>
                          <div className="col-9">
                            <Select
                              isMulti
                              value={this.state.assignedTo.value}
                              onChange={(assignedTo)=>this.setState({assignedTo:{...this.state.assignedTo,value:assignedTo}})}
                              options={canBeAssigned}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.assignedTo.def} onChange={(e)=>this.setState({assignedTo:{...this.state.assignedTo,def:!this.state.assignedTo.def}})} disabled={this.state.assignedTo.fixed || !this.state.assignedTo.show} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.assignedTo.fixed} onChange={(e)=>this.setState({assignedTo:{...this.state.assignedTo,fixed:!this.state.assignedTo.fixed, def: !this.state.assignedTo.fixed ? true : this.state.assignedTo.def }})} disabled={!this.state.assignedTo.show} />
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.assignedTo.show} onChange={(e)=>this.setState({assignedTo:{...this.state.assignedTo, show:!this.state.assignedTo.show, def:true, fixed:true }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Type</label>
                          <div className="col-9">
                            <Select
                              value={this.state.type.value}
                              onChange={(type)=>this.setState({type:{...this.state.type,value:type}})}
                              options={this.state.types}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.type.def} onChange={(e)=>this.setState({type:{...this.state.type,def:!this.state.type.def}})} disabled={this.state.type.fixed || !this.state.type.show } />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.type.fixed} onChange={(e)=>this.setState({type:{...this.state.type,fixed:!this.state.type.fixed, def: !this.state.type.fixed ? true : this.state.type.def }})} disabled={ !this.state.type.show } />
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.type.show} onChange={(e)=>this.setState({type:{...this.state.type, show:!this.state.type.show, def:true, fixed:true }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Requester</label>
                          <div className="col-9">
                            <Select
                              value={this.state.requester.value}
                              onChange={(requester)=>this.setState({requester:{...this.state.requester,value:requester}})}
                              options={this.state.users}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.requester.def} onChange={(e)=>this.setState({requester:{...this.state.requester,def:!this.state.requester.def}})} disabled={this.state.requester.fixed} />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.requester.fixed} onChange={(e)=>this.setState({requester:{...this.state.requester,fixed:!this.state.requester.fixed, def: !this.state.requester.fixed ? true : this.state.requester.def }})} />
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.requester.show} onChange={(e)=>this.setState({requester:{...this.state.requester, show:!this.state.requester.show }})} />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="row">
                          <label className="col-3 col-form-label">Company</label>
                          <div className="col-9">
                            <Select
                              value={this.state.company.value}
                              onChange={(company)=>this.setState({company:{...this.state.company,value:company}})}
                              options={this.state.companies}
                              styles={invisibleSelectStyle}
                              />
                          </div>
                        </div>
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.company.def} onChange={(e)=>this.setState({company:{...this.state.company,def:!this.state.company.def}})} disabled={this.state.company.fixed || !this.state.company.show } />
                      </td>
                      <td>
                        <input type="checkbox" checked={this.state.company.fixed} onChange={(e)=>this.setState({company:{...this.state.company,fixed:!this.state.company.fixed, def: !this.state.company.fixed ? true : this.state.company.def }})} disabled={ !this.state.company.show } />
                      </td>
											<td>
                        <input type="checkbox" checked={this.state.company.show} onChange={(e)=>this.setState({company:{...this.state.company, show:!this.state.company.show, def:true, fixed:true }})} />
                      </td>
                    </tr>

										<tr>
											<td>
												<div className="row">
													<label className="col-3 col-form-label">Pausal</label>
													<div className="col-9">
														<Select
															value={this.state.pausal.value}
															onChange={(pausal)=>this.setState({pausal:{...this.state.pausal,value:pausal}})}
															options={booleanSelects}
															styles={invisibleSelectStyle}
															/>
													</div>
												</div>
											</td>
											<td>
												<input type="checkbox" checked={this.state.pausal.def} onChange={(e)=>this.setState({pausal:{...this.state.pausal,def:!this.state.pausal.def}})} disabled={this.state.pausal.fixed || !this.state.pausal.show} />
											</td>
											<td>
												<input type="checkbox" checked={this.state.pausal.fixed} onChange={(e)=>this.setState({pausal:{...this.state.pausal,fixed:!this.state.pausal.fixed, def: !this.state.pausal.fixed ? true : this.state.pausal.def }})} disabled={!this.state.pausal.show} />
											</td>
											<td>
												<input type="checkbox" checked={this.state.pausal.show} onChange={(e)=>this.setState({pausal:{...this.state.pausal, show:!this.state.pausal.show, def:true, fixed:true }})} />
											</td>
										</tr>

										<tr>
											<td>
												<div className="row">
													<label className="col-3 col-form-label">Mimo pracovných hodín</label>
													<div className="col-9">
														<Select
															value={this.state.overtime.value}
															onChange={(overtime)=>this.setState({overtime:{...this.state.overtime,value:overtime}})}
															options={booleanSelects}
															styles={invisibleSelectStyle}
															/>
													</div>
												</div>
											</td>
											<td>
												<input type="checkbox" checked={this.state.overtime.def} onChange={(e)=>this.setState({overtime:{...this.state.overtime,def:!this.state.overtime.def}})} disabled={this.state.overtime.fixed || !this.state.overtime.show} />
											</td>
											<td>
												<input type="checkbox" checked={this.state.overtime.fixed} onChange={(e)=>this.setState({overtime:{...this.state.overtime,fixed:!this.state.overtime.fixed, def: !this.state.overtime.fixed ? true : this.state.overtime.def }})} disabled={!this.state.overtime.show} />
											</td>
											<td>
												<input type="checkbox" checked={this.state.overtime.show} onChange={(e)=>this.setState({overtime:{...this.state.overtime, show:!this.state.overtime.show, def:true, fixed:true }})} />
											</td>
										</tr>

                  </tbody>
                </table>

								{((this.state.company.value===null&&this.state.company.fixed)||(this.state.status.value===null&&this.state.status.fixed)||(this.state.assignedTo.value.length===0 && this.state.assignedTo.fixed)||(this.state.type.value===null&&this.state.type.fixed)) && <div className="red" style={{color:'red'}}>
                  Status, assigned to, task type and company can't be empty if they are fixed!
                </div>}
              </ModalBody>
              <ModalFooter>
              <Button className="btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>
							<Button className="btn-danger" disabled={this.state.saving} onClick={this.deleteProject.bind(this)}>
								Delete
							</Button>
              <Button
                className="ml-auto btn"
								disabled={this.state.saving||this.state.title===""||(this.state.company.value===null&&this.state.company.fixed)||(this.state.status.value===null&&this.state.status.fixed)||(this.state.assignedTo.value.length===0 && this.state.assignedTo.fixed)||(this.state.type.value===null&&this.state.type.fixed)}
                onClick={()=>{
                  this.setState({saving:true});
                  let body = {
                    title: this.state.title,
                    description: this.state.description,
                    def:{
                      status:this.state.status.value?{...this.state.status,value:this.state.status.value.id}:{def:false,fixed:false, value: null, show:true },
                      tags:this.state.tags.value?{...this.state.tags,value:this.state.tags.value.map(item=>item.id)}:{def:false,fixed:false, value: [], show:true },
                      assignedTo:this.state.assignedTo.value?{...this.state.assignedTo,value:this.state.assignedTo.value.map(item=>item.id)}:{def:false,fixed:false, value: [], show:true },
                      type:this.state.type.value?{...this.state.type,value:this.state.type.value.id}:{def:false,fixed:false, value: null, show:true },
                      requester:this.state.requester.value?{...this.state.requester,value:this.state.requester.value.id}:{def:false,fixed:false, value: null, show:true },
                      company:this.state.company.value?{...this.state.company,value:this.state.company.value.id}:{def:false,fixed:false, value: null, show:true },
											pausal:this.state.pausal.value?{...this.state.pausal,value:this.state.pausal.value.value}:{def:false,fixed:false, value: false, show:true},
											overtime:this.state.overtime.value?{...this.state.overtime,value:this.state.overtime.value.value}:{def:false,fixed:false, value: false, show:true},
                    },
										permissions:this.state.permissions.map((permission)=>{
											return {
												...permission,
												user:permission.user.id,
												internal: permission.internal === undefined ? false : permission.internal,
											}
										})
                  };
                  rebase.updateDoc(`/help-projects/${this.props.item.id}`, body)
                        .then(()=>{
													this.setState({saving:false, opened: false});
													this.props.triggerChange();
											});
              }}>
                {(this.state.saving?'Saving...':'Save project')}
              </Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}

const mapStateToProps = ({ storageHelpStatuses, storageHelpTags, storageUsers, storageHelpTaskTypes, storageCompanies, storageHelpProjects, storageHelpTasks,userReducer }) => {
	const { statusesActive, statuses, statusesLoaded } = storageHelpStatuses;
	const { tagsActive, tags, tagsLoaded } = storageHelpTags;
	const { usersActive, users, usersLoaded } = storageUsers;
	const { taskTypesActive, taskTypes, taskTypesLoaded } = storageHelpTaskTypes;
	const { companiesActive, companies, companiesLoaded } = storageCompanies;
	const { projectsActive, projects, projectsLoaded } = storageHelpProjects;
	const { tasksActive, tasks, tasksLoaded } = storageHelpTasks;
	return {
		currentUser:userReducer,
		statusesActive, statuses, statusesLoaded,
		tagsActive, tags, tagsLoaded,
		usersActive, users, usersLoaded,
		taskTypesActive, taskTypes, taskTypesLoaded,
		companiesActive, companies, companiesLoaded,
		projectsActive, projects, projectsLoaded,
		tasksActive, tasks, tasksLoaded,
	 };
};

export default connect(mapStateToProps, { storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart, storageHelpProjectsStart, setProject, storageHelpTasksStart })(ProjectEdit);
