import React, { Component } from 'react';
import { FormGroup, FormControl, Modal, Button, ControlLabel, Checkbox  } from 'react-bootstrap';
import Select from 'react-select';


export default class AddServiceMaterial extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      unit:this.props.units[0],
      workType:{id:false,value:false,label:'Material',isMaterial:true},
      price:1,
      quantity:1,
      materialMargin:this.props.company?this.props.company.pricelist.materialMargin:0,
      discount:0,
      extraWork:false,

    }
    this.submitMaterial.bind(this);
  }

  submitService(){
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
    this.props.submitService(body);
    this.props.toggle();
    this.setState({
      title:'',
      unit:this.props.units[0],
      workType:{id:false,value:false,label:'Material',isMaterial:true},
      price:1,
      quantity:1,
      discount:0,
      extraWork:false
    });
  }

  submitMaterial(){
    let body={
      discount:this.state.discount!==''?this.state.discount:0,
      margin:this.state.materialMargin!==''?this.state.materialMargin:0,
      price:this.state.price!==''?this.state.price:0,
      quantity:this.state.quantity!==''?this.state.quantity:0,
      title:this.state.title,
      unit:this.state.unit.id
    }
    this.props.submitMaterial(body);
    this.props.toggle();
    this.setState({
      title:'',
      unit:this.props.units[0],
      workType:{id:false,value:false,label:'Material',isMaterial:true},
      price:1,
      quantity:1,
      discount:0,
      extraWork:false
    });
  }

  componentWillReceiveProps(props){
    if((this.props.company===null && props.company!==null) ||
    (props.company!==null && props.company!==null && props.company.id!==this.props.company.id)){
      this.setState({materialMargin:props.company.pricelist.materialMargin});
    }
    if((this.props.units.length!==props.units.length)){
      this.setState({unit:props.units[0]});
    }
  }

  render(){
    let totalPrice;
    if(this.state.workType.id===false){
      totalPrice=(this.state.price!==''?parseFloat(this.state.price):0)*(this.state.quantity!==''?parseFloat(this.state.quantity):0)*
      (100+(this.state.materialMargin!==''?parseFloat(this.state.materialMargin):0))/100*
      (100-(this.state.discount!==''?parseFloat(this.state.discount):0))/100;
    }else{
      totalPrice=(this.state.price!==''?parseFloat(this.state.price):0)*(this.state.quantity!==''?parseFloat(this.state.quantity):0)*
      (100+(this.props.company&&this.state.extraWork?parseFloat(this.props.company.pricelist.afterHours) : 0 ))/100*
      (100-(this.state.discount!==''?parseFloat(this.state.discount):0))/100;
    }
    totalPrice=totalPrice.toFixed(3);

    return (
      <Modal show={this.props.isOpen} className="show" onHide={this.props.toggle} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>{this.state.workType.id===false?'Adding material':'Adding service'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-padding">
          <FormGroup>
              <ControlLabel className="center-hor">Name</ControlLabel>
              <FormControl type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <FormGroup>
              <ControlLabel className="center-hor">Material / Work type</ControlLabel>
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
                options={([{id:false,value:false,label:'Material',isMaterial:true}]).concat(this.props.workTypes)}
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

          {
            this.state.workType.id!==false &&
            <FormGroup className="row">
              <Checkbox value={this.state.extraWork} onChange={()=>{
                  this.setState({extraWork:!this.state.extraWork});
                }}/>
              <ControlLabel className="center-hor">Extra work</ControlLabel>
            </FormGroup>
          }
          {
            this.state.workType.id!==false &&
              <FormGroup>
                <ControlLabel className="center-hor">Extra work price</ControlLabel>
                <FormControl type="number" value={this.props.company?this.props.company.pricelist.afterHours : 0 } disabled={true} />
            </FormGroup>
          }
          {
            this.state.workType.id===false &&
            <FormGroup>
                <ControlLabel className="center-hor">Margin</ControlLabel>
                <FormControl type="number" placeholder="Enter margin" value={this.state.materialMargin} onChange={(e)=>this.setState({materialMargin:e.target.value})} />
            </FormGroup>
          }
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
          <Button bsStyle="success" onClick={()=>{
              if(this.state.workType.id===false){
                this.submitMaterial();
              }else{
                this.submitService();
              }
            }}>Add</Button>
          <Button onClick={this.props.toggle}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
