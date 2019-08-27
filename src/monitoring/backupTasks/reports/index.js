import React, { Component } from 'react';
import { Modal, Button, ModalBody, ModalFooter } from 'reactstrap';
import ReportDetail from "./reportDetail";
import {rebase} from "../../../index";

export default class Reports extends Component{
  constructor(props){
    super(props);
    this.state={
			data: [],

      opendedModal: false,
      saving:false,
    }
  }

	componentWillMount(){
		this.ref1 = rebase.listenToCollection('monitoring-notifications_results', {
		context: this,
		withIds: true,
		then(data) {
			 this.setState({
				 data
			 });
		},
		onFailure(err) {
			//handle error
		}
	});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
	}

  render(){
			let ITEMS = this.state.data.filter(datum => datum.notification === this.props.id);

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
