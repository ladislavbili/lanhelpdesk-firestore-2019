import {SET_TASKS_ORDER_BY, SET_TASKS_ASCENDING,SET_TASKLIST_LAYOUT} from '../types'

const initialState = {
  orderBy:'title',
  ascending:true,
  tasklistLayout:0,
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
    case SET_TASKLIST_LAYOUT:
      return {
        ...state,
        tasklistLayout: action.tasklistLayout,
      };
    default:
      return state;
  }
}
