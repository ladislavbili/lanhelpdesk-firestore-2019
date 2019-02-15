import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../../index';
import StatusAdd from './statusAdd';
import StatusEdit from './statusEdit';

export default class StatusesList extends Component{
  constructor(props){
    super(props);
    this.state={
      statuses:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/statuses', {
      context: this,
      withIds: true,
      then:content=>{this.setState({statuses:content, statusFilter:''})},
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
              <FormControl type="text" onChange={(e)=>this.setState({statusFilter:e.target.value})} />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Table striped condensed hover>
            <thead>
              <tr className="clickable">
                <th>Status name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/statuses/add')}>
                <td>+ Add status</td>
              </tr>
              {this.state.statuses.filter((item)=>item.title.toLowerCase().includes(this.state.statusFilter.toLowerCase())).map((status)=>
                <tr key={status.id} className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/statuses/'+status.id)}>
                  <td>{status.title}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="col-6 withSeparator">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <StatusAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.statuses.some((item)=>item.id===this.props.match.params.id) && <StatusEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
