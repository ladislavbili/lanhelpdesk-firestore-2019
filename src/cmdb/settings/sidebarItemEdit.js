import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../index';
import { calculateTextAreaHeight} from '../../helperFunctions';
import InputSelectList from '../components/inputSelectList';
const inputSelectOptions=[{id:'input',title:'Input',value:'input',label:'Input'},{id:'select',title:'Select',value:'select',label:'Select'},{id:'textarea',title:'Text Area',value:'textarea',label:'Text Area'}];

export default class SidebarItemEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      saving:false,

      title:'',
      url:'',
      bacupTasksLabel:'',
      backupTasksHeight:29,
      sidebarItems:[],
      attributes:[],
      newAttributeID:0
    }
    this.urlInUse.bind(this);
    this.setData.bind(this);
    this.setData(this.props.match.params.sidebarID);
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

  setData(id){
    let item = this.state.sidebarItems.find((item)=>item.id===id);
    if(item===undefined){
      rebase.get('cmdb-sidebar/'+id, {
        context: this,
      }).then((item)=>{
        this.setState({
          title:item.title,
          url:item.url,
          bacupTasksLabel:item.bacupTasksLabel,
          backupTasksHeight:item.backupTasksHeight,
          newAttributeID:item.newAttributeID,
          attributes:item.attributes
        })
      });
    }else{
      this.setState({
        title:item.title,
        url:item.url,
        bacupTasksLabel:item.bacupTasksLabel,
        backupTasksHeight:item.backupTasksHeight,
        newAttributeID:item.newAttributeID,
        attributes:item.attributes
      })
    }
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.sidebarID!==props.match.params.sidebarID){
      this.setData(props.match.params.sidebarID);
    }
  }


  urlInUse(){
    return this.state.sidebarItems.filter((item)=>item.id!==this.props.match.params.sidebarID).map((item)=>item.url).includes(this.state.url)||this.state.url===''
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
          newID={this.state.newAttributeID}
          increaseID={()=>{this.setState({newAttributeID:this.state.newAttributeID+1})}}
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
              return attribute;
            });
            let body = {
              title:this.state.title,
              url:this.state.url,
              bacupTasksLabel:this.state.bacupTasksLabel,
              attributes
              }
              rebase.updateDoc('/cmdb-sidebar/'+this.props.match.params.sidebarID, body)
              .then((response)=>{
                this.setState({saving:false})
              });
          }}>{this.state.saving?'Saving...':'Save sidebar item'}</Button>
      </div>
    );
  }
}
