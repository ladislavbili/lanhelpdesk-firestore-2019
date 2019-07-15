import React, { Component } from 'react';
import { rebase } from '../../index';
import { connect } from "react-redux";
import TimeAgo from 'react-timeago';
import {timestampToString} from '../../helperFunctions';
import {setWikiOrderBy, setWikiAscending} from '../../redux/actions';
import ShowData from '../../components/showData';
import NoteEdit from './NoteEdit';

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notes: [],
			tags: [],
			listName:''
		};

		this.createNew.bind(this);
	}

	componentWillMount(){
			this.setState({
			});
			this.ref1 = rebase.listenToCollection('/lanwiki-notes', {
				context: this,
				withIds: true,
				then: notes=> this.setState({notes})
			});
			this.ref2 = rebase.listenToCollection('/lanwiki-tags', {
				context: this,
				withIds: true,
				then: tags=> this.setState({tags})
			});
			this.getFilterName(this.props.match.params.listID);
	}

	createNew(){
    rebase.addToCollection('lanwiki-notes',
    {name: "Untitled",
      tags: (this.props.match.params.listID !== "all" ? [this.props.match.params.listID] : []),
      body: "",
      lastUpdated: Date().getTime(),
      dateCreated: Date().getTime()
    })
    .then((note) => {
      this.props.history.push(`/lanwiki/${this.props.match.params.listID}/${note.id}`);
    });
  }

	componentWillReceiveProps(props){
		if(this.props.match.params.listID!==props.match.params.listID){
			this.getFilterName(props.match.params.listID);
		}
	}

	getFilterName(id){
		if(!id){
			this.setState({filterName:''});
			return;
		}else if(id==='all'){
			this.setState({filterName:'All'});
			return;
		}
		let tag = this.state.tags.find((item)=>item.id===id);
		if(tag){
			this.setState({filterName:tag.name});
		}else{
			rebase.get('lanwiki-tags/'+id, {
				context: this,
			}).then((result)=>{
				this.setState({filterName:result.name});
			}).catch(()=>{
				this.setState({filterName:'Unknown tag'});
			})

		}
	}


	render() {
		let link='';
		if(this.props.match.params.hasOwnProperty('listID')){
			link = '/lanwiki/i/'+this.props.match.params.listID;
		}else{
			link = '/lanwiki/i/all'
		}
		return (
			<ShowData
				data={this.state.notes.map((note)=>{
					return {
						...note,
						tags:this.state.tags.filter((item)=>note.tags.includes(item.id))
					}
				})
					.filter((item)=>item.tags.some((item)=>item.id===this.props.match.params.listID)||this.props.match.params.listID==='all'||!this.props.match.params.listID)}
				displayCol={(note)=>
					<li className="" >
						<p className="pull-right m-b-0 font-13">
							<i className="fa fa-clock-o" /> <span>Start: {note.dateCreated?timestampToString(note.dateCreated):'None'}</span>
						</p>
						<div className="m-b-0">
							<label>{note.name}</label>
							<div className="m-t-5">
								<p className="pull-right m-b-0 font-13">
									<i className="fa fa-clock-o" /> <span>Updated: {note.lastUpdated&& <TimeAgo style={{color: 'rgb(180, 180, 180)'}} date={new Date(note.lastUpdated)} />}</span>
								</p>
								<div className="taskList-tags">
									{note.tags.map((tag)=>
										<span key={tag.id} className="label label-info m-r-5">{tag.title}</span>
									)}
								</div>
							</div>
						</div>
					</li>
				}
				filterBy={[
					{value:'name',type:'text'},{value:'dateCreated',type:'date'},{value:'lastUpdated',type:'date'},
				]}
				displayValues={[
					{value:'name',label:'Name',type:'text'},{value:'dateCreated',label:'Created at',type:'date'},{value:'lastUpdated',label:'Updated at',type:'date'},
				]}
				orderByValues={[
					{value:'name',label:'Name',type:'text'},{value:'dateCreated',label:'Created at',type:'date'},{value:'lastUpdated',label:'Updated at',type:'date'},
				]}
				link={link}
				history={this.props.history}
				orderBy={this.props.orderBy}
				setOrderBy={this.props.setWikiOrderBy}
				ascending={this.props.ascending}
				setAscending={this.props.setWikiAscending}
				itemID={this.props.match.params.noteID}
				listID={this.props.match.params.listID}
				listName={this.state.filterName}
				match={this.props.match}
				edit={NoteEdit}
				 />
			);
		}
	}


		const mapStateToProps = ({ filterReducer, wikiReducer }) => {
			const { project, filter } = filterReducer;
			const { orderBy, ascending } = wikiReducer;
			return { project, filter,orderBy,ascending };
		};

		export default connect(mapStateToProps, { setWikiOrderBy, setWikiAscending })(List);
