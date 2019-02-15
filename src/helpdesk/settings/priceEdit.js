import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel, Alert } from 'react-bootstrap';
import {rebase, database} from '../../index';
import {snapshotToArray} from '../../helperFunctions';

export default class PriceEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelistName:'',
      afterHours:0,
      margin:0,
      loading:true,
      saving:false,
      workTypes:[],

    }
    this.setData.bind(this);
    this.loadData.bind(this);
    this.loadData(this.props.match.params.id);
  }

  loadData(id){
    Promise.all(
      [
        rebase.get('pricelists/'+id, {
          context: this,
          withIds: true,
        }),
        database.collection('workTypes').get(),
        database.collection('prices').get()
    ]).then(([pricelist, workTypes,prices])=>{
      this.setData(pricelist,snapshotToArray(prices),snapshotToArray(workTypes),id);
    });
  }

  setData(pricelist,prices,workTypes, id){
    let types= workTypes.map((type)=>{
      let newType={...type};
      newType.price= prices.find((item)=>item.pricelist===id && item.workType === newType.id);
      if(newType.price===undefined){
          newType.price={price:0};
      }
      return newType;
    });

    this.setState({
      pricelistName:pricelist.title,
      afterHours:pricelist.afterHours,
      margin: pricelist.materialMargin,
      workTypes:types,
      loading:false
    });
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true});
      this.loadData(props.match.params.id);
    }
  }

  render(){
    return (
      <div className="container-padding">
        {
          this.state.loading &&
          <Alert bsStyle="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Pricelist name</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="text" placeholder="Enter pricelist name" value={this.state.pricelistName} onChange={(e)=>this.setState({pricelistName:e.target.value})} />
          </Col>
        </FormGroup>
        <div className="floatingSeparator"></div>
        {
          this.state.workTypes.map((item,index)=>
          <FormGroup>
            <Col sm={3}>
              <ControlLabel className="center-hor">{item.title}</ControlLabel>
            </Col>
            <Col sm={9}>
              <FormControl type="number" placeholder="Enter pricelist name" value={item.price.price} onChange={(e)=>{
                  let newWorkTypes=[...this.state.workTypes];
                  let newWorkType = {...newWorkTypes[index]};
                  newWorkType.price.price=e.target.value;
                  newWorkTypes[index] = newWorkType;
                  this.setState({workTypes:newWorkTypes});
                }} />
            </Col>
          </FormGroup>
          )
        }

        <div className="floatingSeparator"></div>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">After hours percentage</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="number" placeholder="Enter after hours percentage" value={this.state.afterHours} onChange={(e)=>this.setState({afterHours:e.target.value})} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>
            <ControlLabel className="center-hor">Materials margin percentage</ControlLabel>
          </Col>
          <Col sm={9}>
            <FormControl type="number" placeholder="Enter materials margin percentage" value={this.state.margin} onChange={(e)=>this.setState({margin:e.target.value})} />
          </Col>
        </FormGroup>
        <Button bsStyle="success" className="separate" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            this.state.workTypes.filter((item)=>item.price.id!==undefined).map((workType)=>
              rebase.updateDoc('/prices/'+workType.price.id, {price:parseFloat(workType.price.price === "" ? "0": workType.price.price)})
            );
            this.state.workTypes.filter((item)=>item.price.id===undefined).map((workType)=>
              rebase.addToCollection('/prices', {pricelist:this.props.match.params.id,workType:workType.id,price:parseFloat(workType.price.price === "" ? "0": workType.price.price)}).then((response)=>{
                let index = this.state.workTypes.findIndex((item)=>item.id===workType.id);
                let newWorkTypes=[...this.state.workTypes];
                let newWorkType = {...newWorkTypes[index]};
                newWorkType.price={pricelist:this.props.match.params.id,workType:workType.id,price:parseFloat(workType.price.price === "" ? "0": workType.price.price), id:response.id};
                newWorkTypes[index] = newWorkType;
                this.setState({workTypes:newWorkTypes});
              })
            )

            rebase.updateDoc('/pricelists/'+this.props.match.params.id, {title:this.state.pricelistName, afterHours:parseFloat(this.state.afterHours===''?'0':this.state.afterHours),materialMargin:parseFloat(this.state.margin===''?'0':this.state.margin)})
              .then(()=>
                this.setState({saving:false})
              );
          }}>{this.state.saving?'Saving prices...':'Save prices'}</Button>
      </div>
    );
  }
}
