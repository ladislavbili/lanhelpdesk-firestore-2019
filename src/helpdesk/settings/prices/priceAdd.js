import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase } from '../../../index';
import { connect } from "react-redux";
import {storageHelpPricesStart,storageHelpWorkTypesStart} from '../../../redux/actions';

class PriceAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelistName:'',
      afterHours:0,
      margin:0,
      marginExtra:0,
      loading:true,
      saving:false,
      def:false,
      workTypes:[],
    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.pricesLoaded && props.workTypesLoaded
  }

  componentWillReceiveProps(props){
    if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
      this.setData(props);
    }
  }

  componentWillMount(){
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
    let workTypes = props.workTypes;
    let types= workTypes.map((type)=>{
      let newType={...type};
      newType.price={price:0};
      return newType;
    });

    this.setState({
      workTypes:types,
      loading:false
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
              <Label for={index}>{item.title}</Label>
              <Input type="text" name={index} id={index} placeholder="Enter price" value={item.price.price} onChange={(e)=>{
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

          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.addToCollection('/help-pricelists',
              {
                title:this.state.pricelistName,
                afterHours:parseFloat(this.state.afterHours===''?'0':this.state.afterHours),
                materialMargin:parseFloat(this.state.margin===''?'0':this.state.margin),
                materialMarginExtra:parseFloat(this.state.marginExtra===''?'0':this.state.marginExtra)
              })
                .then((listResponse)=>{
                  if(this.state.def){
                    rebase.updateDoc('/metadata/0',{defaultPricelist:listResponse.id})
                  }
                  this.state.workTypes.map((workType,index)=>
                    rebase.addToCollection('/help-prices', {pricelist:listResponse.id,workType:workType.id,price:parseFloat(workType.price.price === "" ? "0": workType.price.price)})
                  );
                  this.setState({saving:false,
                    pricelistName:'',
                    afterHours:0,
                    margin:0,
                  });
                  this.loadData();
                });
            }}>{this.state.saving?'Saving prices...':'Save prices'}</Button>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpPrices, storageHelpWorkTypes}) => {
  const { pricesActive, prices, pricesLoaded } = storageHelpPrices;
  const { workTypesActive, workTypes, workTypesLoaded } = storageHelpWorkTypes;
  return { pricesActive, prices, pricesLoaded,
    workTypesActive, workTypes, workTypesLoaded, };
};

export default connect(mapStateToProps, { storageHelpPricesStart,storageHelpWorkTypesStart })(PriceAdd);
