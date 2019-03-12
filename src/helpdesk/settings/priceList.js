import React, { Component } from 'react';
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
      <div className="row">
        <div className="col-lg-4">
          <div className="card-box fit-with-header scrollable">
          <div className="input-group">
            <input
              type="text"
              onChange={(e)=>this.setState({pricelistFilter:e.target.value})}
              className="form-control"
              placeholder="Search task name"
              style={{ width: 200 }}
            />
            <div className="input-group-append">
              <button className="btn btn-white" type="button">
                <i className="fa fa-search" />
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mails m-0">
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
          </table>
        </div>
      </div>
        </div>
        <div className="col-lg-8 p-0">
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
