import React, { Component } from 'react';
import { connect } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import { setCalendarLayout } from '../../redux/actions';
import CommandBar from '../../components/showData/commandBar';
import ListHeader from '../../components/showData/listHeader';
import {rebase} from '../../index';
import { fromMomentToUnix, timestampToDate, timestampToHoursAndMinutes } from '../../helperFunctions';

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const formats = {

  dayFormat: (date, culture , localizer) => timestampToDate(date),
	timeGutterFormat: (date, culture , localizer) => {
		return timestampToHoursAndMinutes(date);
	},
  dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>{
		return timestampToDate(start) + ' - ' + timestampToDate(end);
	},
	agendaHeaderFormat: ({ start, end }, culture, localizer) =>{
		return timestampToDate(start) + ' - ' + timestampToDate(end);
	},
	selectRangeFormat: ({ start, end }, culture, localizer) =>{
		return timestampToHoursAndMinutes(start) + ' - ' + timestampToHoursAndMinutes(end);
	},
	eventTimeRangeFormat: ({ start, end }, culture, localizer) =>{
		return timestampToHoursAndMinutes(start) + ' - ' + timestampToHoursAndMinutes(end);
	},
}
const DnDCalendar = withDragAndDrop(Calendar);

// http://intljusticemission.github.io/react-big-calendar/examples/index.html

class TaskCalendar extends Component {

	onEventResize (item){
		if(this.props.currentUser.userData.role.value === 0){
			return;
		}
		if(this.props.calendarLayout === 'week'){
			if(!item.event.isTask){
				rebase.updateDoc('/help-calendar_events/'+item.event.eventID, {start:item.start.getTime(),end:item.end.getTime()})
			}else if(item.event.status.action==='pending'){
				console.log(item);
				rebase.updateDoc('/help-tasks/'+item.event.id, { pendingDate:item.start.getTime(), pendingDateTo:item.end.getTime(), pendingChange:true })
			}
		}
	};

	getOnlyDaytime(date){
		return (new Date(date.getFullYear(),date.getMonth(),date.getDate())).getTime();
	}

	onEventDrop (item) {
		if(this.props.currentUser.userData.role.value === 0){
			return;
		}
		//manage calendar all day
		if((item.isAllDay || this.props.calendarLayout === 'month') && item.event.isTask){
			if(['new','open'].includes(item.event.status.action)){
				if(this.getOnlyDaytime(item.start) > this.getOnlyDaytime(new Date())){
					this.props.data.filter((event)=>!event.isTask).forEach((event) => {
						rebase.removeDoc('/help-calendar_events/'+event.eventID);
					});
					console.log(item);
					rebase.updateDoc('/help-tasks/'+item.event.id, {pendingDate:item.start.getTime(),pendingDateTo:fromMomentToUnix(moment(item.end.getTime()).add(30,'minutes')), pendingChange:true, status: this.props.statuses.find((status)=>status.action==='pending').id })
				}else if(this.getOnlyDaytime(item.start) < this.getOnlyDaytime(new Date()) && this.props.statusesLoaded){
					rebase.updateDoc('/help-tasks/'+item.event.id, {closeDate:item.start.getTime(), status: this.props.statuses.find((status)=>status.action==='close').id })
				}
			}else if(item.event.status.action === 'close'){
				rebase.updateDoc('/help-tasks/'+item.event.id, {closeDate:item.start.getTime()});
			}else if(item.event.status.action === 'pending' && this.getOnlyDaytime(item.start) >= this.getOnlyDaytime(new Date())){
				console.log(item);
				rebase.updateDoc('/help-tasks/'+item.event.id, {pendingDate:item.start.getTime(), pendingDateTo:item.end.getTime(), });
			}
			return false;
		}
		//manage calendar with time
		if(this.props.calendarLayout === 'week'){
			if(item.isAllDay){
				return false;
			}
			console.log('on drop');
			//if TASK
			if(item.event.isTask){
				let newEvent = {
					taskID: item.event.id,
					start: item.start.getTime(),
					end: item.end.getTime(),
				}
				//if in fucture, set as PENDING
				if(['new','open'].includes(item.event.status.action) && this.getOnlyDaytime(item.start) > this.getOnlyDaytime(new Date()) ){
					this.props.data.filter((event)=>!event.isTask).forEach((event) => {
						rebase.removeDoc('/help-calendar_events/'+event.eventID);
					});

					rebase.updateDoc('/help-tasks/'+item.event.id, {status: this.props.statuses.find((status)=>status.action==='pending').id, pendingDate:item.start.getTime(), pendingDateTo: fromMomentToUnix(moment(newEvent.start).add(30,'minutes')) ,pendingChange:true })
				//if new it will be open
				}else if(item.event.status.action==='new' && this.props.statusesLoaded){
					//new task is open
					newEvent.end=fromMomentToUnix(moment(newEvent.start).add(2,'hours'));
					rebase.addToCollection('help-calendar_events',newEvent);
					rebase.updateDoc('/help-tasks/'+item.event.id, {status: this.props.statuses.find((status)=>status.action==='open').id })
				}else if(item.event.status.action==='pending'){
					console.log('EEEE');
					console.log(item);
					rebase.updateDoc('/help-tasks/'+item.event.id, { pendingDate:item.start.getTime(), pendingDateTo: item.end.getTime() })
				}else{
					rebase.addToCollection('help-calendar_events',newEvent);
				}
			}else{ //if EVENT
				rebase.updateDoc('/help-calendar_events/'+item.event.eventID, {start:item.start.getTime(),end:item.end.getTime()})
			}
		}
	};

  render() {
		let data = this.props.data.map((event)=>({...event,title:event.titleFunction(event, !event.isTask && this.props.calendarLayout==='month') }))

		//console.log(this.props.data.filter((item)=>item.isTask && item.status.action==='pending'));
		//console.log(this.props.data.filter((item)=>!item.isTask).length);
		if(this.props.match.params.taskID){
			return (<this.props.edit match={this.props.match} columns={true} history={this.props.history} />);
		}
	   return (
  		<div>
				<CommandBar { ...this.props.commandBar } />
				<div className="full-width scroll-visible fit-with-header-and-commandbar task-container p-20">
					<ListHeader { ...this.props.commandBar } listName={ this.props.listName } />
					<DnDCalendar
						events = { data }
	          defaultDate = { new Date() }
	          defaultView = { this.props.calendarLayout }
						style = {{ height: "100vh" }}
						views={['month', 'week']}
						drilldownView="day"
	          localizer = { localizer }
	          resizable
						popup={true}
						formats={formats}


						onEventDrop = { this.onEventDrop.bind(this) }
						onEventResize = { this.onEventResize.bind(this) }

						onDoubleClickEvent={(event)=>{
							this.props.history.push(this.props.link+'/'+event.id);
						}}
						onView={(viewType)=>{
							this.props.setCalendarLayout(viewType);
						}}
	        />
				</div>
      </div>
    );
 }
}

const mapStateToProps = ({userReducer, taskReducer, storageHelpStatuses}) => {
	const currentUser = userReducer;
	const { calendarLayout } = taskReducer;
	const { statusesLoaded, statuses } = storageHelpStatuses;
	return {currentUser, calendarLayout, statusesLoaded, statuses };
};

export default connect(mapStateToProps, { setCalendarLayout })(TaskCalendar);
