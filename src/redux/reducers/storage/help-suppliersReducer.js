import {STORAGE_HELP_SUPPLIERS, STORAGE_HELP_SUPPLIERS_ACTIVE} from '../../types'

const initialState = {
  suppliersActive:false,
  suppliersLoaded:false,
  suppliers:[]
};

export default function storageSuppliersReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_HELP_SUPPLIERS:{
      return {
        ...state,
        suppliers: action.suppliers,
        suppliersLoaded:true,
      };
    }
    case STORAGE_HELP_SUPPLIERS_ACTIVE:
      return {
        ...state,
        suppliersActive: true,
      };
    default:
      return state;
  }
}
