import { createSelector } from 'reselect';

const personStateSelector = (state) => state.personDetails;

export const userIdentifierSelector = createSelector(
  personStateSelector,
  ({ userIdentifier }) => userIdentifier,
);

export const currentTasksStatusSelector = createSelector(
  personStateSelector,
  ({ currentTasksStatus }) => currentTasksStatus,
);

export const tasksIsFetchingSelector = createSelector(
  personStateSelector,
  ({ isFetching }) => isFetching,
);

export const completedTasksIsFetchingSelector = createSelector(
  personStateSelector,
  ({ isCompletedTasksFetching }) => isCompletedTasksFetching,
);

export const taskIdentifiersSelector = createSelector(
  personStateSelector,
  ({ taskIdentifiers }) => taskIdentifiers,
);

export const completedTaskIdentifiersSelector = createSelector(
  personStateSelector,
  ({ completedTaskIdentifiers }) => completedTaskIdentifiers,
);

export const tasksSelector = createSelector(
  personStateSelector,
  ({ taskIdentifiers, tasksMap }) => {
    const tasks = [];
    if (taskIdentifiers) {
      for (const taskId of taskIdentifiers) {
        tasks.push(tasksMap[taskId]);
      }
    }
    return tasks;
  },
);

export const completedTasksSelector = createSelector(
  personStateSelector,
  ({ completedTaskIdentifiers, tasksMap }) => {
    const tasks = [];
    if (completedTaskIdentifiers) {
      for (const taskId of completedTaskIdentifiers) {
        tasks.push(tasksMap[taskId]);
      }
    }
    return tasks;
  },
);

export const taskCountersSelector = createSelector(
  personStateSelector,
  ({ taskCounters }) => taskCounters,
);

export const userDetailsSelector = createSelector(
  personStateSelector,
  ({ userDetails }) => userDetails,
);

export const sortSelector = createSelector(
  personStateSelector,
  ({ sort }) => sort,
);

export const userTaskDetailsSelector = createSelector(
  personStateSelector,
  (_, taskId) => taskId,
  (details, taskId) => details.tasksMap[taskId],
);
