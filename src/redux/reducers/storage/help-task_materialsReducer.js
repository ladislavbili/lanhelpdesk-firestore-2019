import {STORAGE_SET_HELP_TASK_MATERIALS, STORAGE_SET_HELP_TASK_MATERIALS_ACTIVE} from '../../types'

const initialState = {
  materialsActive:false,
  materialsLoaded:false,
  materials:[]
};

export default function storageTaskMaterialsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_TASK_MATERIALS:{
      return {
        ...state,
        materials: action.materials,
        materialsLoaded:true,
      };
    }
    case STORAGE_SET_HELP_TASK_MATERIALS_ACTIVE:
      return {
        ...state,
        materialsActive: true,
      };
    default:
      return state;
  }
}
