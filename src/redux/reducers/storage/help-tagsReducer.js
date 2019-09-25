import {STORAGE_SET_HELP_TAGS, STORAGE_HELP_TAGS_ACTIVE} from '../../types'

const initialState = {
  tagsActive:false,
  tagsLoaded:false,
  tags:[]
};

export default function storageTagsReducer(state = initialState, action) {
  switch (action.type) {
    case STORAGE_SET_HELP_TAGS:{
      return {
        ...state,
        tags: action.tags,
        tagsLoaded:true,
      };
    }
    case STORAGE_HELP_TAGS_ACTIVE:
      return {
        ...state,
        tagsActive: true,
      };
    default:
      return state;
  }
}
