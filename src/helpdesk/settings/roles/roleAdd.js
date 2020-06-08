import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import Select from 'react-select';
import firebase from 'firebase';
import {rebase} from '../../../index';
import {isEmail} from '../../../helperFunctions';
import {selectStyle} from "../../../scss/selectStyles";
import config from '../../../firebase';

import { connect } from "react-redux";
import {storageUsersStart} from '../../../redux/actions';
import {sameStringForms, toSelArr} from '../../../helperFunctions';
import Checkbox from '../../../components/checkbox';

class RoleAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      roles: [
        {label:'Guest',value:-1},
        {label:'User',value:0},
        {label:'Agent',value:1},
        {label:'Manager',value:2},
        {label:'Admin',value:3}],
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
            <h2>Rules</h2>
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
                        />
                    </td>
                  </tr>
                  <tr>
                    <td>Delete tasks</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.delTask }
                        label = ""
                        onChange={()=>
                          this.setState({
                            delTask: !this.state.delTask})
                        }
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
                        />
                    </td>
                  </tr>
                  <tr>
                    <td>Can add filters</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.filtersAdd }
                        label = ""
                        onChange={()=>
                          this.setState({
                            filtersAdd: !this.state.filtersAdd})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can edit filters</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.filtersEdit }
                        label = ""
                        onChange={()=>
                          this.setState({
                            filtersEdit: !this.state.filtersEdit})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can view attributes</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.attributesView }
                        label = ""
                        onChange={()=>
                          this.setState({
                            attributesView: !this.state.attributesView})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can edit attributes</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.attributesEdit }
                        label = ""
                        onChange={()=>
                          this.setState({
                            attributesEdit: !this.state.attributesEdit})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can view tags</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.tagsView }
                        label = ""
                        onChange={()=>
                          this.setState({
                            tagsView: !this.state.tagsView})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can edit tags</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.tagsEdit }
                        label = ""
                        onChange={()=>
                          this.setState({
                            tagsEdit: !this.state.tagsEdit})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can view attachments</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.attachmentsView }
                        label = ""
                        onChange={()=>
                          this.setState({
                            attachmentsView: !this.state.attachmentsView})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can edit attachments</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.attachmentsEdit }
                        label = ""
                        onChange={()=>
                          this.setState({
                            attachmentsEdit: !this.state.attachmentsEdit})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can view vykazy</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.vykazView }
                        label = ""
                        onChange={()=>
                          this.setState({
                            vykazView: !this.state.vykazView})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can edit vykazy</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        value = { this.state.vykazEdit }
                        label = ""
                        onChange={()=>
                          this.setState({
                            vykazEdit: !this.state.vykazEdit})
                        }
                        />
                    </td>
                  </tr>
                  <tr >
                    <td>Can view settings</td>
                  <td>
                    <Checkbox
                      className = "m-b-5 p-l-0"
                      value = { this.state.settingsView }
                      label = ""
                      onChange={()=>
                        this.setState({
                          settingsView: !this.state.settingsView})
                      }
                      />
                  </td>
                </tr>
                <tr >
                  <td>Can edit settings</td>
                  <td>
                    <Checkbox
                      className = "m-b-5 p-l-0"
                      value = { this.state.settingsEdit }
                      label = ""
                      onChange={()=>
                        this.setState({
                          settingsEdit: !this.state.settingsEdit})
                      }
                      />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Button className="btn" onClick={()=>{}}>{this.state.saving?'Adding...':'Add user'}</Button>

          {this.props.close &&
          <Button className="btn-link"
            onClick={()=>{this.props.close()}}>Cancel</Button>
          }
      </div>
    );
  }
}

const mapStateToProps = ({ storageUsers}) => {
  const { usersActive, users } = storageUsers;
  return { usersActive, users };
};

export default connect(mapStateToProps, { storageUsersStart })(RoleAdd);
