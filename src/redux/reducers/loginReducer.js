import {LOGIN_SUCCESS} from '../types'

const initialState = {
  isAuthenticated: true
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
      };
    default:
      return state;
  }
}
