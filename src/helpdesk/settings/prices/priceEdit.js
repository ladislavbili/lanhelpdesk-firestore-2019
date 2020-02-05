import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase } from '../../../index';

import { connect } from "react-redux";
import {storageMetadataStart,storageHelpPricelistsStart,storageHelpPricesStart,storageHelpTaskTypesStart, storageHelpTripTypesStart} from '../../../redux/actions';

class PriceEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      id: "",
      pricelistName:'',
      afterHours:0,
      margin:0,
      marginExtra:0,
      defaultPricelist:null,
      def:false,
      loading:true,
      saving:false,
      taskTypes:[],
      tripTypes:[],

    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.pricesLoaded && props.taskTypesLoaded && props.pricelistsLoaded && props.metadataLoaded && props.tripTypesLoaded
  }

  componentWillReceiveProps(props){
    if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
      this.setData(props);
    }
    if((this.props.match && props.match && this.props.match.params.id!==props.match.params.id)
      ||
      (this.props.listId !== props.listId)){
      this.setState({loading:true})
      if(this.storageLoaded(props)){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.metadataActive){
      this.props.storageMetadataStart();
    }
    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }
    if(!this.props.pricesActive){
      this.props.storageHelpPricesStart();
    }
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    if(!this.props.tripTypesActive){
      this.props.storageHelpTripTypesStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  setData(props){
    let id = (props.listId ? props.listId : props.match.params.id);
    let pricelist = props.pricelists.find((pricelist)=>pricelist.id===id);
    let meta = props.metadata;
    let prices = props.prices;
    let taskTypes = props.taskTypes;
    let tripTypes = props.tripTypes;

    taskTypes = taskTypes.map((type)=>{
      let newType={...type};
      newType.price= prices.find((item)=>item.pricelist===id && item.type === newType.id);
      if(newType.price===undefined){
          newType.price={price:0};
      }
      return newType;
    });

    tripTypes = tripTypes.map((type)=>{
      let newType={...type};
      newType.price= prices.find((item)=>item.pricelist===id && item.type === newType.id);
      if(newType.price===undefined){
          newType.price={price:0};
      }
      return newType;
    });

    this.setState({
      id,
      pricelistName:pricelist.title,
      afterHours:pricelist.afterHours,
      margin: pricelist.materialMargin,
      marginExtra: pricelist.materialMarginExtra,
      taskTypes,
      tripTypes,
      loading:false,
      def:meta.defaultPricelist===id,
      defaultPricelist:meta.defaultPricelist
    });
  }

  render(){
    return (
      <div>
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <FormGroup check className="m-b-5 p-l-0">
            <Input type="checkbox" checked={this.state.def} disabled={true} onChange={(e)=>this.setState({def:!this.state.def})}/>
            <Label check className="m-l-15">
              Default
            </Label>
          </FormGroup>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="name">Pricelist name</Label>
            </div>
            <div className="flex">
              <Input type="text" name="name" id="name" placeholder="Enter pricelist name" value={this.state.pricelistName} onChange={(e)=>this.setState({pricelistName:e.target.value})} />
            </div>
          </FormGroup>

          <h3>Ceny úloh</h3>
          <div className="p-t-10 p-b-10">
            {
              this.state.taskTypes.map((item,index)=>
              <FormGroup key={index} className="row m-b-10">
                <div className="m-r-10 w-20">
                  <Label for={item.title}>{item.title}</Label>
                </div>
                <div className="flex">
                  <Input type="text" name={item.title} id={item.title} placeholder="Enter price" value={item.price.price} onChange={(e)=>{
                      let newTaskTypes=[...this.state.taskTypes];
                      let newTaskType = {...newTaskTypes[index]};
                      newTaskType.price.price=e.target.value;
                      newTaskTypes[index] = newTaskType;
                      this.setState({taskTypes:newTaskTypes});
                    }} />
                </div>
              </FormGroup>
              )
            }
          </div>

          <h3>Ceny Výjazdov</h3>
            <div className="p-t-10 p-b-10">
              {
                this.state.tripTypes.map((item,index)=>
                <FormGroup key={index} className="row m-b-10">
                  <div className="m-r-10 w-20">
                    <Label for={item.title}>{item.title}</Label>
                  </div>
                  <div className="flex">
                    <Input type="text" name={item.title} id={item.title} placeholder="Enter price" value={item.price.price} onChange={(e)=>{
                        let newTripTypes=[...this.state.tripTypes];
                        let newTripType = {...newTripTypes[index]};
                        newTripType.price.price=e.target.value;
                        newTripTypes[index] = newTripType;
                        this.setState({tripTypes:newTripTypes});
                      }} />
                  </div>
                </FormGroup>
                )
              }
            </div>

          <h3>Všeobecné prirážky</h3>
          <div className="p-t-10 p-b-10">
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="afterPer">After hours percentage</Label>
              </div>
              <div className="flex">
                <Input type="text" name="afterPer" id="afterPer" placeholder="Enter after hours percentage" value={this.state.afterHours} onChange={(e)=>this.setState({afterHours:e.target.value})} />
              </div>
            </FormGroup>
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="materMarg">Materials margin percentage 50-</Label>
              </div>
              <div className="flex">
                <Input type="text" name="materMarg" id="materMarg" placeholder="Enter materials margin percentage" value={this.state.margin} onChange={(e)=>this.setState({margin:e.target.value})} />
              </div>
            </FormGroup>
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="materMarg">Materials margin percentage 50+</Label>
              </div>
              <div className="flex">
                <Input type="text" name="materMarg" id="materMarg" placeholder="Enter materials margin percentage" value={this.state.marginExtra} onChange={(e)=>this.setState({marginExtra:e.target.value})} />
              </div>
            </FormGroup>
          </div>
          <div className="row">
              <Button className="btn" disabled={this.state.saving} onClick={()=>{
                  this.setState({saving:true});
                  if(!this.state.def && this.state.defaultPricelist===(this.props.match ? this.props.match.params.id : this.props.listId)){
                    this.setState({defaultPricelist:null});
                    rebase.updateDoc('/metadata/0',{defaultPricelist:null});
                  }else if(this.state.def){
                    this.setState({defaultPricelist: (this.props.match ? this.props.match.params.id : this.props.listId)});
                    rebase.updateDoc('/metadata/0',{defaultPricelist:(this.props.match ? this.props.match.params.id : this.props.listId)});
                  }

                  this.state.taskTypes.concat(this.state.tripTypes).filter((item)=>item.price.id!==undefined).map((type)=>
                    rebase.updateDoc('/help-prices/'+type.price.id, {price:parseFloat(type.price.price === "" ? "0": type.price.price)})
                  );
                  this.state.taskTypes.filter((item)=>item.price.id===undefined).map((type)=>
                    rebase.addToCollection('/help-prices', {pricelist:(this.props.match ? this.props.match.params.id : this.props.listId),type:type.id,price:parseFloat(type.price.price === "" ? "0": type.price.price)}).then((response)=>{
                      let index = this.state.taskTypes.findIndex((item)=>item.id===type.id);
                      let newTaskTypes=[...this.state.taskTypes];
                      let newTaskType = {...newTaskTypes[index]};
                      newTaskType.price={pricelist:(this.props.match ? this.props.match.params.id : this.props.listId),type:type.id,price:parseFloat(type.price.price === "" ? "0": type.price.price), id:response.id};
                      newTaskTypes[index] = newTaskType;
                      this.setState({taskTypes:newTaskTypes});
                    })
                  )

                  this.state.tripTypes.filter((item)=>item.price.id===undefined).map((type)=>
                    rebase.addToCollection('/help-prices', {pricelist:(this.props.match ? this.props.match.params.id : this.props.listId),type:type.id,price:parseFloat(type.price.price === "" ? "0": type.price.price)}).then((response)=>{
                      let index = this.state.tripTypes.findIndex((item)=>item.id===type.id);
                      let newTripTypes=[...this.state.tripTypes];
                      let newTripType = {...newTripTypes[index]};
                      newTripType.price={pricelist:(this.props.match ? this.props.match.params.id : this.props.listId),type:type.id,price:parseFloat(type.price.price === "" ? "0": type.price.price), id:response.id};
                      newTripTypes[index] = newTripType;
                      this.setState({tripTypes:newTripTypes});
                    })
                  )


                  rebase.updateDoc('/help-pricelists/'+(this.props.listId ? this.props.listId : this.props.match.params.id), {title:this.state.pricelistName, afterHours:parseFloat(this.state.afterHours===''?'0':this.state.afterHours),materialMargin:parseFloat(this.state.margin===''?'0':this.state.margin),materialMarginExtra:parseFloat(this.state.marginExtra===''?'0':this.state.marginExtra)})
                    .then(()=>
                      this.setState({saving:false})
                    );
                }}>{this.state.saving?'Saving prices...':'Save prices'}</Button>

              <Button className="btn-red ml-auto" disabled={this.state.saving} onClick={()=>{
                    if(window.confirm("Are you sure?")){
                      rebase.removeDoc('/help-pricelists/'+(this.props.match ? this.props.match.params.id : this.props.listId));
                      if(this.state.defaultPricelist===(this.props.match ? this.props.match.params.id : this.props.listId)){
                        rebase.updateDoc('/metadata/0',{defaultPricelist:null});
                      }
                      this.state.taskTypes.filter((item)=>item.price.id!==undefined).map((taskType)=>
                        rebase.removeDoc('/help-prices/'+taskType.price.id)
                      );
                      this.props.history.goBack();
                    }
                }}>Delete price list</Button>
          </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageMetadata,storageHelpPricelists,storageHelpPrices, storageHelpTaskTypes, storageHelpTripTypes}) => {
  const { metadataActive, metadata, metadataLoaded } = storageMetadata;
  const { pricelistsActive, pricelists, pricelistsLoaded } = storageHelpPricelists;
  const { pricesActive, prices, pricesLoaded } = storageHelpPrices;
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
  const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;

  return {
    metadataActive, metadata, metadataLoaded,
    pricelistsActive, pricelists, pricelistsLoaded,
    pricesActive, prices, pricesLoaded,
    taskTypesLoaded, taskTypesActive, taskTypes,
		tripTypesActive, tripTypes, tripTypesLoaded,
  };
};

export default connect(mapStateToProps, { storageMetadataStart,storageHelpPricelistsStart,storageHelpPricesStart,storageHelpTaskTypesStart, storageHelpTripTypesStart })(PriceEdit);
