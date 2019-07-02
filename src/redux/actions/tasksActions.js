import {SET_TASKS_ORDER_BY, SET_TASKS_ASCENDING } from '../types';

export const setTasksOrderBy = (orderBy) => {
  return (dispatch) => {
    dispatch({ type: SET_TASKS_ORDER_BY,orderBy });
  };
};

export const setTasksAscending = (ascending) => {
  return (dispatch) => {
    dispatch({ type: SET_TASKS_ASCENDING,ascending });
  };
};
