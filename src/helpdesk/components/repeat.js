import React, { Component } from 'react';
import Select from 'react-select';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FormGroup, Label, Input } from 'reactstrap';
import {selectStyle} from '../../scss/selectStyles';
var intervals = [{title:'Deň',value:86400000,label:'Deň'},{title:'Týždeň',value:604800016.56,label:'Týždeň'},{title:'Mesiac',value:2629800000,label:'Mesiac'}];

export default class Repeat extends Component{
constructor(props) {
  super(props);
  this.state = {
    open: false,
    startAt:"",
    repeatEvery:intervals[0].value,
    repeatInterval:intervals[0],
  };
  this.toggleRepeat = this.toggleRepeat.bind(this);
}

componentWillReceiveProps(props){
  if(this.props.taskID!==props.taskID){
    this.setState({open: false})
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
  if(this.props.repeat){
    this.setState({
      startAt:this.props.repeat.startAt ? new Date(this.props.repeat.startAt).toISOString().replace("Z", "") : "",
      repeatEvery:this.props.repeat.repeatEvery,
      repeatInterval:intervals.find((interval)=>interval.title===this.props.repeat.repeatInterval),
      open:!this.state.open
    });
  }else{
    this.setState({
      open: !this.state.open,
      startAt:"",
      repeatEvery:intervals[0].value,
      repeatInterval:intervals[0],
    });
  }
}

render() {
  const repeatInterval = this.props.repeat?(intervals.find((interval)=>interval.title===this.props.repeat.repeatInterval)):null;
  return (
    <div>
      <Button type="button" id="openPopover" onClick={this.openRepeat}>
        {this.props.repeat?("Opakovať každý "+ parseFloat((this.props.repeat.repeatEvery/repeatInterval.value).toFixed(2)) + ' ' + repeatInterval.title ) :"No repeat"}
      </Button>
      <Popover placement="bottom" isOpen={this.state.open} target="openPopover" toggle={this.toggleRepeat}>
        <PopoverHeader>Opakovanie</PopoverHeader>
        <PopoverBody>
          <div>
            <FormGroup>
              <Label>Start date *</Label>
              <Input type="datetime-local"
                placeholder="Enter start date"
                value={this.state.startAt}
                onChange={(e)=>this.setState({startAt: e.target.value})}
                />
            </FormGroup>

            <FormGroup>
              <Label>Repeat every *</Label>
                <div className="row">
                <div className="w-50 p-r-20">
                  <Input type="number"
                    className={(this.state.repeatEvery/this.state.repeatInterval.value < 0 ) ? "form-control-warning" : ""}
                    placeholder="Enter number"
                    value={(this.state.repeatEvery/this.state.repeatInterval.value )}
                    onChange={(e)=>{
                      this.setState({repeatEvery: e.target.value*this.state.repeatInterval.value})}
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
            <div>
              <Button type="button" disabled={this.state.repeatEvery <= 0 || isNaN(new Date(this.state.startAt).getTime())  }
                onClick={()=>{
                  this.props.submitRepeat({startAt:this.state.startAt,repeatEvery:this.state.repeatEvery,repeatInterval:this.state.repeatInterval.title});
                  this.setState({open:false});
                }}>
                Submit
              </Button>
              <Button type="button" disabled={this.props.repeat===null}
                onClick={this.props.deleteRepeat}>
                Clear interval
              </Button>

            </div>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
}
