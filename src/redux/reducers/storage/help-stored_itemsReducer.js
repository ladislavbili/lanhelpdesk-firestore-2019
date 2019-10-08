import {STORAGE_HELP_STORED_ITEMS, STORAGE_HELP_STORED_ITEMS_ACTIVE} from '../../types'

const initialState = {
  storedItemsActive:false,
  storedItemsLoaded:false,
  storedItems:[]
};

export default function storageHelpStoredItemsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_HELP_STORED_ITEMS:{
      return {
        ...state,
        storedItems: action.storedItems,
        storedItemsLoaded:true,
      };
    }
    case STORAGE_HELP_STORED_ITEMS_ACTIVE:
      return {
        ...state,
        storedItemsActive: true,
      };
    default:
      return state;
  }
}
