import {STORAGE_SET_HELP_FILTERS, STORAGE_HELP_FILTERS_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';

function fixOldFilterDates(filters){
    return filters.map((filter)=>{
      return {
        ...filter,
        filter:{
          ...filter.filter,
          pendingDateFrom: (filter.filter.pendingDateFrom==='' || filter.filter.pendingDateFrom===undefined) ? null : filter.filter.pendingDateFrom,
          pendingDateTo: (filter.filter.pendingDateTo==='' || filter.filter.pendingDateTo===undefined) ? null : filter.filter.pendingDateTo,
          closeDateFrom: (filter.filter.closeDateFrom==='' || filter.filter.closeDateFrom===undefined) ? null : filter.filter.closeDateFrom,
          closeDateTo: (filter.filter.closeDateTo==='' || filter.filter.closeDateTo===undefined) ? null : filter.filter.closeDateTo,
          statusDateFrom: (filter.filter.statusDateFrom==='' || filter.filter.statusDateFrom===undefined) ? null : filter.filter.statusDateFrom,
          statusDateTo: (filter.filter.statusDateTo==='' || filter.filter.statusDateTo===undefined) ? null : filter.filter.statusDateTo,
        }
      }
    })
}

export const storageHelpFiltersStart = () => {
  return (dispatch) => {

    database.collection('help-filters').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_FILTERS,filters:fixOldFilterDates(snapshotToArray(querySnapshot))});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });
    dispatch({ type: STORAGE_HELP_FILTERS_ACTIVE });
  };
};
