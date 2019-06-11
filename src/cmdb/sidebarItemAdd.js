import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../index';
import { calculateTextAreaHeight} from '../helperFunctions';
import InputSelectList from './components/inputSelectList';
const inputSelectOptions=[{id:'input',title:'Input',value:'input',label:'Input'},{id:'select',title:'Select',value:'select',label:'Select'},{id:'textarea',title:'Text Area',value:'textarea',label:'Text Area'}];

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
    let attributes = [...this.state.attributes];
    let attribute = attributes.find((item)=>item.id===id);
    attributes = attributes.map((item)=>{
      return {...item, order:item.order>attribute.order?item.order-1:item.order}
    });
    attributes.splice(attributes.findIndex((item)=>item.id===id),1);
    this.setState({attributes});
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
              this.setState({bacupTasksLabel:e.target.value, backupTasksHeight:calculateTextAreaHeight(e)});
            }}
          />
        </FormGroup>

        <FormGroup>
          <Label for="name">Custom attributes</Label>
        <InputSelectList
          items={this.state.attributes}
          onChange={(items)=>this.setState({attributes:items})}
          removeItem={this.removeAttribute.bind(this)}
          width={300}
          options={inputSelectOptions}
          addLabel="Add"
          />

        </FormGroup>
        <div>

        </div>
        <Button color="primary" disabled={this.state.saving||this.urlInUse()} onClick={()=>{
            this.setState({saving:true});
            let attributes = [...this.state.attributes].map((att)=>{
              let attribute = {...att};
              delete attribute['id'];
              delete attribute['fake'];
              return attribute;
            });
            let body = {
              title:this.state.title,
              url:this.state.url,
              bacupTasksLabel:this.state.bacupTasksLabel,
              attributes
              }
            rebase.addToCollection('/cmdb-sidebar', body)
              .then((response)=>{
                this.setState({title:'',url:'',saving:false,bacupTasksLabel:'', backupTasksHeight:29,attributes:[]})
              });
          }}>{this.state.saving?'Adding...':'Add sidebar item'}</Button>
      </div>
    );
  }
}
