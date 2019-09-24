import {STORAGE_SET_COMPANIES, STORAGE_COMPANIES_ACTIVE} from '../../types'

const initialState = {
  companiesActive:false,
  companies:[]
};

export default function storageCompaniesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_COMPANIES:{
      return {
        ...state,
        companies: action.companies,
      };
    }
    case STORAGE_COMPANIES_ACTIVE:
      return {
        ...state,
        companiesActive: true,
      };
    default:
      return state;
  }
}
