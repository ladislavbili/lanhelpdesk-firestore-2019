import {STORAGE_IMAPS, STORAGE_IMAPS_ACTIVE} from '../../types'

const initialState = {
  imapsActive:false,
  imapsLoaded:false,
  imaps:[]
};

export default function storageImapsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_IMAPS:{
      return {
        ...state,
        imaps: action.imaps,
        imapsLoaded:true,
      };
    }
    case STORAGE_IMAPS_ACTIVE:
      return {
        ...state,
        imapsActive: true,
      };
    default:
      return state;
  }
}
