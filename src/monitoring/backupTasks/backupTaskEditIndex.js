import React, { Component } from 'react';

import BackupTaskEdit from './backupTaskEdit';
import BackupTaskShowInfo from './backupTaskShowInfo';


export default class BackupTaskEditIndex extends Component{
  constructor(props){
    super(props);
    this.state={
			showEdit: false,
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
						<BackupTaskEdit {...this.props} id={this.props.id} toggleEdit={() => this.toggleEdit()} />
					}
					{
						!this.state.showEdit
						&&
						<BackupTaskShowInfo {...this.props} id={this.props.id} toggleEdit={() => this.toggleEdit()} />
					}
  			</div>
      )
  }
}
