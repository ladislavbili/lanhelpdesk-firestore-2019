import {STORAGE_HELP_SUPPLIER_INVOICES, STORAGE_HELP_SUPPLIER_INVOICES_ACTIVE} from '../../types'

const initialState = {
  supplierInvoicesActive:false,
  supplierInvoicesLoaded:false,
  supplierInvoices:[]
};

export default function storageSupplierInvoicesReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_HELP_SUPPLIER_INVOICES:{
      return {
        ...state,
        supplierInvoices: action.supplierInvoices,
        supplierInvoicesLoaded:true,
      };
    }
    case STORAGE_HELP_SUPPLIER_INVOICES_ACTIVE:
      return {
        ...state,
        supplierInvoicesActive: true,
      };
    default:
      return state;
  }
}
