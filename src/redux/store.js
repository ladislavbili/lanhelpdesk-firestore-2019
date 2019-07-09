import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import taskReducer from './reducers/taskReducer';
import appReducer from './reducers/appReducer';
import expenditureReducer from './reducers/expenditureReducer';
import userReducer from './reducers/userReducer';
import filterReducer from './reducers/filterReducer';
import passReducer from './reducers/passReducer';

const reducers = combineReducers({
    appReducer,
    userReducer,
    filterReducer,
    taskReducer,
    expenditureReducer,
    passReducer,
  });

const enhancers = compose(
  applyMiddleware(ReduxThunk)
);


export default () => createStore(reducers, {}, enhancers);
