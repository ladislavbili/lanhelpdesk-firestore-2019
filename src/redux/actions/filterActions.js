import {SET_FILTER} from '../types';

export const setFilter = (filter) => {
   return (dispatch) => {
     dispatch({ type: SET_FILTER,filter });
   };
 };
