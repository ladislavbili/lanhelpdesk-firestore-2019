import {LOGIN_SUCCESS} from '../types';

export const loginUser = (username, password,isAuthenticated) => {
   return (dispatch) => {
     dispatch({ type: LOGIN_SUCCESS,isAuthenticated });
   };
 };
