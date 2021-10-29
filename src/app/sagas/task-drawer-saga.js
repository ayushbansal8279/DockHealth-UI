import { takeEvery, put, call } from 'redux-saga/effects';
import { showGlobalErrorAlert } from 'alert/actions';
import * as ActionTypes from 'actions/action-types';
import * as CustomFieldsApi from 'api/custom-fields-api';

function* getTaskCustomFields({ taskIdentifier, taskListIdentifier }) {
  try {
    const customFieldsList = yield call(
      CustomFieldsApi.getAllTaskCustomFields,
      taskIdentifier,
      taskListIdentifier,
    );
    yield put({
      type: ActionTypes.GET_TASK_CUSTOM_FIELDS_SUCCESS,
      customFieldsList,
    });
  } catch {
    yield put({ type: ActionTypes.GET_TASK_CUSTOM_FIELDS_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

export default function* watchTaskDrawer() {
  yield takeEvery(ActionTypes.GET_TASK_CUSTOM_FIELDS, getTaskCustomFields);
}
