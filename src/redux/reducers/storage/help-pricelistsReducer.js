import {STORAGE_SET_HELP_PRICELISTS, STORAGE_HELP_PRICELISTS_ACTIVE} from '../../types'

const initialState = {
  priceListsActive:false,
  priceLists:[]
};

export default function storagePricelistsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_PRICELISTS:{
      return {
        ...state,
        priceLists: action.priceLists,
      };
    }
    case STORAGE_HELP_PRICELISTS_ACTIVE:
      return {
        ...state,
        priceListsActive: true,
      };
    default:
      return state;
  }
}
