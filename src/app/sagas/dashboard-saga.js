import { put, takeEvery } from 'redux-saga/effects';
import { hideHeader } from 'actions/template-actions';

const INITIALIZE_DASHBOARD_VIEW = 'INITIALIZE_DASHBOARD_VIEW';

export const initializeDashboardView = () => ({
  type: INITIALIZE_DASHBOARD_VIEW,
});

function* doInitializeDashboardView() {
  yield put(hideHeader());
}

export default function* watchDashboard() {
  yield takeEvery(INITIALIZE_DASHBOARD_VIEW, doInitializeDashboardView);
}
