import React, { Component } from 'react';
import base from '../firebase';
import { Grid, Row, Col, Image } from 'react-bootstrap';

import firebase from 'firebase';
import FileUploader from "react-firebase-file-uploader";

export default class PictureUploadModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      open: false,

      name: "",
      isUploading: false,
      progress: 0,
      picURL: "",
      allNames : [],
    }
  }


    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
      this.setState({ isUploading: false });
      console.error(error);
    };
    handleUploadSuccess = filename => {
      this.setState({ name: filename, progress: 100, isUploading: false });
      firebase
        .storage()
        .ref("lanKB-images")
        .child(filename)
        .getDownloadURL()
        .then(url => this.setState({ picURL: url, allNames: [...this.state.allNames, url] }));

    };

    componentWillMount(){
  /*    base.fetch('kb-image-names', {
        context: this,
        state:'allNames',
        then(data){
          this.setState({
            allNames : data
          })
          }
        }
      );

      console.log('aaa');*/
        this.ref = base.syncState(`kb-image-names`, {
          context: this,
          state: 'allNames',
          asArray: true,
        });
      }

      componentWillUnmount() {
  //      base.removeBinding(this.ref);
      }

  render() {
    return (
         <div>
              <FileUploader
                accept="image/*"
                name="avatar"
                randomizeFilename
                storageRef={firebase.storage().ref("lanKB-images")}
                onUploadStart={this.handleUploadStart}
                onUploadError={this.handleUploadError}
                onUploadSuccess={this.handleUploadSuccess}
                onProgress={this.handleProgress}
              />
              {this.state.isUploading && <p>Progress: {this.state.progress}</p>}

              <Grid>
                 {
                   this.state.allNames.map((_, index) =>
                     {
                       if(index%3 !== 0) return null;
                       return (

                         <Row key={index}>
                           {
                             [...this.state.allNames]
                             .splice(index, index+3)
                             .map((url) =>
                                 <Col key={url} xs={3} >
                                   <Image onClick={() => this.props.appendImage(`<p><img src=${url} /></p>`)} src={url} responsive />
                                 </Col>
                             )
                           }
                         </Row>
                       );
                     }
                   )
                 }
               </Grid>

            </div>
    );
  }
}
