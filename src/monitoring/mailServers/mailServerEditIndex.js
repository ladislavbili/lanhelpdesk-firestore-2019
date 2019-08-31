import React, { Component } from 'react';

import MailServerEdit from './mailServerEdit';
import MailServerShowInfo from './mailServerShowInfo';

export default class MailServerEditIndex extends Component{
  constructor(props){
    super(props);
    this.state={
      showEdit: false,
      id: props.id,
    }
		this.toggleEdit.bind(this);
  }

  componentWillReceiveProps(props){
    if (this.props !== props){
      this.setState({
        id: props.id,
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
						<MailServerEdit id={this.props.id} toggleEdit={() => this.toggleEdit()} />
					}
					{
						!this.state.showEdit
						&&
						<MailServerShowInfo id={this.props.id} toggleEdit={() => this.toggleEdit()} />
					}
  			</div>
      )
  }
}
