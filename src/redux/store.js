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
import reportReducer from './reducers/reportReducer';

//storage
import storageHelpFilters from './reducers/storage/help-filtersReducer';
import storageHelpInvoiceItems from './reducers/storage/help-invoice_itemsReducer';
import storageHelpPricelists from './reducers/storage/help-pricelistsReducer';
import storageHelpPrices from './reducers/storage/help-pricesReducer';
import storageHelpProjects from './reducers/storage/help-projectsReducer';
import storageHelpStatuses from './reducers/storage/help-statusesReducer';
import storageHelpStoredItems from './reducers/storage/help-stored_itemsReducer';
import storageHelpSupplierInvoices from './reducers/storage/help-supplier_invoicesReducer';
import storageHelpSuppliers from './reducers/storage/help-suppliersReducer';
import storageHelpTags from './reducers/storage/help-tagsReducer';
import storageHelpTaskMaterials from './reducers/storage/help-task_materialsReducer';
import storageHelpTaskTypes from './reducers/storage/help-task_typesReducer';
import storageHelpTaskWorks from './reducers/storage/help-task_worksReducer';
import storageHelpTasks from './reducers/storage/help-tasksReducer';
import storageHelpUnits from './reducers/storage/help-unitsReducer';
import storageHelpWorkTypes from './reducers/storage/help-work_typesReducer';

import storageCompanies from './reducers/storage/companiesReducer';
import storageImaps from './reducers/storage/imapsReducer';
import storageMetadata from './reducers/storage/metadataReducer';
import storageSmtps from './reducers/storage/smtpsReducer';
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
    reportReducer,
    //storage
    storageHelpFilters,
    storageHelpInvoiceItems,
    storageHelpPricelists,
    storageHelpPrices,
    storageHelpProjects,
    storageHelpStatuses,
    storageHelpStoredItems,
    storageHelpSupplierInvoices,
    storageHelpSuppliers,
    storageHelpTags,
    storageHelpTaskMaterials,
    storageHelpTaskTypes,
    storageHelpTaskWorks,
    storageHelpTasks,
    storageHelpUnits,
    storageHelpWorkTypes,

    storageCompanies,
    storageImaps,
    storageMetadata,
    storageSmtps,
    storageUsers,
  });

const enhancers = compose(
  applyMiddleware(ReduxThunk)
);


export default () => createStore(reducers, {}, enhancers);
