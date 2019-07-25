import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import ReportDetail from "./reportDetail";

const ITEMS =[
		{
			id: 0,
			sendTestDate: "27.6.2016 13:14:25",
			responseDateTime: "27.6.2016 13:14:25",
			responseTime: "5",
			twentyFive: "25",
			status: "OK",
			},
		{
			id: 1,
			sendTestDate: "27.6.2016 13:14:25",
			responseDateTime: "27.6.2016 13:14:25",
			responseTime: "5",
			twentyFive: "25",
			status: "OK",
		},{
			id: 2,
			sendTestDate: "27.6.2016 13:14:25",
			responseDateTime: "27.6.2016 13:14:25",
			responseTime: "5",
			twentyFive: "25",
			status: "OK",
		},
]

export default class Reports extends Component{
  constructor(props){
    super(props);
    this.state={

      opendedModal: false,
      saving:false,
    }
  }

  render(){
      return (
        <div className="flex">
					<table className="table">
							<thead>
								<tr>
									<th>Send test date</th>
									<th>Response date time</th>
									<th>Response time (min:sec)</th>
									<th></th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{
									ITEMS.map(item =>
										<tr
											className="clickable"
											key={item.id}
											onClick={()=>{
												this.setState({
													openedModal: true,
													reportID: item.id
												})
											}}>
											<td>{item.sendTestDate}</td>
											<td>{item.responseDateTime}</td>
											<td>{item.responseTime}</td>
											<td>{item.twentyFive}</td>
											<td>{item.status}</td>
										</tr>
									)
								}
							</tbody>
						</table>

						<Modal className="w-50" isOpen={this.state.openedModal} toggle={() => this.setState({openedModal:!this.state.openedModal})} >
			        <ModalBody>
			          <ReportDetail id={this.state.reportID} isModal={true} />
			        </ModalBody>
			        <ModalFooter>
			          <Button className="btn-link mr-auto" onClick={() => this.setState({openedModal:!this.state.openedModal})}>
			            Close
			          </Button>
			        </ModalFooter>
			      </Modal>


  			</div>
      )
  }
}
