import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase } from '../../../index';

import { connect } from "react-redux";
import {storageMetadataStart,storageHelpPricelistsStart,storageHelpPricesStart,storageHelpWorkTypesStart} from '../../../redux/actions';

class PriceEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelistName:'',
      afterHours:0,
      margin:0,
      marginExtra:0,
      defaultPricelist:null,
      def:false,
      loading:true,
      saving:false,
      workTypes:[],

    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.pricesLoaded && props.workTypesLoaded && props.pricelistsLoaded && props.metadataLoaded
  }

  componentWillReceiveProps(props){
    if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
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
    if(!this.props.workTypesActive){
      this.props.storageHelpWorkTypesStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  setData(props){
    let id = props.match.params.id;
    let pricelist = props.pricelists.find((pricelist)=>pricelist.id===id);
    let meta = props.metadata;
    let prices = props.prices;
    let workTypes = props.workTypes;

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
      marginExtra: pricelist.materialMarginExtra,
      workTypes:types,
      loading:false,
      def:meta.defaultPricelist===id,
      defaultPricelist:meta.defaultPricelist
    });
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <FormGroup check className="m-b-5 p-l-0">
            <Input type="checkbox" checked={this.state.def} onChange={(e)=>this.setState({def:!this.state.def})}/>
            <Label check className="m-l-15">
              Default
            </Label>
          </FormGroup>

          <FormGroup>
            <Label for="name">Pricelist name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter pricelist name" value={this.state.pricelistName} onChange={(e)=>this.setState({pricelistName:e.target.value})} />
          </FormGroup>

            {
              this.state.workTypes.map((item,index)=>
              <FormGroup key={index}>
                <Label for={item.title}>{item.title}</Label>
                <Input type="text" name={item.title} id={item.title} placeholder="Enter price" value={item.price.price} onChange={(e)=>{
                    let newWorkTypes=[...this.state.workTypes];
                    let newWorkType = {...newWorkTypes[index]};
                    newWorkType.price.price=e.target.value;
                    newWorkTypes[index] = newWorkType;
                    this.setState({workTypes:newWorkTypes});
                  }} />
              </FormGroup>
              )
            }

          <FormGroup>
            <Label for="afterPer">After hours percentage</Label>
            <Input type="text" name="afterPer" id="afterPer" placeholder="Enter after hours percentage" value={this.state.afterHours} onChange={(e)=>this.setState({afterHours:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label for="materMarg">Materials margin percentage 50-</Label>
            <Input type="text" name="materMarg" id="materMarg" placeholder="Enter materials margin percentage" value={this.state.margin} onChange={(e)=>this.setState({margin:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="materMarg">Materials margin percentage 50+</Label>
            <Input type="text" name="materMarg" id="materMarg" placeholder="Enter materials margin percentage" value={this.state.marginExtra} onChange={(e)=>this.setState({marginExtra:e.target.value})} />
          </FormGroup>

          <div className="row">
              <Button className="btn" disabled={this.state.saving} onClick={()=>{
                  this.setState({saving:true});
                  if(!this.state.def && this.state.defaultPricelist===this.props.match.params.id){
                    this.setState({defaultPricelist:null});
                    rebase.updateDoc('/metadata/0',{defaultPricelist:null});
                  }else if(this.state.def){
                    this.setState({defaultPricelist:this.props.match.params.id});
                    rebase.updateDoc('/metadata/0',{defaultPricelist:this.props.match.params.id});
                  }

                  this.state.workTypes.filter((item)=>item.price.id!==undefined).map((workType)=>
                    rebase.updateDoc('/help-prices/'+workType.price.id, {price:parseFloat(workType.price.price === "" ? "0": workType.price.price)})
                  );
                  this.state.workTypes.filter((item)=>item.price.id===undefined).map((workType)=>
                    rebase.addToCollection('/help-prices', {pricelist:this.props.match.params.id,workType:workType.id,price:parseFloat(workType.price.price === "" ? "0": workType.price.price)}).then((response)=>{
                      let index = this.state.workTypes.findIndex((item)=>item.id===workType.id);
                      let newWorkTypes=[...this.state.workTypes];
                      let newWorkType = {...newWorkTypes[index]};
                      newWorkType.price={pricelist:this.props.match.params.id,workType:workType.id,price:parseFloat(workType.price.price === "" ? "0": workType.price.price), id:response.id};
                      newWorkTypes[index] = newWorkType;
                      this.setState({workTypes:newWorkTypes});
                    })
                  )

                  rebase.updateDoc('/help-pricelists/'+this.props.match.params.id, {title:this.state.pricelistName, afterHours:parseFloat(this.state.afterHours===''?'0':this.state.afterHours),materialMargin:parseFloat(this.state.margin===''?'0':this.state.margin),materialMarginExtra:parseFloat(this.state.marginExtra===''?'0':this.state.marginExtra)})
                    .then(()=>
                      this.setState({saving:false})
                    );
                }}>{this.state.saving?'Saving prices...':'Save prices'}</Button>

              <Button className="btn-red ml-auto" disabled={this.state.saving} onClick={()=>{
                    if(window.confirm("Are you sure?")){
                      rebase.removeDoc('/help-pricelists/'+this.props.match.params.id);
                      if(this.state.defaultPricelist===this.props.match.params.id){
                        rebase.updateDoc('/metadata/0',{defaultPricelist:null});
                      }
                      this.state.workTypes.filter((item)=>item.price.id!==undefined).map((workType)=>
                        rebase.removeDoc('/help-prices/'+workType.price.id)
                      );
                      this.props.history.goBack();
                    }
                }}>Delete</Button>
          </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageMetadata,storageHelpPricelists,storageHelpPrices, storageHelpWorkTypes}) => {
  const { metadataActive, metadata, metadataLoaded } = storageMetadata;
  const { pricelistsActive, pricelists, pricelistsLoaded } = storageHelpPricelists;
  const { pricesActive, prices, pricesLoaded } = storageHelpPrices;
  const { workTypesActive, workTypes, workTypesLoaded } = storageHelpWorkTypes;
  return {
    metadataActive, metadata, metadataLoaded,
    pricelistsActive, pricelists, pricelistsLoaded,
    pricesActive, prices, pricesLoaded,
    workTypesActive, workTypes, workTypesLoaded, };
};

export default connect(mapStateToProps, { storageMetadataStart,storageHelpPricelistsStart,storageHelpPricesStart,storageHelpWorkTypesStart })(PriceEdit);
