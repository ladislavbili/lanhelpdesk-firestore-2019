import React, { Component } from 'react';
import base from '../firebase';
import { Link } from 'react-router-dom';

export default class ArticleList extends Component{

  constructor(props){
    super(props);
    this.state = {
      articles : [],
      tags:[],
    }
    this.tagsToString.bind(this);
  }

  componentWillMount(){
    this.ref2 = base.bindToState(`kb-tags`, {
      context: this,
      state: 'tags',
      asArray: true
    });
      this.ref = base.bindToState(`kb-articles`, {
        context: this,
        state: 'articles',
        asArray: true
      });
  }

  tagsToString(tags){
    let show = this.state.tags.filter((tag)=>tags.includes(tag.id));
    let result="";
    show.map((item)=>result+=item.name+' | ');
    return result.substring(0,result.length-2);
  }

  componentWillUnmount() {
      base.removeBinding(this.ref);
      base.removeBinding(this.ref2);
  }

  render(){
    return (
      <div className='content-page'>
        <div className="content">
          <div className="container-fluid">

        <Link to={{pathname: './'+this.props.match.params.tagID+'/add/article'}}>
          <p>+ Article</p>
        </Link>
        {this.state.articles.filter((item)=>this.props.match.params.tagID==='all'||item.tags.includes(parseInt(this.props.match.params.tagID, 10))).map((article)=>
          <div className='card-box'>
              <div className="article" key={article.id}>

                <h3 style={{paddingLeft:3}}>{article.title}</h3>
                <p>
                  Tags: {this.tagsToString(article.tags)}
                </p>
                <div className="articleBody">
                  <div dangerouslySetInnerHTML={{__html:article.text.substring(0,655)+'...'}} />
                <Link className='articleRead' to={{pathname: './'+this.props.match.params.tagID+`/article/`+article.id}}>
                  <p className='articleAddButton' >read more...</p>
                </Link>
              </div>
            </div>
          </div>
          ) }
      </div>
      </div>
      </div>
    );
  }
}
