import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';
import * as ListDetailsApi from 'api/list-details-api';
import {
  currentTaskListIdentifierSelector,
  currentTaskListTasksStatusSelector,
} from 'selectors/task-list-selectors';
import { calendarDateRangeSelector } from 'selectors/calendar-tasks-selectors';
import { showGlobalErrorAlert } from 'alert/actions';
import * as CalendarTasksActions from 'actions/calendar-tasks-actions';

function* getCalendarTasks() {
  try {
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    const status = yield select(currentTaskListTasksStatusSelector);
    const { startDate, endDate } = yield select(calendarDateRangeSelector);
    const tasks = yield call(
      ListDetailsApi.getTasksForListByDateRange,
      taskListIdentifier,
      status,
      startDate.slice(0, 10),
      endDate.slice(0, 10),
    );
    yield put(CalendarTasksActions.getCalendarTasksSuccess(tasks));
  } catch {
    yield all([
      put(CalendarTasksActions.getCalendarTasksFailure()),
      put(showGlobalErrorAlert()),
    ]);
  }
}

export default function* watchCalendarTasks() {
  yield takeLatest(ActionTypes.GET_CALENDAR_TASKS, getCalendarTasks);
}
