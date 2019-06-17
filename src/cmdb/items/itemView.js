import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Table } from 'reactstrap';
import {toSelArr, snapshotToArray, getAttributeDefaultValue, htmlFixNewLines, calculateTextAreaHeight} from '../../helperFunctions';
import Select from 'react-select';
import IPList from './ipList';
import Passwords from './passwords';
import AttributesHandler from './attributesHandler';
import TextareaList from '../components/textareaListTextOnly';
import classnames from 'classnames';


export default class ItemView extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      tab:'1',
      item:null,
      statuses:[],
      companies:[],
      sidebarItem:null,
      IPs:[],
      passwords:[],
      backups:[],
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.delete.bind(this);
    this.getData();
  }

  componentWillReceiveProps(props){
    if(props.delete){
      this.delete();
    }
  }

  getData(){
    Promise.all([
      database.collection('cmdb-items').doc(this.props.match.params.itemID).get(),
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-sidebar').where('url','==',this.props.match.params.sidebarID).get(),
      database.collection('cmdb-IPs').where('itemID','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-passwords').where('itemID','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-backups').where('itemID','==',this.props.match.params.itemID).get(),
    ])
    .then(([item,statuses,companies,sidebarItem,IPs,passwords,backups])=>{
      this.setData({id:item.id,...item.data()}, snapshotToArray(statuses),snapshotToArray(companies),snapshotToArray(sidebarItem)[0],snapshotToArray(IPs),snapshotToArray(passwords),snapshotToArray(backups));
    });
  }

  setData(item,statuses,companies,sidebarItem, IPs,passwords, backups){
    let attributes={};
    sidebarItem.attributes.forEach((item)=>attributes[item.id]=getAttributeDefaultValue(item));
    attributes={...attributes,...item.attributes};
    this.setState({
      item,
      statuses,
      companies,
      sidebarItem,
      IPs,
      passwords,
      backups,
      attributes,
    });
  }

  delete(){
    if(window.confirm('Are you sure?')){
      this.setState({saving:true,loading:true})
      this.state.IPs.map((item)=>rebase.removeDoc('/cmdb-IPs/'+item));
      this.state.backups.map((item)=>rebase.removeDoc('/cmdb-backups/'+item));
      rebase.removeDoc('/cmdb-items/'+this.props.match.params.itemID);
      this.props.setDeleting(false);
      this.props.history.goBack();
    }
    this.props.setDeleting(false);
  }

  render(){
    return (
        <div className="form-background card-box scrollable fit-with-header" style={{padding:0,border:'none'}}>
          <div className="ml-auto mr-auto" style={{maxWidth:1000}}>
            <FormGroup>
              <Label>Name</Label>
              <div>{this.state.item===null?'':this.state.item.title}</div>
            </FormGroup>
            <FormGroup>
              <Label>Company</Label>
              <div>{this.state.item===null?'':this.state.companies.find((item)=>item.id===this.state.item.company).title}</div>
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <div>{this.state.item===null?'':this.state.statuses.find((item)=>item.id===this.state.item.status).title}</div>
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <div  dangerouslySetInnerHTML={{__html:this.state.item===null?'': this.state.item.description.replace(/(?:\r\n|\r|\n)/g, '<br>') }}></div>
            </FormGroup>

            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1', clickable:true })}
                  onClick={() => { this.setState({tab:'1'}); }}
                >
                  IP list
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' , clickable:true   })}
                  onClick={() => { this.setState({tab:'2'}); }}
                >
                  Backup tasks
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3', clickable:true })}
                  onClick={() => { this.setState({tab:'3'}); }}
                >
                  Attributes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '4', clickable:true })}
                  onClick={() => { this.setState({tab:'4'}); }}
                >
                  Passwords
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.tab} style={{marginBottom:30,borderRadius:4}}>
              <TabPane tabId="1">
                <Table striped>
                  <thead>
                    <tr>
                      <th>NIC</th>
                      <th>IP</th>
                      <th>Mask</th>
                      <th>Gateway</th>
                      <th>DNS</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.IPs.map((item,index)=>
                      <tr key={item.id}>
                        <td>{item.NIC}</td>
                        <td>{item.IP}</td>
                        <td>{item.mask}</td>
                        <td>{item.gateway}</td>
                        <td>{item.DNS}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TabPane>
              <TabPane tabId="2">
                { this.state.backups.map((item,index)=>
                  <div className="row" key={item.id}>
                    <Label>
                      <div style={{width:300, fontWeight: 50}} dangerouslySetInnerHTML ={{__html:htmlFixNewLines(this.state.sidebarItem?this.state.sidebarItem.bacupTasksLabel:'')}}/>
                    </Label>
                    <div style={{width:700}} dangerouslySetInnerHTML ={{__html:htmlFixNewLines(item.text)}}>
                    </div>
                  </div>
                )}
              </TabPane>
              <TabPane tabId="3">
                { (this.state.sidebarItem ? this.state.sidebarItem.attributes : []).map((item)=>
                  <FormGroup key={item.id}>
                    <Label>{item.title}</Label>
                    { item.type.id==='select' &&
                      <div>{this.state.attributes[item.id].label}</div>
                    }
                    { item.type.id==='input' &&
                      <div>{this.state.attributes[item.id]}</div>
                    }
                    { item.type.id==='textarea' &&
                      <div dangerouslySetInnerHTML ={{__html:htmlFixNewLines(this.state.attributes[item.id])}}></div>
                    }
                  </FormGroup>
                )}
              </TabPane>
              <TabPane tabId="4">
                <Table striped>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>URL</th>
                      <th>Login</th>
                      <th>Password</th>
                      <th>IP</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.passwords.map((item,index)=>
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.URL}</td>
                        <td>{item.login}</td>
                        <td>{item.password}</td>
                        <td>{item.IP}</td>
                        <td>{item.note}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TabPane>
            </TabContent>
        </div>
      </div>
    );
  }
}
