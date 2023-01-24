import pick from 'ramda/src/pick';
import { createSelector } from 'reselect';

export const calendarTasksStateSelector = (state) => state.calendarTasks;

export const calendarDateRangeSelector = createSelector(
  calendarTasksStateSelector,
  pick(['startDate', 'endDate']),
);

export const calendarTasksSelector = createSelector(
  calendarTasksStateSelector,
  ({ tasks }) => tasks,
);
