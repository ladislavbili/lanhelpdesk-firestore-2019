import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';


export default class TextareaList extends Component{
  constructor(props){
    super(props);
    this.state={
      editText:'',
      editTextHeight: 1,
      editID:null,
      editFake:null,
      editTextLeft:"",
      editTextLeftHeight: 1,
      newID:0,
    }

  }

  render(){
    return (
      <div>
        {
          this.props.items.map((item,index)=>
          <div className="row" key={item.id} style={{marginBottom: "10px"}}>

            <div style={{width: (this.props.width ? this.props.width : 150)}}>
              <Input
                type="textarea"
                rows={item.id === this.state.editID ? this.state.editTextLeftHeight : item.textLeftHeight}
                value={item.id === this.state.editID
                  ? this.state.editTextLeft
                  : item.textLeft}
                  onChange={e =>{
                    let str = e.nativeEvent.target.textContent;
                    let textContentLength = e.nativeEvent.target.textContent.length;
                    let textLength = e.nativeEvent.target.textLength;
                  this.setState({
                    editTextLeft: e.target.value,
                    editTextLeftHeight: (str.split("\n").length + (textLength > textContentLength ? 1 : 0)),
                   })}}
                onBlur={() => {
                  let body={
                    text:this.state.editText,
                    textHeight: this.state.editTextHeight,
                    textLeft:this.state.editTextLeft,
                    textLeftHeight: this.state.editTextLeftHeight,
                    id:this.state.editID,
                    fake:this.state.editFake,
                  }
                  let newData = [...this.props.items];
                  newData[index]=body;
                  this.props.onChange(newData);
                  this.setState({ editID: null });
                }}
                onFocus={() => {
                  this.setState({
                    editText: item.text,
                    editTextHeight: item.textHeight,
                    editTextLeft: item.textLeft,
                    editTextLeftHeight: item.textLeftHeight,
                    editFake: item.fake,
                    editID: item.id,
                  });
                }}
                />
              </div>

          <div style={{width: this.props.width ? 1000-this.props.width-20 : 150}}>
            <Input
              type="textarea"
              rows={item.id === this.state.editID ? this.state.editTextHeight : item.textHeight}
              value={
                item.id === this.state.editID
                  ? this.state.editText
                  : item.text
                }
                onBlur={() => {
                  let body={
                    textLeft:this.state.editTextLeft,
                    textLeftHeight: this.state.editTextLeftHeight,
                    textHeight: this.state.editTextHeight,
                    text:this.state.editText,
                    id:this.state.editID,
                    fake:this.state.editFake,
                  }
                  let newData = [...this.props.items];
                  newData[index]=body;
                  this.props.onChange(newData);
                  this.setState({ editID: null });
                }}
                onFocus={() => {
                  this.setState({
                    editTextLeft:item.textLeft,
                    editTextLeftHeight: item.textLeftHeight,
                    editTextHeight: item.textHeight,
                    editText:item.text,
                    editFake:item.fake,
                    editID:item.id,
                  });
                }}
                onChange={e =>{
                  let str = e.nativeEvent.target.textContent;
                  let textContentLength = e.nativeEvent.target.textContent.length;
                  let textLength = e.nativeEvent.target.textLength;
                  this.setState({
                    editText: e.target.value,
                    editTextHeight: (str.split("\n").length + (textLength > textContentLength ? 1 : 0)),
                   });}
                }
                />
            </div>
            <div>
              <Button outline color="danger" size="sm" style={{border: "0px"}} onClick={()=>{this.props.removeItem(index);}}><i className="fa fa-times" style={{color: "rgb(178, 34, 34)"}} /></Button>
            </div>
          </div>
        )}
        <Button color="primary" onClick={()=>{
            this.props.onChange(
              [
                {id: this.state.newID,
                  text:"",
                  textHeight: 1,
                  textLeft: `Názov`,
                  textLeftHeight: 1,
                  fake:true},
              ...this.props.items
            ]);
              this.setState({newID:this.state.newID+1})}}>{this.props.addLabel}</Button>

      </div>
    );
  }
}
