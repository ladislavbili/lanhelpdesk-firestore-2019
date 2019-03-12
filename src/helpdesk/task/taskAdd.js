import React, { Component } from 'react';
import Select from 'react-select';
import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import { Modal } from 'react-bootstrap';

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
    this.fetchData();
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
			rebase.addToCollection('/tasks', body,(taskMeta.data().taskLastID+1)+"")
			.then(()=>{
				rebase.updateDoc('/metadata/0',{taskLastID:taskMeta.data().taskLastID+1})
				this.setState({
					saving:false,
					openAddTaskModal:false,
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
				})
				this.fetchData();
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
    ]).then(([statuses,projects,users, companies, workTypes])=>{
      this.setData(toSelArr(snapshotToArray(statuses)), toSelArr(snapshotToArray(projects)),toSelArr(snapshotToArray(users),'email'),toSelArr(snapshotToArray(companies)),toSelArr(snapshotToArray(workTypes)));
    });
  }

  setData(statuses, projects,users,companies,workTypes){
    let status = statuses.find((item)=>item.title==='New');
    if(!status){
      status=null;
    }
    this.setState({
      statuses,
      projects,
      users,
      companies,
      workTypes,
      status,
      statusChange:null,
      project:null,
      company:null,
      workHours:0,
      workType:null,
      requester:null,
      assigned:null,
      loading:false
    });
  }

  render(){
    return (
			<div>
			<button
				className="btn btn-success"
				style={{ width: '100%' }}
				onClick={()=>{this.setState({openAddTaskModal:true})}}
			> Add task
			</button>
			<Modal  bsSize="large"  className="show" show={this.state.openAddTaskModal} >
				<Modal.Header>
					<h1 className="modal-header">Add task</h1>
					<button type="button" className="close ml-auto" aria-label="Close" onClick={()=>{this.setState({openAddTaskModal:false})}}><span aria-hidden="true">×</span></button>
				</Modal.Header>
				<Modal.Body>
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
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-success"
						disabled={this.state.title==="" || this.state.status===null || this.state.project === null|| this.state.company === null||this.state.saving}
						onClick={this.submitTask.bind(this)}
					> Add
					</button>
				</Modal.Footer>
			</Modal>
		</div>
    );
  }
}
