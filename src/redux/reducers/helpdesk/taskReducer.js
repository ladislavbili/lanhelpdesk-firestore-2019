import {SET_TASKS_ORDER_BY, SET_TASKS_ASCENDING,SET_TASKLIST_LAYOUT, SET_USER_DATA} from '../../types'

const initialState = {
  orderBy:'status',
  ascending:false,
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
    case SET_USER_DATA:
      return {
        ...state,
        tasklistLayout: action.userData.tasklistLayout?action.userData.tasklistLayout:state.tasklistLayout,
      };

    default:
      return state;
  }
}
