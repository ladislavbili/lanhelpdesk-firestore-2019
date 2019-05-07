import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import Rebase from 're-base';

import Navigation from './navigation';

import config from './firebase';
import configFirestore from './firestore';
import createStore from './redux/store';

import 'react-datepicker/dist/react-datepicker.css';
import './css/custom_style.css';
import 'react-table/react-table.css';
import "./css/bootstrap/bootstrap-2.min.css";
import "./css/bootstrap.min.css";
import "./css/icons.css";
import "./css/style.css";

import "./scss/index.scss";

const store=createStore();
const app = firebase.initializeApp(config);
let db = firebase.firestore(app);
const settings = { };
db.settings(settings);
export let rebase = Rebase.createClass(db);
export let database = db;

const appFirestore = firebase.initializeApp(configFirestore, "otherApp");
const dbFirestore = firebase.firestore(appFirestore);

export let rebaseFirestore = Rebase.createClass(dbFirestore);
export let firebaseFirestore = dbFirestore;

const Root = () => {
  return(
    <div>
      <Provider store={store}>
      <BrowserRouter>
        <div>
          <Route path='/' component={Navigation} />
        </div>
      </BrowserRouter>
    </Provider>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
