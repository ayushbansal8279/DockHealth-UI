import { put, takeEvery } from 'redux-saga/effects';
import * as TemplateActions from 'actions/template-actions';

const INITIALIZE_DASHBOARD_VIEW = 'INITIALIZE_DASHBOARD_VIEW';

export const initializeDashboardView = () => ({
  type: INITIALIZE_DASHBOARD_VIEW,
});

function* doInitializeDashboardView() {
  yield put(TemplateActions.hideHeader());
  yield put(TemplateActions.enableNavbarFullMode());
  yield put(TemplateActions.hideNavbarSettings());
  yield put(TemplateActions.setCustomNavbarWidth(380));
}

export default function* watchDashboard() {
  yield takeEvery(INITIALIZE_DASHBOARD_VIEW, doInitializeDashboardView);
}
