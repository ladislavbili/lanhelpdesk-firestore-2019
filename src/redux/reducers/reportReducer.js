import {SET_REPORT_YEAR, SET_REPORT_MONTH} from '../types'

const initialState = {
  year:null,
  month:null,
};

export default function reportReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REPORT_YEAR:
      return {
        ...state,
        year: action.year,
      };
    case SET_REPORT_MONTH:
      return {
        ...state,
        month: action.month,
      };
    default:
      return state;
  }
}
