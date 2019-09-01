import React, { Component } from 'react';
import { Modal, Button, ModalBody, ModalFooter } from 'reactstrap';
import {rebase} from "../../../index";
import {fromMillisec} from "../../../helperFunctions";

import ReportDetail from "./reportDetail";

export default class Reports extends Component{
  constructor(props){
    super(props);
    this.state={
			data: [],
      reportID: null,

      opendedModal: false,
      saving:false,
    }
  }

	componentWillMount(){
		this.ref1 = rebase.listenToCollection('monitoring-servers_results', {
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
		const ITEMS = this.state.data
                  .filter(datum => datum.server === this.props.id)
                  .sort((a, b) => b.startDate - a.startDate);
      return (
        <div className="flex">
					<table className="table">
							<thead>
								<tr>
									<th>Send test date</th>
									<th>Response date time</th>
									<th>Response time</th>
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
											<td>{new Date(item.startDate).toLocaleString()}</td>
											<td>{new Date(item.receiveDate).toLocaleString()}</td>
											<td>{fromMillisec(item.difference, "seconds") + " sec."}</td>
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
