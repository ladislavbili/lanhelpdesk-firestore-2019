import React, { Component } from 'react';
import TaskEditCol from './taskEdit';
import TaskEditList from './taskEditList';

export default class TaskAddContainer extends Component{
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
