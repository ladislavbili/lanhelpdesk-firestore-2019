import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import {toSelArr, snapshotToArray, getAttributeDefaultValue, htmlFixNewLines} from '../../helperFunctions';
import Select from 'react-select';
import {selectStyle} from "../../scss/selectStyles";
import IPList from './ipList';
import Links from './links';
import Passwords from './passwords';
import AttributesHandler from './attributesHandler';
import TextareaList from '../components/backups';
import classnames from 'classnames';
import CKEditor from 'ckeditor4-react';

export default class ItemAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      loading:true,
      companies:[],
      statuses:[],
      allLinks:[],
      sidebarItem:null,
      tab:'0',

      title:'',
      description:'',
      company:null,
      status:null,
      IPlist:[],
      backupTasks:[],
      passwords:[],
      attributes:{},
      links:[]
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData();
  }

  getData(){
    Promise.all([
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-items').get(),
      database.collection('cmdb-sidebar').where('url','==',this.props.match.params.sidebarID).get(),
    ])
    .then(([statuses,companies,links,sidebarItem])=>{
      this.setData(toSelArr(snapshotToArray(statuses)),toSelArr(snapshotToArray(companies)),toSelArr(snapshotToArray(links)),snapshotToArray(sidebarItem)[0]);
    });
  }


  setData(statuses,companies,links, sidebarItem){
    let attributes={};
    sidebarItem.attributes.forEach((item)=>attributes[item.id]=getAttributeDefaultValue(item))
    this.setState({
      statuses,
      companies,
      sidebarItem,
      attributes,
      allLinks:links,
      loading:false
    });
  }

  removeBackupTask(id){
    this.setState({
      backupTasks: this.state.backupTasks.filter((item)=>item.id!==id),
    });
  }

  removePassword(id){
    this.setState({
      passwords: this.state.passwords.filter((item)=>item.id!==id),
    });
  }



  render(){
    return (
      <div className="ml-auto mr-auto card-box fit-with-header-and-commandbar p-t-15 w-50" >
          <FormGroup>
            <Label>Name</Label>
            <Input type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label>Company</Label>
            <Select
              styles={selectStyle}
              options={this.state.companies}
              value={this.state.company}
              onChange={e =>{ this.setState({ company: e }); }}
              />
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <Select
              styles={selectStyle}
              options={this.state.statuses}
              value={this.state.status}
              onChange={e =>{ this.setState({ status: e }); }}
              />
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
          <TabContent activeTab={this.state.tab} className="m-t-15">
            <TabPane tabId="0">
              <CKEditor
                data={this.state.description}
                onChange={(e)=>this.setState({description:e.editor.getData()})}
                config={ {
                  //height: [ '60vh' ],
                  codeSnippet_languages: {
                    javascript: 'JavaScript',
                    php: 'PHP'
                  }
                } }
                />
            </TabPane>
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
              <TabPane tabId="4">
                <Passwords items={this.state.passwords} onChange={(items)=>this.setState({passwords:items})} />
              </TabPane>
              <TabPane tabId="5">
                <Links items={this.state.links} links={this.state.allLinks} onChange={(links)=>this.setState({links})} />
              </TabPane>
            </TabContent>

            <Button className="btn m-t-10" disabled={this.state.company===null || this.state.status===null} onClick={()=>{
                this.setState({saving:true});
                let body = {
                  title:this.state.title,
                  description:this.state.description,
                  company:this.state.company.id,
                  status:this.state.status.id,
                  IP:this.state.IPlist.map((item)=>item.IP),
                  attributes:this.state.attributes,
                  sidebarID:this.state.sidebarItem.url
                };
                rebase.addToCollection('/cmdb-items', body)
                .then((response)=>{
                  this.state.IPlist.forEach((item)=>{
                    delete item['id'];
                    delete item['fake'];
                    rebase.addToCollection('/cmdb-IPs',{...item,itemID:response.id});
                  });

                  this.state.passwords.forEach((item)=>{
                    delete item['id'];
                    delete item['fake'];
                    rebase.addToCollection('/cmdb-passwords',{...item,itemID:response.id});
                  });

                  this.state.links.forEach((item)=>{
                    delete item['id'];
                    delete item['fake'];
                    delete item['opened'];
                    item.link=item.link.id;
                    rebase.addToCollection('/cmdb-links',{...item,itemID:response.id});
                  });


                  this.state.backupTasks.forEach((item)=>{
                    rebase.addToCollection('/cmdb-backups',{text:item.text,itemID:response.id,textHeight:item.textHeight});
                  });
                  let attributes={};
                  this.state.sidebarItem.attributes.forEach((item)=>attributes[item.id]=getAttributeDefaultValue(item));
                  this.setState({
                    title:'',
                    company:null,
                    status:null,
                    IPlist:[],
                    saving:false,
                    attributes,
                    description:'',
                    links:[]
                  });
                  this.props.history.goBack();
                });
              }}>{this.state.saving?'Adding...':(this.state.sidebarItem? ('Add '+this.state.sidebarItem.title) :'Add item')}</Button>

              <Button className="btn-link m-t-10" onClick={this.props.history.goBack}>Cancel</Button>

          </div>
        );
      }
    }
