import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Checkbox from '../../../components/checkbox';
import {rebase } from '../../../index';
import { connect } from "react-redux";
import {storageImapsStart} from '../../../redux/actions';

class ImapEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      saving:false,
      imaps:[],
      isDefault:false,
      showPass:false,

      title:'',
      host: "",
      port: 993,
      user: '',
      password: '',
      tls: true,
      rejectUnauthorized: false,
      def:false,
    }
    this.setData.bind(this);
  }

  canSave(){
    return this.state.title!=='' &&
      this.state.host!=='' &&
      this.state.port!=='' &&
      this.state.user!==''
  }

  setData(imaps,id){
    let imap=imaps.find((item)=>item.id===id);
    this.setState({
      loading:false,
      imaps,
      isDefault:imap.def,
      showPass:false,

      title: imap.title,
      host: imap.host,
      port: imap.port,
      user: imap.user,
      password: imap.password,
      tls: imap.tls,
      rejectUnauthorized: imap.rejectUnauthorized,
      def:imap.def,
      })
  }

  componentWillMount(){
    if(!this.props.imapsActive){
      this.props.storageImapsStart();
    }
    if(this.props.imapsLoaded){
      this.setData(this.props.imaps,this.props.match.params.id);
    }
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(props.imapsLoaded){
        this.setData(props.imaps,props.match.params.id);
      }
    }
    if(props.imapsLoaded && !this.props.imapsLoaded){
      this.setData(props.imaps,props.match.params.id);
    }
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        {
          this.state.loading &&
          <Alert color="success">
            Loading data...
          </Alert>
        }

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.def }
          onChange={()=>{
            this.setState({def:!this.state.def})
          }}
          label = "Default"
          />

        <FormGroup>
          <Label for="name">Title</Label>
          <Input type="text" name="name" id="name" placeholder="Enter title" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="name">Host</Label>
          <Input type="text" name="name" id="host" placeholder="Enter host" value={this.state.host} onChange={(e)=>this.setState({host:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="name">Port</Label>
          <Input type="number" name="name" id="port" placeholder="Enter port" value={this.state.port} onChange={(e)=>this.setState({port:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="name">Username</Label>
          <Input type="text" name="name" id="user" placeholder="Enter user" value={this.state.user} onChange={(e)=>this.setState({user:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <InputGroup>
            <Input type={this.state.showPass?'text':"password"} className="from-control" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} />
            <InputGroupAddon addonType="append" className="clickable" onClick={()=>this.setState({showPass:!this.state.showPass})}>
              <InputGroupText>
                <i className={"mt-auto mb-auto "+ (!this.state.showPass ?'fa fa-eye':'fa fa-eye-slash')}/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.tls }
          onChange={()=>{
            this.setState({tls:!this.state.tls})
          }}
          label = "TLS"
          />

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.rejectUnauthorized }
          onChange={()=>{
            this.setState({rejectUnauthorized:!this.state.rejectUnauthorized})
          }}
          label = "Reject unauthorized"
          />

        <div className="row">
            <Button className="btn" disabled={this.state.saving || !this.canSave()} onClick={()=>{
              this.setState({saving:true});
              rebase.updateDoc('/imaps/'+this.props.match.params.id, {
                title:this.state.title ,
                host:this.state.host ,
                port:this.state.port ,
                user:this.state.user ,
                password:this.state.password ,
                tls:this.state.tls ,
                rejectUnauthorized:this.state.rejectUnauthorized ,
                def:this.state.def,
              }).then((response)=>{
                if(this.state.def && !this.state.isDefault){
                  this.state.imaps.filter((imap)=>imap.id!==this.props.match.params.id && imap.def).forEach((item)=>{
                    rebase.updateDoc('/imaps/'+item.id,{def:false})
                  })
                }
                this.setState({saving:false});
              });
            }}>{this.state.saving?'Saving Imap...':'Save Imap'}</Button>

          <Button className="btn-red ml-auto" disabled={this.state.saving} onClick={()=>{
                  if(window.confirm("Are you sure?")){
                    rebase.removeDoc('/imaps/'+this.props.match.params.id).then(()=>{
                      this.props.history.goBack();
                    });
                  }
              }}>Delete</Button>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ storageImaps }) => {
  const { imapsLoaded,imapsActive, imaps } = storageImaps;
  return { imapsLoaded,imapsActive, imaps };
};

export default connect(mapStateToProps, { storageImapsStart })(ImapEdit);
