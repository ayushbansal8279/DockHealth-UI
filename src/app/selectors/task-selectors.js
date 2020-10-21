/* eslint-disable no-param-reassign */
import { createSelector } from 'reselect';
// import { sort } from 'ramda';
import memoize from 'lodash.memoize';
import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import { listDetailsGroupsSelector } from './list-details-selectors';

export const listTasksSelector = state => state.listTasks;
export const taskSelector = state => state.taskState;

export const tasksIsFetchingSelector = createSelector(
  listTasksSelector,
  ({ isFetching }) => isFetching,
);

export const completedTasksSelector = createSelector(
  listTasksSelector,
  ({ completedTasks }) => completedTasks,
);

export const completedTasksIsFetchingSelector = createSelector(
  listTasksSelector,
  ({ isCompletedTasksFetching }) => isCompletedTasksFetching,
);
export const completedTasksIsFetchingMoreSelector = createSelector(
  listTasksSelector,
  ({ isFetchingMoreTasks }) => isFetchingMoreTasks,
);

const addGroupIfNotExists = (groupedTasks, groupName) => {
  if (groupedTasks[groupName]) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  groupedTasks[groupName] = [];
};

// const addTaskToDefaultGroup = (groupedTasks, task) => {
//   addGroupIfNotExists(groupedTasks, TASKGROUP_DEFAULT_TYPE);
//   groupedTasks[TASKGROUP_DEFAULT_TYPE].push(task);
// };

// const sortByOrderProperty = (a, b) => {
//   if (a.taskOrderProp === null && b.taskOrderProp === null) {
//     return 0;
//   }

//   if (a.taskOrderProp === null) {
//     return 1;
//   }

//   if (b.taskOrderProp === null) {
//     return 1;
//   }

//   return a.taskOrderProp - b.taskOrderProp;
// };

export const tasksSelector = createSelector(
  listTasksSelector,
  ({ tasks }) => tasks,
);

export const groupTasksSelector = createSelector(
  listTasksSelector,
  ({ groupedTasks }) => {
    if (!groupedTasks) {
      return {};
    }
    const groupedTasksMap = {};

    // const sortIndexOfTaskInGroup = 1;
    groupedTasks?.taskGroups?.forEach(taskGroup => {
      groupedTasksMap[taskGroup.groupIdentifier] = {
        tasks: taskGroup.tasks,
        hasMore: taskGroup.hasMore,
        pageNumber: taskGroup.pageNumber,
      };
    });

    return groupedTasksMap;
  },
);

export const taskIsSelectedSelector = createSelector(
  taskSelector,
  ({ selectedTask }) => !!selectedTask,
);

export const selectedTaskIdentifierSelector = createSelector(
  taskSelector,
  ({ selectedTask }) => selectedTask?.taskIdentifier,
);

export const searchedGroupsWithTasksSelector = createSelector(
  groupTasksSelector,
  tasks =>
    memoize(searchValue =>
      !searchValue
        ? tasks
        : Object.keys(tasks).reduce((groupObject, currentKey) => {
            const searchedTasks = filterTasksBySearchValue(
              tasks[currentKey],
              searchValue,
            );

            if (searchedTasks.length === 0) return groupObject;

            return { ...groupObject, [currentKey]: searchedTasks };
          }, {}),
    ),
);

export const searchedGroupsListSelector = createSelector(
  listDetailsGroupsSelector,
  group =>
    memoize((searchValue, searchedGroupsWithTasks) =>
      !searchValue
        ? group
        : group.filter(
            ({ taskGroupIdentifier, groupType }) =>
              Object.keys(searchedGroupsWithTasks).includes(
                taskGroupIdentifier,
              ) || Object.keys(searchedGroupsWithTasks).includes(groupType),
          ),
    ),
);
