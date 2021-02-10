import * as ActionTypes from './action-types';

export function getListDetailsTaskCounters(taskListIdentifier) {
  return {
    type: ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS,
    payload: {
      taskListIdentifier,
    },
  };
}

export const getListDetailsGroupedTasks = ({
  withLoader,
  loadingMore,
  taskListIdentifier,
  status,
}) => ({
  type: ActionTypes.GET_LIST_DETAILS_GROUPED_TASKS,
  payload: {
    withLoader,
    loadingMore,
    taskListIdentifier,
    status,
  },
});

export function sortListDetailsTasks(key, order) {
  return {
    type: ActionTypes.SORT_LIST_DETAILS_TASKS,
    payload: {
      key,
      order,
    },
  };
}
