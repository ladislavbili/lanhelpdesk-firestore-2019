import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';
import { } from '../../helperFunctions';
import Select from 'react-select';

export default class InputSelectList extends Component{
  constructor(props){
    super(props);
    this.state={
      editID:null,
      editFake:null,
      editInput:'',
      newID:0,

      newOptionID:0,

      editOptIndex:'',
      editOptValue:'',
    }

    this.onFocus.bind(this);

  }

  onBlur(){
    let body={
      id:this.state.editID,
      fake:this.state.editFake,
      input:this.state.editInput,
    }
    let newData = [...this.props.items];
    let index = newData.findIndex((item)=>item.id===body.id);
    newData[index]={...newData[index],...body};
    this.props.onChange(newData);
    this.setState({ editID: null });
  }

  onFocus(item){
    this.setState({
      editID: item.id,
      editFake: item.fake,
      editInput: item.label,
    });
  }

  render(){
    return (
      <div>
        {
          this.props.items.sort((item1,item2)=>item1.order-item2.order).map((item)=>
          <div key={item.id} style={{marginBottom: "10px"}}>
            <div className="row">
              <div style={{width: (this.props.width ? this.props.width : 150)}}>
                <Input
                  type="text"
                  value={item.id === this.state.editID
                    ? this.state.editInput
                    : item.input}
                    onChange={e =>{
                    this.setState({
                      editInput: e.target.value
                     })}}
                  onBlur={this.onBlur.bind(this)}
                  onFocus={()=>this.onFocus(item)}
                  />
              </div>

              <div style={{width: this.props.width ? 1000-this.props.width-20 : 150}}>
                <Select
                  value={item.type}
                  onChange={(type)=>{
                    let newData = [...this.props.items];
                    let index = newData.findIndex((item2)=>item2.id===item.id);
                    newData[index] = {...newData[index],type};
                    this.props.onChange(newData);
                  }}
                  options={this.props.options}
                  />
                {item.type.id==='select' &&
                  <div>
                    <div>
                      {
                        item.options.map((option)=>
                          <div className="row" key={option.id} style={{marginBottom: "10px"}}>
                            <div style={{flex:1}}>
                              <Input
                                type="text"
                                value={option.id === this.state.editOptIndex
                                  ? this.state.editOptValue
                                  : option.value}
                                  onChange={e =>{
                                  this.setState({
                                    editOptValue: e.target.value
                                   })}}
                                onBlur={()=>{
                                  let newOptions=[...item.options];
                                  newOptions[newOptions.findIndex((item=>item.id===option.id))].value = this.state.editOptValue;
                                  let newData = [...this.props.items];
                                  let index = newData.findIndex((item2)=>item2.id===item.id);
                                  newData[index]={...newData[index],options:newOptions};
                                  this.props.onChange(newData);
                                  this.setState({ editOptIndex: null });

                                }}
                                onFocus={()=>{
                                  this.setState({
                                    editOptIndex: option.id,
                                    editOptValue: option.value
                                  });
                                }}
                                />
                            </div>
                            <div>
                              <button className="btn btn-link waves-effect"
                                onClick={()=>{
                                  let newOptions=[...item.options];
                                  newOptions.splice(newOptions.findIndex((item)=>item.id===option.id),1);
                                  let newData = [...this.props.items];
                                  let index = newData.findIndex((item2)=>item2.id===item.id);
                                  newData[index]={...newData[index],options:newOptions};
                                  this.props.onChange(newData);
                                    }}>
                                  <i className="fa fa-times"  />
                              </button>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                }
              </div>
              <div>
                <button className="btn btn-link btn-link waves-effect" onClick={()=>{this.props.removeItem(item.id);}}>
                    <i className="fa fa-times"  />
                </button>
                {item.type.id==='select' &&
                  <Button color="primary" style={{height:38}} onClick={()=>{
                    let newOptions=[...item.options,{value:'',id:this.state.newOptionID}];
                    let newData = [...this.props.items];
                    let index = newData.findIndex((item2)=>item2.id===item.id);
                    newData[index]={...newData[index],options:newOptions};
                    this.setState({ newOptionID: this.state.newOptionID+1 });
                    this.props.onChange(newData);
                  }}>Add option</Button>
                }
                <button className="btn btn-link waves-effect" disabled={item.order >= this.props.items.length} onClick={()=>{
                  let newOrder=item.order+1;
                  let newData = [...this.props.items];
                  newData.find((item2)=>item2.order===newOrder).order=item.order;
                  newData.find((item2)=>item2.id===item.id).order=newOrder;
                  this.props.onChange(newData);
                  }}>
                    <i className="fa fa-arrow-down"  />
                </button>
                <button className="btn btn-link waves-effect" disabled={item.order === 1} onClick={()=>{
                  let newOrder=item.order-1;
                  let newData = [...this.props.items];
                  newData.find((item2)=>item2.order===newOrder).order=item.order;
                  newData.find((item2)=>item2.id===item.id).order=newOrder;
                  this.props.onChange(newData);
                  }}>
                    <i className="fa fa-arrow-up" />
                </button>
              </div>
            </div>
          </div>
        )}
        <Button color="primary" onClick={()=>{
            this.props.onChange(
              [ ...this.props.items,
                {
                  id: this.state.newID,
                  fake:true,
                  input:"",
                  type: this.props.options[0],
                  options:[],
                  order:this.props.items.length+1
                }
            ]);
              this.setState({newID:this.state.newID+1})}}>{this.props.addLabel}</Button>
      </div>
    );
  }
}
