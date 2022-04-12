import { createSelector } from 'reselect';

export const calendarTasksStateSelector = state => state.dashboardTasks;

export const calendarTasksSelector = createSelector(
  calendarTasksStateSelector,
  ({ tasks }) => tasks,
);
