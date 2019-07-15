import React, { Component } from 'react';
import { Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import TimeAgo from 'react-timeago'
import Select from 'react-select';
import {timestampToString, toSelArr} from '../../helperFunctions';
import { rebase } from '../../index';
import {invisibleSelectStyle} from '../../scss/selectStyles';

import CKEditor from 'ckeditor4-react';

import PictureUpload from './PictureUpload';



export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      saving: false,
      loading: true,
      dropdownOpen: false,
      modalOpen: false,
      name: "",
      body: "",
      newLoad:false,
      tags: [],
      chosenTags: [],
      dateCreated: null,
      lastUpdated: null,
      editBodyOpen:false,

      value: 0,

      timeout: null,
    }

    this.onEditorChange.bind(this);
    this.appendImage.bind(this);
    this.toggleModal.bind(this);
    this.submit.bind(this);
    this.fetchData.bind(this);
    this.fetchData(this.props.match.params.noteID);
  }

  fetchData(id){
    Promise.all(
      [
        rebase.get('lanwiki-notes/' + id, {
          context: this,
        }),
        rebase.get('/lanwiki-tags', {
          context: this,
          withIds: true,
        })
      ]).then(([note,tags]) =>{
        let allTags=toSelArr(tags);
        this.setState({
          name: note.name,
          body: note.body,
          tags: allTags.filter((item)=>note.tags.includes(item.id)),
          dateCreated: new Date(note.dateCreated).getTime(),
          lastUpdated: new Date(note.lastUpdated).getTime(),
          allTags,
          newLoad:true,
          loading:false
        });
      });

  }

  componentWillReceiveProps(props){
    if(this.props.match.params.noteID!==props.match.params.noteID){
      this.setState({loading:true,editBodyOpen:false});
      this.fetchData(props.match.params.noteID);
    }
  }

  submit(){
    let lastUpd = new Date().getTime();
    this.setState({saving:true});
    let body={
      name:this.state.name,
      body:this.state.body,
      tags: this.state.tags.map((item)=>item.id),
      lastUpdated:lastUpd,
      dateCreated: new Date(this.state.dateCreated).getTime()
    };
    rebase.updateDoc('/lanwiki-notes/'+this.props.match.params.noteID, body)
    .then(() => {
      this.setState({
        saving:false,
        timeout: null,
        lastUpdated: lastUpd,
        dateCreated: new Date(this.state.dateCreated).getTime()
      });
    });
  }

  remove(){
    if (window.confirm("Chcete zmazať túto poznámku?")) {
      rebase.removeDoc('/lanwiki-notes/'+this.props.match.params.noteID)
      .then(() => {
        this.props.history.goBack();
      });
    }
  }

  toggleModal() {
      this.setState({
        modalOpen: !this.state.modalOpen
      });
  }

  onEditorChange( evt ) {
    if(this.state.newLoad){
      this.setState( {
        body: evt.editor.getData(),
        newLoad:false
      });
    }else{
      this.setState( {
        body: evt.editor.getData()
      },this.submit.bind(this) );
    }
  }

  appendImage(image){
    this.setState({
      body : this.state.body.concat(image),
      modalOpen : false
    },this.submit.bind(this));
  }

  render(){
    return (
      <div className="flex">
				<div className="container-fluid p-2">
					<div className="d-flex flex-row align-items-center">
						<div className="center-hor">
							{!this.props.columns &&
								<button type="button" className="btn btn-link waves-effect" onClick={()=>this.props.history.goBack()}>
									<i
										className="fas fa-arrow-left commandbar-command-icon icon-M"
										/>
								</button>
							}
							{' '}
							<button type="button" className="btn btn-link waves-effect" onClick={this.submit.bind(this)}>
								{this.state.saving?'Saving... ':''}
								<i
									className="fas fa-save icon-M"
									/>
							</button>
							{' '}
							<button type="button" className="btn btn-link waves-effect" onClick={this.remove.bind(this)}>
								<i
									className="fas fa-trash icon-M"
									/>
							</button>
						</div>
					</div>
				</div>
        <div className="row scrollable fit-header-commandBar">
            <div className={"card-box flex " + (!this.props.columns ? " center-ver" : "")}>
              <div className="d-flex p-2">
                <div className="row">
                  <h1 className="center-hor text-extra-slim">#</h1>
                  <span className="center-hor">
                    <input type="text" value={this.state.name} className="task-title-input text-extra-slim hidden-input" onChange={(e)=>this.setState({name:e.target.value},this.submit.bind(this))} placeholder="Enter task name" />
                  </span>
                </div>
              </div>
              <hr/>

              <div className="row">
                <div className="col-lg-12 d-flex">
                  <p className="text-muted">Created at {this.state.dateCreated?(timestampToString(this.state.dateCreated)):''}</p>
                  <p className="text-muted ml-auto">{this.state.lastUpdated && <TimeAgo style={{color: 'rgb(180, 180, 180)'}} date={new Date(this.state.lastUpdated)} />}</p>
                </div>
              </div>
              <div className="col-lg-12 row">
                <strong className="center-hor text-slim">Tagy: </strong>
                <div className="f-1">
                  <Select
                    value={this.state.tags}
                    isMulti
                    onChange={(tags)=>this.setState({tags},this.submit.bind(this))}
                    options={this.state.allTags}
                    styles={invisibleSelectStyle}
                    />
                </div>
              </div>
              {!this.state.editBodyOpen && <div className="clickable" onClick={()=>this.setState({editBodyOpen:true})} dangerouslySetInnerHTML={{__html:this.state.body===null?'': this.state.body }}></div>}
              { this.state.editBodyOpen &&
              <FormGroup>
                  <Button outline color="secondary" size="sm" onClick={this.toggleModal.bind(this)}>Pridať obrázok z uložiska</Button>
                  <Modal className="modalLO" isOpen={this.state.modalOpen} toggle={this.toggleModal.bind(this)} >
                    <ModalHeader toggle={this.toggleModal.bind(this)}>Nahrať obrázok</ModalHeader>
                    <ModalBody>
                      <PictureUpload appendImage={this.appendImage.bind(this)}/>
                    </ModalBody>
                    <ModalFooter>
                      <Button outline color="secondary" size="sm" onClick={this.toggleModal.bind(this)}>Close</Button>{'  '}
                    </ModalFooter>
                  </Modal>
                  <CKEditor
                    data={this.state.body}
                    onChange={this.onEditorChange.bind(this)}
                    config={ {
                        height: [ '60vh' ],
                        codeSnippet_languages: {
                          javascript: 'JavaScript',
                          php: 'PHP'
                        }
                    } }
                    />
              </FormGroup>}
          </div>
        </div>
      </div>
    );
  }
}
