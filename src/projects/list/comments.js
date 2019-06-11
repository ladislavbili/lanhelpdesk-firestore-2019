import React, { Component } from 'react';
import { Input, Label, Button, FormGroup } from 'reactstrap';
import { connect } from "react-redux";
import {rebase,database} from '../../index';
import {snapshotToArray, timestampToString} from '../../helperFunctions';

class Comments extends Component{

constructor(props){
  super(props);
  this.state={
    newComment:'',
    comments:[]
  }
  this.getData.bind(this);
  this.getData(this.props.id);
}

getData(id){
    database.collection('proj-comments').where("task", "==", id).get()
  .then((data)=>{
    let comments = snapshotToArray(data).map((item)=>{
      return {
        ...item,
        user:this.props.users.find((user)=>user.id===item.user)
      };
  });
    this.setState({comments});
  });
}


  render(){
    return (
      <div>
        <div>
          <FormGroup>
            <Label>Add comment</Label>
            <Input type="textarea" placeholder="Enter comment" value={this.state.newComment} onChange={(e)=>this.setState({newComment:e.target.value})}/>
            <Button color="primary" disabled={this.state.newComment===''||this.state.saving} onClick={()=>{
                this.setState({saving:true});
                let body={
                  user:this.props.userID,
                  comment:this.state.newComment,
                  createdAt: (new Date()).getTime(),
                  task:this.props.id
                }
                rebase.addToCollection('/proj-comments',body).then(()=>{this.setState({saving:false,newComment:''});this.getData(this.props.id)})
              }}>Send</Button>
          </FormGroup>

        </div>
        {this.state.comments.sort((item1,item2)=>item2.createdAt-item1.createdAt).map((comment)=>
          <div key={comment.id}>
            <div className="" style={{borderTop:"1px solid rgba(54, 64, 74, 0.05)", borderBottom:"1px solid rgba(54, 64, 74, 0.05)"}}>
              <div className="media m-b-30 m-t-30">
                <img
                  className="d-flex mr-3 rounded-circle thumb-sm"
                  src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
                  alt="Generic placeholder XX"
                  />
                <div className="media-body">
                  <span className="media-meta pull-right">{timestampToString(comment.createdAt)}</span>
                  <h4 className="text-primary font-16 m-0">{comment.user!==undefined?(comment.user.name + ' '+comment.user.surname):'Unknown sender'}</h4>
                  <small className="text-muted">From: {comment.user!==undefined?(comment.user.email):'Unknown sender'}</small>
                </div>
              </div>
              <div  dangerouslySetInnerHTML={{__html: comment.comment.replace(/(?:\r\n|\r|\n)/g, '<br>') }}>
              </div>
            </div>
          </div>
        )}
    </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
	const { id } = userReducer;
	return { userID:id };
};

export default connect(mapStateToProps, { })(Comments);