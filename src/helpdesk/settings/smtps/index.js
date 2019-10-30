import React, { Component } from 'react';
import {Button } from 'reactstrap';
import SMTPAdd from './smtpAdd';
import SMTPEdit from './smtpEdit';

import { connect } from "react-redux";
import {storageSmtpsStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class SMTPsList extends Component{
  constructor(props){
    super(props);
    this.state={
      smtps:[],
      smtpFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.smtps,this.props.smtps)){
      this.setState({smtps:props.smtps})
    }
  }

  componentWillMount(){
    if(!this.props.smtpsActive){
      this.props.storageSmtpsStart();
    }
    this.setState({smtps:this.props.smtps});
  }

  render(){
    return (
      <div className="content">
        <div className="commandbar">
            <div className="commandbar-search">
                <input
                  type="text"
                  className="form-control commandbar-search-text"
                  value={this.state.smtpFilter}
                  onChange={(e)=>this.setState({smtpFilter:e.target.value})}
                  placeholder="Search"
                />
              <button className="commandbar-search-btn" type="button">
                <i className="fa fa-search" />
              </button>
            </div>
            <Button
              className="btn-link center-hor"
              onClick={()=>this.props.history.push('/helpdesk/settings/smtps/add')}>
             <i className="fa fa-plus p-l-5 p-r-5"/> Add SMTP
            </Button>
        </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h4 className="font-24 p-b-10">
  							SMTPs
  						</h4>
              <table className="table table-hover">
                <thead>
                  <tr className="clickable">
                    <th>Title</th>
                    <th>Host</th>
                    <th>Port</th>
                    <th>Username</th>
                    <th>Default</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.smtps.filter((item)=>
                    item.title.toLowerCase().includes(this.state.smtpFilter.toLowerCase())||
                    item.host.toLowerCase().includes(this.state.smtpFilter.toLowerCase())||
                    item.port.toString().toLowerCase().includes(this.state.smtpFilter.toLowerCase())||
                    item.user.toLowerCase().includes(this.state.smtpFilter.toLowerCase())
                  ).map((smtp)=>
                    <tr
                      key={smtp.id}
                      className={"clickable" + (this.props.match.params.id === smtp.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/smtps/'+smtp.id)}>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.title}
                      </td>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.host}
                      </td>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.port}
                      </td>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.user}
                      </td>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.def.toString()}
                      </td>
                    </tr>
                    )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8">
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <SMTPAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.smtps.some((item)=>item.id===this.props.match.params.id) && <SMTPEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageSmtps }) => {
  const { smtpsActive, smtps } = storageSmtps;
  return { smtpsActive, smtps };
};

export default connect(mapStateToProps, { storageSmtpsStart })(SMTPsList);
