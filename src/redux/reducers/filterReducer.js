import {SET_FILTER, SET_SEARCH, SET_PROJECT} from '../types'

const initialState = {
  filter: {
    requester:null,
    company:null,
    assigned:null,
    workType:null,
    statusDateFrom:'',
    statusDateTo:'',
    status:null,
    updatedAt:(new Date()).getTime(),
  },
  search:'',
  project:null
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
    case SET_PROJECT:
      return {
        ...state,
        project: action.project,
      };
    default:
      return state;
  }
}
