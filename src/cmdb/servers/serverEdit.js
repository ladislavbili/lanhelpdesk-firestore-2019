import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon, InputGroupText, Alert, Table } from 'reactstrap';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import Select from 'react-select';
import IPList from '../ipList';
import TextareaList from '../textareaList';

export default class ServerEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      companies:[],
      statuses:[],
      originalIPList:[],
      title:'',
      company:null,
      status:null,
      IPlist:[],
      backupTasks:[],
      diskArray:[],
    }

    this.setData.bind(this);
    this.getData.bind(this);
    this.getData();
  }

  getData(){
    Promise.all([
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-servers').doc(this.props.match.params.id).get(),
      database.collection('cmdb-IPList').where("serverID", "==", this.props.match.params.id).get(),
      database.collection('cmdb-server-backups').where("serverID", "==", this.props.match.params.id).get(),
      database.collection('cmdb-server-storage').where("serverID", "==", this.props.match.params.id).get(),
    ])
    .then(([statuses,companies,server,ipList,backups,storages])=>{
      this.setData(
        toSelArr(snapshotToArray(statuses)),
        toSelArr(snapshotToArray(companies)),
        {id:server.id,...server.data()},
        snapshotToArray(ipList),
        snapshotToArray(backups),
        snapshotToArray(storages),
    );
    });
  }

  setData(statuses,companies,server,ipList,backups,storages){
    this.setState({
      statuses,
      companies,
      backupTasks:backups,
      title:server.title,
      company:companies.find((item)=>item.id===server.company),
      status:statuses.find((item)=>item.id===server.status),
      originalIPList:ipList,
      IPlist:ipList.map((item)=>{return {...item,fake:false}}),
      backupTasks:backups.map((item)=>{return {...item,fake:false}}),
      diskArray:storages.map((item)=>{return {...item,fake:false}}),
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

          <IPList items={this.state.IPlist} onChange={(items)=>this.setState({IPlist:items})} />
          <TextareaList
            items={this.state.backupTasks}
            onChange={(items)=>this.setState({backupTasks:items})}
            width={300}
            label={`
                Názov <br>
                Zálohované údaje  <br>
                Rotáciu zálohy  <br>
                Čas spustenia <br>
                Notifikačný email <br>
                Smtp settings pre notifikácie <br>
            `}
            addLabel="Add backup task"
            />
          <TextareaList
            items={this.state.diskArray}
            onChange={(items)=>this.setState({diskArray:items})}
            width={300}
            label={`
              <span>
              RAID RADIČ <br>
              POCET HDD <br>
              Typ a velkost hdd <br>
            </span>
            `}
            addLabel="Add disk array"
            />


        <Button color="secondary" onClick={this.props.history.goBack}>Cancel</Button>

        <Button color="success" disabled={this.state.company===null || this.state.status===null} onClick={()=>{
            let ID = this.props.match.params.id;
            this.setState({saving:true});
            let body = {
              title:this.state.title,
              company:this.state.company.id,
              status:this.state.status.id,
              IP:this.state.IPlist.map((item)=>item.IP)
            };
            rebase.updateDoc('/cmdb-servers/'+ID, body);

            this.state.IPlist.filter((item)=>item.fake).map((item)=>{
              let newItem={...item};
              delete newItem['id'];
              delete newItem['fake'];
              rebase.addToCollection('/cmdb-IPList',{...newItem,serverID:ID});
            });

            this.state.IPlist.filter((item)=>!item.fake).map((item)=>{
              let newItem={...item};
              delete newItem['id'];
              delete newItem['fake'];
              rebase.updateDoc('/cmdb-IPList/'+item.id,{...newItem});
            });

            let currentIDs=this.state.IPlist.filter((item)=>!item.fake).map((item)=>item.id);
            this.state.originalIPList.filter((item)=>!currentIDs.includes(item.id)).map((item)=>{
              rebase.removeDoc('/cmdb-IPList/'+item.id);
            });

            this.state.backupTasks.filter((item)=>item.fake).map((item)=>{
              rebase.addToCollection('/cmdb-server-backups',{text:item.text,serverID:ID});
            });
            this.state.backupTasks.filter((item)=>!item.fake).map((item)=>{
              rebase.updateDoc('/cmdb-server-backups/'+item.id,{text:item.text,serverID:ID});
            });

            this.state.diskArray.filter((item)=>item.fake).map((item)=>{
              rebase.addToCollection('/cmdb-server-storage',{text:item.text,serverID:ID});
            });
            this.state.diskArray.filter((item)=>!item.fake).map((item)=>{
              rebase.updateDoc('/cmdb-server-storage/'+item.id,{text:item.text,serverID:ID});
            });

            this.setState({
              title:'',
              company:null,
              status:null,
              IPlist:[],
              backupTasks:[],
              diskArray:[],
              saving:false
            });

            this.props.history.goBack();
          }}>{this.state.saving?'Saving...':'Save server'}</Button>
        </div>
      </div>
    );
  }
}
