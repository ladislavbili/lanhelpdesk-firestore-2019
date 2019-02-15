import React, {Component} from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { SketchPicker } from "react-color";
import base from '../firebase';

export default class ArticleEdit extends Component {

  constructor(props){
    super(props);
    this.state = {
      name:'',
      note:'',
      color:'#FFF',
      hideColor:false,
      tag:null
    }
    this.submit.bind(this);
  }

  componentWillMount(){
      this.ref = base.bindToState(`kb-tags`, {
        context: this,
        state: 'tag',
        asArray: true,
        queries: {
          orderByChild: 'id',
          limitToLast: 1
        }
      });
    }

  componentWillUnmount() {
      base.removeBinding(this.ref);
  }

  submit(){
    let data={
      name:this.state.name,
      note:this.state.note,
      color:this.state.color,
      id:(this.state.tag.length>0?this.state.tag[0].id+1:0)
    }
    base.post(`kb-tags/`+data.id,{data});
    this.props.closeModal();
  }

  render() {
    console.log(this.state.tags);
      return (
      <div style={{padding:10}}>
        <FormGroup bsSize="large" controlId="inputName">
        <label>Tag name</label>
          <FormControl type="text"
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
           value={this.state.name}/>
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
        <label>Tag color</label>
          <FormControl type="text"
            readOnly
            onClick={e => {
              this.setState({ hideColor: false });
            }}
           value={this.state.color}
           style={{color:this.state.color, fontWeight:'bold'}}/>
         {
            !this.state.hideColor&&
            <div>
           <SketchPicker
             id="color"
             color={this.state.color}
             onChangeComplete={value => this.setState({ color: value.hex })}
             />
           <Button onClick={()=>this.setState({ hideColor:true })} bsStyle="primary">Hide color picker</Button>
           </div>
         }
        </FormGroup>
        <FormGroup bsSize="large" controlId="inputName">
        <label>Tag note</label>
          <FormControl type="textarea"
            onChange={e => {
              this.setState({ note: e.target.value });
            }}
           value={this.state.note}/>
        </FormGroup>
          <Button onClick={this.submit.bind(this)} bsStyle="primary">Add</Button>
      </div>
    );
}}
