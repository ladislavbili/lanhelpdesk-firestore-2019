import React, { Component } from 'react';
import { connect } from "react-redux";
import {storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart} from '../../../redux/actions';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {toSelArr, sameStringForms, testing} from '../../../helperFunctions';
import {rebase} from '../../../index';
import Permissions from "../../components/projects/permissions";
import ProjectDefaultValues from "../../components/projects/defaultValues";

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
		if(this.props.usersLoaded){
			this.setState({users:toSelArr(this.props.users,'email'),permissions:this.state.permissions.length===0?[{user:toSelArr(this.props.users,'email').find((user)=>user.id===this.props.currentUser.id),read:true,write:true,delete:true,isAdmin:true}]:this.state.permissions});
		}

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


					<ProjectDefaultValues
						updateState={(newState)=>this.setState(newState)}
						state={this.state}
						canBeAssigned={canBeAssigned}
						/>

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
	const { usersLoaded, usersActive, users } = storageUsers;
	const { taskTypesActive, taskTypes } = storageHelpTaskTypes;
	const { companiesActive, companies } = storageCompanies;
	return { statusesActive, statuses,
		tagsActive, tags,
		usersLoaded, usersActive, users,
		taskTypesActive, taskTypes,
		companiesActive, companies,
		currentUser:userReducer };
};

export default connect(mapStateToProps, { storageHelpStatusesStart, storageHelpTagsStart, storageUsersStart, storageHelpTaskTypesStart, storageCompaniesStart })(ProjectAdd);
