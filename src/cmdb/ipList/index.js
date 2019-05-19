import React, { Component } from 'react';
import { Table } from 'reactstrap';

export default class ServerAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      editNIC:'',
      editIP:'',
      editMask:'',
      editGateway:'',
      editDNS:'',
      editItemID:null,
      editFake: true,

      newNIC:'',
      newIP:'',
      newMask:'',
      newGateway:'',
      newDNS:'',
      newItemID:0
    }
  }


  render(){
    return (
      <Table striped>
        <thead>
          <tr>
            <th>NIC</th>
            <th>IP</th>
            <th>Mask</th>
            <th>Gateway</th>
            <th>DNS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.props.items.map((item,index)=>
            <tr key={item.id}>
              <td>
                <input
                  type="text"
                  className="invisible-input"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editNIC
                      : item.NIC
                    }
                    onBlur={() => {
                      let body={
                        NIC:this.state.editNIC,
                        IP:this.state.editIP,
                        mask:this.state.editMask,
                        gateway:this.state.editGateway,
                        DNS:this.state.editDNS,
                        id:this.state.editItemID,
                        fake:this.state.editFake,
                      }
                      let newData = [...this.props.items];
                      newData[index]=body;
                      this.props.onChange(newData);
                      this.setState({ editItemID: null });
                    }}
                    onFocus={() => {
                      this.setState({
                        editNIC:item.NIC,
                        editIP:item.IP,
                        editMask:item.mask,
                        editGateway:item.gateway,
                        editDNS:item.DNS,
                        editItemID:item.id,
                        editFake:item.fake,
                      });
                    }}
                    onChange={e =>{
                      this.setState({ editNIC: e.target.value })}
                    }
                    />
              </td>
              <td>
                <input
                  type="text"
                  className="invisible-input"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editIP
                      : item.IP
                    }
                    onBlur={() => {
                      let body={
                        NIC:this.state.editNIC,
                        IP:this.state.editIP,
                        mask:this.state.editMask,
                        gateway:this.state.editGateway,
                        DNS:this.state.editDNS,
                        id:this.state.editItemID,
                        fake:this.state.editFake,
                      }
                      let newData = [...this.props.items];
                      newData[index]=body;
                      this.props.onChange(newData);
                      this.setState({ editItemID: null });
                    }}
                    onFocus={() => {
                      this.setState({
                        editNIC:item.NIC,
                        editIP:item.IP,
                        editMask:item.mask,
                        editGateway:item.gateway,
                        editDNS:item.DNS,
                        editItemID:item.id,
                        editFake:item.fake,
                      });
                    }}
                    onChange={e =>{
                      this.setState({ editIP: e.target.value })}
                    }
                    />
              </td>
              <td>
                <input
                  type="text"
                  className="invisible-input"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editMask
                      : item.mask
                    }
                    onChange={e =>{
                      this.setState({ editMask: e.target.value })}
                    }
                    onBlur={() => {
                      let body={
                        NIC:this.state.editNIC,
                        IP:this.state.editIP,
                        mask:this.state.editMask,
                        gateway:this.state.editGateway,
                        DNS:this.state.editDNS,
                        id:this.state.editItemID,
                        fake:this.state.editFake,
                      }
                      let newData = [...this.props.items];
                      newData[index]=body;
                      this.props.onChange(newData);
                      this.setState({ editItemID: null });
                    }}
                    onFocus={() => {
                      this.setState({
                        editNIC:item.NIC,
                        editIP:item.IP,
                        editMask:item.mask,
                        editGateway:item.gateway,
                        editDNS:item.DNS,
                        editItemID:item.id,
                        editFake:item.fake,
                      });
                    }}
                    />
              </td>
              <td>
                <input
                  type="text"
                  className="invisible-input"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editGateway
                      : item.gateway
                    }
                    onChange={e =>{
                      this.setState({ editGateway: e.target.value })}
                    }
                    onBlur={() => {
                      let body={
                        NIC:this.state.editNIC,
                        IP:this.state.editIP,
                        mask:this.state.editMask,
                        gateway:this.state.editGateway,
                        DNS:this.state.editDNS,
                        id:this.state.editItemID,
                        fake:this.state.editFake,
                      }
                      let newData = [...this.props.items];
                      newData[index]=body;
                      this.props.onChange(newData);
                      this.setState({ editItemID: null });
                    }}
                    onFocus={() => {
                      this.setState({
                        editNIC:item.NIC,
                        editIP:item.IP,
                        editMask:item.mask,
                        editGateway:item.gateway,
                        editDNS:item.DNS,
                        editItemID:item.id,
                        editFake:item.fake,
                      });
                    }}
                    />
              </td>
              <td>
                <input
                  type="text"
                  className="invisible-input"
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editDNS
                      : item.DNS
                    }
                    onChange={e =>{
                      this.setState({ editDNS: e.target.value })}
                    }
                    onBlur={() => {
                      let body={
                        NIC:this.state.editNIC,
                        IP:this.state.editIP,
                        mask:this.state.editMask,
                        gateway:this.state.editGateway,
                        DNS:this.state.editDNS,
                        id:this.state.editItemID,
                        fake:this.state.editFake,
                      }
                      let newData = [...this.props.items];
                      newData[index]=body;
                      this.props.onChange(newData);
                      this.setState({ editItemID: null });
                    }}
                    onFocus={() => {
                      this.setState({
                        editNIC:item.NIC,
                        editIP:item.IP,
                        editMask:item.mask,
                        editGateway:item.gateway,
                        editDNS:item.DNS,
                        editItemID:item.id,
                        editFake:item.fake,
                      });
                    }}
                    />
              </td>
              <td>
                <button className="btn btn-link waves-effect"
                  onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      let newData = [...this.props.items];
                      newData.splice(index,1);
                      this.props.onChange(newData);
                    }
                  }}
                  >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
            )
          }
          <tr>
            <td>
              <input
                type="text"
                value={this.state.newNIC}
                onChange={(e)=>this.setState({newNIC:e.target.value})}
                className="form-control invisible-input"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <input
                type="text"
                value={this.state.newIP}
                onChange={(e)=>this.setState({newIP:e.target.value})}
                className="form-control invisible-input"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <input
                type="text"
                value={this.state.newMask}
                onChange={(e)=>this.setState({newMask:e.target.value})}
                className="form-control invisible-input"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <input
                type="text"
                value={this.state.newGateway}
                onChange={(e)=>this.setState({newGateway:e.target.value})}
                className="form-control invisible-input"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>
            <td>
              <input
                type="text"
                value={this.state.newDNS}
                onChange={(e)=>this.setState({newDNS:e.target.value})}
                className="form-control invisible-input"
                id="inlineFormInput"
                placeholder=""
                style={{ height: 30 }}
                />
            </td>

            <td>
              <button className="btn btn-link waves-effect"
                disabled={this.state.newIP===''}
                onClick={()=>{
                  let body={
                    NIC:this.state.newNIC,
                    IP:this.state.newIP,
                    mask:this.state.newMask,
                    gateway:this.state.newGateway,
                    DNS:this.state.newDNS,
                    id:this.state.newItemID,
                    fake:true
                  }
                  this.setState({
                    newNIC:'',
                    newIP:'',
                    newMask:'',
                    newGateway:'',
                    newDNS:'',
                    newItemID:this.state.newItemID+1
                  });

                  this.props.onChange([...this.props.items,body]);
                  }
                }
                >
                <i className="fa fa-plus" />
              </button>
            </td>

          </tr>
        </tbody>

      </Table>
    );
  }
}
