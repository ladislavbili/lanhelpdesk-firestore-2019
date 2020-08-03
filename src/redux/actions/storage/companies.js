import {STORAGE_SET_COMPANIES, STORAGE_COMPANIES_ACTIVE } from '../../types';
import {database} from '../../../index.js';
import {snapshotToArray} from '../../../helperFunctions';


export const storageCompaniesStart = () => {
  return (dispatch) => {
    database.collection('companies').onSnapshot(querySnapshot => {
      dispatch({ type: STORAGE_SET_COMPANIES,companies:snapshotToArray(querySnapshot).sort((c1, c2) => (c1.title.toLowerCase() > c2.title.toLowerCase() ? 1 : -1))});
      }, err => {
      console.log(`Encountered error: ${err}`);
    });

    dispatch({ type: STORAGE_COMPANIES_ACTIVE });
  };
};
