import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import classnames from 'classnames';
import { rebase } from '../../index';
import TaskEdit from '../task/taskEdit';

import { connect } from "react-redux";
import { storageHelpTasksStart } from '../../redux/actions';

class NotificationList extends Component {
  constructor(props){
    super(props);
    this.state={
      searchFilter:''
    }
    this.processNotifications.bind(this);
  }

  componentWillMount(){
    if(!this.props.tasksActive){
      this.props.storageHelpTasksStart();
    }
  }

  processNotifications(){
    return this.props.notifications.map((notification)=>{
      let task = this.props.tasks.find((task)=>task.id === notification.task );
      return{
        ...notification,
        task: task !== undefined ? task : {id:notification.task, title: 'Unknown task' }
      }
    }).filter((notification)=>(`${notification.task.id} ${notification.task.title} ${notification.message}`).toLowerCase().includes(this.state.searchFilter.toLowerCase()))
  }

  markAllAsRead(){
    if(window.confirm('Ste si istý že chcete všetky správy označiť ako prečítané?')){
      this.props.notifications.filter((notification)=>!notification.read).forEach((notification) => rebase.updateDoc('user_notifications/' + notification.id, {read:true}));
    }
  }
  deleteAll(){
    if(window.confirm('Ste si istý že chcete všetky správy vymazať?')){
      this.props.notifications.forEach((notification) => rebase.removeDoc('/user_notifications/'+ notification.id));
      this.props.history.push('/helpdesk/notifications/');
    }
  }
  deleteRead(){
    if(window.confirm('Ste si istý že chcete všetky prečítané správy vymazať?')){
      this.props.notifications.filter((notification)=>notification.read).forEach((notification) => rebase.removeDoc('/user_notifications/'+ notification.id));
      this.props.history.push('/helpdesk/notifications/');
    }
  }

  render(){
    return (
			<div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.searchFilter}
                    onChange={(e)=>this.setState({searchFilter:e.target.value})}
                    placeholder="Search"
                    />
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
  							Notifications
  						</h2>
              <div>
                <button type="button" className="btn btn-link waves-effect" onClick={this.markAllAsRead.bind(this)} disabled={this.props.notifications.every((notification)=>notification.read)}>Označit všetky ako prečítané</button>
                <button type="button" className="btn btn-link waves-effect" onClick={this.deleteAll.bind(this)} disabled={this.props.notifications.length === 0}>Vymazať všetky</button>
                <button type="button" className="btn btn-link waves-effect" onClick={this.deleteRead.bind(this)} disabled={this.props.notifications.filter((notification)=>notification.read).length === 0}>Vymazať prečítané</button>
              </div>
              <div>
                <ListGroup>
                {
                  this.processNotifications().map((notification)=>
                  <ListGroupItem
                    key={notification.id}
                    onClick={()=>{
                      this.props.history.push('/helpdesk/notifications/'+notification.id+'/'+notification.task.id);
                      if(!notification.read){
                        rebase.updateDoc('user_notifications/' + notification.id, {read:true} );
                      }
                    }}
                    className={classnames({ 'notification-read': notification.read, 'notification-not-read': !notification.read, 'selected-item': this.props.match.params.notificationID === notification.id }, "clickable")}
                    >
                    <div>
                      <i className={classnames({ 'far fa-envelope-open': notification.read, 'fas fa-envelope': !notification.read })} /> {notification.message}
                    </div>
                    <div style={{overflowX:'hidden'}}>{notification.task.id}: {notification.task.title}</div>
                  </ListGroupItem>
                )}
                {this.props.notifications.length === 0 && <ListGroupItem>You have no new notifications.</ListGroupItem>}
                </ListGroup>
              </div>

            </div>
          </div>
          <div className="col-lg-8">
            {(this.props.match.params.taskID && this.props.tasks.some((task)=>task.id+""===this.props.match.params.taskID)) ?
              <TaskEdit match={this.props.match} columns={true} history={this.props.history} /> :
              <div className="commandbar"></div>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer, storageHelpTasks }) => {
  const { tasksActive, tasks } = storageHelpTasks;
  return { notifications: userReducer.notifications, tasksActive, tasks };
};

export default connect(mapStateToProps, { storageHelpTasksStart })(NotificationList);
