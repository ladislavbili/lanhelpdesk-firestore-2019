import {SET_USER_DATA, SET_USER_ID, DELETE_USER_DATA, SET_USER_NOTIFICATIONS} from '../../types'

const initialState = {
  id:null,
  loggedIn:false,
  userData:null,
  notifications:[],
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA:{
      return {
        ...state,
        userData: action.userData,
        loggedIn:true
      };
    }
    case SET_USER_ID:{
      return {
        ...state,
        id: action.id
      };
    }
    case SET_USER_NOTIFICATIONS:{
      return {
        ...state,
        notifications:action.notifications,
      };
    }
    case DELETE_USER_DATA:
      return initialState;
    default:
      return state;
  }
}
