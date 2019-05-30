import {SET_USER_DATA,SET_USER_ID,DELETE_USER_DATA} from '../types';


export const setUserID = (id) => {
   return (dispatch) => {
     dispatch({ type: SET_USER_ID,id });
   };
};

export const deleteUserData = () => {
  return (dispatch) => {
    dispatch({ type: DELETE_USER_DATA });
  };
};

export const setUserData = (userData) => {
  return (dispatch) => {
    dispatch({ type: SET_USER_DATA, userData });
  };
};
