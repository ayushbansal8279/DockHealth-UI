import * as ActionTypes from 'actions/action-types';
import TaskBaseReducer from 'reducers/task-base-reducer';
import { updateTasksStateCallback } from 'reducers/reducer-helper';

const initial = {
  tasksMap: {},
};

export default (state = initial, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case ActionTypes.FIND_TASKS_BY_PROFILE_GROUPED_BY_TASK_LIST_SUCCESS: {
      const newMap = { ...state.tasksMap };
      for (const task of action.payload.flatMap((taskList) => taskList.tasks)) {
        newMap[task.identifier] = task;
      }

      return {
        ...state,
        tasksMap: newMap,
      };
    }

    default: {
      return state.profileIdentifier && state.profileIdentifier !== ''
        ? TaskBaseReducer(state, action, updateTasksStateCallback)
        : state;
    }
  }
};
