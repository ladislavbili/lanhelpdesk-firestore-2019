import React, { Component } from 'react';
import { Input, Label, Button, FormGroup } from 'reactstrap';
import firebase from 'firebase';
import { connect } from "react-redux";
import {rebase,database} from '../../index';
import {snapshotToArray, timestampToString} from '../../helperFunctions';
import { Creatable } from 'react-select';
import classnames from 'classnames';

class Comments extends Component{

constructor(props){
  super(props);
  this.state={
    newComment:'',
    isEmail:false,
    comments:[],
    subject:'',
    tos:[]
  }
  this.getData.bind(this);
  this.getData(this.props.id);
}

componentWillReceiveProps(props){
	if(this.props.id!==props.id){
		this.getData(props.id);
	}
}

getData(id){
  Promise.all([
    database.collection('help-comments').where("task", "==", id).get(),
    database.collection('help-mails').where("taskID", "==", parseInt(id)).get(),
  ])
  .then(([data,mails])=>{
    let comments = snapshotToArray(data).map((item)=>{
      return {
        ...item,
        isMail:false,
        user:this.props.users.find((user)=>user.id===item.user)
      };
  });
  let emails = snapshotToArray(mails).map((item)=>{
    return {
      ...item,
      isMail:true
    }
  })
    this.setState({comments:[...comments,...emails]});
  });
}


  render(){
    return (
      <div>
        <div>
          {this.state.isEmail &&<FormGroup>
            <Label className="text-slim">To:</Label>
              <Creatable
                isMulti
                onChange={(newData)=>this.setState({tos:newData.map((item)=>item.label)})}
                options={this.props.users}
              />
          </FormGroup>}
          {this.state.isEmail && <FormGroup>
            <Label className="text-slim">Subject</Label>
            <Input type="text" placeholder="Enter subject" value={this.state.subject} onChange={(e)=>this.setState({subject:e.target.value})}/>
          </FormGroup>}
          <FormGroup>
            <Label className="text-slim">Add comment</Label>
            <Input type="textarea" placeholder="Enter comment" value={this.state.newComment} onChange={(e)=>this.setState({newComment:e.target.value})}/>
          </FormGroup>
          <Button
            className={classnames({ active:this.state.isEmail}, "btn-link", "t-a-l", "m-t-5" )}
            onClick={()=>this.setState({isEmail:!this.state.isEmail})} >
            {this.state.isEmail?'Message':'E-mail'}
          </Button>
          <Button className="btn waves-effect m-t-5"
            disabled={this.state.newComment===''||(this.state.isEmail&&(this.state.tos.length < 1 ||this.state.subject===''))||this.state.saving} onClick={()=>{
              this.setState({saving:true});
              let body={
                user:this.props.userID,
                comment:this.state.newComment,
                createdAt: (new Date()).getTime(),
                task:this.props.id
              }
              rebase.addToCollection('/help-comments',body).then(()=>{this.setState({saving:false,newComment:''});this.getData(this.props.id)})
              if(this.state.isEmail){
                firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((token)=>{
                  fetch('https://127.0.0.1:8081/send-mail',{
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body:JSON.stringify({message:this.state.newComment,tos:this.state.tos, subject:this.state.subject, taskID:this.props.id,token,email:this.props.users.find((user)=>user.id===this.props.userID).email}),
                  }).then((response)=>response.json().then((response)=>{
                    this.setState({subject:'',tos:[]})
                    console.log(response);
                  }))
                });
              }
            }}>Send</Button>

        </div>
        {this.state.comments.sort((item1,item2)=>item2.createdAt-item1.createdAt).map((comment)=>
          <div key={comment.id} style={{width:900}}>
            <div className="" style={{borderTop:"1px solid rgba(54, 64, 74, 0.05)", borderBottom:"1px solid rgba(54, 64, 74, 0.05)"}}>
              <div className="media m-b-30 m-t-30">
                <img
                  className="d-flex mr-3 rounded-circle thumb-sm"
                  src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
                  alt="Generic placeholder XX"
                  />
                <div className="media-body">
                  <span className="media-meta pull-right">{timestampToString(comment.createdAt)}</span>
                  {comment.isMail && <h4 className="text-primary font-16 m-0">{comment.from.map((item)=>item.address).toString()}</h4>}
                  {comment.isMail && <small className="text-muted">Send from e-mail: {comment.subject}</small>}
                  {!comment.isMail && <h4 className="text-primary font-16 m-0">{comment.user!==undefined?(comment.user.name + ' '+comment.user.surname):'Unknown sender'}</h4>}
                  {!comment.isMail && <small className="text-muted">From: {comment.user!==undefined?(comment.user.email):'Unknown sender'}</small>}
                </div>
              </div>
              {comment.isMail && <div className="ignore-css" dangerouslySetInnerHTML={{__html: comment.html?comment.html:unescape(comment.text).replace(/(?:\r\n|\r|\n)/g, '<br>') }}></div>}
              {!comment.isMail && <div  dangerouslySetInnerHTML={{__html: comment.comment.replace(/(?:\r\n|\r|\n)/g, '<br>') }}>
              </div>}
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
