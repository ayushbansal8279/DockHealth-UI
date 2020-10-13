/* eslint-disable no-param-reassign */
import { createSelector } from 'reselect';
import { sort } from 'ramda';
import memoize from 'lodash.memoize';
import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import { tasksGroupListSelector } from './task-group-list-selectors';

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

const addTaskToDefaultGroup = (groupedTasks, task) => {
  addGroupIfNotExists(groupedTasks, TASKGROUP_DEFAULT_TYPE);
  groupedTasks[TASKGROUP_DEFAULT_TYPE].push(task);
};

const sortByOrderProperty = (a, b) => {
  if (a.taskOrderProp === null && b.taskOrderProp === null) {
    return 0;
  }

  if (a.taskOrderProp === null) {
    return 1;
  }

  if (b.taskOrderProp === null) {
    return 1;
  }

  return a.taskOrderProp - b.taskOrderProp;
};

export const tasksSelector = createSelector(
  listTasksSelector,
  ({ tasks }) => tasks,
);

export const groupTasksSelector = createSelector(
  listTasksSelector,
  ({ tasks }) => {
    if (!tasks) {
      return {};
    }
    const groupedTasks = {};

    tasks.forEach(task => {
      if (!task.taskGroups || task.taskGroups.length === 0) {
        addTaskToDefaultGroup(groupedTasks, task);
      } else {
        task.taskGroups.forEach(taskGroup => {
          if (taskGroup.groupType !== TASKGROUP_DEFAULT_TYPE) {
            addGroupIfNotExists(groupedTasks, taskGroup.taskGroupIdentifier);
            groupedTasks[taskGroup.taskGroupIdentifier].push({
              ...task,
              taskOrderProp: taskGroup.sortIndexOfTaskInGroup,
            });
          } else {
            addTaskToDefaultGroup(groupedTasks, {
              ...task,
              taskOrderProp: taskGroup.sortIndexOfTaskInGroup,
            });
          }
        });
      }
    });

    return Object.keys(groupedTasks).reduce((groupsObject, key) => {
      groupsObject[key] = sort(sortByOrderProperty, groupedTasks[key]);
      return groupsObject;
    }, {});
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
  tasksGroupListSelector,
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
