import {STORAGE_SET_COMPANIES, STORAGE_COMPANIES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageUsersStart = () => {
  return (dispatch) => {
    console.log('LOADED');
    database.collection('companies').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_COMPANIES,companies:snapshotToArray(querySnapshot)});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_COMPANIES_ACTIVE });
  };
};
