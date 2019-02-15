import React, {Component} from 'react';
import base from '../../../../firebase';
import AddNICModalForm from './AddNICModalForm';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import BackupTaskList from '../backuptasks/BackupTaskList';

export default class ServerEdit extends Component {

  constructor(props){
    super(props);
      this.state = {
        id : null,
        serverName : null,
        companyName : null,
        description: null,
        serverFunction: null,
        processor: null,
        hdd: null,
        type : null,
        status : null,
        placeID : null,

        chosenCompany : null,
        chosenStatus : null,

        companies: [],
        nics : {},
        types : [],
        places : [],

        openEdit : false,
      }
      this.editServer.bind(this);
      this.setAny.bind(this);
      this.renderEditable.bind(this);
      this.handleDeleteNIC.bind(this);
  }

  componentDidMount(){
    const SERVER_ID = this.props.match.params.id;
    base.fetch(`cmdb-servers/${SERVER_ID}`, {
      context: this,
      state:'server',
      then:(server)=>{
        this.setState({
          id : SERVER_ID,
          serverName : server.serverName,
          companyName : server.companyName,
          description: server.description,
          serverFunction: server.serverFunction,
          processor: server.processor,
          hdd: server.hdd,
          type : server.type,
          status : server.status,
          placeID : server.placeID,
        })
      }
    });

    this.ref1 = base.syncState(`cmdb-nics`, {
        context: this,
        state: 'nics'
      });

    this.ref2 = base.syncState(`settings-companies`, {
      context: this,
      state: 'companies',
      asArray: true,
    });

      this.ref3 = base.syncState(`cmdb-types`, {
          context: this,
          state: 'types',
          asArray: true,
        });

      this.ref5 = base.bindToState(`cmdb-places`, {
        context: this,
        state: 'places',
        asArray: true,
      });
  }

  componentWillUnmount() {
      base.removeBinding(this.ref1);
      base.removeBinding(this.ref2);
      base.removeBinding(this.ref3);
      base.removeBinding(this.ref5);
  }

  editServer(){
    let data={
      serverName : this.state.serverName,
      companyName : (this.state.chosenCompany ? this.state.chosenCompany.companyName : this.state.companyName),
      description: this.state.description,
      serverFunction: this.state.serverFunction,
      processor: this.state.processor,
      hdd: this.state.hdd,
      type: (this.state.chosenType ? this.state.chosenType.label : this.state.type),
      status: (this.state.chosenStatus ? this.state.chosenStatus.label : this.state.status),
      placeID : this.state.placeID || null,
    }
    base.update(`cmdb-servers/${this.state.id}`,{data});

    this.props.history.goBack();
  }

  setAny(key, value){
    let newState={};
    newState[key]=value.target.value;
    this.setState( newState);
  }

  setAnyFromSelect(key, value){
    let newState={};
    newState[key]=value;
    this.setState(newState);
  }

  handleDeleteNIC(event){
    if (window.confirm("Are you sure you want to delete this NIC?")) {
      base.remove(`cmdb-nics/${event}`);
    } else {
      return;
    }
  }

