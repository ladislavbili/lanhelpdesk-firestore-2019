import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import taskReducer from './reducers/taskReducer';
import appReducer from './reducers/appReducer';
import expenditureReducer from './reducers/expenditureReducer';
import userReducer from './reducers/userReducer';
import filterReducer from './reducers/filterReducer';

const reducers = combineReducers({
    appReducer,
    userReducer,
    filterReducer,
    taskReducer,
    expenditureReducer,
  });

const enhancers = compose(
  applyMiddleware(ReduxThunk)
);


export default () => createStore(reducers, {}, enhancers);
