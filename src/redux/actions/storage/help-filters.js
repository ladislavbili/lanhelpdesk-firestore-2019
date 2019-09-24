import {STORAGE_SET_HELP_FILTERS, STORAGE_HELP_FILTERS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageHelpFiltersStart = () => {
  return (dispatch) => {
    
    database.collection('help-filters').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_FILTERS,filters:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_FILTERS_ACTIVE });
  };
};
