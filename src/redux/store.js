import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import taskReducer from './reducers/taskReducer';
import appReducer from './reducers/appReducer';
import expenditureReducer from './reducers/expenditureReducer';
import userReducer from './reducers/userReducer';
import filterReducer from './reducers/filterReducer';
import passReducer from './reducers/passReducer';
import cmdbReducer from './reducers/cmdbReducer';
import wikiReducer from './reducers/wikiReducer';

//storage
import storageCompanies from './reducers/storage/companiesReducer';
import storageHelpFilters from './reducers/storage/help-filtersReducer';
import storageHelpPricelists from './reducers/storage/help-pricelistsReducer';
import storageHelpPrices from './reducers/storage/help-pricesReducer';
import storageHelpProjects from './reducers/storage/help-projectsReducer';
import storageHelpStatuses from './reducers/storage/help-statusesReducer';
import storageHelpSupplierInvoices from './reducers/storage/help-supplier_invoicesReducer';
import storageHelpSuppliers from './reducers/storage/help-suppliersReducer';
import storageHelpTags from './reducers/storage/help-tagsReducer';
import storageHelpTaskTypes from './reducers/storage/help-task_typesReducer';
import storageHelpTasks from './reducers/storage/help-tasksReducer';
import storageHelpUnits from './reducers/storage/help-unitsReducer';
import storageHelpWorkTypes from './reducers/storage/help-work_typesReducer';
import storageMetadata from './reducers/storage/metadataReducer';
import storageUsers from './reducers/storage/usersReducer';



const reducers = combineReducers({
    appReducer,
    userReducer,
    filterReducer,
    taskReducer,
    expenditureReducer,
    passReducer,
    cmdbReducer,
    wikiReducer,
    //storage
    storageCompanies,
    storageHelpFilters,
    storageHelpPricelists,
    storageHelpPrices,
    storageHelpProjects,
    storageHelpStatuses,
    storageHelpSupplierInvoices,
    storageHelpSuppliers,
    storageHelpTags,
    storageHelpTaskTypes,
    storageHelpTasks,
    storageHelpUnits,
    storageHelpWorkTypes,
    storageMetadata,
    storageUsers,
  });

const enhancers = compose(
  applyMiddleware(ReduxThunk)
);


export default () => createStore(reducers, {}, enhancers);
