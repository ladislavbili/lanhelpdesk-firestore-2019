import base from '../../firebase';
import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

//import { Button } from 'react-bootstrap';


//import sampleUsers from '../samples/sampleUsers';

export default class DataTable extends Component{

  constructor(props){
    super(props);
    this.state = {
      assets : [],
//      users : sampleUsers,
    }
//    this.addUsers.bind(this);
  }

  componentWillMount(){

      this.ref = base.syncState(`${this.props.database}`, {
        context: this,
        state: 'assets'
      });
/*      this.ref2 = base.syncState(`users`, {
        context: this,
        state: 'users'
      });
  }

  addUsers(){
      this.setState({
        users : sampleUsers,
      });*/
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
//      base.removeBinding(this.ref2);
  }

  render(){
    const DATA = Object.values(this.state.assets);
    const COLUMNS = this.props.columns;

    return (

        <div className='content-page'>
          <div className="content">
            <div className="container-fluid">

              {this.props.loadButton()}
                {/* <Button onClick={this.addUsers.bind(this)}>asdsad</Button> */}
              {(DATA.length > 0) &&
              <ReactTable
                data={DATA}
                filterable
                defaultFilterMethod={(filter, row) =>
                  row[filter.id].toLowerCase().includes(filter.value.toLowerCase())}
                columns={COLUMNS}
                defaultPageSize={DATA.length}
                showPagination={false}
              />}

        </div>
      </div>
    </div>
    )
  }

}
