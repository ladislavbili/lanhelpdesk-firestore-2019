import React, { Component } from 'react';

export default class CompanyPriceList extends Component {
	constructor(props){
		super(props);
		this.state={
		}
	}

	componentWillReceiveProps(props){
	/*	if(props.clearForm){
			this.props.setClearForm();
			this.setState({
				title:'',
				quantity:1,
				unitCost:0,
				unitPrice:0,
				totalPrice:0,
			})
		}*/
	}

	render() {
		return (
			<div>
				<div className="row">
	        <h3 className="m-b-20 m-r-10">Cenník</h3>
	          <label>
	            <Switch
	              checked={this.state.pricelist.def}
	              onChange={(checked)=>{
	                if (checked){
	                  this.setState({oldPricelist: {...this.state.pricelist}, pricelist: this.state.pricelists.find(list => list.def), newData: true})
	                } else {
	                  this.setState({oldPricelist: {...this.state.pricelist}, pricelist: (this.state.pricelists.length > 1 ? this.state.pricelists.slice(1, this.state.pricelists.length).find(list => !list.def) : {}), newData: true})
	                }
	              }}
	              height={22}
	              width={80}
	              checkedIcon={<span className="switchLabel">Default</span>}
	              uncheckedIcon={<span className="switchLabel-right">Vlastný</span>}
	              onColor={"#0078D4"} />
	            <span className="m-l-10"></span>
	          </label>
	      </div>
	      {!this.state.pricelist.def && this.state.pricelist !== null &&
	          <FormGroup className="row m-b-10">
	            <div className="m-r-10 w-20">
	            <Label for="pricelist">Pricelist</Label>
	            </div>
	              <div className="flex">
	            <Select
	              id="pricelist"
	              name="pricelist"
	              styles={selectStyle}
	              options={this.state.pricelists}
	              value={this.state.pricelist}
	              onChange={e =>{ this.setState({oldPricelist: {...this.state.pricelist}, pricelist: e, newData: true}) }}
	              />
	          </div>
	          </FormGroup>
	        }
	          {!this.state.pricelist.def &&
	            this.state.pricelist.value === "0" &&
	            (this.state.priceName === "" ||
	            this.state.newData) &&
	            <FormGroup className="row m-b-10">
	              <div className="m-r-10 w-20">
	              <Label for="priceName">Price list name</Label>
	              </div>
	                <div className="flex">
	                  <Input
	                    name="priceName"
	                    id="priceName"
	                    type="text"
	                    placeholder="Enter price list nema"
	                    value={this.state.priceName}
	                    onChange={(e)=>this.setState({priceName: e.target.value, newData: true})}/>
	                </div>
	            </FormGroup>
	          }
	          { Object.keys(this.state.pricelist).length &&
	            this.state.pricelist !== {} &&
	            this.state.pricelist.value !== "0" &&
	            !this.state.pricelist.def &&
	            <PriceEdit {...this.props}
	              listId={this.state.pricelist.id}
	              changedName={ (e) => this.setState({pricelist: {...this.state.pricelist, label: e} }) }
	              deletedList={ () => this.setState({pricelist: {}, priceName: ""}) }/>
	          }
	          { Object.keys(this.state.pricelist).length &&
	            this.state.pricelist.value !== "0" &&
	            this.state.pricelist.def &&
	            <div>
	              <Button
	                className="btn-link-reversed p-l-0"
	                onClick={()=>{
	                  if (window.confirm("You will be redirected to a page where you can edit this pricelist. All unsaved progress will be lost, are you sure you want to proceed?")){
	                    this.cancel();
	                    this.props.history.push(`/helpdesk/settings/pricelists/${this.state.pricelist.id}`)
	                  }
	              }}>Edit default pricelist</Button>
	            </div>
	          }
				</div>
			);
		}
	}
