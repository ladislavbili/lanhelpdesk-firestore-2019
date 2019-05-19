import React, { Component } from 'react';
import {Button, FormGroup, Progress, Label, Input} from 'reactstrap';
import { rebase } from '../../index';

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
			firstRead: [],
			firstWrite: [],
			users: [],
			search: "",

			value: 0,
		};

//		this.addUser.bind(this);
//		this.changeUserRead.bind(this);
//		this.changeUserWrite.bind(this);
		this.submit.bind(this);
		this.remove.bind(this);
		this.fetchData.bind(this);
		this.fetchData(this.props.match.params.tagID);
	}

		fetchData(id){
			if (id === 'add'){
				return;
			}
			rebase.get('lanwiki-tags/' + id, {
				context: this,
				withIds: true,
			}).then((tag) =>{
					 /*rebase.get('/lanwiki-users', {
						context: this,
						withIds: true,
						}).then((users) =>*/
								this.setState({
									name: tag.name,
									body: tag.body,
							//		read: users.filter(u => tag.read.includes(u.id)),
							//		write: users.filter(u => tag.write.includes(u.id)),
									active: tag.active,
									public: tag.public,
							//		users,
									value: 100,
								})
						//	);
			});
		}

	componentWillReceiveProps(props){
    if(this.props.match.params.tagID!==props.match.params.tagID){
      this.setState({value: 0});
      this.fetchData(props.match.params.tagID);
    }
  }

	submit(){
    this.setState({value: 0, saving: true});
  //  let newRead = this.state.read.map(user => user.id);
  //  let newWrite = this.state.write.map(user => user.id);
    rebase.updateDoc('/lanwiki-tags/'+this.props.match.params.tagID, {name:this.state.name, body:this.state.body, /*read: newRead, write: newWrite, public: this.state.public,*/ active: this.state.active})
    .then(() => {
      this.setState({
        value: 100,
				saving: false,
      });
    });
  }

	remove(){
    this.setState({value: 0});
    if (window.confirm("Chcete zmazať tento tag?")) {
      rebase.removeDoc('/lanwiki-tags/'+this.props.match.params.tagID)
        .then(() =>
            { rebase.get('/lanwiki-notes', {
                context: this,
                withIds: true,
              })
              .then((notes) =>{
                notes.filter(note => (note.tags.includes(this.props.match.params.tagID)))
                .map(note =>
                    rebase.updateDoc('/lanwiki-notes/'+note.id, {name: note.name, body: note.body, tags: note.tags.filter(item => item !== this.props.match.params.tagID)})
                  );
                this.props.history.push(`/lanwiki/notes/all`);
              });
            });
      };
    this.setState({value: 100});
  }

	render() {
		if (this.props.match.params.tagID === 'add'){
      return (<div></div>)
    }
		return (
			<div className="">
				<div className="commandbar">
					<Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>
					<h2>Edit tag</h2>
				</div>
				<div className="fit-with-header scrollable col-lg-12 form">


					<FormGroup check>
							<Input
								type="checkbox"
								checked={this.state.active}
								onChange={(e) => this.setState({active: e.target.checked})}
								/>{'    '}
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
						{" "}
					<Button  color="danger" className="delBtn" onClick={this.remove.bind(this)} >Delete</Button>


				</div>

			</div>
			);
		}
	}
