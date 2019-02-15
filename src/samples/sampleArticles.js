/*const sampleArticles = {
  1: {
    id: 1,
    articleId: 1,
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur vulputate est eget fringilla. Suspendisse faucibus velit id nibh venenatis, eu mollis velit euismod. Aliquam erat volutpat. Vivamus ac rhoncus urna. Etiam nec faucibus nisi. Cras quis elit pharetra, maximus nunc a, varius elit. Proin et sem accumsan, hendrerit purus id, rutrum velit. Fusce lacinia elit tellus, in tempus ante maximus id. Vivamus consequat risus ac semper dictum. Suspendisse elementum volutpat egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas sed placerat augue, vitae mattis mauris. Sed molestie ac ex sed interdum. Phasellus dui sapien, porttitor ut mattis nec, placerat sed felis. Nam quis tincidunt lacus.
    `,
  },

  2: {
    id: 2,
    articleId: 2,
    text: `Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas sed placerat augue, vitae mattis mauris. Sed molestie ac ex sed interdum. Phasellus dui sapien, porttitor ut mattis nec, placerat sed felis. Nam quis tincidunt lacus.
    `,
  },

  3: {
    id: 3,
    articleId: 3,
    text: `Morbi efficitur vulputate est eget fringilla. Suspendisse faucibus velit id nibh venenatis, eu mollis velit euismod. Aliquam erat volutpat. Vivamus ac rhoncus urna. Etiam nec faucibus nisi. Cras quis elit pharetra, maximus nunc a, varius elit. Proin et sem accumsan, hendrerit purus id, rutrum velit. Fusce lacinia elit tellus, in tempus ante maximus id. Vivamus consequat risus ac semper dictum. Suspendisse elementum volutpat egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas sed placerat augue, vitae mattis mauris. Sed molestie ac ex sed interdum. Phasellus dui sapien, porttitor ut mattis nec, placerat sed felis. Nam quis tincidunt lacus.
    `,
  },

};*/

const sampleTags = {
  1: {
    id: 1,
    name: 'Windows',
    color: 'blue',
    notes: 'Nice Tag',
  },

  2: {
    id: 2,
    name: 'Linux',
    color: 'purple',
    notes: 'no notes',
  },

  3: {
    id: 3,
    name: 'Config List',
    color: 'yellow',
    notes: 'some notes',
  },


};

export default sampleTags;

/*import React, { Component } from 'react';
import base from '../firebase';
import firebase from 'firebase';
import { Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Tags from './Tags';
import Comments from './Comments';

//import sampleArticles from '../samples/sampleArticles';

export default class ArticleList extends Component{

  constructor(props){
    super(props);
    const ARTICLES = firebase.database().ref(`kb-article-titles`);
    ARTICLES.once('value')
          .then(snap =>
            {
              this.setState({
                titles : snap.val(),
              });
            }
          );*/
/*    this.state = {
      samples : null,
    }
    this.addSamples.bind(this);*/
//  }

/*  componentWillMount(){
      this.ref = base.syncState(`kb-tags`, {
        context: this,
        state: 'samples'
      });
  }

  addSamples(){
      this.setState({
        samples : sampleArticles,
      });
  }

  componentWillUnmount() {
      base.removeBinding(this.ref);
  }*/
/*
  render(){
    const ARTICLES = firebase.database().ref(`kb-articles`);
    return (
      <div>
        <Col xs={8} >
          <div className='DataTable'>*/
        /*{    <Button onClick={this.addSamples.bind(this)}>aaa</Button> }*/
  /*          <Link to={{pathname: `/lanwiki/articles`}}>
              <p>+ Article</p>
            </Link>
            <Button onClick={() => console.log(this.state.titles)}>aaa</Button>

          { this.state !== null &&
            Object
            .keys(this.state.titles)
            .map(id =>
              {
                console.log('aaaa');
                let text = ARTICLES.orderByChild('articleId')
                      .equalTo(id).on('value',
                    function(snap){
                      console.log();
                      return( <p> snap </p>)
                    });
              }
            )
          }*/
/*{
            <h3> A Big Title </h3>
            <p> Created: Branislav Susta 7:23 10.9.2018, Last Edit: Branislav Susta 7:23 10.9.2018 </p>

            <p>
              Tags: Linux | Config List
            </p>

            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur vulputate est eget fringilla. Suspendisse faucibus velit id nibh venenatis, eu mollis velit euismod. Aliquam erat volutpat. Vivamus ac rhoncus urna. Etiam nec faucibus nisi. Cras quis elit pharetra, maximus nunc a, varius elit. Proin et sem accumsan, hendrerit purus id, rutrum velit. Fusce lacinia elit tellus, in tempus ante maximus id. Vivamus consequat risus ac semper dictum. Suspendisse elementum volutpat egestas.
            </p>

            <Link className='articleRead' to={{pathname: `/lanwiki/articles/a-big-title`}}>
              <p className='articleAddButton' >read more...</p>
            </Link>
            }*/
      /*    </div>
        </Col>
        <Col xs={4}>
          <Tags />
        </Col>
      </div>
    );
  }
}
*/
