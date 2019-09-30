import {STORAGE_SET_HELP_TASK_WORKS, STORAGE_SET_HELP_TASK_WORKS_ACTIVE} from '../../types'

const initialState = {
  taskWorksActive:false,
  taskWorksLoaded:false,
  taskWorks:[]
};

export default function storageTaskWorksReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_TASK_WORKS:{
      return {
        ...state,
        taskWorks: action.taskWorks,
        taskWorksLoaded:true,
      };
    }
    case STORAGE_SET_HELP_TASK_WORKS_ACTIVE:
      return {
        ...state,
        taskWorksActive: true,
      };
    default:
      return state;
  }
}
