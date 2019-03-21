import {SET_FILTER, SET_SEARCH} from '../types';

export const setFilter = (filter) => {
   return (dispatch) => {
     dispatch({ type: SET_FILTER,filter });
   };
 };

 export const setSearch = (search) => {
    return (dispatch) => {
      dispatch({ type: SET_SEARCH,search });
    };
  };
