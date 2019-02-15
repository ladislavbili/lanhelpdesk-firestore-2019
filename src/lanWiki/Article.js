import React, { Component } from 'react';
import base from '../firebase';
import { Link } from 'react-router-dom';
import Comments from './Comments';

export default class Article extends Component{
constructor(props){
  super(props);
  this.state = {
    article : null,
    tags:[]
  }
  this.tagsToString.bind(this);
}

tagsToString(tags){
  let show = this.state.tags.filter((tag)=>tags.includes(tag.id));
  let result="";
  show.map((item)=>result+=item.name+' ');
  return result;
}


componentWillMount(){
    this.ref2 = base.bindToState(`kb-tags`, {
      context: this,
      state: 'tags',
      asArray: true
    });

    this.ref = base.bindToState(`kb-articles`, {
      context: this,
      state: 'article',
      asArray: true,
      queries: {
        orderByChild: 'id',
        equalTo: parseInt(this.props.match.params.articleID, 10),
      }
    });
}

componentWillUnmount() {
    base.removeBinding(this.ref);
    base.removeBinding(this.ref2);
}


  render(){
    const PATH = this.props.location.pathname.split('/');
    const NEW_PATH = PATH.splice(0, PATH.length-2).join('/');
    let article=this.state.article && this.state.article.length===1?this.state.article[0]:null;
    if(!article) return null;
    return (
      <div className='content-page'>
        <div className="content">
          <div className="container-fluid">
            <div className='card-box'>
          <div className='DataTable'>

            <Link to={{pathname: `${NEW_PATH}`}}>
              <p>Back</p>
            </Link>

            <Link to={{pathname: './'+article.id+`/edit`}}>
              <p>Edit</p>
            </Link>

            <h1>{article.title}</h1>
            <p> Created: Branislav Susta 7:23 10.9.2018 </p>
            <p> Last Edit: Branislav Susta 7:23 10.9.2018 </p>

            <p>
              Tags: {this.tagsToString(article.tags)}
            </p>

            <div dangerouslySetInnerHTML={{__html:article.text}} />

          </div>
          <Comments />
          </div>
        </div>
          </div>
          </div>
    );
  }
}
