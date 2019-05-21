import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Input, Table, Label, Button, FormGroup } from 'reactstrap';

export default class Comments extends Component{

  render(){
    return (
      <div>
        <div>
          <FormGroup>
            <Label>Add comment</Label>
            <Input type="textarea" placeholder="Enter comment"/>
            <Button color="primary float-right">Send</Button>
          </FormGroup>

        </div>
        {/*comments*/}
        {[1,2,3].map((item)=><div key={item}>
          <div className="" style={{borderTop:"1px solid rgba(54, 64, 74, 0.05)", borderBottom:"1px solid rgba(54, 64, 74, 0.05)"}}>
            <div className="media m-b-30 m-t-30">
              <img
                className="d-flex mr-3 rounded-circle thumb-sm"
                src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
                alt="Generic placeholder XX"
                />
              <div className="media-body">
                <span className="media-meta pull-right">07:23 AM</span>
                <h4 className="text-primary font-16 m-0">Jonathan Smith</h4>
                <small className="text-muted">From: jonathan@domain.com</small>
              </div>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
              Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
            </p>
            <p>
              Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate
              eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum
              felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper
              nisi.
            </p>
            <p>
              Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend
              ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra
              nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel
              augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus,
              tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed
              ipsum. Nam quam nunc, blandit vel, luctus pulvinar,
            </p>
          </div>
        </div>
      )}
    </div>
    );
  }
}
