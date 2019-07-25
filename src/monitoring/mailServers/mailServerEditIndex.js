import React, { Component } from 'react';

import MailServerEdit from './mailServerEdit';
import MailServerShowInfo from './mailServerShowInfo';

export default class MailServerEditIndex extends Component{
  constructor(props){
    super(props);
    this.state={
    }
		this.toggleEdit.bind(this);
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
						<MailServerEdit {...this.props} id={this.props.id} toggleEdit={() => this.toggleEdit()} />
					}
					{
						!this.state.showEdit
						&&
						<MailServerShowInfo {...this.props} id={this.props.id} toggleEdit={() => this.toggleEdit()} />
					}
  			</div>
      )
  }
}
