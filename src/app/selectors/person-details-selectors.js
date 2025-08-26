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

export const taskIdentifiersSelector = createSelector(
  personStateSelector,
  ({ taskIdentifiers }) => taskIdentifiers,
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

export const userMultipleTaskDetailsSelector = createSelector(
  personStateSelector,
  (_, taskIds) => taskIds,
  (details, taskIds) => taskIds.map((taskId) => details.tasksMap[taskId]),
);

export const selectedTasksSelector = (state) =>
  state?.taskItems?.selectedTaskIdentifiers
    .filter((taskId) => state?.personDetails?.tasksMap[taskId] !== undefined)
    .map((taskId) => state?.personDetails?.tasksMap[taskId]);
