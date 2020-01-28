import React, { Component } from 'react';
import Select from 'react-select';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FormGroup, Label, Input } from 'reactstrap';
import DatePicker from 'react-datepicker';

import {selectStyle} from '../../scss/selectStyles';
import datePickerConfig from '../../scss/datePickerConfig';
import {toMomentInput, fromMomentToUnix } from '../../helperFunctions';
var intervals = [{title:null,value:null,label:'Žiadny'},{title:'Deň',value:86400000,label:'Deň'},{title:'Týždeň',value:604800000,label:'Týždeň'},{title:'Mesiac',value:2629800000,label:'Mesiac'}];

export default class Repeat extends Component{
constructor(props) {
  super(props);
  this.state = {
    open: false,
    startAt:null,
    repeatEvery:1,
    repeatInterval:intervals[0],
  };
  this.toggleRepeat = this.toggleRepeat.bind(this);
}

componentWillReceiveProps(props){
  if(this.props.taskID!==props.taskID){
    this.setState({open: false});
    if(props.repeat===null){
      this.setState({
        startAt:null,
        repeatEvery:1,
        repeatInterval:intervals[0],
      });
    }
  }
  if((this.props.repeat===null && props.repeat!==null)|| (this.props.repeat!==null && props.repeat!==null && props.repeat.id!==this.props.repeat.id)){
      let repeatInterval = intervals.find((interval)=>interval.title===props.repeat.repeatInterval);
      this.setState({
        startAt:toMomentInput(props.repeat.startAt),
        repeatEvery:props.repeat.repeatEvery/repeatInterval.value,
        repeatInterval,
      });
  }
}

/*
začiatočný čas + opakovanie den/týžden/mesiac
keď nastane čas opakovania tak sa vytvorí nová úloha
všetky úlohy vytvorené z opakovanej úlohy sú spojené opakovaním - keď sa modifikuje opakovanie v jednej úlohe ta sa modifikuje vo všetkých
doplniť zoznam do tabu opakovaných úloh
kopirujú sa atribúty úlohy + popis + rozpočet bez komentárov
nová úloha vytvorená z opakovania je v stave new
*/

toggleRepeat() {
  if(this.props.disabled){
    return;
  }
  this.setState({open:true});
}

render() {
  const repeatInterval = this.props.repeat?(intervals.find((interval)=>interval.title===this.props.repeat.repeatInterval)):null;
  return (
    <div>
        <div className="row p-r-10">
          <Label className="col-3 col-form-label">Repeat</Label>
          <div className="col-9">
            <Button type="button" className="repeat-btn flex" id={"openPopover"+this.props.taskID} onClick={this.toggleRepeat}>
              {this.props.repeat?("Opakovať každý "+ parseInt(this.props.repeat.repeatEvery/repeatInterval.value) + ' ' + repeatInterval.title) :"No repeat"}
            </Button>
          </div>
        </div>

      <Popover placement="bottom" isOpen={this.state.open && !this.props.disabled} target={"openPopover"+this.props.taskID} toggle={this.toggleRepeat}>
        <PopoverHeader>Opakovanie</PopoverHeader>
        <PopoverBody>
          <div>
            <FormGroup>
              <Label>Start date *</Label>
              <DatePicker
                className="form-control hidden-input"
                selected={this.state.startAt}
                onChange={startAt => {
                  this.setState({ startAt });
                }}
                placeholderText="No start date"
                {...datePickerConfig}
                />
            </FormGroup>

            <FormGroup>
              <Label>Repeat every *</Label>
                <div className="row">
                <div className="w-50 p-r-20">
                  <Input type="number"
                    className={(this.state.repeatEvery < 0 ) ? "form-control-warning" : ""}
                    placeholder="Enter number"
                    value={(this.state.repeatEvery )}
                    onChange={(e)=>{
                      this.setState({repeatEvery: parseInt(e.target.value)})}
                    }
                    />
                </div>
                <div className="w-50">
                  <Select
                    value={this.state.repeatInterval}
                    onChange={(e)=> this.setState({repeatInterval: e})}
                    options={intervals}
                    styles={selectStyle}
                    />
                </div>
                {
                  this.state.repeatEvery <= 0 &&
                  <Label className="warning">Must be bigger than 0.</Label>
                }
              </div>
            </FormGroup>
            <div className="row">
              <div className="flex">
                <Button type="button"
                  onClick={()=>{
                     if(this.state.repeatInterval.value===null || this.state.repeatEvery <= 0 || isNaN(this.state.repeatEvery) || this.state.startAt === null ){
                       if(this.props.repeat!==null){
                         this.props.deleteRepeat();
                       }
                     }else{
                       this.props.submitRepeat({startAt:fromMomentToUnix(this.state.startAt),repeatEvery:this.state.repeatEvery*this.state.repeatInterval.value,repeatInterval:this.state.repeatInterval.title});
                     }
                    this.setState({open:false});
                  }}>
                  Save
                </Button>
              </div>
              <div className="pull-right">
                <Button type="button"
                  onClick={()=>this.setState({open:false})}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
}
