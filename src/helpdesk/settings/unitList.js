import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../../index';
import UnitAdd from './unitAdd';
import UnitEdit from './unitEdit';

export default class UnitsList extends Component{
  constructor(props){
    super(props);
    this.state={
      units:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/units', {
      context: this,
      withIds: true,
      then:content=>{this.setState({units:content, unitFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return (
      <div className="row flex container container-padding center-ver">
        <div className="col-6">
          <FormGroup>
            <InputGroup>
              <FormControl type="text" onChange={(e)=>this.setState({unitFilter:e.target.value})} />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Table striped condensed hover>
            <thead>
              <tr className="clickable">
                <th>Unit name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/units/add')}>
                <td>+ Add unit</td>
              </tr>
              {this.state.units.filter((item)=>item.title.toLowerCase().includes(this.state.unitFilter.toLowerCase())).map((unit)=>
                <tr key={unit.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/units/'+unit.id)}>
                  <td>{unit.title}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="col-6 withSeparator">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <UnitAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.units.some((item)=>item.id===this.props.match.params.id) && <UnitEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
