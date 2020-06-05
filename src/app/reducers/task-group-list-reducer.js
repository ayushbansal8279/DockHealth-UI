import * as types from 'actions/action-types';

const initialState = {
  groupList: [],
  isFetching: false,
  error: '',
  listInitialized: false,
};

const TaskGroupListReducer = (state = initialState, { type, groupList }) => {
  switch (type) {
    case types.TASK_GROUP_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case types.TASK_GROUP_LIST_SUCCESS:
      return {
        groupList,
        isFetching: false,
        listInitialized: true,
      };

    case types.TASK_GROUP_LIST_FAILURE:
      return {
        ...state,
        error: 'Something went wrong',
        isFetching: false,
      };

    case types.TASK_GROUP_INITIALIZE:
      return {
        ...initialState,
        groupList,
        listInitialized: true,
      };

    default:
      return state;
  }
};

export default TaskGroupListReducer;
