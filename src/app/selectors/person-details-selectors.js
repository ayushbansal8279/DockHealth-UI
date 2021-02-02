import { createSelector } from 'reselect';

export const personSelector = state => state.personDetails;

export const tasksIsFetchingSelector = createSelector(
  personSelector,
  ({ isFetching }) => isFetching,
);

export const completedTasksIsFetchingSelector = createSelector(
  personSelector,
  ({ isCompletedTasksFetching }) => isCompletedTasksFetching,
);

export const tasksSelector = createSelector(
  personSelector,
  ({ tasks }) => tasks,
);

export const completedTasksSelector = createSelector(
  personSelector,
  ({ completedTasks }) => completedTasks,
);

export const personTaskCountersSelector = createSelector(
  personSelector,
  ({ taskCounters }) => taskCounters,
);

export const personDataSelector = createSelector(
  personSelector,
  ({ personData }) => personData,
);

export const personDetailsSortSelector = createSelector(
  personSelector,
  ({ sort }) => sort,
);
