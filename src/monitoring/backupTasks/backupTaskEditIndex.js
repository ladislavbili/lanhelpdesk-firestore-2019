import React, { Component } from 'react';

import BackupTaskEdit from './backupTaskEdit';
import BackupTaskShowInfo from './backupTaskShowInfo';


export default class BackupTaskEditIndex extends Component{
  constructor(props){
    super(props);
    this.state={
			showEdit: false,
      openedID: 0,
    }
		this.toggleEdit.bind(this);
  }

  componentWillReceiveProps(props){
    if (this.props !== props){
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
						<BackupTaskEdit id={this.state.openedID} toggleEdit={() => this.toggleEdit()} />
					}
					{
						!this.state.showEdit
						&&
						<BackupTaskShowInfo id={this.state.openedID} toggleEdit={() => this.toggleEdit()} />
					}
  			</div>
      )
  }
}
