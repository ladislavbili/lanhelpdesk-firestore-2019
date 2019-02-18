import React, { Component } from 'react';
import { FormGroup, FormControl, Modal, Button, ControlLabel, Checkbox  } from 'react-bootstrap';
import Select from 'react-select';


export default class EditService extends Component{
  constructor(props){
    super(props);
    this.state={
      title:this.props.service.title,
      unit:this.props.units.find((unit)=>this.props.service.unit.id===unit.id),
      workType:this.props.workTypes.find((workType)=>workType.id===this.props.service.workType),
      price:this.props.service.price,
      quantity:this.props.service.quantity,
      discount:this.props.service.discount,
      extraWork:this.props.service.extraWork,

    }
    this.saveService.bind(this);
  }

  saveService(){
    let body={
      discount:this.state.discount!==''?this.state.discount:0,
      extraPrice:this.props.company?parseFloat(this.props.company.pricelist.afterHours) : 0,
      extraWork:this.state.extraWork,
      price:this.state.price!==''?this.state.price:0,
      quantity:this.state.quantity!==''?this.state.quantity:0,
      title:this.state.title,
      unit:this.state.unit.id,
      workType: this.state.workType.id
    }
    this.props.saveService(body,this.props.service.id);
    this.props.toggle();
  }

  componentWillReceiveProps(props){
    if(props.service!==null && (this.props.service===null || (this.props.service.id!==props.service.id))){
        this.setState({
          title:props.service.title,
          unit:props.units.find((unit)=>props.service.unit.id===unit.id),
          workType:props.workTypes.find((workType)=>workType.id===props.service.workType),
          price:props.service.price,
          quantity:props.service.quantity,
          discount:props.service.discount,
          extraWork:props.service.extraWork,

        });
    }
  }

  render(){
    let totalPrice=(this.state.price!==''?parseFloat(this.state.price):0)*(this.state.quantity!==''?parseFloat(this.state.quantity):0)*
      (100+(this.props.company&&this.state.extraWork?parseFloat(this.props.company.pricelist.afterHours) : 0 ))/100*
      (100-(this.state.discount!==''?parseFloat(this.state.discount):0))/100;
    totalPrice=totalPrice.toFixed(3);

    return (
      <Modal show={this.props.isOpen} onHide={this.props.toggle} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>{'Editing service'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-padding">
          <FormGroup>
              <ControlLabel className="center-hor">Name</ControlLabel>
              <FormControl type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <FormGroup>
              <ControlLabel className="center-hor">Work type</ControlLabel>
              <Select
                value={this.state.workType}
                onChange={(workType)=>{
                  let price=0;
                  if(workType.id!==false){
                    price = workType.prices.find((item)=>item.pricelist===this.props.company.pricelist.id);
                    if(price === undefined){
                      price = 0;
                    }else{
                      price = price.price;
                    }
                  }
                  this.setState({workType,price})
                  }
                }
                options={this.props.workTypes}
                />
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
          <FormGroup className="row">
            <Checkbox value={this.state.extraWork} onChange={()=>{
                this.setState({extraWork:!this.state.extraWork});
              }}/>
            <ControlLabel className="center-hor">Extra work</ControlLabel>
          </FormGroup>
            <FormGroup>
              <ControlLabel className="center-hor">Extra work price</ControlLabel>
              <FormControl type="number" value={this.props.company?this.props.company.pricelist.afterHours : 0 } disabled={true} />
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
                  this.saveService();
            }}>Save</Button>
          <Button onClick={this.props.toggle}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
