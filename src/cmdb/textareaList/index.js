import React, { Component } from 'react';
import { Button, Label, Input, Col } from 'reactstrap';


export default class TextareaList extends Component{
  constructor(props){
    super(props);
    this.state={
      editText:'',
      editID:null,
      editFake:null,
      newID:0,
    }
  }

  render(){
    return (
      <div>
        {
          this.props.items.map((item,index)=>
          <div className="row" key={item.id}>
            <Label>
              <div style={{width:this.props.width?this.props.width:150, fontWeight: 50}} dangerouslySetInnerHTML ={{__html:this.props.label}}/>
            </Label>

          <div style={{width:this.props.width?1000-this.props.width:150}}>
            <Input
              type="textarea"
              rows={this.props.rows ? this.props.rows : 3}
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
                  });
                }}
                onChange={e =>{
                  this.setState({ editText: e.target.value })}
                }
                />
            </div>
              <Button outline color="danger" size="sm" style={{marginBottom: "20px", marginLeft: "900px", width: "100px", border: "0px"}} onClick={()=>{this.props.removeItem(index);}}>Remove</Button>

          </div>
        )}
        <Button color="primary" onClick={()=>{this.props.onChange([{id:this.state.newID,text:"",fake:true},...this.props.items]);this.setState({newID:this.state.newID+1})}}>{this.props.addLabel}</Button>

      </div>
    );
  }
}
