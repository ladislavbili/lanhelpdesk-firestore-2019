import React, { Component } from 'react';
import { Input, Table } from 'reactstrap';
import {rebase,database} from '../../index';
import {snapshotToArray} from '../../helperFunctions';

export default class Subtasks extends Component{
  constructor(props){
    super(props);
    this.state={
      newSubtask:'',
      subtasks:[],
      editedSubtaskTitle:'',
      focusedSubtask:null,
    }
    this.submitSubtask.bind(this);
    this.deleteSubtask.bind(this);
    this.getData.bind(this);
    this.getData(this.props.id);
  }

  getData(id){
      database.collection('proj-subtasks').where("task", "==", id).get()
    .then((subtasks)=>{
      this.setState({subtasks:snapshotToArray(subtasks)})
    });
  }

  canSave(){
    return this.state.title!=='' && this.state.project!==null && !this.state.loading
  }

  deleteSubtask(id){
    if(window.confirm("Are you sure?")){
      rebase.removeDoc('proj-subtasks/'+id).then(()=>{this.getData(this.props.id )})
    }
  }

  submitSubtask(){
    if(this.state.newSubtask===''){
      return;
    }
    this.setState({saving:true});
    let body={
      done:false,
      title:this.state.newSubtask,
      task:this.props.id
    }
    rebase.addToCollection('/proj-subtasks',body).then(()=>{this.setState({saving:false,newSubtask:''});this.getData(this.props.id)})
  }

  render(){
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th style={{width:40}}></th>
              <th>Subtasks</th>
              <th style={{width:20}}></th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.subtasks.map((item,index)=>
              <tr key={item.id}>
                <td><Input type="checkbox" checked={item.done} onChange={()=>{
                    let newData=[...this.state.subtasks];
                    newData[index].done=!newData[index].done;
                    rebase.updateDoc('proj-subtasks/'+item.id,{done:item.done});
                    this.setState({subtasks:newData});
                  }} /></td>
                <td><Input type="text"
                  value={this.state.focusedSubtask===item.id?this.state.editedSubtaskTitle:item.title}
                  onBlur={() => {
                  rebase.updateDoc('proj-subtasks/'+item.id,{title:this.state.editedSubtaskTitle});
                  let newSubtasks=[...this.state.subtasks];
                  newSubtasks[index].title=this.state.editedSubtaskTitle;
                  this.setState({ focusedSubtask: null, subtasks:newSubtasks });
                  }}
                  onFocus={() => {
                    this.setState({
                      editedSubtaskTitle: item.title,
                      focusedSubtask: item.id
                    });
                  }}
                  onChange={e =>{
                    this.setState({ editedSubtaskTitle: e.target.value })}
                  }

                  className="invisible-input" /></td>
                <td>
                  <button
                    className="btn"
                    type="button"
                    >
                    <i className="fa fa-trash primary-color" onClick={()=>this.deleteSubtask(item.id)} />
                  </button>
                </td>
              </tr>
            )
          }
            <tr>
              <td colSpan={2}><Input type="text" value={this.state.newSubtask} onChange={(e)=>this.setState({newSubtask:e.target.value})} /></td>
              <td>
                <button
                  className="btn"
                  type="button"
                  onClick={this.submitSubtask.bind(this)}
                >
                  <i className="fa fa-plus primary-color" />
                </button>
              </td>
            </tr>
          </tbody>
        </Table>

      </div>
    );
  }
}
