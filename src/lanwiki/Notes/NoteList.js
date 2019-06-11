import React, { Component } from 'react';
import {ListGroup, ListGroupItem, InputGroup, Input, Button, Row, Col} from 'reactstrap';
import TimeAgo from 'react-timeago'
import { rebase } from '../../index';
import {hightlightText} from '../../helperFunctions';

import NoteEdit from './NoteEdit';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notes: [],
			search: "",
			tags: [],

			value: 0,
		};

			this.createNew.bind(this);
			this.compare.bind(this);
	}

	componentWillMount(){
			this.setState({
				value: 0,
			});
			rebase.listenToCollection('/lanwiki-notes', {
				context: this,
				withIds: true,
				then: notes=> this.setState({notes, value: 100})
			});
			rebase.listenToCollection('/lanwiki-tags', {
				context: this,
				withIds: true,
				then: tags=> this.setState({tags, value: 100})
			});
	}

	createNew(){
    rebase.addToCollection('lanwiki-notes',
    {name: "Untitled",
      tags: (this.props.match.params.tagID !== "all" ? [this.props.match.params.tagID] : []),
      body: "",
      lastUpdated: Date().toLocaleString(),
      dateCreated: Date().toLocaleString()
    })
    .then((note) => {
      this.props.history.push(`/lanwiki/notes/${this.props.match.params.tagID}/${note.id}`);
    });
  }

  compare(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

	render() {

		const NOTES = this.state.notes
									.filter((item) => item.name.toLowerCase().includes(this.state.search.toLowerCase()))
									.filter((note) => {
										if (this.props.match.params.tagID === 'all'){
											let cond1 = this.state.tags.filter(tag => note.tags.length === 0 || note.tags.includes(tag.id)).length > 0;
											return cond1;
										}
											let cond1 = note.tags.includes(this.props.match.params.tagID);
											return cond1;
									 });

		const ORDERRED_NOTES = NOTES.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

		return (
			<div className="">

				<div className="row">


						<div className="fit-with-header scrollable col-lg-4">
							<div className="commandbar">
							{/*		<Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>*/}
								<InputGroup >
									<Input placeholder="Search" value={this.state.search} onChange={(e) => this.setState({search: e.target.value})}/>
								</InputGroup>
							</div>


							<ListGroup className="list">
								<Button
									color="success"
									className="addNote"
									onClick={(e) => {
										e.preventDefault();
										this.createNew();
									}}
									>New Note +</Button>
	              {
	                this.state.tags.length > 0
	                &&
	                  ORDERRED_NOTES.map(note => (
	                    <ListGroupItem
	                      active={this.props.match.params.noteID ? (this.props.match.params.noteID === note.id) : false}
	                      tag="a"
	                      href={`/notes/${this.props.match.params.tagID}/` + note.id}
												className="sidebarItem"
	                      onClick={(e) => {
	                        e.preventDefault();
	                        this.props.history.push(`/lanwiki/notes/${this.props.match.params.tagID}/` + note.id);
	                      }}
	                      action
	                      key={note.id}
	                      >
	                      <Row>
	                        <Col xs="9" className="listName">{hightlightText(note.name, this.state.search, '#81c868')}</Col>
	                        <Col xs="3" className="listTag"><TimeAgo date={note.lastUpdated} minPeriod={300}/></Col>
	                      </Row>
	                      <Row>
	                        <Col className="listTime">{this.state.tags.filter(tag =>
	                          note.tags.includes(tag.id)).map(tag => "| " + tag.name + " ")}</Col>
	                      </Row>
	                    </ListGroupItem>
	                  ))
	              }
	            </ListGroup>
					</div>
					<div className="fit-with-header scrollable col-lg-8">
						{
              this.state.notes.some((item)=>item.id===this.props.match.params.noteID) && <NoteEdit match={this.props.match} history={this.props.history}/>
            }
					</div>
				</div>
			</div>
			);
		}
	}