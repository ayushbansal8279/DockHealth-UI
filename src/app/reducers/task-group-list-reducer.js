import * as types from 'actions/action-types';

const initialState = {
  groupList: [],
  isFetching: false,
  error: '',
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
      };

    case types.TASK_GROUP_LIST_FAILURE:
      return {
        ...state,
        error: 'Something went wrong',
        isFetching: false,
      };

    default:
      return state;
  }
};

export default TaskGroupListReducer;
