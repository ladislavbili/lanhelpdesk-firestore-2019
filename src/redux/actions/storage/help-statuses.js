import {STORAGE_SET_HELP_STATUSES, STORAGE_HELP_STATUSES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageUsersStart = () => {
  return (dispatch) => {
    console.log('LOADED');
    database.collection('help-statuses').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_STATUSES,statuses:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_STATUSES_ACTIVE });
  };
};
