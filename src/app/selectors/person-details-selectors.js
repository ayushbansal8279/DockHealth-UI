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

export const tasksSelector = createSelector(
  personStateSelector,
  ({ tasks }) => tasks,
);

export const completedTasksSelector = createSelector(
  personStateSelector,
  ({ completedTasks }) => completedTasks,
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
