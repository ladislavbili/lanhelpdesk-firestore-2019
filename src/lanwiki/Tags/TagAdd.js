import React, { Component } from 'react';
import {NavItem, Nav, TabPane, TabContent, NavLink, Button, FormGroup, Progress, Label, Input, InputGroup, ListGroup, ListGroupItem, Table} from 'reactstrap';
import {hightlightText} from '../../helperFunctions';

import { rebase } from '../../index';

import classnames from 'classnames';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saving: false,
			name: "",
			body: "",
			public: false,
			active: false,
			read: [],
			write: [],
			users: [],
			search: "",

			value: 100,
		};

		this.submit.bind(this);
	}

	submit(){
    this.setState({value: 0, saving: true});
    let newRead = this.state.read.map(user => user.id);
    let newWrite = this.state.write.map(user => user.id);
    rebase.addToCollection('/lanwiki-tags', {name:this.state.name, body:this.state.body, read: newRead, write: newWrite, public: this.state.public, active: this.state.active})
    .then(() => {
      this.setState({
        saving:false,
        name: "",
        body: "",
        users: "",
        read: [],
        write: [],
        public: false,
        active: false,
        value: 100
      });
    });
  }

	render() {
		return (
			<div className="">
				<div className="commandbar">
					<Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>
					<h2>Add tag</h2>
				</div>
				<div className="fit-with-header scrollable col-lg-12 form">


					<FormGroup check>
							<Input
								type="checkbox"
								checked={this.state.active}
								onChange={(e) => this.setState({active: e.target.checked})}
								/>
							<Label check>
							Active
						</Label>
					</FormGroup>

						<FormGroup>
							<Label htmlFor="name">Názov</Label>
							<Input id="name" placeholder="Názov" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
						</FormGroup>

						<FormGroup>
							<Label htmlFor="body">Popis</Label>
							<Input type="textarea" id="body" placeholder="Zadajte text" value={this.state.body} onChange={(e) => this.setState({body: e.target.value})}/>
						</FormGroup>


						<Button  color="primary" className="saveBtn" onClick={this.submit.bind(this)} >{!this.state.saving ? "Save":"Saving..."}</Button>


				</div>

			</div>
			);
		}
	}
