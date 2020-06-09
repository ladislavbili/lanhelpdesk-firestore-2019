import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';

import { connect } from "react-redux";
import Checkbox from '../../../components/checkbox';

class RoleAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      label: "",
      roles: [
        {label:'Guest',value:-1},
        {label:'User',value:0},
        {label:'Agent',value:1},
        {label:'Manager',value:2},
        {label:'Admin',value:3}
      ],
      rules: [
        {
          title: "Task",
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
        {
          title: "Filter",
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
        {
          title: "Filter (global)",
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
        {
          title: "Tag",
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
        {
          title: "Attachment",
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
        {
          title: "Attribute",
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
        {
          title: "Vykazy",
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
        {
          title: "Settings",
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
      ]
    }
  }

  componentWillReceiveProps(props){
  }

  componentWillMount(){
  }

  render(){
  //  console.log(this.state.roles);
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="role">Role</Label>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="Enter role name"
                value={this.state.label}
                onChange={(e)=>{
                  this.setState({
                    label: e.target.label})
              }}
              />
          </FormGroup>

          <div className="">
            <h2>General rules</h2>
            <table className="table">
              <thead>
                <tr>
                    <th key={1}>
                      Rule
                    </th>
                    <th key={2}>
                      Granted
                    </th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                    <td>Send mails via comments</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.mailViaComment }
                        label = ""
                        onChange={()=>
                          this.setState({
                            mailViaComment: !this.state.mailViaComment})
                        }
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr>
                    <td>Can login to system</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.login }
                        label = ""
                        onChange={()=>
                          this.setState({
                            login: !this.state.login})
                        }
                        highlighted={true}
                        />
                    </td>
                  </tr>
                  <tr>
                    <td>Can view test sections</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.testSections }
                        label = ""
                        onChange={()=>
                          this.setState({
                           testSections: !this.state.testSections})
                        }
                        highlighted={true}
                        />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="">
              <h2>Specific rules</h2>
              <table className="table">
                <thead>
                  <tr>
                      <th key={1}>

                      </th>
                      <th key={2}>
                        View
                      </th>
                      <th key={2}>
                        Add
                      </th>
                      <th key={2}>
                        Edit
                      </th>
                      <th key={2}>
                        Delete
                      </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.rules.map(rule =>
                      <tr>
                        <td>{rule.title}</td>
                        <td>
                          <Checkbox
                            className = "m-b-5 p-l-0"
                            value = { rule.view }
                            label = ""
                            onChange={(e)=>{
                              let newRules = this.state.rules.map(r => {
                                if (r.title !== rule.title){
                                  return r
                                }
                                if (e.target.checked){
                                  return {...r, view: true}
                                }
                                return {
                                  ...r,
                                  view: false,
                                  add: false,
                                  edit: false,
                                  delete: false,
                                }
                              });
                              this.setState({
                                rules: newRules})
                            }}
                            highlighted={true}
                            />
                        </td>
                        <td>
                          <Checkbox
                            className = "m-b-5 p-l-0"
                            value = { rule.add }
                            label = ""
                            onChange={(e)=>{
                              let newRules = this.state.rules.map(r => {
                                if (r.title !== rule.title){
                                  return r
                                }
                                if (e.target.checked){
                                  return {...r, view: true, add: true}
                                }
                                return {...r, add:false}
                              });
                              this.setState({
                                rules: newRules})
                            }}
                            highlighted={true}
                            />
                        </td>
                        <td>
                          <Checkbox
                            className = "m-b-5 p-l-0"
                            value = { rule.edit }
                            label = ""
                            onChange={(e)=>{
                              let newRules = this.state.rules.map(r => {
                                if (r.title !== rule.title){
                                  return r
                                }
                                if (e.target.checked){
                                  return {...r, view: true, edit: true}
                                }
                                return {
                                  ...r,
                                  view: r.view,
                                  add: r.add,
                                  edit: false,
                                  delete: false,
                                }
                              });
                              this.setState({
                                rules: newRules})
                            }}
                            highlighted={true}
                            />
                        </td>
                        <td>
                          <Checkbox
                            className = "m-b-5 p-l-0"
                            value = { rule.delete }
                            label = ""
                            onChange={(e)=>{
                              let newRules = this.state.rules.map(r => {
                                if (r.title !== rule.title){
                                  return r
                                }
                                if (e.target.checked){
                                  return {...r, view: true, edit: true, delete: true}
                                }
                                return {
                                  ...r,
                                  view: r.view,
                                  add: r.add,
                                  edit: r.edit,
                                  delete: false,
                                }
                              });
                              this.setState({
                                rules: newRules})
                            }}
                            highlighted={true}
                            />
                        </td>
                      </tr>
                    )
                  }

              </tbody>
            </table>
          </div>

          <Button className="btn" disabled={true} onClick={()=>{}}>{this.state.saving?'Adding...':'Add role'}</Button>

          {this.props.close &&
          <Button className="btn-link"
            onClick={()=>{this.props.close()}}>Cancel</Button>
          }
      </div>
    );
  }
}


export default connect()(RoleAdd);
