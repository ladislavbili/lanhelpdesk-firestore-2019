import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../../index';
import WorkTypeAdd from './workTypeAdd';
import WorkTypeEdit from './workTypeEdit';

export default class WorkTypesList extends Component{
  constructor(props){
    super(props);
    this.state={
      workTypes:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/workTypes', {
      context: this,
      withIds: true,
      then:content=>{this.setState({workTypes:content, workTypeFilter:''})},
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
              <FormControl type="text" onChange={(e)=>this.setState({workTypeFilter:e.target.value})} />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Table striped condensed hover>
            <thead>
              <tr className="clickable">
                <th>Work type name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/workTypes/add')}>
                <td>+ Add work type</td>
              </tr>
              {this.state.workTypes.filter((item)=>item.title.toLowerCase().includes(this.state.workTypeFilter.toLowerCase())).map((workType)=>
                <tr key={workType.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/workTypes/'+workType.id)}>
                  <td>{workType.title}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="col-6 withSeparator">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <WorkTypeAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.workTypes.some((item)=>item.id===this.props.match.params.id) && <WorkTypeEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
