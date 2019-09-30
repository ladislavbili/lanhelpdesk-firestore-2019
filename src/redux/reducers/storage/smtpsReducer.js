import {STORAGE_SET_SMTPS, STORAGE_SMTPS_ACTIVE} from '../../types'

const initialState = {
  smtpsActive:false,
  smtpsLoaded:false,
  smtps:[]
};

export default function storageSmtpsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_SMTPS:{
      return {
        ...state,
        smtps: action.smtps,
        smtpsLoaded:true,
      };
    }
    case STORAGE_SMTPS_ACTIVE:
      return {
        ...state,
        smtpsActive: true,
      };
    default:
      return state;
  }
}
