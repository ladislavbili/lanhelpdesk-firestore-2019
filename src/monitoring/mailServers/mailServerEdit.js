import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from "../../index";
import Select from 'react-select';
import {selectStyle} from '../../scss/selectStyles';

export default class MailServerEdit extends Component{
  constructor(props){
    super(props);
    this.state={
			title: "",
      company: null,
      testEmail: "",
      note: "",
      timeout: "",

			companies: [],

      saving:false,
    }
		this.fetch.bind(this);
		this.msToTime.bind(this);
		this.submit.bind(this);
  }

	componentWillMount(){
		rebase.get("companies", {
			context: this,
			withIds: true,
		}).then(data => {
			let newCompanies = data.map(com => {return {value: com.id, label: com.title}});
			this.setState({
				companies: newCompanies,
			}, () => this.fetch(this.props.id));
		}).catch(err => {
			//handle error
		})
	}

	fetch(id){
		console.log("here");
		rebase.get(`monitoring-servers/${id}`, {
			context: this,
			withIds: true,
		}).then(datum => {
				 this.setState({
					 title: datum.title,
		 			 company: datum.company,
		 			 testEmail: datum.testEmail,
					 note: datum.note,
		       timeout: this.msToTime(datum.timeout),
				 });
			});
	}

	componentWillReceiveProps(props){
		if (this.props.id !== props.id){
			this.fetch(props.id);
		}
	}


	submit(){
		this.setState({
			saving: true,
		})
		let data = {
			title: this.state.title,
			company: this.state.company,
			testEmail: this.state.testEmail,
			note: this.state.note,
			timeout: this.state.timeout * 60000,
		};

		rebase.updateDoc(`monitoring-servers/${this.props.id}`, data)
		.then(() => {
			this.setState({
				saving: false,
			})
			this.props.toggleEdit();
		}).catch(err => {
		});
	}

	msToTime(time){
		return time / 60000;
	}

  render(){
      return (
        <div className="flex">

            <FormGroup>
              <Label>Title *</Label>
              <Input type="text" placeholder="Enter mailserver name" value={this.state.title} onChange={(e)=>this.setState({title: e.target.value})} />
            </FormGroup>

						<FormGroup>
							<Label>Company</Label>
							<Select
								value={this.state.company}
								onChange={(company)=>this.setState({company})}
								options={this.state.companies}
								styles={selectStyle}
								/>
						</FormGroup>

						<FormGroup>
							<Label>Timeout (min) *</Label>
							<Input type="number" placeholder="Enter timeout" value={this.state.timeout} onChange={(e)=>this.setState({timeout: e.target.value})} />
						</FormGroup>

            <FormGroup>
              <Label>Test e-mail *</Label>
              <Input type="text" placeholder="Enter port" value={this.state.testEmail} onChange={(e)=>this.setState({testEmail: e.target.value})} />
            </FormGroup>

            <FormGroup>
              <Label>Note</Label>
              <textarea className="form-control b-r-0" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note: e.target.value})}  />
            </FormGroup>

            <Button
  						className="btn pull-right"
							disabled={this.state.saving
								|| this.state.title === ""
								|| this.state.timeout <= 0
								|| this.state.testEmail === ""
							}
							onClick={() => this.submit()}
  					> { this.state.saving ? "Saving..." : "Save changes"}
            </Button>
            <Button
              className="btn-link m-r-10"
              onClick={() => this.props.toggleEdit()}
            > Back to overview
            </Button>

  			</div>
      )
  }
}
