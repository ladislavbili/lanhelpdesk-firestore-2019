import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';

import { connect } from "react-redux";
import {storageHelpTripTypesStart} from '../../../redux/actions';


class TripTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
  }

  componentWillReceiveProps(props){
    if(props.tripTypesLoaded && !this.props.tripTypesLoaded){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(props.tripTypesLoaded){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.tripTypesActive){
      this.props.storageHelpTripTypesStart();
    }
    if(this.props.tripTypesLoaded){
      this.setData(this.props);
    };
  }

  setData(props){
    let data = props.tripTypes.find((item)=>item.id===props.match.params.id);
    this.setState({title:data.title,loading:false})
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
            <FormGroup>
              <Label for="name">Task type name</Label>
              <Input type="text" name="name" id="name" placeholder="Enter trip type" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>

          <div className="row">
            <Button className="btn" disabled={this.state.saving} onClick={()=>{
                this.setState({saving:true});
                rebase.updateDoc('/help-trip_types/'+this.props.match.params.id, {title:this.state.title})
                  .then(()=>{this.setState({saving:false})});
              }}>{this.state.saving?'Saving trip type...':'Save trip type'}</Button>

            <Button className="btn-red ml-auto"  disabled={this.state.saving} onClick={()=>{
                  if(window.confirm("Are you sure?")){
                    rebase.removeDoc('/help-trip_types/'+this.props.match.params.id).then(()=>{
                      this.props.history.goBack();
                    });
                  }
              }}>Delete</Button>
          </div>
      </div>
    );
  }
}


const mapStateToProps = ({ storageHelpTripTypes}) => {
  const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;
  return { tripTypesActive, tripTypes, tripTypesLoaded };
};

export default connect(mapStateToProps, { storageHelpTripTypesStart })(TripTypeEdit);
