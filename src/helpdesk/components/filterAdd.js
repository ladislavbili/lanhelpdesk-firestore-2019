import React, { Component } from 'react';
import Select from 'react-select';
import { Button, FormGroup, Label, Input,Modal, ModalBody, ModalFooter } from 'reactstrap';
import { storageHelpProjectsStart } from '../../redux/actions';
import {toSelArr} from '../../helperFunctions';
import {selectStyle} from '../../scss/selectStyles';
import {rebase} from '../../index';
import { connect } from "react-redux";

class FilterAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      public:false,
      global:false,
      dashboard:false,
      project:null,

      saving:false,
      opened:false
    }
  }

  componentWillReceiveProps(props){
		if(!this.props.projectsLoaded && props.projectsLoaded){
			this.setState({
        project: this.state.opened && props.filterID && props.filterData.project ? toSelArr(props.projects).find((project)=>project.id===props.filterData.project):null,
			})
		}
	}

  toggle(){
    if(!this.state.opened && this.props.filterID){
      this.setState({
        title:this.props.filterData.title,
        public:this.props.filterData.public,
        global:this.props.filterData.global?this.props.filterData.global:false,
        dashboard:this.props.filterData.dashboard?this.props.filterData.dashboard:false,
        project:this.props.filterData.project?toSelArr(this.props.projects).find((project)=>project.id===this.props.filterData.project):null,
      });
    }
    this.setState({opened:!this.state.opened})
  }

  componentWillMount(){
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
  }

  render(){
    return (
      <div>
        <Button className="btn-link-reversed m-2" onClick={this.toggle.bind(this)}>
          <i className="far fa-save icon-M"/>
        </Button>

        <Modal style={{width: "800px"}} isOpen={this.state.opened} toggle={this.toggle.bind(this)} >
            <ModalBody>
              <FormGroup className="m-t-15">
                <Label>Filter name</Label>
                <Input type="text" className="from-control" placeholder="Enter filter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              { this.props.currentUser.userData.role.value > 1 &&
                <FormGroup>
                  <Input type="checkbox" id="public" checked={this.state.public} onChange={(e)=>this.setState({public:!this.state.public })} />
                  <Label for="public" className="p-l-15">Public (everyone see this filter)</Label>
                </FormGroup>
              }

              <FormGroup>
                <Input type="checkbox" id="global" checked={this.state.global} onChange={(e)=>this.setState({global:!this.state.global })} />
                <Label for="global" className="p-l-15">Global (shown in all projects)</Label>
              </FormGroup>

              <div className="m-b-10">
                <Label className="form-label">Projekt</Label>
                  <Select
                    placeholder="Vyberte projekt"
                    value={this.state.project}
                    isDisabled={this.state.global}
                    onChange={(project)=> {
                      this.setState({project});
                    }}
                    options={toSelArr(this.props.projects).filter((project)=>{
                      let curr = this.props.currentUser;
                      if(curr.userData && curr.userData.role.value===3){
                        return true;
                      }
                      let permission = project.permissions.find((permission)=>permission.user===curr.id);
                      return permission && permission.read;
                    })}
                    styles={selectStyle}
                    />
              </div>

              <FormGroup>
                <Input type="checkbox" id="dashboard" checked={this.state.dashboard} onChange={(e)=>this.setState({dashboard:!this.state.dashboard })} />
                <Label for="dashboard" className="p-l-15">Dashboard (shown in dashboard)</Label>
              </FormGroup>



              </ModalBody>
              <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>


              <Button
                className="btn"
                disabled={this.state.saving||this.state.title===""||(!this.state.global && this.state.project===null)}
                onClick={()=>{
                  this.setState({saving:true});
                  if(this.props.filterID!==null){
                    rebase.updateDoc('/help-filters/'+this.props.filterID, {
                      title: this.state.title,
                      filter:this.props.filter,
                      public:this.state.public,
                      global:this.state.global,
                      dashboard:this.state.dashboard,
                      project:this.state.project!==null?this.state.project.id:null,
                  })
                    .then(()=> {
                      this.setState({title:'',public:false,saving:false});
                      this.toggle();
                    });
                  }else{
                    rebase.addToCollection('/help-filters', {
                      title: this.state.title,
                      createdBy:this.props.currentUser.id,
                      filter: this.props.filter,
                      public:this.state.public,
                      global:this.state.global,
                      dashboard:this.state.dashboard,
                      project:this.state.project!==null?this.state.project.id:null,
                    })
                    .then(()=> {
                      this.setState({title:'',public:false,global:false,dashboard:false,project:null,saving:false});
                      this.toggle();
                    });
                  }
                }}>{this.props.filterID!==null?(this.state.saving?'Saving...':'Save filter'):(this.state.saving?'Adding...':'Add filter')}</Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}

const mapStateToProps = ({ userReducer, storageHelpProjects }) => {
  const { projectsActive, projects, projectsLoaded } = storageHelpProjects;

  return {
    currentUser:userReducer,
    projectsActive, projects, projectsLoaded
   };
};

export default connect(mapStateToProps, { storageHelpProjectsStart })(FilterAdd);
