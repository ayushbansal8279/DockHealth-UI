import { createSelector } from 'reselect';

export const taskListStateSelector = state => state.taskList;

export const currentTaskListIdentifierSelector = createSelector(
  taskListStateSelector,
  ({ currentTaskListIdentifier }) => currentTaskListIdentifier,
);

export const currentTaskListTasksStatusSelector = createSelector(
  taskListStateSelector,
  ({ currentTasksStatus }) => currentTasksStatus,
);

export const currentTaskListSelector = createSelector(
  taskListStateSelector,
  ({ currentTaskList }) => currentTaskList,
);

export const taskListsSelector = createSelector(
  taskListStateSelector,
  ({ taskLists }) => taskLists,
);
export const pendingTaskListsSelector = createSelector(
  taskListStateSelector,
  ({ pendingTaskLists }) => pendingTaskLists,
);

export const taskListMembersSelector = createSelector(
  taskListStateSelector,
  ({ tasklistmembers }) => tasklistmembers,
);

export const archivedTaskListsSelector = createSelector(
  taskListStateSelector,
  ({ archivedTaskLists }) => archivedTaskLists,
);

export const currentTaskListCustomFieldsPreferencesSelector = identifier => {
  return createSelector(
    taskListStateSelector,
    ({ currentTaskList }) =>
      currentTaskList?.listUsers.find(u => u.identifier === identifier)
        ?.customFieldDisplayColumns,
  );
};
