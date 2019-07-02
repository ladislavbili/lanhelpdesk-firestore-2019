import {SET_TASKS_ORDER_BY, SET_TASKS_ASCENDING} from '../types'

const initialState = {
  orderBy:'title',
  ascending:true
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TASKS_ORDER_BY:
      return {
        ...state,
        orderBy: action.orderBy,
      };
    case SET_TASKS_ASCENDING:
      return {
        ...state,
        ascending: action.ascending,
      };
    default:
      return state;
  }
}
