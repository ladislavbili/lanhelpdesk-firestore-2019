import React, {Component} from 'react';
import RichTextEditor from 'react-rte';
import { FormGroup, ControlLabel, FormControl, Button, Modal } from 'react-bootstrap';
import base from '../firebase';
import Select from 'react-select';
import { Link } from 'react-router-dom';

import PictureUploadModal from './PictureUploadModal';

export default class ArticleEdit extends Component {

  constructor(props){
    super(props);
    this.state = {
      tags:null,
      article:null,
      articleTitle:'',
      articleText: RichTextEditor.createValueFromString('',"html"),
      articleTags:[],
    }
    this.submit.bind(this);
    this.appendImage.bind(this);
  }

    componentWillMount(){
      this.ref2 = base.bindToState(`kb-tags`, {
        context: this,
        state: 'tags',
        asArray: true,
        then: ()=>{
          if(this.state.article!==null){
            this.setState({
              articleTags:(this.state.tags?this.state.tags:[]).map(tag => {
                tag.label = tag.name;
                tag.value = tag.id;
                return tag;
              }).filter((tag)=>[this.article.tags].includes(tag.id))});
        }},
      });

      base.fetch('kb-articles/'+this.props.match.params.articleID, {
        context: this,
        state:'article',
        then(article){
            if(!article){
              this.props.history.push('/lanwiki');
              return;
            };

            if(this.state.tags===null){
              this.setState({
                article,
                articleText: RichTextEditor.createValueFromString(article.text,"html"),
                articleTitle:article.title,
                articleTags:article.tags});
            }else{
              this.setState({
                article,
                articleText:RichTextEditor.createValueFromString(article.text,"html"),
                articleTitle:article.title,
                articleTags:(this.state.tags?this.state.tags:[]).map(tag => {
                  tag.label = tag.name;
                  tag.value = tag.id;
                  return tag;
                }).filter((tag)=>article.tags.includes(tag.id))
              });
            }
          }
      });

    }

    componentWillUnmount() {
        base.removeBinding(this.ref2);
    }

    submit(){
      let data={
        id:this.state.article.id,
        tags:this.state.articleTags.map((item)=>item.id),
        text: this.state.articleText.toString('html'),
        title:this.state.articleTitle,
      }
      base.update('kb-articles/'+this.state.article.id, {
        data
      });
      this.props.history.goBack();
    }

    appendImage(image){
      console.log(this.state.articleText.toString('html').concat(image));
      this.setState({
        articleText : RichTextEditor.createValueFromString(this.state.articleText.toString('html').concat(image),"html"),
        openModal : false
      });
    }

  render() {
    const PATH = this.props.location.pathname.split('/');
    const NEW_PATH = PATH.splice(0, PATH.length-1).join('/');
      return (
        <div className='content-page'>
          <div className="content">
            <div className="container-fluid">
              <div className='card-box'>
        <Link to={{pathname: `${NEW_PATH}`}}>
          <p>Back</p>
        </Link>
          <h3>{'Editing article "' +this.state.articleTitle+'"' }</h3>
          <FormGroup bsSize="large" controlId="inputName">
            <FormControl type="text"
              onChange={e => {
                this.setState({ articleTitle: e.target.value });
              }}
             value={this.state.articleTitle}/>
          </FormGroup>


          <FormGroup controlId="multiselectTag">
            <Select
              options={(this.state.tags?this.state.tags:[]).map(tag => {
                tag.label = tag.name;
                tag.value = tag.id;
                return tag;
              })}
              isMulti
              value={this.state.articleTags}
              onChange={e =>{ this.setState({ articleTags: e })}}
            />
          </FormGroup>

          <Button onClick={() => this.setState({openModal:true})}> Add picture to text </Button>

          <Modal bsSize='large' show={this.state.openModal} onHide={()=>{this.setState({openModal:false})}}>
            <Modal.Header closeButton>
              <Modal.Title>Images</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PictureUploadModal appendImage={this.appendImage.bind(this)} closeModal={()=>{this.setState({openModal:false})}} />
            </Modal.Body>
          </Modal>

          <FormGroup controlId="wisig">
            <ControlLabel>Edit Text</ControlLabel>
            <RichTextEditor
              value={this.state.articleText}
              onChange={e => {
                this.setState({ articleText: e });
              }}
              toolbarClassName="demo-toolbar"
              editorClassName="demo-editor"
            />
          </FormGroup>

          <Button onClick={this.submit.bind(this)} bsStyle="primary">Save</Button>
          </div>
        </div>
          </div>
          </div>
    );
}}
