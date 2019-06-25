import React, { Component } from 'react';
import { Table, Input } from 'reactstrap';

export default class ServerAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      editTitle:'',
      editServer:'',
      editTool:'',
      editWhat:'',
      editWhere:'',
      editWhen:'',
      editLength:'',
      editRotation:'',
      editItemID: null,

      newTitle:'',
      newServer:'',
      newTool:'',
      newWhat:'',
      newWhere:'',
      newWhen:'',
      newLength:'',
      newRotation:'',
      newItemID:0
    }
  }

  onBlur(item,index){
    let body={
      title:this.state.editTitle,
      server:this.state.editServer,
      tool:this.state.editTool,
      what:this.state.editWhat,
      where:this.state.editWhere,
      when:this.state.editWhen,
      length:this.state.editLength,
      rotation:this.state.editRotation,
    }
    let newData = [...this.props.items];
    newData[index]=body;
    this.props.onChange(newData);
    this.setState({ editItemID: null });
  }

  onFocus(item,index){
    this.setState({
      editTitle:item.title,
      editServer:item.server,
      editTool:item.tool,
      editWhat:item.what,
      editWhere:item.where,
      editWhen:item.when,
      editLength:item.length,
      editRotation:item.rotation,
      editItemID:item.id
    });
  }

  render(){
    return (
      <Table striped>
        <thead>
          <tr>
            <th>Title</th>
            <th>Server</th>
            <th>Tool</th>
            <th>What</th>
            <th>Where</th>
            <th>When</th>
            <th>Time</th>
            <th>Rotation</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.props.items.map((item,index)=>
            <tr key={item.id}>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editTitle
                      : item.title
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editTitle: e.target.value })}
                    }
                    />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editServer
                      : item.server
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editServer: e.target.value })}
                    }
                    />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editTool
                      : item.tool
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editTool: e.target.value })}
                    }
                    />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editWhat
                      : item.what
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editWhat: e.target.value })}
                    }
                    />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editWhere
                      : item.where
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editWhere: e.target.value })}
                    }
                    />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editWhen
                      : item.when
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editWhen: e.target.value })}
                    }
                    />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editLength
                      : item.length
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editLength: e.target.value })}
                    }
                    />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editRotation
                      : item.rotation
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editRotation: e.target.value })}
                    }
                    />
              </td>
              <td>
                <button className="btn btn-link waves-effect"
                  onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      let newData = [...this.props.items];
                      newData.splice(index,1);
                      this.props.onChange(newData);
                    }
                  }}
                  >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
            )
          }
          <tr>
            <td>
              <Input
                type="text"
                value={this.state.newTitle}
                onChange={(e)=>this.setState({newTitle:e.target.value})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <Input
                type="text"
                value={this.state.newServer}
                onChange={(e)=>this.setState({newServer:e.target.value})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <Input
                type="text"
                value={this.state.newTool}
                onChange={(e)=>this.setState({newTool:e.target.value})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <Input
                type="text"
                value={this.state.newWhat}
                onChange={(e)=>this.setState({newWhat:e.target.value})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <Input
                type="text"
                value={this.state.newWhere}
                onChange={(e)=>this.setState({newWhere:e.target.value})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <Input
                type="text"
                value={this.state.newWhen}
                onChange={(e)=>this.setState({newWhen:e.target.value})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <Input
                type="text"
                value={this.state.newLength}
                onChange={(e)=>this.setState({newLength:e.target.value})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <Input
                type="text"
                value={this.state.newRotation}
                onChange={(e)=>this.setState({newRotation:e.target.value})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <button className="btn btn-link waves-effect"
                disabled={this.state.newIP===''}
                onClick={()=>{
                  let body={
                    title:this.state.newTitle,
                    server:this.state.newServer,
                    tool:this.state.newTool,
                    what:this.state.newWhat,
                    where:this.state.newWhere,
                    when:this.state.newWhen,
                    length:this.state.newLength,
                    rotation:this.state.newRotation,
                    id:this.state.newItemID,
                    fake:true
                  }
                  this.setState({
                    newTitle:'',
                    newServer:'',
                    newTool:'',
                    newWhat:'',
                    newWhere:'',
                    newWhen:'',
                    newLength:'',
                    newRotation:'',
                    newItemID:this.state.newItemID+1
                  });

                  this.props.onChange([...this.props.items,body]);
                  }
                }
                >
                <i className="fa fa-plus" />
              </button>
            </td>

          </tr>
        </tbody>

      </Table>
    );
  }
}
