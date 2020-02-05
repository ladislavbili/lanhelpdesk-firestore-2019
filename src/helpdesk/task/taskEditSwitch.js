import React, { Component } from 'react';
import TaskEdit from './taskEdit';
import TaskEdit2 from './taskEdit2';

export default class TaskEditSwitch extends Component{
  constructor(props){
    super(props);
    this.state={
      edit: 0,
    }
  }

  switch(){
    this.setState({
      edit: (this.state.edit === 0 ? 1 : 0),
    })
  }

  render(){
    if (this.state.edit === 0){
      return (
        <TaskEdit switch={() => this.switch()} {...this.props}/>
      )
    }
	  return (
		    <TaskEdit2 switch={() => this.switch()} {...this.props}/>
    );
  }
}