import {SET_FILTER, SET_SEARCH} from '../types'

const initialState = {
  filter: {
    requester:null,
    company:null,
    assigned:null,
    workType:null,
    statusDateFrom:'',
    statusDateTo:'',
    status:null
  },
  search:''
};

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
    case SET_SEARCH:
      return {
        ...state,
        search: action.search,
      };
    default:
      return state;
  }
}
