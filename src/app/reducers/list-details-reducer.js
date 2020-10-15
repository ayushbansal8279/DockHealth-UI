import * as types from 'actions/action-types';

const initialState = {
  listGroups: [],
  isFetchingGroups: false,
  error: '',
  groupsInitialized: false,
  completedTasks: [],
};

const ListDetailsReducer = (state = initialState, { type, listGroups }) => {
  switch (type) {
    case types.TASK_GROUP_LIST_REQUEST:
      return {
        ...state,
        groupsInitialized: true,
      };

    case types.TASK_GROUP_LIST_SUCCESS:
      return {
        listGroups,
        isFetchingGroups: false,
        groupsInitialized: true,
      };

    case types.TASK_GROUP_LIST_FAILURE:
      return {
        ...state,
        error: 'Something went wrong',
        isFetchingGroups: false,
      };

    case types.TASK_GROUP_INITIALIZE:
      return {
        ...initialState,
        listGroups,
        groupsInitialized: true,
      };

    default:
      return state;
  }
};

export default ListDetailsReducer;
