import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../index';
import TextareaListMutable from './components/textareaListBoth';

export default class SidebarItemAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      saving:false,
      url:'',
      bacupTasksLabel:'',
      backupTasksHeight:29,
      sidebarItems:[],
      attributes:[]
    }
    this.urlInUse.bind(this);
  }

  componentWillMount(){
    this.ref = rebase.listenToCollection('/cmdb-sidebar', {
      context: this,
      withIds: true,
      then:content=>{this.setState({sidebarItems:content})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }


  urlInUse(){
    return this.state.sidebarItems.map((item)=>item.url).includes(this.state.url)||this.state.url===''
  }

  removeAttribute(id){
    this.setState({attributes: this.state.attributes.filter((item)=>item.id!==id)});
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
        <FormGroup>
          <Label for="name">Item name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter item name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="name">URL name</Label>
          {this.urlInUse() && <Label for="name" style={{color:'red',fontSize:10,marginLeft:5}}>This URL is already in use or is empty!</Label>}
          <Input type="text" name="name" id="name" placeholder="Enter item name" value={this.state.url} onChange={(e)=>this.setState({url:e.target.value.replace(/\s/g, '').toLowerCase()})} />
        </FormGroup>
        <FormGroup>
          <Label for="backupTasks">Backup tasks label</Label>
          <Input
            type="textarea"
            name="backupTasks"
            id="backupTasks"
            placeholder="Enter backup tasks label"
            style={{height:this.state.backupTasksHeight}}
            value={this.state.bacupTasksLabel}
            onChange={(e)=>{
              this.setState({bacupTasksLabel:e.target.value, textareaHeight:Math.floor((e.target.scrollHeight-29)/21)*21 + 29});
            }}
          />
        </FormGroup>

        <FormGroup>
          <Label for="name">Custom attributes</Label>
        <TextareaListMutable
          items={this.state.attributes}
          onChange={(items)=>this.setState({attributes:items})}
          removeItem={this.removeAttribute.bind(this)}
          width={300}
          label={'Názov'}
          addLabel="Add"
          />

        </FormGroup>
        <div>

        </div>
        <Button color="primary" disabled={this.state.saving||this.urlInUse()} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/cmdb-sidebar', {title:this.state.title,url:this.state.url,bacupTasksLabel:this.state.bacupTasksLabel})
              .then((response)=>{
                this.setState({title:'',url:'',saving:false,bacupTasksLabel:'', backupTasksHeight:29})
              });
          }}>{this.state.saving?'Adding...':'Add sidebar item'}</Button>
      </div>
    );
  }
}
