import React, { Component } from 'react';
import { Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';

import TimeAgo from 'react-timeago'
import Select from 'react-select';
import {timestampToString, toSelArr} from '../../helperFunctions';
import { rebase } from '../../index';
import {invisibleSelectStyle} from '../../scss/selectStyles';

//import CKEditor from 'ckeditor5-custom-build/build/ckeditor';
//import CKEditor from '../../CKEditor5/build/ckeditor';

import CKEditor from '@ckeditor/ckeditor5-react';
import ck5config from '../../scss/ck5config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
      body: this.state.body,
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

  onEditorChange( editor ) {
    if(this.state.newLoad){
      this.setState( {
        body: editor.getData(),
        newLoad:false
      });
    }else{
      this.setState( {
        body: editor.getData()
      }, this.submit.bind(this) );
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
      <div className="flex" >
        {this.state.editBodyOpen &&
					<div style={{position: "fixed", zIndex: "99", backgroundColor: "transparent", top: "0", left: "0", width: "100%", height: "100vh"}} onClick={()=>this.setState({editBodyOpen:false})}>
					</div>
				}
				<div className="commandbar p-2 ">
					<div className={"d-flex flex-row" + (!this.props.columns ? " w-50" : "") }>
						<div className="center-hor">
							{!this.props.columns &&
								<button type="button" className="btn btn-link-reversed waves-effect" onClick={()=>this.props.history.goBack()}>
									<i
										className="fas fa-arrow-left commandbar-command-icon"
										/> Back
								</button>
							}
							{' '}
							<button type="button" className="btn btn-link-reversed waves-effect" onClick={this.submit.bind(this)}>
								<i
									className="fas fa-save commandbar-command-icon"
									/> 	{this.state.saving?'Saving... ':'Save'}
							</button>
							{' '}
							<button type="button" className="btn btn-link-reversed waves-effect" onClick={this.remove.bind(this)}>
								<i
									className="fas fa-trash commandbar-command-icon"
									/> Delete
							</button>
						</div>
					</div>
				</div>

        <div className={"card-box-lanwiki scrollable fit-with-header-and-commandbar p-20"} >
            <div className="row">
              <h2 className="center-hor">#</h2>
              <span className="center-hor flex">
                <input type="text" value={this.state.name} className="task-title-input hidden-input flex" onChange={(e)=>this.setState({name:e.target.value},this.submit.bind(this))} placeholder="Enter task name" />
              </span>
            </div>

            <hr/>

            <div className="row">
              <div className="col-lg-12 d-flex">
                <p className="text-muted">Created at {this.state.dateCreated?(timestampToString(this.state.dateCreated)):''}</p>
                <p className="text-muted ml-auto">{this.state.lastUpdated && <TimeAgo className="text-muted" date={new Date(this.state.lastUpdated)} />}</p>
              </div>
            </div>

            <div className="row">
              <Label className="col-form-label">Tagy:</Label>
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

                {!this.state.editBodyOpen &&
                  <div >
                    <Button className="btn-link-reversed p-l-0" onClick={()=>this.setState({editBodyOpen:true})}>Upraviť text</Button>
                    <div className="clickable task-edit-popis" onClick={()=>this.setState({editBodyOpen:true})} dangerouslySetInnerHTML={{__html:this.state.body===null?'': this.state.body }}></div>
                  </div>
                }

                <Modal isOpen={this.state.modalOpen}>
                  <ModalHeader>
                    Picture upload
                  </ModalHeader>
                  <ModalBody className="m-t-15">
                    <PictureUpload appendImage={this.appendImage.bind(this)}/>
                  </ModalBody>
                  <ModalFooter>
                    <Button className="btn-link mr-auto" onClick={this.toggleModal.bind(this)}>Close</Button>{'  '}
                  </ModalFooter>
                </Modal>

              { this.state.editBodyOpen &&
              <FormGroup className=""  style={{position: "relative",zIndex:(this.state.modalOpen ? "1" : "9999")}}>
                  <Button className="btn-link-reversed p-l-0" onClick={this.toggleModal.bind(this)}>Pridať obrázok z uložiska</Button>

                    <CKEditor
                      data={this.state.body}
                      onInit={(editor)=>{
                  //      console.log(Array.from( editor.ui.componentFactory.names() ));
                      }}
                      onChange={(e,editor) => this.onEditorChange(editor)}
                      />
              </FormGroup>}
          </div>
      </div>
    );
  }
}

/*
<CKEditor
  editor={ ClassicEditor }
  data={this.state.body}
  onInit={(editor)=>{
//      console.log(Array.from( editor.ui.componentFactory.names() ));
  }}
  onChange={(e,editor) => this.onEditorChange(editor)}
  config={ck5config}
  />

config={ {
    height: [ '60vh' ],
    codeSnippet_languages: {
      javascript: 'JavaScript',
      php: 'PHP'
    },
    format_h2: {
      element: 'h2',
      attributes: {
        'style' : 'color: #0078D4; font-size: 20px; font-family: Segoe UI;'
      }
    },
} }
*/
