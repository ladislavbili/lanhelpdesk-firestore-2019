import React from 'react';
import base from '../../../../firebase';
import firebase from 'firebase';
import AddNICModalForm from './AddNICModalForm';
import BackupTaskList from '../backuptasks/BackupTaskList';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import Select from 'react-select';

export default class ServerAdd extends React.Component {

  constructor(props){
    super(props);
      this.state = {
        companies : [],
        modalOpen : false,
        nics : {},
        types : [],
        statuses : {},
        places : [],
        lastServer : null,

        openEdit : false,

        place : null,
      }
      this.addServer.bind(this);
      this.renderEditable.bind(this);
      this.handleDeleteNIC.bind(this);
  }

  componentDidMount(){
    this.ref = base.bindToState(`cmdb-servers`, {
      context: this,
      state: 'lastServer',
      asArray: true,
      queries: {
        orderByChild: 'id',
        limitToLast: 1
      }
    });

    this.ref1 = base.syncState(`cmdb-nics`, {
        context: this,
        state: 'nics'
      });

    this.ref2 = base.syncState(`settings-companies`, {
      context: this,
      state: 'companies',
      asArray: true
    });

    this.ref3 = base.syncState(`cmdb-types`, {
        context: this,
        state: 'types',
        asArray: true
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

  addServer(){
    if (this.name.value.length < 1) return;
    const ID = this.state.lastServer.length>0?this.state.lastServer[0].id+1:0;
    firebase.database()
            .ref(`cmdb-servers/${ID}`)
            .set({
              id: ID,
              serverName : this.name.value,
              companyName : (this.company ? this.company.companyName : null),
              description: this.description.value,
              serverFunction: this.serverFunction.value,
              processor: this.processor.value,
              hdd: this.hdd.value,
              type : (this.type ? this.type.typeName : null),
              status : (this.status ? this.status.label : null),
              placeID : (this.state.place !== null && this.state.place !== undefined) ? this.state.place.id : null,
            });
  }

  handleDeleteNIC(id){
    if (window.confirm("Are you sure you want to delete this NIC?")) {
      base.remove(`cmdb-nics/${id}`);
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
    const SERVER_ID = this.state.lastServer !== null && this.state.lastServer.length>0?this.state.lastServer[0].id+1:0;

    const DATA_NIC = Object
                  .values(this.state.nics)
                  .filter(val => val.serverID === ''+SERVER_ID);
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
      const DATA_PLACES = this.state.place === null ? [] : [this.state.place];
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
                            <Button bsSize='small' bsStyle='danger' onClick={() => this.setState({place : null})}>No location</Button>
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

              <h4 class="page-title m-b-20">Server Add</h4>

                <div className='form-group row'>
                  <ControlLabel className='col-2 col-form-label'>Server Name</ControlLabel>
                  <div className='col-10' >
                      <FormControl  inputRef={(input) => this.name = input} type="text" placeholder="Enter Server Name"/>
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
                          value={this.company}
                          onChange={e =>{ this.company = e }}
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
                          value={this.type}
                          onChange={e =>{ this.type = e }}
                        />
                    </div>
                </div>

                <div  className='form-group row'>
                  <ControlLabel className='col-2 col-form-label'>Select status</ControlLabel>
                    <div className='col-10' >
                      <Select
                        options={STATUSES}
                        value={this.status}
                        onChange={e =>{ this.status = e }}
                      />
                    </div>
                </div>

                <div className='form-group row'>
                  <ControlLabel className='col-2 col-form-label'>Function</ControlLabel>
                    <div className='col-10' >
                    <FormControl  inputRef={(input) => this.serverFunction = input } type="text" placeholder="Enter Server Function"/>
                    </div>
                  </div>

                  <div className='form-group row'>
                    <ControlLabel className='col-2 col-form-label'>Description</ControlLabel>
                      <div className='col-10' >
                    <FormControl inputRef={(input) => this.description = input } componentClass="textarea" placeholder="Enter description of this server" />
                    </div>
                  </div>

                  <div className='form-group row'>
                    <ControlLabel className='col-2 col-form-label'>Processor</ControlLabel>
                      <div className='col-10' >
                    <FormControl  inputRef={(input) => this.processor = input } type="text" placeholder="Enter Processor"/>
                    </div>
                  </div>

                  <div className='form-group row'>
                    <ControlLabel className='col-2 col-form-label'>HDD</ControlLabel>
                      <div className='col-10' >
                    <FormControl inputRef={(input) => this.hdd = input } componentClass="textarea" placeholder="Enter HDD" />
                    </div>
                  </div>

                  <FormGroup >
                    <ControlLabel>NICs</ControlLabel>
                      <ReactTable
                        data={DATA_NIC}
                        columns={COLUMNS_NIC}
                        defaultPageSize={5}
                        className="-highlight"
                        showPagination={false}
                      />

                    <AddNICModalForm serverId={ SERVER_ID+''}/>
                  </FormGroup>

                  <FormGroup >
                    <ControlLabel>Location</ControlLabel>
                      {
                        this.state.place !== null &&
                        <ReactTable
                          data={DATA_PLACES}
                          columns={COLUMNS_PLACES}
                          defaultPageSize={1}
                          showPagination={false}
                        />
                    }

                      {this.state.place === null &&
                        <div>
                        <Button bsStyle="success" bsSize='small' onClick={() => this.setState({openEdit:true})}> Choose location of server </Button>
                        </div>
                      }

                      <div>
                        <Modal
                          open={this.state.openEdit}
                          onClose={() => {}}
                          center
                          closeOnEsc
                          closeOnOverlayClick
                          >
                            <FormGroup controlId="selectplace">
                              <ControlLabel>Select place </ControlLabel>

                                <Select
                                  options={this.state.places.map((place)=>{
                                    place.value=place.id;
                                    place.label=place.state + ', ' + place.city + ', ' + place.street + ', ' + place.room;
                                    return place;
                                  })}
                                  value={this.state.place}
                                  onChange={e =>{ this.setState({ place: e })}}
                                  />

                                <Button onClick={() => this.setState({openEdit:false})}> Close </Button>
                            </FormGroup>
                        </Modal>
                      </div>
                    </FormGroup>

                  <FormGroup>
                    <BackupTaskList serverID={SERVER_ID} />
                  </FormGroup>

                  <Link to={{pathname : '/cmdb/servers'}}>
                    <Button type="submit" onClick={this.addServer.bind(this)} bsStyle='success' >+ Add Server</Button>
                  </Link>

                </div>
              </div>
          </div>
        </div>
        );
    }
}
