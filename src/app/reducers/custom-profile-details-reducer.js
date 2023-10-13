import * as ActionTypes from 'actions/action-types';
import TaskBaseReducer from 'reducers/task-base-reducer';
import { updateTasksStateCallback } from 'reducers/reducer-helper';

const initial = {
  lists: null,
  tasksMap: {},
  isFetching: false,
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
        lists: action.lists,
        tasksMap: newMap,
        isFetching: false,
      };
    }

    case ActionTypes.ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;

      // const bundleIdentifier = addedTask.taskGroups?.find(
      //   ({ groupType }) => groupType === TaskGroupType.BUNDLE,
      // )?.taskGroupIdentifier;

      // if (bundleIdentifier) {
      //   return {
      //     ...state,
      //     lists: state.lists?.map((l) => ({
      //       ...l,
      //       tasks: l.tasks?.map((t) =>
      //         t.identifier === bundleIdentifier
      //           ? { ...t, tasks: [...(t.tasks || []), addedTask] }
      //           : t,
      //       ),
      //     })),
      //   };
      // }

      const { taskListIdentifier } = addedTask.taskList || {};

      const updatedState = {
        ...state,
        lists: state.lists?.map((l) =>
          l.taskListIdentifier === taskListIdentifier
            ? {
                ...l,
                tasks: [addedTask, ...(l.tasks || [])],
              }
            : l,
        ),
      };

      return updateTasksStateCallback(updatedState, addedTask);
    }

    default: {
      return state.profileIdentifier && state.profileIdentifier !== ''
        ? TaskBaseReducer(state, action, updateTasksStateCallback)
        : state;
    }
  }
};
