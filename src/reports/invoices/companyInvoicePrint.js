import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import CompanyInvoice from './companyInvoice';
import classnames from 'classnames';

export default class CompanyInvoicePrint extends Component {

	render() {
		const { landscape } = this.props;
		return (
			<div className="display-inline">
				<ReactToPrint
					trigger={() =>
						<button className="btn btn-link waves-effect">
							{landscape ? "pdf" : "pdf" }
						</button>
					}
					content={()=>this.toPrint}
					/>
				<div style={{display: "none"}}>
					{
						landscape &&
						<style type="text/css" media="print">{"\
							@page { size: landscape; }\
							"}</style>
					}
					<div className={classnames({"print-landscape": landscape})} ref={ref => (this.toPrint = ref)}>
						<CompanyInvoice invoice={this.props.invoice}/>
					</div>
				</div>
			</div>
		)
	}
}
