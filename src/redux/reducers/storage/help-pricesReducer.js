import {STORAGE_SET_HELP_PRICES, STORAGE_HELP_PRICES_ACTIVE} from '../../types'

const initialState = {
  pricesActive:false,
  prices:[]
};

export default function storagePricesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_PRICES:{
      return {
        ...state,
        prices: action.prices,
      };
    }
    case STORAGE_HELP_PRICES_ACTIVE:
      return {
        ...state,
        pricesActive: true,
      };
    default:
      return state;
  }
}
