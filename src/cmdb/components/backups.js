import React, { Component } from 'react';
import { Button, Label, Input } from 'reactstrap';
import {calculateTextAreaHeight} from '../../helperFunctions';
import BackupList from './backupList';


export default class Backups extends Component{
  constructor(props){
    super(props);
    this.state={
      editText:'',
      editID:null,
      editFake:null,
      newID:0,
      editTextHeight:29,
    }
  }

  render(){
    return (
      <div className="m-t-10">
        {
          this.props.items.map((item,index)=>
          <div key={item.id} >
            <div key={item.id}>
              <Label>
                <div dangerouslySetInnerHTML ={{__html:this.props.label}}/>
              </Label>

            <div>
              <Input
                className="no-scrolling"
                style={{height:item.id===this.state.editID?this.state.editTextHeight:item.textHeight}}
                type="textarea"
                value={
                  item.id === this.state.editID
                    ? this.state.editText
                    : item.text
                  }
                  onBlur={() => {
                    let body={
                      text:this.state.editText,
                      id:this.state.editID,
                      fake:this.state.editFake,
                      textHeight:this.state.editTextHeight
                    }
                    let newData = [...this.props.items];
                    newData[index]=body;
                    this.props.onChange(newData);
                    this.setState({ editID: null });
                  }}
                  onFocus={() => {
                    this.setState({
                      editText:item.text,
                      editFake:item.fake,
                      editID:item.id,
                      editTextHeight:item.textHeight
                    });
                  }}
                  onChange={e =>{
                    this.setState({ editText: e.target.value, editTextHeight:calculateTextAreaHeight(e) })}
                  }
                  />
              </div>
            </div>
            <BackupList id={item.id} items={item.backupList?item.backupList:[]}
              onChange={(items)=>{
                let newData = [...this.props.items];
                newData[index].backupList=items;
                this.props.onChange(newData);
              }}
            />
          <Button className="btn-link" onClick={()=>{this.props.removeItem(item.id);}}>Remove</Button>
          <hr className="m-b-10"/>
          </div>
        )}
        <Button className="btn" onClick={()=>{this.props.onChange([{id:this.state.newID,text:"",textHeight:29,fake:true,backupList:[]},...this.props.items]);this.setState({newID:this.state.newID+1})}}>{this.props.addLabel}</Button>
      </div>
    );
  }
}
