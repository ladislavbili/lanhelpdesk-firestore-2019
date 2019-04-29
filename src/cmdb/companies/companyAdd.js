import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Col, ControlLabel } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import {rebase,database} from '../../index';
import Select from 'react-select';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelists:[],
      pricelist:null,
      companyName:'',
      pausal:0,
      saving:false,
      opened:false
    }
    this.fetchData.bind(this);
    this.setData.bind(this);
    this.fetchData();
  }

    fetchData(){
      Promise.all(
        [
          database.collection('pricelists').get(),
          rebase.get('metadata/0', {
            context: this,
          })
        ]).then(([pricelists,meta])=>{
        this.setData(toSelArr(snapshotToArray(pricelists)),meta);
      });
    }

    setData(pricelists,meta){
      let pricelist = null;
        if(pricelists.length>0){
          if(meta.defaultPricelist!==null){
            pricelist=pricelists.find((item)=>item.id===meta.defaultPricelist);
          }else{
            pricelist=pricelists[0];
          }
        }
        this.setState({pricelists,pricelist,loading:false})
    }

  toggle(){
    this.setState({opened:!this.state.opened})
  }
  render(){
    return (
      <div>
        <i className="fa fa-plus clickable" onClick={()=>{
            this.setState({opened:true});
          }} />
          <Modal className="show" show={this.state.opened} >
            <Modal.Header>
              <h1 className="modal-header">Add company</h1>
              <button type="button" className="close ml-auto" aria-label="Close" onClick={this.toggle.bind(this)}><span aria-hidden="true">×</span></button>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <Col sm={3}>
                  <ControlLabel className="center-hor">Company name</ControlLabel>
                </Col>
                <Col sm={9}>
                  <FormControl type="text" placeholder="Enter company name" value={this.state.companyName} onChange={(e)=>this.setState({companyName:e.target.value})} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3}>
                  <ControlLabel className="center-hor">Paušál</ControlLabel>
                </Col>
                <Col sm={9}>
                  <FormControl type="number" placeholder="Enter pausal" value={this.state.pausal} onChange={(e)=>this.setState({pausal:e.target.value})} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3}>
                  <ControlLabel className="center-hor">Pricelist</ControlLabel>
                </Col>
                <Col sm={9}>
                  <Select
                    className="supressDefaultSelectStyle"
                    options={this.state.pricelists}
                    value={this.state.pricelist}
                    onChange={e =>{ this.setState({ pricelist: e }); }}
                      />
                </Col>
              </FormGroup>
              </Modal.Body>
              <Modal.Footer>
              <Button bsStyle="danger" className="mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>
              <Button bsStyle="primary" className="separate" disabled={this.state.saving||this.state.loading||this.state.pricelist===undefined||this.state.companyName===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/companies', {title:this.state.companyName,pricelist:this.state.pricelist.id})
                    .then(()=>{this.setState({companyName:'',pausal:this.state.pausal,pricelist:this.state.pricelists.length>0?this.state.pricelists[0]:null,saving:false})});
                }}>{this.state.saving?'Adding...':'Add company'}</Button>
            </Modal.Footer>
          </Modal>
          </div>
    );
  }
}
