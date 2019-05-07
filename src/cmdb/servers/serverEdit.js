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
      database.collection('cmdb-IPlist').where("serverID", "==", this.props.match.params.id).get(),
      database.collection('cmdb-server-backups').where("serverID", "==", this.props.match.params.id).get(),
      database.collection('cmdb-server-storage').where("serverID", "==", this.props.match.params.id).get(),
    ])
    .then(([statuses,companies,server,ipList,backups,storages])=>{
      this.setData(
        toSelArr(snapshotToArray(statuses)),
        toSelArr(snapshotToArray(companies)),
        {id:server.id,...server.data()},
        toSelArr(snapshotToArray(ipList)),
        toSelArr(snapshotToArray(backups)),
        toSelArr(snapshotToArray(storages)),
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
      IPlist:ipList,
      backupTasks:backups,
      diskArray:storages
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

        <Button color="primary" disabled={this.state.company===null || this.state.status===null} onClick={()=>{
            this.setState({saving:true});
            let body = {
              title:this.state.title,
              company:this.state.company.id,
              status:this.state.status.id,
              IP:this.state.IPlist.map((item)=>item.IP)
            };
            rebase.addToCollection('/cmdb-servers', body)
              .then((response)=>{
                this.state.IPlist.map((item)=>{
                  delete item['id'];
                  rebase.addToCollection('/cmdb-IPList',{...item,serverID:response.id});
                });

                this.state.backupTasks.map((item)=>{
                  rebase.addToCollection('/cmdb-server-backups',{text:item.text,serverID:response.id});
                });

                this.state.diskArray.map((item)=>{
                  rebase.addToCollection('/cmdb-server-storage',{text:item.text,serverID:response.id});
                });

                  this.setState({
                  title:'',
                  company:null,
                  status:null,
                  IPlist:[],
                  backupTasks:[],
                  diskArray:[],
                  saving:false});
                  //this.props.history.goBack();
              });
          }}>{this.state.saving?'Adding...':'Add server'}</Button>
        </div>
      </div>
    );
  }
}
