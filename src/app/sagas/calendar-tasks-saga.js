import { takeEvery } from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';

// eslint-disable-next-line require-yield
function* changeCalendarDateRange({ startDate, endDate }) {
  console.log('start', startDate);
  console.log('end', endDate);
}

export default function* watchCalendarTasks() {
  yield takeEvery(
    ActionTypes.CHANGE_CALENDAR_DATE_RANGE,
    changeCalendarDateRange,
  );
}
