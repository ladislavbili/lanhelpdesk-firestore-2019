import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from "react-redux";
import {invisibleSelectStyle} from '../../../scss/selectStyles';
import {storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart} from '../../../redux/actions';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {toSelArr, sameStringForms, testing} from '../../../helperFunctions';
import {rebase} from '../../../index';
import Permissions from "../../components/projects/permissions";

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

class ProjectAdd extends Component{
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
    }
  }

	componentWillReceiveProps(props){
		if(!sameStringForms(props.statuses,this.props.statuses)){
			this.setState({statuses:toSelArr(props.statuses)})
		}
		if(!sameStringForms(props.tags,this.props.tags)){
			this.setState({tags:toSelArr(props.tags)})
		}
		if(!sameStringForms(props.users,this.props.users)){
			this.setState({users:toSelArr(props.users,'email')})
		}
		if(props.usersLoaded && !this.props.usersLoaded){
			this.setState({permissions:this.state.permissions.length===0?[{user:toSelArr(props.users,'email').find((user)=>user.id===this.props.currentUser.id),read:true,write:true,delete:true,isAdmin:true}]:this.state.permissions});
		}
		if(!sameStringForms(props.taskTypes,this.props.taskTypes)){
			this.setState({taskTypes:toSelArr(props.taskTypes)})
		}
		if(!sameStringForms(props.companies,this.props.companies)){
			this.setState({companies:toSelArr(props.companies)})
		}
	}

	componentWillMount(){
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}
		this.setState({statuses:toSelArr(this.props.statuses)});

		if(!this.props.tagsActive){
			this.props.storageHelpTagsStart();
		}
		this.setState({allTags:toSelArr(this.props.tags)});

		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		this.setState({users:toSelArr(this.props.users,'email'),permissions:this.state.permissions.length===0?[{user:toSelArr(this.props.users,'email').find((user)=>user.id===this.props.currentUser.id),read:true,write:true,delete:true,isAdmin:true}]:this.state.permissions});

		if(!this.props.taskTypesActive){
			this.props.storageHelpTaskTypesStart();
		}
		this.setState({types:toSelArr(this.props.taskTypes)});

		if(!this.props.companiesActive){
			this.props.storageCompaniesStart();
		}
		this.setState({companies:toSelArr(this.props.companies)});
	}

  render(){
		let canReadUserIDs = this.state.permissions.map((permission)=>permission.user.id);
		let canBeAssigned = this.state.users.filter((user)=>canReadUserIDs.includes(user.id))

    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
				<FormGroup>
					<Label for="name">Project name</Label>
					<Input type="text" name="name" id="name" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
				</FormGroup>

				<FormGroup>
					<Label htmlFor="description">Popis</Label>
					<Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
				</FormGroup>

				<Permissions
					addUser={(user)=>{
						this.setState({
							permissions:[...this.state.permissions,{user,read:true,write:false,delete:false,isAdmin:false}]
						})
					}}
					givePermission={(user,permission)=>{
						let permissions=[...this.state.permissions];
						let index = permissions.findIndex((permission)=>permission.user.id===user.id);
						let item = permissions[index];
						item.read=permission.read;
						item.write=permission.write;
						item.delete=permission.delete;
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

					<Button className="btn"
						disabled={this.state.saving||this.state.title===""||(this.state.company.value===null&&this.state.company.fixed)||(this.state.status.value===null&&this.state.status.fixed)||(this.state.assignedTo.value.length===0 && this.state.assignedTo.fixed)||(this.state.type.value===null&&this.state.type.fixed)}
						onClick={()=>{
							this.setState({saving:true});
							let body = {
								title: this.state.title,
								description: this.state.description,
								permissions:this.state.permissions.map((permission)=>{
									return {
										...permission,
										user:permission.user.id,
									}
								}),
								def:{
									status:this.state.status.value?{...this.state.status,value:this.state.status.value.id}:{def:false,fixed:false, value: null, show:true},
									tags:this.state.tags.value?{...this.state.tags,value:this.state.tags.value.map(item=>item.id)}:{def:false,fixed:false, value: [], show:true},
									assignedTo:this.state.assignedTo.value?{...this.state.assignedTo,value:this.state.assignedTo.value.map(item=>item.id)}:{def:false,fixed:false, value: [], show:true},
									type:this.state.type.value?{...this.state.type,value:this.state.type.value.id}:{def:false,fixed:false, value: null, show:true},
									requester:this.state.requester.value?{...this.state.requester,value:this.state.requester.value.id}:{def:false,fixed:false, value: null, show:true},
									company:this.state.company.value?{...this.state.company,value:this.state.company.value.id}:{def:false,fixed:false, value: null, show:true},
									pausal:this.state.pausal.value?{...this.state.pausal,value:this.state.pausal.value.id}:{def:false,fixed:false, value: false, show:true},
									overtime:this.state.overtime.value?{...this.state.overtime,value:this.state.overtime.value.value}:{def:false,fixed:false, value: false, show:true},
								}
							};
							rebase.addToCollection('/help-projects', body)
							.then(()=>{
								this.setState({
								saving:false,
								title: '',
								description: '',
								...noDef
								});
								this.props.close();
							});
						}}>
						{this.state.saving?'Adding...':'Add project'}
					</Button>
          </div>
    );
  }
}

const mapStateToProps = ({ storageHelpStatuses, storageHelpTags, storageUsers, storageHelpTaskTypes, storageCompanies, userReducer }) => {
	const { statusesActive, statuses } = storageHelpStatuses;
	const { tagsActive, tags } = storageHelpTags;
	const { usersActive, users } = storageUsers;
	const { taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { companiesActive, companies } = storageCompanies;
	return { statusesActive, statuses,
		tagsActive, tags,
		usersActive, users,
		taskTypesActive, taskTypes,
		companiesActive, companies,
		currentUser:userReducer };
};

export default connect(mapStateToProps, { storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart })(ProjectAdd);
