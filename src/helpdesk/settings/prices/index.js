import React, { Component } from 'react';
import {rebase} from '../../../index';
import PriceAdd from './priceAdd';
import PriceEdit from './priceEdit';
import {Button } from 'reactstrap';

import { connect } from "react-redux";
import {storageHelpPricelistsStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';


class PriceList extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelist:[],
      pricelistFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.pricelists,this.props.pricelists)){
      this.setState({pricelists:props.pricelists})
    }
  }

  componentWillMount(){
    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }
    this.setState({pricelists:this.props.pricelists});
  }

  render(){
    return (
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="container-fluid">
						<div className="row align-items-center">
              <div className="p-2">
                <div className="input-group">
                  <input
                    type="text"
                    onChange={(e)=>this.setState({pricelistFilter:e.target.value})}
                    className="form-control commandbar-search"
                    placeholder="Search task name"
                    style={{ width: 200 }}
                  />
                  <div className="input-group-append">
                    <button className="commandbar-btn-search" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>

              <Button
                className="btn-link t-a-l"
                onClick={()=>this.props.history.push('/helpdesk/settings/pricelists/add')}>
               <i className="fa fa-plus sidebar-icon-center"/> Add new pricelist
              </Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr>
                    <th>Price list</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pricelists.filter((item)=>item.title.toLowerCase().includes(this.state.pricelistFilter.toLowerCase())).map((pricelist)=>
                    <tr key={pricelist.id}
                      className={"clickable" + (this.props.match.params.id === pricelist.id ? " sidebar-item-active":"")}
                      onClick={()=>{this.props.history.push('/helpdesk/settings/pricelists/'+pricelist.id)}}>
                      <td className={(this.props.match.params.id === pricelist.id ? "text-highlight":"")}>
                        {pricelist.title}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8 p-0">
              {
                this.props.match.params.id && this.props.match.params.id==='add' && <PriceAdd />
              }
              {
                this.props.match.params.id && this.props.match.params.id!=='add' && this.state.pricelists.some((item)=>item.id===this.props.match.params.id) && <PriceEdit match={this.props.match} history={this.props.history}/>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpPricelists}) => {
  const { pricelistsActive, pricelists } = storageHelpPricelists;
  return { pricelistsActive, pricelists };
};

export default connect(mapStateToProps, { storageHelpPricelistsStart })(PriceList);
