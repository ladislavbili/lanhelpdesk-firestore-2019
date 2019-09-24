import {STORAGE_SET_HELP_WORK_TYPES, STORAGE_HELP_WORK_TYPES_ACTIVE} from '../../types'

const initialState = {
  workTypesActive:false,
  workTypes:[]
};

export default function storageWorkTypesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_WORK_TYPES:{
      return {
        ...state,
        workTypes: action.workTypes,
      };
    }
    case STORAGE_HELP_WORK_TYPES_ACTIVE:
      return {
        ...state,
        workTypesActive: true,
      };
    default:
      return state;
  }
}
