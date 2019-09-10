import React, { Component } from 'react';
import { Modal, Button, ModalBody, ModalFooter } from 'reactstrap';
import ReportDetail from "./reportDetail";
import {database} from "../../../index";
import {fromMillisec, snapshotToArray} from "../../../helperFunctions";

export default class Reports extends Component{
  constructor(props){
    super(props);
    this.state={
			testResults: [],

      opendedModal: false,
      saving:false,
    }
    this.createListener.bind(this);
  }

	componentWillMount(){
    this.createListener(this.props.id);
	}

  componentWillReceiveProps(props){
    if (props.id !== this.props.id){
      if (this.ref) {
        this.ref();
      }
      this.createListener(props.id);
    }
  }

	componentWillUnmount(){
    this.ref();
	}

  createListener(id){
    this.ref = database.collection("monitoring-notifications_results")
    .where("notification", "==", id)
    .orderBy("receiveDate", "desc")
    .limit(50)
    .onSnapshot((doc) => {
        let data = snapshotToArray(doc);
        this.setState({
          testResults: data
        });
    });
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
									this.state.testResults.map(item =>
										<tr
											className="clickable"
											key={item.id}
											onClick={()=>{
												this.setState({
													openedModal: true,
													reportID: item.id
												})
											}}>
											<td>{new Date(item.receiveDate).toLocaleString()}</td>
											<td>{item.subject}</td>
											<td>{item.success ? "OK" : "Failed"}</td>
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
