import React, { Component } from 'react';

import MailServerEdit from './mailServerEdit';
import MailServerShowInfo from './mailServerShowInfo';

export default class MailServerEditIndex extends Component{
  constructor(props){
    super(props);
    this.state={
      showEdit: false,
      openedID: 0,
    }
		this.toggleEdit.bind(this);
  }

  componentWillReceiveProps(props){
    if (this.props != props){
      this.setState({
        openedID: props.match.params.itemID,
      });
    }
  }

	toggleEdit(){
		this.setState({
			showEdit: !this.state.showEdit,
		})
	}

  render(){
      return (
        <div className={"flex p-t-15 scrollable " + (this.props.isModal ? "" : " card-box fit-with-header-and-commandbar ")}>
					{ this.state.showEdit
						&&
						<MailServerEdit id={this.state.openedID} toggleEdit={() => this.toggleEdit()} />
					}
					{
						!this.state.showEdit
						&&
						<MailServerShowInfo id={this.state.openedID} toggleEdit={() => this.toggleEdit()} />
					}
  			</div>
      )
  }
}
