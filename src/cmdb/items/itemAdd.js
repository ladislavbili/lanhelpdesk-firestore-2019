import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input } from 'reactstrap';
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
      backupTasks:[{id:-1, def: true}],
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
    console.log(this.state.backupTasks);
    return (
      <div>

          <div className="container-fluid">
            <div className="d-flex flex-row align-items-center">
            </div>
          </div>

      <div className="ml-auto mr-auto card-box fit-with-header-and-commandbar p-t-15 scrollable" >
          <FormGroup className="row m-b-10">
            <div className="w-10">
              <Label>Name</Label>
            </div>
            <div className="flex">
              <Input type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </div>
          </FormGroup>
          <FormGroup className="row m-b-10">
            <div className="w-10">
              <Label>Company</Label>
            </div>
            <div className="flex">
              <Select
                styles={selectStyle}
                options={this.state.companies}
                value={this.state.company}
                onChange={e =>{ this.setState({ company: e }); }}
                />
            </div>
          </FormGroup>
          <FormGroup className="row m-b-10">
            <div className="w-10">
              <Label>Status</Label>
            </div>
            <div className="flex">
              <Select
                styles={selectStyle}
                options={this.state.statuses}
                value={this.state.status}
                onChange={e =>{ this.setState({ status: e }); }}
                />
            </div>
          </FormGroup>
          <FormGroup className="row m-b-10">
            <div  className="w-10">
              <Label>Description</Label>
            </div>
            <div className="flex">
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
            </div>
            </FormGroup>

            <AttributesHandler attributes={this.state.sidebarItem ? this.state.sidebarItem.attributes : []} values={this.state.attributes}
              setValue={(id, val)=>{
                let newAttributes={...this.state.attributes};
                newAttributes[id] = val;
                this.setState({attributes:newAttributes})
              }} />

            <div className="m-t-10">
              <Label className="font-16">IP list</Label>
              <IPList items={this.state.IPlist} onChange={(items)=>this.setState({IPlist:items})} />
            </div>
            <div className="m-t-10">
              <Label className="font-16">Backup tasks</Label>
              <TextareaList
                items={this.state.backupTasks}
                onChange={(items)=>this.setState({backupTasks:items})}
                removeItem={this.removeBackupTask.bind(this)}
                width={300}
                rows={6}
                label={htmlFixNewLines(this.state.sidebarItem?this.state.sidebarItem.bacupTasksLabel:'')}
                addLabel="Add backup task"
                />
            </div>

              <div className="m-t-10">
                <Label className="font-16">Passwords</Label>
                <Passwords items={this.state.passwords} onChange={(items)=>this.setState({passwords:items})} />
              </div>
              <div className="m-t-10">
                <Label className="font-16">Links</Label>
                <Links items={this.state.links} links={this.state.allLinks} onChange={(links)=>this.setState({links})} />
              </div>

            <Button className="btn m-t-10  m-b-30 " disabled={this.state.company===null || this.state.status===null} onClick={()=>{
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

                  if (this.state.backupTasks.length === 1 && !this.state.backupTasks[0].def){
                    this.state.backupTasks.forEach((item)=>{
                      rebase.addToCollection('/cmdb-backups',
                      {
                        text: item.text ? item.text : "",
                        itemID:response.id,
                        textHeight:item.textHeight ? item.textHeight : null,
                        backupList: item.backupList ? item.backupList : [],
                      });
                    });
                  }

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

              <Button className="btn-link m-t-10  m-b-30 " onClick={this.props.history.goBack}>Cancel</Button>

          </div>
        </div>
        );
      }
    }
