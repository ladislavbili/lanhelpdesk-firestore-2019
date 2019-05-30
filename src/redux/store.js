import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import userReducer from './reducers/userReducer';
import filterReducer from './reducers/filterReducer';

const reducers = combineReducers({
    userReducer,
    filterReducer
  });

const enhancers = compose(
  applyMiddleware(ReduxThunk)
);


export default () => createStore(reducers, {}, enhancers);
