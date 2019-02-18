import React, { Component } from 'react';
import { FormGroup, FormControl, Modal, Button, ControlLabel  } from 'react-bootstrap';
import Select from 'react-select';


export default class EditMaterial extends Component{
  constructor(props){
    super(props);
    this.state={
      title:this.props.material.title,
      unit:this.props.units.find((unit)=>this.props.material.unit.id===unit.id),
      price:this.props.material.price,
      quantity:this.props.material.quantity,
      discount:this.props.material.discount,
      materialMargin:this.props.material.margin,
    }
    this.saveMaterial.bind(this);
  }

  saveMaterial(){
    let body={
      title:this.state.title,
      unit:this.state.unit.id,
      price:this.state.price!==''?this.state.price:0,
      quantity:this.state.quantity!==''?this.state.quantity:0,
      discount:this.state.discount!==''?this.state.discount:0,
      margin:this.state.materialMargin
    }
    this.props.saveMaterial(body,this.props.material.id);
    this.props.toggle();
  }

  componentWillReceiveProps(props){
    if(props.material!==null && (this.props.material===null || (this.props.material.id!==props.material.id))){
        this.setState({
          title:props.material.title,
          unit:props.units.find((unit)=>props.material.unit.id===unit.id),
          price:props.material.price,
          quantity:props.material.quantity,
          discount:props.material.discount,
          materialMargin:props.material.margin

        });
    }
  }

  render(){
    let totalPrice=(this.state.price!==''?parseFloat(this.state.price):0)*(this.state.quantity!==''?parseFloat(this.state.quantity):0)*
    (100+(this.state.materialMargin!==''?parseFloat(this.state.materialMargin):0))/100*
    (100-(this.state.discount!==''?parseFloat(this.state.discount):0))/100;
    totalPrice=totalPrice.toFixed(3);

    return (
      <Modal show={this.props.isOpen} onHide={this.props.toggle} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>{'Editing material'}</Modal.Title>
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
              <ControlLabel className="center-hor">Margin</ControlLabel>
              <FormControl type="number" placeholder="Enter margin" value={this.state.materialMargin} onChange={(e)=>this.setState({materialMargin:e.target.value})} />
          </FormGroup>
          <FormGroup>
              <ControlLabel className="center-hor">Discount</ControlLabel>
              <FormControl type="number" placeholder="Enter discount" value={this.state.discount} onChange={(e)=>this.setState({discount:e.target.value})} />
          </FormGroup>
          <FormGroup>
              <ControlLabel className="center-hor">Total price</ControlLabel>
              <FormControl type="number" disabled={true} value={totalPrice} />
          </FormGroup>
        </div>

        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={()=>{
                  this.saveMaterial();
            }}>Save</Button>
          <Button onClick={this.props.toggle}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
