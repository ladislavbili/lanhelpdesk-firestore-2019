import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon, InputGroupText, Alert } from 'reactstrap';
import {toSelArr,snapshotToArray} from '../../helperFunctions';
import Select from 'react-select';

const REPEAT = [
  {label: "Denne", value: 1},
  {label: "Týždenne", value: 2},
  {label: "Mesačne", value: 3},
  {label: "Ročne", value: 4},
  {label: "Podľa potreby", value: 5}
];

export default class UnitAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      folders:[],
      saving:false,

      title: "",
      folder:null,
      price: 0.00,
      repeat: "",
      startDate: "",
      note:'',
    }
    this.fetch.bind(this);
    this.fetch(this.props.match.params.passID);
  }

  fetch(id){
    Promise.all([
      rebase.get('expenditures-instances/'+id, {
        context: this,
      }),
      database.collection('expenditures-folders').get()
    ])
    .then(([instance,content])=>{
        let arr = toSelArr(snapshotToArray(content));
        let folders = arr.map(f => {
        let newF = {...f};
        newF["value"] = f.id;
        newF["label"] = f.title;
        return newF;
      });
      this.setState({
        title:  instance.title,
        folder: folders.filter(f => f.id === instance.folder)[0],
        price:  instance.price,
        repeat:  REPEAT.filter(r => r.label === instance.repeat)[0],
        startDate:  instance.startDate,
        note: instance.note,
        folders
      });
    });
  }
  /*
  rebase.get('expenditures-instances/'+id, {
    context: this,
  }).then((instance) => {
    rebase.get('expenditures-folders', {
      context: this,
      withIds: true,
    }).then((content) => {
      let folders = content.map(f => {
      let newF = {...f};
      newF["value"] = f.id;
      newF["label"] = f.title;
      return newF;
    });
      this.setState({
        title:  instance.title,
        folder: instance.folder,
        price:  instance.price,
        repeat:  instance.repeat,
        startDate:  instance.startDate,
        note: instance.note,
        folders
      });
    })
  });
  */


  render(){
    console.log(this.state);
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
          <div className="ml-auto mr-auto" style={{maxWidth:1000}}>
            <FormGroup>
              <Label>Názov</Label>
              <Input type="text" placeholder="zadajte názov" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>

          <FormGroup>
            <Label>Folder</Label>
            <Select
              className="supressDefaultSelectStyle"
              options={this.state.folders}
              value={this.state.folder}
              onChange={e =>{ this.setState({ folder: e }); }}
                />
          </FormGroup>
          <FormGroup>
            <Label>Suma</Label>
            <Input type="number" placeholder="0.00" required name="price" min="0" value="0" step="0.01" title="Currency" pattern="^\d+(?:\.\d{1,2})?$" value={this.state.price} onChange={(e)=> this.setState({price: e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Opakovanie</Label>
              <Select
                className="supressDefaultSelectStyle"
                options={REPEAT}
                value={this.state.repeat}
                onChange={e =>{ this.setState({ repeat: e }); }}
                  />
          </FormGroup>

          <FormGroup>
            <Label>Začiatočný dátum</Label>
            <Input type="date" placeholder="Expiration date" value={this.state.startDate} onChange={(e)=>this.setState({startDate:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Note</Label>
            <Input type="textarea" placeholder="Leave a note here" value={this.state.note} onChange={(e)=>this.setState({note:e.target.value})} />
          </FormGroup>

        <Button color="secondary" onClick={this.props.history.goBack}>Cancel</Button>
{"    "}
        <Button color="primary" disabled={this.state.saving||this.state.loading||this.state.title===""||this.state.folder===null} onClick={()=>{
            this.setState({saving:true});
            let body = {
              title: this.state.title,
              folder: this.state.folder.id,
              repeat:this.state.repeat.label,
              price: this.state.price,
              startDate: this.state.startDate,
              note: this.state.note,
            };
            rebase.updateDoc('expenditures-instances/'+this.props.match.params.passID, body)
              .then((response)=>{
                this.setState({saving:false});
                this.props.history.goBack();
              });
          }}>{this.state.saving?'Saving...':'Save'}</Button>
        </div>
      </div>
    );
  }
}
