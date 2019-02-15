import base from '../firebase';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import TagAdd from './TagAdd';

export default class Tags extends Component{
  constructor(props){
    super(props);
    this.state = {
      kbTags : [],
      openAddTag:false
    }
    //this.isActive.bind(this);
  }

  componentDidMount(){
    this.ref = base.syncState(`kb-tags`, {
      context: this,
      state: 'kbTags',
    asArray: true
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  isActive(id){
      return this.props.history.location.pathname.toLowerCase().includes('/tag/'+id+'/')||this.props.history.location.pathname.toLowerCase().endsWith('/tag/'+id);
    }

  render(){
    return (
      <div className="left side-menu">
        <div className="sidebar-inner slimscrollleft">
            <div id="sidebar-menu">

                <ul className="sidebar-menu">
                  <li active={this.isActive('all')} className="sidebar-menu">
                    <Link className='link' to={{pathname: `/lanwiki/tag/all`}}>
                        All
                    </Link>
                  </li>

                    {
                      this.state.kbTags
                      .map(asset =>
                        {
                          return(
                            <li className="sidebar-menu" active={this.isActive(asset.id)} className="sidebar-menu" key={asset.id} >
                            <Link  to={{pathname: `/lanwiki/tag/`+asset.id}}  key={asset.id}>
                                {asset.name}
                            </Link>
                          </li>)
                          })
                      }

                        <li onClick={()=>{this.setState({openAddTag:true})}} active={this.isActive('add')} className="sidebar-menu" >
                          <Link to={{}}>+Tag</Link>
                        </li>
                        
                        <Modal show={this.state.openAddTag} onHide={()=>{this.setState({openAddTag:false})}}>
                          <Modal.Header closeButton>
                            <Modal.Title>Add tag</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <TagAdd closeModal={()=>{this.setState({openAddTag:false})}} />
                          </Modal.Body>
                        </Modal>
                  </ul>
            </div>
        </div>
    </div>

        );
/*    <div className="left side-menu">
      <div className="sidebar-inner slimscrollleft">
        <div id="sidebar-menu">
          <ul className="sidebar-menu">
            {
            Object
              .keys(this.state.assets)
              .map(asset =>
                  <li className="sidebar-menu">
                    <Link className='' to={{pathname: `/cmdb/${this.state.assets[asset].toLowerCase()}`}}  key={this.state.assets[asset]}>
                        {this.state.assets[asset]}
                    </Link>
                  </li>
                )
            }
          </ul>
        </div>
      </div>
    </div>*/
      }
    }
