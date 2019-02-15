import React,{Component} from 'react';
export default class TaskListRow extends Component {
  render(){
    return (<li className="list-group-item" style={{cursor:'pointer',borderLeft:'none',borderRight:'none'}} onClick={()=>this.props.openEdit()} key={this.props.task.id}>
    <div  className="d-flex flex-row justify-content-between">
      <h5>{this.props.task.title}</h5>
      <span className="badge badge-success" style={{backgroundColor:'white',color:'black',padding:4,marginTop:'auto', marginBottom:'auto'}}>{this.props.status.title}
      </span>
    </div>
    <p style={{marginBottom:0}}>
      <span
        className="badge mr-1"
        style={{
          backgroundColor:'red',
          color: "white"
        }}
        >
        test tag
      </span>
    </p>
    <div style={{marginBottom:0}}>
      Zadal:No one
    </div>
    <p style={{marginBottom:0}}>
      <span>
        Riešil/i:No one
      </span>
      <span style={{float:'right'}}>
        Dnes
      </span>
    </p>
  </li>)
}
}
