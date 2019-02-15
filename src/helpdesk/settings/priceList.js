import React, { Component } from 'react';
import { Table, FormGroup, FormControl,InputGroup, Glyphicon } from 'react-bootstrap';
import {rebase} from '../../index';
import PriceAdd from './priceAdd';
import PriceEdit from './priceEdit';

export default class PriceList extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelist:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/pricelists', {
      context: this,
      withIds: true,
      then:content=>{this.setState({pricelist:content, pricelistFilter:''})},
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
              <FormControl type="text" onChange={(e)=>this.setState({pricelistFilter:e.target.value})} />
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Table striped condensed hover>
            <thead>
              <tr className="clickable">
                <th>Price list</th>
              </tr>
            </thead>
            <tbody>
              <tr className="clickable" onClick={()=>this.props.history.push('/helpdesk/settings/pricelists/add')}>
                <td>+ Add new pricelist</td>
              </tr>
              {this.state.pricelist.filter((item)=>item.title.toLowerCase().includes(this.state.pricelistFilter.toLowerCase())).map((pricelist)=>
                <tr key={pricelist.id} className="clickable" onClick={()=>{this.props.history.push('/helpdesk/settings/pricelists/'+pricelist.id)}}>
                  <td>{pricelist.title}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="col-6 withSeparator">
          {
            this.props.match.params.id && this.props.match.params.id==='add' && <PriceAdd />
          }
          {
            this.props.match.params.id && this.props.match.params.id!=='add' && this.state.pricelist.some((item)=>item.id===this.props.match.params.id) && <PriceEdit match={this.props.match} />
          }
        </div>
      </div>
    );
  }
}
