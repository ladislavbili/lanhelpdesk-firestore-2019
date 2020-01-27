import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default class Test extends Component{
  constructor(props){
    super(props);
    this.state={
      text:'',
    }
  }

  render(){
    return (
      <div className="scroll-visible p-20 fit-with-header-and-commandbar" style={{marginTop:200}}>
        {/*<CKEditor
          data={this.state.text}
          onInit={(editor)=>{
            console.log((Array.from( editor.ui.componentFactory.names() )));
          }}
          onChange={(e,editor)=>{
            this.setState({text: editor.getData()})
          }}
          />*/}
        <hr/>
        <div dangerouslySetInnerHTML={{__html:this.state.text}}/>
      </div>
    );
  }
}
