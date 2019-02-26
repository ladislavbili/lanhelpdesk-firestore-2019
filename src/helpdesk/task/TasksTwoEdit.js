import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl, Table } from 'react-bootstrap';
import Select from 'react-select';

import Comments from '../components/comments.js';
import TaskMaterials from '../components/taskMaterials';
import Subtasks from '../components/subtasks';
import AddServiceMaterial from './addServiceMaterial';
import EditService from './editService';
import EditMaterial from './editMaterial';

import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray, timestampToString} from '../../helperFunctions';

const tableStyle = {
	border: 'none',
};

const repeat = [
	{ value: 'none', label: 'none' },
	{ value: 'every day', label: 'every day' },

];
const selectStyle = {
	control: base => ({
		...base,
		minHeight: 30,
		backgroundColor: 'white',
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 4,
	}),
	clearIndicator: base => ({
		...base,
		padding: 4,
	}),
	multiValue: base => ({
		...base,
		backgroundColor: 'white',
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px',
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0,
		backgroundColor: 'white',
	}),
};

export default class TasksTwoEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saving:false,
			loading:true,
			addItemModal:false,
			users:[],
			companies:[],
			workTypes:[],
			statuses:[],
			projects:[],
			taskMaterials:[],
			taskWorks:[],
			units:[],
			task:null,
			openEditServiceModal:false,
			openService:null,
			openEditMaterialModal:false,
			openMaterial:null,


			title:'',
			company:null,
			workHours:'0',
			workType:null,
			requester:null,
			assigned:null,
			description:'',
			status:null,
			statusChange:null,
			createdAt:null,
			deadline:null,
			project:null,
			pausal:{value:true,label:'Pausal'},
			overtime:{value:true,label:'Áno'},

			/////
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
		};
    this.submitTask.bind(this);
    this.submitMaterial.bind(this);
    this.submitService.bind(this);
    this.saveService.bind(this);
    this.saveMaterial.bind(this);
		this.canSave.bind(this);
    this.fetchData(this.props.match.params.taskID);
	}

	canSave(){
		return this.state.title==="" || this.state.status===null || this.state.project === null||this.state.saving;
	}


  submitTask(){
    this.setState({saving:true});
    let body = {
      title: this.state.title,
      company: this.state.company?this.state.company.id:null,
      workHours: this.state.workHours,
      workType: this.state.workType?this.state.workType.id:null,
      requester: this.state.requester?this.state.requester.id:null,
      assigned: this.state.assigned?this.state.assigned.id:null,
      description: this.state.description,
      status: this.state.status?this.state.status.id:null,
			deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : (new Date(this.state.deadline).getTime()),
      statusChange: this.state.statusChange,
      project: this.state.project?this.state.project.id:null,
      pausal: this.state.pausal.value,
      overtime: this.state.overtime.value,
    }
    rebase.updateDoc('/tasks/'+this.state.task.id, body)
    .then(()=>{
      if(!this.props.columns){
        this.props.history.goBack()
      }else{
        this.setState({saving:false});
      }
    });
  }

  submitMaterial(body){
    rebase.addToCollection('taskMaterials',{task:this.props.match.params.taskID,...body}).then((result)=>{
      this.setState({taskMaterials:[...this.state.taskMaterials, {task:this.props.match.params.taskID,...body,id:result.id}]})
    });
  }

  submitService(body){
    rebase.addToCollection('taskWorks',{task:this.props.match.params.taskID,...body}).then((result)=>{
      this.setState({taskWorks:[...this.state.taskWorks, {task:this.props.match.params.taskID,...body,id:result.id}]})
    });
  }

  saveService(body,id){
    rebase.updateDoc('/taskWorks/'+id,body).then((result)=>{
      let newTaskWorks=[...this.state.taskWorks];
      newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...body};
      this.setState({taskWorks:newTaskWorks,openService:null});
    });
  }

  saveMaterial(body,id){
    rebase.updateDoc('/taskMaterials/'+id,body).then((result)=>{
      let newTaskMaterials=[...this.state.taskMaterials];
      newTaskMaterials[newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id)]={...newTaskMaterials.find((taskMaterial)=>taskMaterial.id===id),...body};
      this.setState({taskMaterials:newTaskMaterials,openMaterial:null});
    });
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.taskID!==props.match.params.taskID){
      this.setState({loading:true})
      this.fetchData(props.match.params.taskID);
    }
  }

  fetchData(taskID){
    Promise.all(
      [
        database.collection('tasks').doc(taskID).get(),
        database.collection('statuses').get(),
        database.collection('projects').get(),
        database.collection('companies').get(),
        database.collection('workTypes').get(),
        database.collection('units').get(),
        database.collection('prices').get(),
        database.collection('pricelists').get(),
        database.collection('users').get(),
        database.collection('taskMaterials').where("task", "==", taskID).get(),
        database.collection('taskWorks').where("task", "==", taskID).get()
    ]).then(([task,statuses,projects, companies, workTypes, units, prices, pricelists, users,taskMaterials, taskWorks])=>{
      this.setData({id:task.id,...task.data()}, toSelArr(snapshotToArray(statuses)), toSelArr(snapshotToArray(projects)),toSelArr(snapshotToArray(users),'email'),
      toSelArr(snapshotToArray(companies)),toSelArr(snapshotToArray(workTypes)),
      toSelArr(snapshotToArray(units)), snapshotToArray(prices),snapshotToArray(taskMaterials),snapshotToArray(taskWorks),snapshotToArray(pricelists));
    });
  }

  setData(task, statuses, projects,users,companies,workTypes,units, prices,taskMaterials,taskWorks,pricelists){
    let project = projects.find((item)=>item.id===task.project);
    let status = statuses.find((item)=>item.id===task.status);
    let company = companies.find((item)=>item.id===task.company);
    company = {...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
    let workType = workTypes.find((item)=>item.id===task.workType);
    let requester = users.find((item)=>item.id===task.requester);
    let assigned = users.find((item)=>item.id===task.assigned);


    let newCompanies=companies.map((company)=>{
      let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
      return newCompany;
    });
    let newWorkTypes=workTypes.map((workType)=>{
      let newWorkType = {...workType, prices:prices.filter((price)=>price.workType===workType.id)}
      return newWorkType;
    });

    this.setState({
      task,
      statuses,
      projects,
      users,
      companies:newCompanies,
      workTypes:newWorkTypes,
      units,
      taskMaterials,
      taskWorks,
      description:task.description,
      title:task.title,
      pausal:task.pausal?{value:true,label:'Pausal'}:{value:false,label:'Project'},
			overtime:task.overtime?{value:true,label:'Áno'}:{value:false,label:'Nie'},
      status:status?status:null,
			statusChange:task.statusChange?task.statusChange:null,
			createdAt:task.createdAt?task.createdAt:null,
			deadline: task.deadline!==null?new Date(task.deadline).toISOString().replace('Z',''):'',
      project:project?project:null,
      company:company?company:null,
      workHours:isNaN(parseInt(task.workHours))?0:parseInt(task.workHours),
      workType:workType?workType:null,
      requester:requester?requester:null,
      assigned:assigned?assigned:null,
      loading:false
    });
  }

	render() {

		let taskWorks= this.state.taskWorks.map((work)=>{
			let finalUnitPrice=parseFloat(work.price);
			if(work.extraWork){
				finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
			}
			let totalPrice=(finalUnitPrice*parseFloat(work.quantity)*(1-parseFloat(work.discount)/100)).toFixed(3);
			finalUnitPrice=finalUnitPrice.toFixed(3);
			let workType= this.state.workTypes.find((item)=>item.id===work.workType);
			return {
				...work,
				workType,
				unit:this.state.units.find((unit)=>unit.id===work.unit),
				finalUnitPrice,
				totalPrice
			}
		});

		let taskMaterials= this.state.taskMaterials.map((material)=>{
			let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100));
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)*(1-parseFloat(material.discount)/100)).toFixed(3);
			finalUnitPrice=finalUnitPrice.toFixed(3);
			return {
				...material,
				unit:this.state.units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice
			}
		});

		return (
			<div>
				<div className="row scrollable fit-with-header" style={{}}>
					<div className="col-lg-12">
						<div className="card-box p-t-0" style={{ maxWidth: 1284, background: '#F9F9F9', borderRadius: 0, padding: "none" }}>
							<div className="d-flex flex-row">
								<div className="row">
									<h1># 143</h1>
									<span className="center-hor">
							    	<input type="text" value={this.state.title} class="form-control hidden-input" onChange={(e)=>this.setState({title:e.target.value})} placeholder="Enter task name" />
									</span>
								</div>
								<div className="ml-auto p-2 align-self-center">
									<button type="button" disabled={this.canSave()} className="btn btn-link waves-effect" onClick={this.submitTask.bind(this)}>
										{this.state.saving?'Saving... ':''}
										<i
											className="fas fa-save"
											style={{
												color: '#4a81d4',
												fontSize: '1.2em',
											}}
											/>
									</button>
									{' '}
									<button type="button" className="btn btn-link waves-effect">
										<i
											className="fas fa-trash"
											style={{
												color: '#4a81d4',
												fontSize: '1.2em',
											}}
											/>
									</button>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-12 p-10 d-flex flex-row">
									<p className="text-muted">Created by Branislav Šusta at {this.state.createdAt?(timestampToString(this.state.createdAt)):''}</p>
									<p className="text-muted ml-auto">{this.state.statusChange?('Status changed at ' + timestampToString(this.state.statusChange)):''}</p>
								</div>

							</div>
							<div className="row">
								<div className="col-lg-12">
									<strong>Tagy: </strong>
									<span className="label label-info m-r-5">Po pracovných hodínach</span>
									<span className="label label-success m-r-5">Telefonovať</span>
								</div>
								<div className="col-lg-12 p-0">
									<div className="col-lg-6">
										<div className="m-t-20 p-r-20">
											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Status</label>
												<div className="col-7">
													<Select
														value={this.state.status}
														onChange={(status)=>this.setState({status,statusChange:(new Date().getTime())})}
														options={this.state.statuses.map((status)=>{return {...status,value:status.id,label:status.title}})}
														styles={selectStyle}
														/>
												</div>
											</div>
											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Projekt</label>
												<div className="col-7">
													<Select
														value={this.state.project}
														onChange={(project)=>this.setState({project})}
														options={this.state.projects}
														styles={selectStyle}
														/>
												</div>
											</div>
											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Zadal</label>
												<div className="col-7">
													<Select
														value={this.state.requester}
														onChange={(requester)=>this.setState({requester})}
														options={this.state.users}
														styles={selectStyle}
														/>
												</div>
											</div>
											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Firma</label>
												<div className="col-7">
													<Select
														value={this.state.company}
														onChange={(company)=>this.setState({company})}
														options={this.state.companies}
														styles={selectStyle}
														/>
												</div>
											</div>
											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Riesi</label>
												<div className="col-7">
													<Select
														value={this.state.assigned}
														onChange={(assigned)=>this.setState({assigned})}
														options={this.state.users}
														styles={selectStyle}
														/>
												</div>
											</div>
										</div>
									</div>
									<div className="col-lg-6">
										<div className="m-t-20">
											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Pripomienka</label>
												<div className="col-7">
													<Select styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Deadline</label>
												<div className="col-7">
													<input
														className='form-control'
														placeholder="Status change date"
														type="datetime-local"
														value={this.state.deadline}
														onChange={(e)=>{
															this.setState({deadline:e.target.value})}
														}
														/>
												</div>
											</div>
											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Opakovanie</label>
												<div className="col-7">
													<Select options={repeat} styles={selectStyle} />
												</div>
											</div>

											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Typ</label>
												<div className="col-7">
													<Select
					                  value={this.state.workType}
														styles={selectStyle}
					                  onChange={(workType)=>this.setState({workType})}
					                  options={this.state.workTypes}
					                  />
												</div>
											</div>
											<div className="form-group m-b-0 row">
												<label className="col-5 col-form-label">Mimo pracovných hodín</label>
												<div className="col-7">
													<Select
														value={this.state.overtime}
														styles={selectStyle}
														onChange={(overtime)=>this.setState({overtime})}
														options={[{value:true,label:'Áno'},{value:false,label:'Nie'}]}
														/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<label className="m-t-5">Popis</label>
								<textarea class="form-control" placeholder="Enter task description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />

							{false && <TaskMaterials />}
							<Subtasks
								submitService={this.submitService.bind(this)}
								updatePrices={(ids)=>{
									taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
										let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
										if(price === undefined){
											price = 0;
										}else{
											price = price.price;
										}
										rebase.updateDoc('taskWorks/'+item.id, {price})
										.then(()=>{
											let newTaskWorks=[...this.state.taskWorks];
								      newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
								      this.setState({taskWorks:newTaskWorks});
										});
									})
								}}
								subtasks={taskWorks}
								workTypes={this.state.workTypes}
								updateSubtask={(id,newData)=>{
									let newTaskWorks=[...this.state.taskWorks];
									newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
									this.setState({taskWorks:newTaskWorks});
								}}
								company={this.state.company}
								removeSubtask={(id)=>{
									let newTaskWorks=[...this.state.taskWorks];
									newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
									this.setState({taskWorks:newTaskWorks});
									}
								}
								/>
								<div>
									<Button bsStyle="primary" disabled={this.state.loading} onClick={()=>this.setState({addItemModal:true})}>+ Service/Material</Button>
								</div>
								<table className="table table-centered table-borderless table-hover mb-0">
									<thead className="thead-light">
					          <tr>
					            <th>Name</th>
					            <th>Quantity</th>
					            <th>Price</th>
					            <th>Discount</th>
					            <th>Total</th>
					          </tr>
					        </thead>
					        <tbody>
					          {taskWorks.map((item)=>
					            <tr key={item.id} className="clickable" onClick={()=>this.setState({openEditServiceModal:true,openService:item})}>
					              <td>{item.title}</td>
					              <td>{item.quantity + ' '+ item.unit.title}</td>
					              <td>{item.finalUnitPrice}</td>
					              <td>{item.discount + '%'}</td>
					              <td>{item.totalPrice}</td>
					            </tr>
					          )}
					          {taskMaterials.map((item)=>
					            <tr key={item.id} className="clickable" onClick={()=>this.setState({openEditMaterialModal:true,openMaterial:item})}>
					              <td>{item.title}</td>
					              <td>{item.quantity + ' '+ item.unit.title}</td>
					              <td>{item.finalUnitPrice}</td>
					              <td>{item.discount + '%'}</td>
					              <td>{item.totalPrice}</td>
					            </tr>
					          )}
					        </tbody>
					      </table>

							<AddServiceMaterial
				        isOpen={this.state.addItemModal}
				        toggle={()=>this.setState({addItemModal:!this.state.addItemModal})}
				        company={this.state.company}
				        workTypes={this.state.workTypes}
				        submitMaterial={this.submitMaterial.bind(this)}
				        submitService={this.submitService.bind(this)}
				        units={this.state.units}
				        />
				      {
				        this.state.taskWorks.some((item)=>this.state.openService && item.id===this.state.openService.id) &&
				      <EditService
				        isOpen={this.state.openEditServiceModal}
				        units={this.state.units}
				        workTypes={this.state.workTypes}
				        company={this.state.company}
				        service={this.state.openService}
				        saveService={this.saveService.bind(this)}
				        toggle={()=>this.setState({openEditServiceModal:!this.state.openEditServiceModal})}
				        />
				      }

				      {
				        this.state.taskMaterials.some((item)=>this.state.openMaterial && item.id===this.state.openMaterial.id) &&
				      <EditMaterial
				        isOpen={this.state.openEditMaterialModal}
				        units={this.state.units}
				        material={this.state.openMaterial}
				        saveMaterial={this.saveMaterial.bind(this)}
				        toggle={()=>this.setState({openEditMaterialModal:!this.state.openEditMaterialModal})}
				        />
						}
							<Comments />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
