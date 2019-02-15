import {Component} from 'react';

export default class Reroute extends Component {
  constructor(props){
    super(props);
    this.props.history.push('./demoHelpdesk');
  }
  render(){
    return null;
  }
}
