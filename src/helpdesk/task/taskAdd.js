import React, { Component } from 'react';
import Select from 'react-select';
import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Materials from '../components/materials';
import Subtasks from '../components/subtasks';

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

export default class TaskEdit extends Component{
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
			hidden:true,

      title:'',
      company:null,
      workHours:'0',
      workType:null,
      requester:null,
      assigned:null,
      description:'',
      status:null,
      statusChange:null,
      project:null,
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
      assigned: this.state.assigned?this.state.assigned.id:null,
      description: this.state.description,
      status: this.state.status?this.state.status.id:null,
      deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : (new Date(this.state.deadline).getTime()),
      createdAt:(new Date()).getTime(),
      statusChange:(new Date()).getTime(),
      project: this.state.project?this.state.project.id:null,
      pausal: this.state.pausal.value,
      overtime: this.state.overtime.value,
    }

		database.collection('metadata').doc('0').get().then((taskMeta)=>{
			let newID = (taskMeta.data().taskLastID+1)+"";
			this.state.taskWorks.map((item)=>{
				delete item['id'];
					rebase.addToCollection('taskWorks',{task:newID,...item});
			})

			this.state.taskMaterials.map((item)=>{
				delete item['id'];
				rebase.addToCollection('taskMaterials',{task:newID,...item});
			})


			rebase.addToCollection('/tasks', body,newID)
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
					assigned:null,
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
        database.collection('statuses').get(),
        database.collection('projects').get(),
        database.collection('users').get(),
        database.collection('companies').get(),
        database.collection('workTypes').get(),
        database.collection('units').get(),
        database.collection('prices').get(),
        database.collection('pricelists').get(),
				rebase.get('metadata/0', {
					context: this,
				})
    ]).then(([statuses,projects,users, companies, workTypes,units, prices, pricelists,meta])=>{
      this.setData(
				toSelArr(snapshotToArray(statuses)),
				toSelArr(snapshotToArray(projects)),
				toSelArr(snapshotToArray(users),'email'),
				toSelArr(snapshotToArray(companies)),
				toSelArr(snapshotToArray(workTypes)),
      	toSelArr(snapshotToArray(units)),
				snapshotToArray(prices),
				snapshotToArray(pricelists),
				meta.defaultUnit
			);
    });
  }

  setData(statuses, projects,users,companies,workTypes,units, prices, pricelists,defaultUnit){
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
      status,
      units,
      statusChange:null,
      project:null,
      company:null,
      workHours:0,
      workType:null,
      requester:null,
      assigned:null,
      loading:false,
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
			<div>
			<button
				className="btn btn-success"
				style={{ width: '100%' }}
				onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}
			> Add task
			</button>
			<Modal size="lg" isOpen={this.state.openAddTaskModal} toggle={()=>{this.setState({openAddTaskModal:!this.state.openAddTaskModal})}} >
					<ModalHeader toggle={()=>{this.setState({openAddTaskModal:!this.state.openAddTaskModal})}}>Add task</ModalHeader>
					<ModalBody>
					<div className="scrollable">
						<div className="card-box p-t-0" style={{ maxWidth: 1284, background: '#F9F9F9', borderRadius: 0, padding: "none" }}>
							<div className="d-flex flex-row">
								<div className="row">
									<h1># NEW</h1>
									<span className="center-hor">
										<input type="text" value={this.state.title} className="form-control hidden-input" onChange={(e)=>this.setState({title:e.target.value})} placeholder="Enter task name" />
									</span>
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
							<textarea className="form-control" placeholder="Enter task description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />

						{!this.state.hidden && <Subtasks
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
						className="btn btn-success"
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
