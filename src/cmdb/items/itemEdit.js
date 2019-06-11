import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import {toSelArr, snapshotToArray, getAttributeDefaultValue, htmlFixNewLines} from '../../helperFunctions';
import Select from 'react-select';
import IPList from './ipList';
import AttributesHandler from './attributesHandler';
import TextareaList from '../components/textareaListTextOnly';
import classnames from 'classnames';


export default class ItemAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      loading:true,
      companies:[],
      statuses:[],
      originalIPs:[],
      originalBackups:[],
      sidebarItem:null,
      tab:'1',

      title:'',
      company:null,
      status:null,
      IPlist:[],
      backupTasks:[],
      attributes:{},
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData();
  }

  getData(){
    Promise.all([
      database.collection('cmdb-items').doc(this.props.match.params.itemID).get(),
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-sidebar').where('url','==',this.props.match.params.sidebarID).get(),
      database.collection('cmdb-IPs').where('itemID','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-backups').where('itemID','==',this.props.match.params.itemID).get(),
    ])
    .then(([item,statuses,companies,sidebarItem,IPs, backups])=>{
      this.setData({id:item.id,...item.data()}, toSelArr(snapshotToArray(statuses)),toSelArr(snapshotToArray(companies)),snapshotToArray(sidebarItem)[0],snapshotToArray(IPs),snapshotToArray(backups));
    });
  }


  setData(item,statuses,companies,sidebarItem, IPs, backups){
    let attributes={};
    sidebarItem.attributes.forEach((item)=>attributes[item.id]=getAttributeDefaultValue(item));
    attributes={...attributes,...item.attributes};
    let company = companies.find((item2)=>item2.id===item.company);
    if(company===undefined){
      if(companies.length>0){
        company=companies[0];
      }else{
        company=null
      }
    }
    let status = statuses.find((item2)=>item2.id===item.status);
    if(!status){
      if(statuses.length>0){
        status=statuses[0];
      }
      status=null
    }
    this.setState({
      statuses,
      companies,
      sidebarItem,
      loading:false,

      title:item.title,
      company,
      status,
      IPlist:IPs.map((item)=>{return {...item,fake:false}}),
      backupTasks:backups.map((item)=>{return {...item,fake:false}}),
      attributes,

      originalIPs:IPs.map((item)=> item.id),
      originalBackups:backups.map((item)=> item.id),
    });
  }

  removeBackupTask(id){
    this.setState({
      backupTasks: this.state.backupTasks.filter((item)=>item.id!==id),
    });
  }



  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
          <div className="ml-auto mr-auto" style={{maxWidth:1000}}>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label>Company</Label>
              <Select
                className="supressDefaultSelectStyle"
                options={this.state.companies}
                value={this.state.company}
                onChange={e =>{ this.setState({ company: e }); }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select
                className="supressDefaultSelectStyle"
                options={this.state.statuses}
                value={this.state.status}
                onChange={e =>{ this.setState({ status: e }); }}
              />
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
            </Nav>
            <TabContent activeTab={this.state.tab} style={{marginBottom:30,borderRadius:4}}>
              <TabPane tabId="1">
                <IPList items={this.state.IPlist} onChange={(items)=>this.setState({IPlist:items})} />
              </TabPane>
              <TabPane tabId="2">
                <TextareaList
                  items={this.state.backupTasks}
                  onChange={(items)=>this.setState({backupTasks:items})}
                  removeItem={this.removeBackupTask.bind(this)}
                  width={300}
                  rows={6}
                  label={htmlFixNewLines(this.state.sidebarItem?this.state.sidebarItem.bacupTasksLabel:'')}
                  addLabel="Add backup task"
                />
              </TabPane>
              <TabPane tabId="3">
                <AttributesHandler attributes={this.state.sidebarItem ? this.state.sidebarItem.attributes : []} values={this.state.attributes}
                  setValue={(id, val)=>{
                    let newAttributes={...this.state.attributes};
                    newAttributes[id] = val;
                    this.setState({attributes:newAttributes})
                  }} />
              </TabPane>
            </TabContent>



        <Button color="secondary" onClick={this.props.history.goBack}>Cancel</Button>

        <Button color="primary" disabled={this.state.company===null || this.state.status===null||this.state.saving} onClick={()=>{

          let ID = this.props.match.params.itemID;
          this.setState({saving:true});
          let body = {
            title:this.state.title,
            company:this.state.company.id,
            status:this.state.status.id,
            IP:this.state.IPlist.map((item)=>item.IP),
            attributes:this.state.attributes
          };
          let promises=[];
          promises.push(rebase.updateDoc('/cmdb-items/'+ID, body));

          this.state.IPlist.filter((item)=>item.fake).forEach((item)=>{
            let newItem={...item};
            delete newItem['id'];
            delete newItem['fake'];
            promises.push(rebase.addToCollection('/cmdb-IPs',{...newItem,itemID:ID}));
          });

          this.state.IPlist.filter((item)=>!item.fake).forEach((item)=>{
            let newItem={...item};
            delete newItem['id'];
            delete newItem['fake'];
            promises.push(rebase.updateDoc('/cmdb-IPs/'+item.id,{...newItem}));
          });

          let currentIDs=this.state.IPlist.filter((item)=>!item.fake).map((item)=>item.id);
          this.state.originalIPs.filter((item)=>!currentIDs.includes(item)).forEach((item)=>{
            promises.push(rebase.removeDoc('/cmdb-IPs/'+item.id));
          });

          this.state.backupTasks.filter((item)=>item.fake).forEach((item)=>{
            promises.push(rebase.addToCollection('/cmdb-backups',{text:item.text,itemID:ID}));
          });
          this.state.backupTasks.filter((item)=>!item.fake).forEach((item)=>{
            promises.push(rebase.updateDoc('/cmdb-backups/'+item.id,{text:item.text,itemID:ID}));
          });

          currentIDs = this.state.backupTasks.map(item => item.id);
          this.state.originalBackups.filter((item)=> !currentIDs.includes(item)).forEach((item)=>{
            promises.push(rebase.removeDoc('/cmdb-backups/'+item));
          });
          Promise.all(promises).then(()=>{
            this.setState({saving:false,loading:true})
            Promise.all([
              database.collection('cmdb-items').doc(this.props.match.params.itemID).get(),
              database.collection('cmdb-IPs').where('itemID','==',this.props.match.params.itemID).get(),
              database.collection('cmdb-backups').where('itemID','==',this.props.match.params.itemID).get(),
            ])
            .then(([item,IPs, backups])=>{
              this.setData({id:item.id,...item.data()}, this.state.statuses,this.state.companies,this.state.sidebarItem,snapshotToArray(IPs),snapshotToArray(backups));
            });
          })
        }}>{this.state.saving?'Saving...':(this.state.sidebarItem? ('Save '+this.state.sidebarItem.title) :'Save item')}</Button>

        <Button color="danger" disabled={this.state.saving} onClick={()=>{
            if(window.confirm('Are you sure?')){
              this.setState({saving:true,loading:true})
              this.state.originalIPs.map((item)=>rebase.removeDoc('/cmdb-IPs/'+item));
              this.state.originalBackups.map((item)=>rebase.removeDoc('/cmdb-backups/'+item));
              rebase.removeDoc('/cmdb-items/'+this.props.match.params.itemID);
              this.props.history.goBack();
            }
        }}>Delete</Button>
        </div>
      </div>
    );
  }
}
