import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from "react-redux";
import { FormGroup, Label, Button } from 'reactstrap';
import {selectStyle} from '../../scss/selectStyles';
import {setReportMonth, setReportYear} from '../../redux/actions';
var months = [{value:1,label:'January'},{value:2,label:'February'},{value:3,label:'March'},{value:4,label:'April'},{value:5,label:'May'},{value:6,label:'June'},
{value:7,label:'July'},{value:8,label:'August'},{value:9,label:'September'},{value:10,label:'October'},{value:11,label:'November'},{value:12,label:'December'}]
var years = [];

for (let i = (new Date().getFullYear()); i >= 2000; i--) {
  years.push({value:i,label:i});
}

class MonthSelector extends Component {
	constructor(props){
		super(props);
		this.state={
			month:this.props.month,
			year:this.props.year
		}
	}

	render() {
		return (
				<div className="p-20">
					<FormGroup>
						<Label>Select month and year</Label>
							<div className="row">
							<div className="w-50 p-r-20">
								<Select
									value={this.state.month}
									onChange={(e)=> this.setState({month: e})}
									options={months}
									styles={selectStyle}
									/>
							</div>
							<div className="w-50">
								<Select
									value={this.state.year}
									onChange={(e)=> this.setState({year: e})}
									options={years}
									styles={selectStyle}
									/>
							</div>
						</div>
					</FormGroup>
          <Button type="button" disabled={this.state.year===null || this.state.month===null} className="btn-primary flex" onClick={()=>{
              this.props.setReportYear(this.state.year);
              this.props.setReportMonth(this.state.month);
            }}>
						Show
					</Button>
			 </div>
			);
		}
	}

	const mapStateToProps = ({ reportReducer }) => {
		const { year, month } = reportReducer;

		return { year, month }
	};

	export default connect(mapStateToProps, { setReportMonth, setReportYear })(MonthSelector);
