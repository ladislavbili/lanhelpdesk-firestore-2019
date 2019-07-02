import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import appReducer from './reducers/appReducer';
import userReducer from './reducers/userReducer';
import filterReducer from './reducers/filterReducer';

const reducers = combineReducers({
    appReducer,
    userReducer,
    filterReducer
  });

const enhancers = compose(
  applyMiddleware(ReduxThunk)
);


export default () => createStore(reducers, {}, enhancers);
