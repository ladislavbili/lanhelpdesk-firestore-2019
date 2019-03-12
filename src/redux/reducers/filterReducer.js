import {SET_FILTER} from '../types'

const initialState = {
  filter: {
    requester:null,
    company:null,
    assigned:null,
    workType:null,
    statusDateFrom:'',
    statusDateTo:'',
  }
};

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
    default:
      return state;
  }
}