  renderEditable(cellInfo) {
      return (
          <div
            style={{ backgroundColor: "#fafafa" }}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => {
              let DATA = {...this.state.nics};
              DATA[cellInfo.original.id][cellInfo.column.id] = e.target.innerHTML;
              this.setState({
                nics : DATA
              });
            }}
            dangerouslySetInnerHTML={{
              __html: this.state.nics[cellInfo.original.id][cellInfo.column.id]
            }}
          />
        );
      }


  render() {
      const DATA_NIC = Object
                    .values(this.state.nics)
                    .filter(val => val.serverID === this.state.id);

      const COLUMNS_NIC = [
      {
        Header: 'NIC',
        accessor: 'nic',
        Cell: this.renderEditable.bind(this)
      }, {
        Header: 'IP address',
        accessor: 'IPaddress',
        Cell: this.renderEditable.bind(this)
      },{
        Header: 'Mask',
        accessor: 'mask',
        Cell: this.renderEditable.bind(this)
      }, {
        Header: 'Gateway',
        accessor: 'gateway',
        Cell: this.renderEditable.bind(this)
      },{
        Header: 'DNS1',
        accessor: 'dns1',
        Cell: this.renderEditable.bind(this)
      }, {
        Header: 'DNS2',
        accessor: 'dns2',
        Cell: this.renderEditable.bind(this)
      },{
        Header: 'MAC',
        accessor: 'mac',
        Cell: this.renderEditable.bind(this)
      }, {
        Header: 'DHCP',
        accessor: 'dhcp',
        Cell : this.renderEditable.bind(this)
      },
      {
        Header: '',
        accessor: 'edit',
        Cell : row => {
              return (
                  <div>
                    <Button bsSize='small' bsStyle='danger' onClick={(e) => {this.handleDeleteNIC(row.original.id)}}>Delete</Button>
                  </ div>
                )
              },
      },
    ];

      const DATA_PLACES = (this.state.placeID === null || this.state.placeID === "") ? [] : this.state.places.filter(place => place.id === this.state.placeID);
      const COLUMNS_PLACES = [
              {
                Header: 'Room',
                accessor: 'room',
              }, {
                Header: 'Street',
                accessor: 'street',
              },{
                Header: 'City',
                accessor: 'city',
              }, {
                Header: 'State',
                accessor: 'state',
              }, {
                Header: '',
                accessor: 'edit',
                Cell : row => {
                      return (
                          <div>
                            <Button bsSize='small' bsStyle='warning' onClick={() => this.setState({openEdit:true})}>Change</Button>
                            <Button bsSize='small' bsStyle='danger' onClick={() => this.setState({placeID : null})}>No location</Button>
                          </ div>
                        )
                      },
              },
            ];
      const STATUSES = [
        {
          label: "ON",
          value: 1
        }, {
          label: "OFF",
          value: 2
        }, {
          label: "TEST",
          value: 3
        }
      ];
    return (
      <div className='content-page'>
        <div className="content">
          <div className="container-fluid">
            <div className='card-box'>

              <h4 class="page-title m-b-20">Server Edit</h4>

              <div className='form-group row'>
                <ControlLabel className='col-2 col-form-label'>Server Name</ControlLabel>
                <div className='col-10' >
                  <FormControl type="text" placeholder='Enter name' value={this.state.serverName} onChange={(e) => this.setState({ serverName: e.target.value })}/>
                </div>
              </div>

              <div className='form-group row'>
                <ControlLabel className='col-2 col-form-label'>Select company</ControlLabel>
                <div className='col-10' >
                  <Select
                    options={(this.state.companies ? this.state.companies : []).map(company => {
                      company.label = company.companyName;
                      company.value = company.id;
                      return company;
                    })}
                    value={
                      this.state.chosenCompany || (this.state.companies ? this.state.companies : []).filter(company =>
                        company.companyName === this.state.companyName)
                    }
                    onChange={(value) => this.setAnyFromSelect("chosenCompany", value)}
                  />
                  </div>
              </div>

              <div className='form-group row'>
                <ControlLabel className='col-2 col-form-label'>Select type</ControlLabel>
                  <div className='col-10' >
                    <Select
                      options={(this.state.types ? this.state.types : []).map(type => {
                        type.label = type.typeName;
                        type.value = type.id;
                        return type;
                      })}
                      value={
                        this.state.chosenType || (this.state.types ? this.state.types : []).filter(t =>
                          t.label === this.state.type
                        )
                      }
                      onChange={(value) => this.setAnyFromSelect('chosenType', value)}
                    />
                  {/*          <FormControl value={this.state.type} onChange={(value) => this.setAny('type', value)} componentClass="select" placeholder="select" >
                  {
                    Object.keys(this.state.types)
                          .map(c => <option key={c} value={this.state.types[c].typeName}> {this.state.types[c].typeName} </option> )
                  }
                  </FormControl>*/}
                  </div>
              </div>
              <div  className='form-group row'>
                <ControlLabel className='col-2 col-form-label'>Select status</ControlLabel>
                  <div className='col-10' >
                    <Select
                      options={STATUSES}
                      value={
                        this.state.chosenStatus || STATUSES.filter(st =>
                          st.label === this.state.status
                        )
                      }
                      onChange={(value) => this.setAnyFromSelect('chosenStatus', value)}
                    />
                  </div>
              </div>

              <div className='form-group row'>
                <ControlLabel className='col-2 col-form-label'>Function</ControlLabel>
                  <div className='col-10' >
                <FormControl  placeholder='Enter function' value={this.state.serverFunction} onChange={(e) => this.setState({ serverFunction: e.target.value })} type="text" />
                </div>
              </div>

              <div className='form-group row'>
                <ControlLabel className='col-2 col-form-label'>Description</ControlLabel>
                  <div className='col-10' >
                <FormControl componentClass="textarea" placeholder='Enter describtion' value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} />
                </div>
              </div>

              <div controlId="inputName" className='form-group row'>
                <ControlLabel className='col-2 col-form-label'>Processor</ControlLabel>
                  <div className='col-10' >
                <FormControl type="text" placeholder='Enter processor' value={this.state.processor} onChange={(e) => this.setState({ processor: e.target.value })} />
                </div>
              </div>

              <div controlId="inputName" className='form-group row'>
                <ControlLabel className='col-2 col-form-label'>HDD</ControlLabel>
                  <div className='col-10' >
                <FormControl componentClass="textarea"  placeholder='Enter HDD' value={this.state.hdd} onChange={(e) => this.setState({ hdd: e.target.value })} />
                </div>
              </div>

              <FormGroup controlId="textareaHDD">
                <ControlLabel>NICs</ControlLabel>
                  <ReactTable
                    data={DATA_NIC}
                    columns={COLUMNS_NIC}
                    defaultPageSize={5}
                    className="-highlight"
                    showPagination={false}
                  />

                  <AddNICModalForm serverId={this.state.id}/>
              </FormGroup>

              <FormGroup controlId="textareaHDD">
                <ControlLabel>Location</ControlLabel>
                  {
                    (this.state.placeID !== null && this.state.placeID !== "" && this.state.placeID !== undefined) &&
                    <ReactTable
                      data={DATA_PLACES}
                      columns={COLUMNS_PLACES}
                      defaultPageSize={1}
                      showPagination={false}
                    />

                }

                  {(this.state.placeID === null || this.state.placeID === ""  || this.state.placeID === undefined) &&
                    <div>
                    <Button bsStyle="success" bsSize='small' onClick={() => this.setState({openEdit:true})}> Choose location of server </Button>
                    </div>
                  }

                  <Modal
                    open={this.state.openEdit}
                    onClose={() => this.setState({openEdit:false})}
                    center
                    closeOnEsc
                    closeOnOverlayClick
                    >
                      <FormGroup controlId="selectplace">
                        <ControlLabel>Select place</ControlLabel>

                          <Select
                            options={this.state.places.map((place)=>{
                              place.value=place.id;
                              place.label=place.state + ', ' + place.city + ', ' + place.street + ', ' + place.room;
                              return place;
                            })}
                            value={this.state.place}
                            onChange={e =>{ this.setState({ placeID: e.id })}}
                            />

                          <Button onClick={() => this.setState({openEdit:false})}> Close </Button>

                      </FormGroup>
                  </Modal>

              </FormGroup>

              <FormGroup controlId="textareaHDD">
                <BackupTaskList serverID={parseInt(this.state.id)} />
              </FormGroup>

              <Button type="submit" onClick={this.editServer.bind(this)} bsStyle='warning'>Edit this server</Button>

            </div>
          </div>
        </div>
      </div>
        );
  }
}
