import React, { Component } from 'react';
import { Input, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';

export default class AttributesHandler extends Component{
  constructor(props){
    super(props);
    this.state={
      editID:null,
      editValue:''
    }
    this.drawAttribute.bind(this);

  }

  drawAttribute(attribute){
    switch (attribute.type.id) {
      case 'input':{
        return <Input type="text" value={this.props.values[attribute.id]} onChange={(e)=>this.props.setValue(attribute.id,e.target.value)}/>
      }
      case 'textarea':{
        return <Input type="textarea" value={this.props.values[attribute.id]} onChange={(e)=>this.props.setValue(attribute.id,e.target.value)}/>
      }
      case 'select':{
        return <Select options={attribute.options}  value={this.props.values[attribute.id]} onChange={(item)=>this.props.setValue(attribute.id,item)} />
      }
      default:
        return <p>{attribute.type.id} of {attribute.title}</p>
    }
  }

  render(){
    return (
      <div>
        {
          this.props.attributes.sort((item1,item2)=>item1.order-item2.order).map((item)=>
          <FormGroup key={item.id}>
            <Label>{item.title}</Label>
            {this.drawAttribute(item)}
          </FormGroup>
        )}
      </div>
    );
  }
}
