import React, { Component } from 'react';
import { Modal, Button, ModalBody, ModalFooter } from 'reactstrap';
import ReportDetail from "./reportDetail";

const ITEMS =[
		{
			id: 0,
			receiveDate: "27.6.2016 13:14:25",
			subject: "Daily test",
			status: "OK",
			},
		{
			id: 1,
			receiveDate: "27.6.2016 13:14:25",
			subject: "Daily test 2",
			status: "OK",
		},{
			id: 2,
			receiveDate: "27.6.2016 13:14:25",
			subject: "Daily test 3",
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
									<th>Receive date</th>
									<th>Subject</th>
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
											<td>{item.receiveDate}</td>
											<td>{item.subject}</td>
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
