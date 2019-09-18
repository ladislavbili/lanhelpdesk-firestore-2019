import React, { Component } from 'react';
import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import { Modal, ModalBody, Button } from 'reactstrap';
import TaskEditCol from './taskEdit';
import TaskEditList from './taskEditList';

export default class TaskAddContainer extends Component{
  constructor(props){
    super(props);
  }

  render(){
  	  return (
        <div className="flex">
          {
            this.props.columns &&
            <TaskEditCol {...this.props} />
          }
          {
            !this.props.columns &&
           <TaskEditList {...this.props} />
          }
        </div>
      );
  }
}
