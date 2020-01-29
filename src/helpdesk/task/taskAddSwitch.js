import React, { Component } from 'react';
import TaskAdd from './taskAdd';
import TaskAdd2 from './taskAdd2';

export default class TaskAddSwitch extends Component{
  constructor(props){
    super(props);
    this.state={
      add: 0,
    }
  }

  switch(){
    this.setState({
      add: (this.state.add === 0 ? 1 : 0),
    })
  }

  render(){
    if (this.state.add === 0){
      return (
        <TaskAdd switch={() => this.switch()} {...this.props}/>
      )
    }
	  return (
		    <TaskAdd2 switch={() => this.switch()} {...this.props}/>
    );
  }
}
