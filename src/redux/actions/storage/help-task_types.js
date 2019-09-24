import {STORAGE_SET_HELP_TASK_TYPES, STORAGE_HELP_TASK_TYPES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageUsersStart = () => {
  return (dispatch) => {
    console.log('LOADED');
    database.collection('help-task_types').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_HELP_TASK_TYPES,taskTypes:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_HELP_TASK_TYPES_ACTIVE });
  };
};
