import { call, select, takeLatest } from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';
import * as ListDetailsApi from 'api/list-details-api';
import {
  currentTaskListIdentifierSelector,
  currentTaskListTasksStatusSelector,
} from 'selectors/task-list-selectors';
// import * as CalendarTasksActions from 'actions/calendar-tasks-actions';

function* getCalendarTasks({ startDate, endDate }) {
  try {
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    const status = yield select(currentTaskListTasksStatusSelector);
    const tasks = yield call(
      ListDetailsApi.getTasksForListByDateRange,
      taskListIdentifier,
      status,
      startDate.slice(0, 10),
      endDate.slice(0, 10),
    );
    console.log('tasks', tasks);
  } catch {
    console.log('error');
  }
}

export default function* watchCalendarTasks() {
  yield takeLatest(ActionTypes.GET_CALENDAR_TASKS, getCalendarTasks);
}
