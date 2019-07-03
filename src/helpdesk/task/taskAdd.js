import React, { Component } from 'react';
import Select from 'react-select';
import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Materials from '../components/materials';
import Subtasks from '../components/subtasks';
import {selectStyle, invisibleSelectStyle} from '../../scss/selectStyles';

const repeat = [
	{ value: 'none', label: 'none' },
	{ value: 'every day', label: 'every day' },

];

export default class TaskAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      loading:true,
			openAddTaskModal:false,
      users:[],
      companies:[],
      workTypes:[],
      statuses:[],
      projects:[],
			taskWorks:[],
			taskMaterials:[],
			allTags:[],
			taskTypes:[],
			hidden:true,

      title:'',
      company:null,
      workHours:'0',
      workType:null,
      requester:null,
			assignedTo:[],
      description:'',
      status:null,
      statusChange:null,
      project:null,
			tags:[],
			type:null,
      pausal:{value:true,label:'Pausal'},
      overtime:{value:false,label:'Nie'}
    }
		this.counter = 0;
    this.fetchData();
  }

	getNewID(){
		return this.counter++;
	}


  submitTask(){
    this.setState({saving:true});
    let body = {
      title: this.state.title,
      company: this.state.company?this.state.company.id:null,
      workHours: this.state.workHours,
      workType: this.state.workType?this.state.workType.id:null,
      requester: this.state.requester?this.state.requester.id:null,
			assignedTo: this.state.assignedTo.map((item)=>item.id),
      description: this.state.description,
      status: this.state.status?this.state.status.id:null,
      deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : (new Date(this.state.deadline).getTime()),
      createdAt:(new Date()).getTime(),
      statusChange:(new Date()).getTime(),
      project: this.state.project?this.state.project.id:null,
      pausal: this.state.pausal.value,
      overtime: this.state.overtime.value,
			tags: this.state.tags.map((item)=>item.id),
			type: this.state.type?this.state.type.id:null,
    }

		database.collection('metadata').doc('0').get().then((taskMeta)=>{
			let newID = (parseInt(taskMeta.data().taskLastID)+1)+"";
			this.state.taskWorks.forEach((item)=>{
				delete item['id'];
					rebase.addToCollection('help-task_works',{task:newID,...item});
			})

			this.state.taskMaterials.forEach((item)=>{
				delete item['id'];
				rebase.addToCollection('help-task_materials',{task:newID,...item});
			})


			rebase.addToCollection('/help-tasks', body,newID)
			.then(()=>{
				rebase.updateDoc('/metadata/0',{taskLastID:newID});
				this.setState({
					saving:false,
					openAddTaskModal:false,
					hidden:true,
					title:'',
					company:null,
					workHours:'0',
					workType:null,
					requester:null,
					assignedTo:[],
					tags:[],
					type:null,
					description:'',
					status:null,
					statusChange:null,
					project:null,
					pausal:{value:true,label:'Pausal'},
					overtime:{value:false,label:'Nie'},
					taskWorks:[],
					taskMaterials:[],
				})
				this.fetchData();
				this.props.history.push('/helpdesk/taskList/'+newID);
			});
		})
  }

  fetchData(){
    Promise.all(
      [
        database.collection('help-statuses').get(),
        database.collection('help-projects').get(),
        database.collection('users').get(),
        database.collection('companies').get(),
        database.collection('help-work_types').get(),
        database.collection('help-units').get(),
        database.collection('help-prices').get(),
        database.collection('help-pricelists').get(),
				database.collection('help-tags').get(),
				database.collection('help-task_types').get(),
				rebase.get('metadata/0', {
					context: this,
				})
    ]).then(([statuses,projects,users, companies, workTypes,units, prices, pricelists,tags,taskTypes,meta])=>{
      this.setData(
				toSelArr(snapshotToArray(statuses)),
				toSelArr(snapshotToArray(projects)),
				toSelArr(snapshotToArray(users),'email'),
				toSelArr(snapshotToArray(companies)),
				toSelArr(snapshotToArray(workTypes)),
      	toSelArr(snapshotToArray(units)),
				snapshotToArray(prices),
				snapshotToArray(pricelists),
				toSelArr(snapshotToArray(tags)),
				toSelArr(snapshotToArray(taskTypes)),
				meta.defaultUnit
			);
    });
  }

  setData(statuses, projects,users,companies,workTypes,units, prices, pricelists,tags,taskTypes,defaultUnit){
    let status = statuses.find((item)=>item.title==='New');
    if(!status){
      status=null;
    }
		let newCompanies=companies.map((company)=>{
			let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
			return newCompany;
		});
		let newWorkTypes=workTypes.map((workType)=>{
			let newWorkType = {...workType, prices:prices.filter((price)=>price.workType===workType.id)}
			return newWorkType;
		});

    this.setState({
      statuses,
      projects,
      users,
      companies:newCompanies,
      workTypes:newWorkTypes,
			taskTypes,
			allTags:tags,

      status,
      units,
      statusChange:null,
      project:null,
      company:null,
      workHours:0,
      workType:null,
      requester:null,
      assignedTo:[],
      loading:false,
			type:null,
			tags:[],
			defaultUnit
    });
  }

  render(){
		let taskWorks= this.state.taskWorks.map((work)=>{
			let finalUnitPrice=parseFloat(work.price);
			if(work.extraWork){
				finalUnitPrice+=finalUnitPrice*parseFloat(work.extraPrice)/100;
			}
			let totalPrice=(finalUnitPrice*parseFloat(work.quantity)*(1-parseFloat(work.discount)/100)).toFixed(2);
			finalUnitPrice=finalUnitPrice.toFixed(2);
			let workType= this.state.workTypes.find((item)=>item.id===work.workType);
			let assignedTo=work.assignedTo?this.state.users.find((item)=>item.id===work.assignedTo):null
			return {
				...work,
				workType,
				unit:this.state.units.find((unit)=>unit.id===work.unit),
				finalUnitPrice,
				totalPrice,
				assignedTo:assignedTo?assignedTo:null
			}
		});

		let taskMaterials= this.state.taskMaterials.map((material)=>{
			let finalUnitPrice=(parseFloat(material.price)*(1+parseFloat(material.margin)/100));
			let totalPrice=(finalUnitPrice*parseFloat(material.quantity)).toFixed(2);
			finalUnitPrice=finalUnitPrice.toFixed(2);
			return {
				...material,
				unit:this.state.units.find((unit)=>unit.id===material.unit),
				finalUnitPrice,
				totalPrice
			}
		});

    return (
			<div >

			<Button
				className="btn-link t-a-l sidebar-menu-item"
				onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}
			> <i className="fa fa-plus sidebar-icon-center"/> Add task
			</Button>


			<Modal size="lg"  isOpen={this.state.openAddTaskModal} toggle={()=>{this.setState({openAddTaskModal:!this.state.openAddTaskModal})}} >
					<ModalHeader toggle={()=>{this.setState({openAddTaskModal:!this.state.openAddTaskModal})}} ></ModalHeader>
					<ModalBody>
					<div className="scrollable">
						<div className="p-t-0">
								<div className="row">
									<h1 className="center-hor"># NEW</h1>
									<span className="center-hor">
										<input type="text" value={this.state.title} className="task-title-input hidden-input" onChange={(e)=>this.setState({title:e.target.value})} placeholder="Enter task name" />
									</span>
								</div>
							<div className="row">
								<div className="col-lg-12 row">
									<strong className="center-hor">Tagy: </strong>
									<div className="f-1">
										<Select
											value={this.state.tags}
											isMulti
											onChange={(tags)=>this.setState({tags})}
											options={this.state.allTags}
											styles={invisibleSelectStyle}
											/>
									</div>
								</div>
								<div className="col-lg-12 row">
									<strong className="center-hor">Assigned to: </strong>
									<div className="f-1">
										<Select
											value={this.state.assignedTo}
											isMulti
											onChange={(users)=>this.setState({assignedTo:users})}
											options={this.state.users}
											styles={invisibleSelectStyle}
											/>
									</div>
								</div>

								<div className="col-lg-12 p-0">
									<div className="col-lg-6">
										<div className="p-r-20">
											<div className="row">
												<label className="col-5 col-form-label">Status</label>
												<div className="col-7">
													<Select
														value={this.state.status}
														onChange={(status)=>this.setState({status,statusChange:(new Date().getTime())})}
														options={this.state.statuses.map((status)=>{return {...status,value:status.id,label:status.title}})}
														styles={invisibleSelectStyle}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label">Projekt</label>
												<div className="col-7">
													<Select
														value={this.state.project}
														onChange={(project)=>this.setState({project})}
														options={this.state.projects}
														styles={invisibleSelectStyle}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label">Zadal</label>
												<div className="col-7">
													<Select
														value={this.state.requester}
														onChange={(requester)=>this.setState({requester})}
														options={this.state.users}
														styles={invisibleSelectStyle}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label">Firma</label>
												<div className="col-7">
													<Select
														value={this.state.company}
														onChange={(company)=>this.setState({company})}
														options={this.state.companies}
														styles={invisibleSelectStyle}
														/>
												</div>
											</div>
										</div>
									</div>
									<div className="col-lg-6">
										<div>
											<div className="row">
												<label className="col-5 col-form-label">Pripomienka</label>
												<div className="col-7">
													<Select styles={invisibleSelectStyle} />
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label">Deadline</label>
												<div className="col-7">
													<input
														className='form-control hidden-input'
														placeholder="Status change date"
														type="datetime-local"
														value={this.state.deadline}
														onChange={(e)=>{
															this.setState({deadline:e.target.value})}
														}
														/>
												</div>
											</div>
											<div className="row">
												<label className="col-5 col-form-label">Opakovanie</label>
												<div className="col-7">
													<Select options={repeat} styles={invisibleSelectStyle} />
												</div>
											</div>

											<div className="row">
												<label className="col-5 col-form-label">Typ</label>
												<div className="col-7">
													<Select
														value={this.state.type}
														styles={invisibleSelectStyle}
														onChange={(type)=>this.setState({type})}
														options={this.state.taskTypes}
														/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<label className="m-t-5">Popis</label>
							<textarea className="form-control b-r-0" placeholder="Enter task description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />

						{!this.state.hidden && <Subtasks
							taskAssigned={this.state.assignedTo}
							submitService={(newService)=>{
								this.setState({taskWorks:[...this.state.taskWorks,{id:this.getNewID(),...newService}]});
							}}
							updatePrices={(ids)=>{
								let newTaskWorks=[...this.state.taskWorks];
								taskWorks.filter((item)=>ids.includes(item.id)).map((item)=>{
									let price=item.workType.prices.find((item)=>item.pricelist===this.state.company.pricelist.id);
									if(price === undefined){
										price = 0;
									}else{
										price = price.price;
									}
									newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===item.id)]={...newTaskWorks.find((taskWork)=>taskWork.id===item.id),price};
									return null;
								})
								this.setState({taskWorks:newTaskWorks});
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
							}}
							match={{params:{taskID:null}}}
							/>}

						{!this.state.hidden && <Materials
							materials={taskMaterials}
							submitMaterial={(newMaterial)=>{
								this.setState({taskMaterials:[...this.state.taskMaterials,{id:this.getNewID(),...newMaterial}]});
							}}
							updateMaterial={(id,newData)=>{
								let newTaskMaterials=[...this.state.taskMaterials];
								newTaskMaterials[newTaskMaterials.findIndex((taskWork)=>taskWork.id===id)]={...newTaskMaterials.find((taskWork)=>taskWork.id===id),...newData};
								this.setState({taskMaterials:newTaskMaterials});
							}}
							removeMaterial={(id)=>{
								let newTaskMaterials=[...this.state.taskMaterials];
								newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
								this.setState({taskMaterials:newTaskMaterials});
							}}
							units={this.state.units}
							defaultUnit={this.state.defaultUnit}
							company={this.state.company}
							match={{params:{taskID:null}}}
							/>}
					</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button
						className="btn m-r-10"
						disabled={this.state.title==="" || this.state.status===null || this.state.project === null|| this.state.company === null||this.state.saving}
						onClick={this.submitTask.bind(this)}
					> Add
					</button>
				</ModalFooter>
			</Modal>
		</div>
    );
  }
}
