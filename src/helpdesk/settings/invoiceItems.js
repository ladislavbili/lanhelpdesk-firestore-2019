import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Table, Modal, Glyphicon } from 'react-bootstrap';
import Select from 'react-select';

export default class InvoiceItems extends Component{
  constructor(props){
    super(props);
    this.state={
      addOpened:false,
      editedID:null,
      editOpened:false,
      title:'',
      unit:null,
      quantity:0,
      price:0,
      sn:''
    }
  }

  render(){
    return (
      <div>
          <Table striped condensed hover>
            <thead>
              <tr>
                <th>Item name</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Price (no TAX)</th>
                <th>SN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.props.invoiceItems.map((item)=>
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{this.props.units.some((unit)=>unit.id===item.unit)?this.props.units.find((unit)=>unit.id===item.unit).title:'Unknown unit'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.sn}</td>
                  <td>
                    <Button className="no-border inherit-background" onClick={()=>{
                        this.setState({
                          editOpened:!this.state.editOpened,
                          editedID:item.id,
                          title:item.title,
                          unit:this.props.units.some((unit)=>unit.id===item.unit)?this.props.units.find((unit)=>unit.id===item.unit):null,
                          quantity:item.quantity,
                          price:item.price,
                          sn:item.sn,
                        });
                    }}>
                      <Glyphicon glyph="pencil" className="center-hor" /></Button>
                    <Button className="no-border inherit-background" onClick={()=>{
                        if(window.confirm('Are you sure?')){
                            this.props.deleteItem(item.id);
                        }
                      }}><Glyphicon glyph="trash" className="center-hor" /></Button>
                </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Button bsStyle="success" className="separate" onClick={()=>this.setState({addOpened:!this.state.addOpened})} >Add invoice item</Button>

          <Modal show={this.state.addOpened} onHide={()=>this.setState({addOpened:!this.state.addOpened})} bsSize="large">
            <Modal.Header closeButton>
              <Modal.Title>Adding item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container-padding">
                <FormGroup>
                  <ControlLabel className="center-hor">Name</ControlLabel>
                  <FormControl type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="center-hor">Quantity</ControlLabel>
                  <FormControl type="number" placeholder="Enter quantity" value={this.state.quantity} onChange={(e)=>this.setState({quantity:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="center-hor">Unit</ControlLabel>
                  <Select
                    value={this.state.unit}
                    onChange={(unit)=>this.setState({unit})}
                    options={this.props.units}
                    />
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="center-hor">Price</ControlLabel>
                  <FormControl type="number" placeholder="Enter price" value={this.state.price} onChange={(e)=>this.setState({price:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="center-hor">SN</ControlLabel>
                  <FormControl type="text" placeholder="Enter SN" value={this.state.sn} onChange={(e)=>this.setState({sn:e.target.value})} />
                </FormGroup>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="success" disabled={this.props.disabled||this.state.unit===null} onClick={()=>{
                  this.props.addItem({id:this.props.newItemID,title:this.state.title,unit:this.state.unit.id,quantity:this.state.quantity,price:this.state.price,sn:this.state.sn});
                  this.setState({
                    addOpened:false,
                    title:'',
                    quantity:0,
                    price:0,
                    sn:''
                  });
                }}>Add</Button>
                <Button onClick={()=>this.setState({addOpened:!this.state.addOpened})}>Close</Button>
              </Modal.Footer>
            </Modal>

          <Modal show={this.state.editOpened} onHide={()=>this.setState({editOpened:!this.state.editOpened})} bsSize="large">
            <Modal.Header closeButton>
              <Modal.Title>Editing item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container-padding">
                <FormGroup>
                  <ControlLabel className="center-hor">Name</ControlLabel>
                  <FormControl type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="center-hor">Quantity</ControlLabel>
                  <FormControl type="number" placeholder="Enter quantity" value={this.state.quantity} onChange={(e)=>this.setState({quantity:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="center-hor">Unit</ControlLabel>
                  <Select
                    value={this.state.unit}
                    onChange={(unit)=>this.setState({unit})}
                    options={this.props.units}
                    />
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="center-hor">Price</ControlLabel>
                  <FormControl type="number" placeholder="Enter price" value={this.state.price} onChange={(e)=>this.setState({price:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="center-hor">SN</ControlLabel>
                  <FormControl type="text" placeholder="Enter SN" value={this.state.sn} onChange={(e)=>this.setState({sn:e.target.value})} />
                </FormGroup>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary" disabled={this.props.disabled||this.state.unit===null} onClick={()=>{
                  this.props.editItem({id:this.state.editedID,title:this.state.title,unit:this.state.unit.id,quantity:this.state.quantity,price:this.state.price,sn:this.state.sn});
                  this.setState({
                    editOpened:false,
                    title:'',
                    quantity:0,
                    price:0,
                    sn:''
                  });
                }}>Edit</Button>
              <Button onClick={()=>this.setState({editOpened:!this.state.editOpened})}>Close</Button>
              </Modal.Footer>
            </Modal>
      </div>
    );
  }
}
