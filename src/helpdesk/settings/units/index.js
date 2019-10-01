import React, { Component } from 'react';
import {Button } from 'reactstrap';
import UnitAdd from './unitAdd';
import UnitEdit from './unitEdit';

import { connect } from "react-redux";
import {storageHelpUnitsStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class UnitsList extends Component {
  constructor(props){
    super(props);
    this.state={
      units:[],
      unitFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.units,this.props.units)){
      this.setState({units:props.units})
    }
  }

  componentWillMount(){
    if(!this.props.unitsLoaded){
      this.props.storageHelpUnitsStart();
    }
    this.setState({units:this.props.units});
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
                    className="form-control commandbar-search"
                    value={this.state.unitFilter}
                    onChange={(e)=>this.setState({unitFilter:e.target.value})}
                    placeholder="Search"
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
          				onClick={()=>this.props.history.push('/helpdesk/settings/units/add')}>
          			 <i className="fa fa-plus sidebar-icon-center"/> Add unit
          			</Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr className="clickable">
                    <th>Unit name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.units.filter((item)=>item.title.toLowerCase().includes(this.state.unitFilter.toLowerCase())).map((unit)=>
                    <tr
                      key={unit.id}
                      className={"clickable" + (this.props.match.params.id === unit.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/units/'+unit.id)}>
                      <td className={(this.props.match.params.id === unit.id ? "text-highlight":"")}>
                        {unit.title}
                      </td>
                    </tr>
                    )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8 p-0">
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <UnitAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.units.some((item)=>item.id===this.props.match.params.id) && <UnitEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    </div>
    );
  }
}


const mapStateToProps = ({ storageHelpUnits}) => {
  const { unitsActive, units } = storageHelpUnits;
  return { unitsActive, units };
};

export default connect(mapStateToProps, { storageHelpUnitsStart })(UnitsList);
