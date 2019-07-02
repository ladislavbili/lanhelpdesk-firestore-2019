import {SET_LAYOUT} from '../types'

const initialState = {
  layout:0
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LAYOUT:
      return {
        ...state,
        layout: action.layout,
      };
    default:
      return state;
  }
}
