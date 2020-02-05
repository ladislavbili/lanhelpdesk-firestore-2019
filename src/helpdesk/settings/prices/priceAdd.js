import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase } from '../../../index';
import { connect } from "react-redux";
import {storageHelpTaskTypesStart, storageHelpTripTypesStart} from '../../../redux/actions';

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
      taskTypes:[],
      tripTypes:[],
    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.tripTypesLoaded && props.taskTypesLoaded
  }

  componentWillReceiveProps(props){
    if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
      this.setData(props);
    }
  }

  componentWillMount(){
    if(!this.props.tripTypesActive){
      this.props.storageHelpTripTypesStart();
    }
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  setData(props){
    let taskTypes = props.taskTypes.map((type)=>{
      let newType={...type};
      newType.price={price:0};
      return newType;
    });

    let tripTypes = props.tripTypes.map((type)=>{
      let newType={...type};
      newType.price={price:0};
      return newType;
    });

    this.setState({
      taskTypes,
      tripTypes,
      pricelistName: props.name,
      loading:false
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
                  this.state.taskTypes.map((taskType,index)=>
                    rebase.addToCollection('/help-prices', {pricelist:listResponse.id,type:taskType.id,price:parseFloat(taskType.price.price === "" ? "0": taskType.price.price)})
                  );
                  this.state.tripTypes.map((tripType,index)=>
                    rebase.addToCollection('/help-prices', {pricelist:listResponse.id,type:tripType.id,price:parseFloat(tripType.price.price === "" ? "0": tripType.price.price)})
                  );
                  this.setState({saving:false,
                    pricelistName:'',
                    afterHours:0,
                    margin:0,
                    taskType:this.props.taskTypes.map((type)=>{
                      let newType={...type};
                      newType.price={price:0};
                      return newType;
                    }),
                    tripTypes: this.props.tripTypes.map((type)=>{
                      let newType={...type};
                      newType.price={price:0};
                      return newType;
                    })
                  });
                });
            }}>{this.state.saving?'Saving prices...':'Save prices'}</Button>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpTaskTypes, storageHelpTripTypes}) => {
	const { taskTypesLoaded, taskTypesActive, taskTypes } = storageHelpTaskTypes;
  const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;
  return {
    taskTypesLoaded, taskTypesActive, taskTypes,
		tripTypesActive, tripTypes, tripTypesLoaded,
  };
};

export default connect(mapStateToProps, { storageHelpTaskTypesStart, storageHelpTripTypesStart })(PriceAdd);
