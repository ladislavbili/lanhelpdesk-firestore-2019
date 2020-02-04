import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import CommandBar from '../../components/showData/commandBar';
import ListHeader from '../../components/showData/listHeader';
import {testing} from '../../helperFunctions';
import {rebase} from '../../index';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);


class TaskCalendar extends Component {
	constructor(props){
		super(props);
	}

	onEventResize (event){
		console.log(event);
	};

	onEventDrop ({ event, start, end, allDay }) {
		console.log(start);
	};

  render() {
	   return (
  		<div>
				<CommandBar { ...this.props.commandBar } />
				<div className="full-width scroll-visible fit-with-header-and-commandbar task-container p-20">
					<ListHeader { ...this.props.commandBar } listName={ this.props.listName } />
					<DnDCalendar
	          defaultDate = { new Date() }
	          defaultView = "month"
	          events = { this.props.data }
	          localizer = { localizer }
	          onEventDrop = { this.onEventDrop }
	          onEventResize = { this.onEventResize }
	          resizable
						drilldownView="day"
						popup={true}
						views={['month', 'day', 'week', 'agenda']}
						onDoubleClickEvent={(event)=>{console.log('open event');console.log(event);}}
						onSelecting={()=>{console.log('prevent?');return true;}}
	          style = {{ height: "100vh" }}
	        />
				</div>
      </div>
    );
 }
}

const mapStateToProps = ({userReducer}) => {
	return {currentUser:userReducer };
};

export default connect(mapStateToProps, {  })(TaskCalendar);
