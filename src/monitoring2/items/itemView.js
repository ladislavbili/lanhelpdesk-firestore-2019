import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { FormGroup, Label, TabContent, TabPane, Nav, NavItem, NavLink, Table } from 'reactstrap';
import {snapshotToArray, getAttributeDefaultValue, htmlFixNewLines} from '../../helperFunctions';
import classnames from 'classnames';


export default class ItemView extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      tab:'0',
      item:null,
      statuses:[],
      companies:[],
      sidebarItem:null,
      IPs:[],
      passwords:[],
      backups:[],
      items:[],
      links:[]
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
      database.collection('cmdb-items').get(),
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-sidebar').where('url','==',this.props.match.params.sidebarID).get(),
      database.collection('cmdb-IPs').where('itemID','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-passwords').where('itemID','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-backups').where('itemID','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-links').where('link','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-links').where('itemID','==',this.props.match.params.itemID).get(),
    ])
    .then(([items,statuses,companies,sidebarItem,IPs,passwords,backups,links1,links2])=>{
      this.setData(
        snapshotToArray(items).find((item)=>item.id===this.props.match.params.itemID),
        snapshotToArray(statuses),
        snapshotToArray(companies),
        snapshotToArray(sidebarItem)[0],
        snapshotToArray(IPs),
        snapshotToArray(passwords),
        snapshotToArray(backups),
        snapshotToArray(items),
        [...(snapshotToArray(links1).map((item)=>{return{...item,itemID:item.link,link:item.itemID}})),...(snapshotToArray(links2).map((item)=>{return{...item}}))]
      );
    });
  }

  setData(item,statuses,companies,sidebarItem, IPs,passwords, backups,items,links){
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
      items,
      links: links.map((item)=>{
        return {
          ...item,
          link:items.find((item2)=>item2.id===item.link)
        }
      })
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

            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === '0', clickable:true })}
                  onClick={() => { this.setState({tab:'0'}); }}
                >
                  Description
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === '1', clickable:true })}
                  onClick={() => { this.setState({tab:'1'}); }}
                >
                  IP list
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === '2' , clickable:true   })}
                  onClick={() => { this.setState({tab:'2'}); }}
                >
                  Backup tasks
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === '3', clickable:true })}
                  onClick={() => { this.setState({tab:'3'}); }}
                >
                  Attributes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === '4', clickable:true })}
                  onClick={() => { this.setState({tab:'4'}); }}
                >
                  Passwords
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === '5', clickable:true })}
                  onClick={() => { this.setState({tab:'5'}); }}
                >
                  Links
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.tab} style={{marginBottom:30,borderRadius:4}}>
              <TabPane tabId="0">
                <div  dangerouslySetInnerHTML={{__html:this.state.item===null?'': this.state.item.description.replace(/(?:\r\n|\r|\n)/g, '<br>') }}></div>
              </TabPane>
              <TabPane tabId="1">
                <Table striped>
                  <thead>
                    <tr>
                      <th>NIC</th>
                      <th>IP</th>
                      <th>Mask</th>
                      <th>Gateway</th>
                      <th>DNS</th>
                      <th>DNS 2</th>
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
                        <td>{item.DNS2}</td>
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
                      <th>IP/URL</th>
                      <th>Login</th>
                      <th>Password</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.passwords.map((item,index)=>
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td> <a href={item.IP} target="_blank" without rel="noopener noreferrer">{item.IP}</a></td>
                        <td>{item.login}</td>
                        <td>{item.password}</td>
                        <td>{item.note}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TabPane>
              <TabPane tabId="5">
                <Table striped>
                  <thead>
                    <tr>
                      <th>Connection</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.links.map((item,index)=>
                      <tr key={item.id}>
                        <td><a href={'/cmdb/i/'+item.link.sidebarID+'/'+item.link.id} target="_blank" without rel="noopener noreferrer">{item.link.title}</a></td>
                        <td><div dangerouslySetInnerHTML ={{__html:htmlFixNewLines(item.note)}}></div></td>
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
