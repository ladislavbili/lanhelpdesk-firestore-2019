import {SET_USER_DATA, SET_USER_ID, DELETE_USER_DATA} from '../types'

const initialState = {
  id:null,
  loggedIn:false,
  userData:null
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA:{
      return {
        ...state,
        userData: action.userData,
      };
    }
    case SET_USER_ID:{
      return {
        ...state,
        id: action.id,
        loggedIn:true
      };
    }
    case DELETE_USER_DATA:
      return {
        ...state,
        id:null,
        loggedIn: false,
        userData:null
      };
    default:
      return state;
  }
}
