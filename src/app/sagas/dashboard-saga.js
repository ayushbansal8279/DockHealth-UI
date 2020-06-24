import { all, put, takeEvery } from 'redux-saga/effects';
import * as TemplateActions from 'actions/template-actions';

const INITIALIZE_DASHBOARD_VIEW = 'INITIALIZE_DASHBOARD_VIEW';
const LEAVE_DASHBOARD_VIEW = 'LEAVE_DASHBOARD_VIEW';

export const initializeDashboardView = () => ({
  type: INITIALIZE_DASHBOARD_VIEW,
});

export const leaveDashboardView = () => ({
  type: LEAVE_DASHBOARD_VIEW,
});

function* doInitializeDashboardView() {
  yield all([
    put(TemplateActions.hideHeader()),
    put(TemplateActions.enableNavbarFullMode()),
    put(TemplateActions.hideNavbarSettings()),
    put(TemplateActions.setCustomNavbarWidth(380)),
    put(TemplateActions.hideNavbar()),
  ]);
}

function* doLeaveDashboardView() {
  yield all([
    put(TemplateActions.showHeader()),
    put(TemplateActions.disableNavbarFullMode()),
    put(TemplateActions.showNavbarSettings()),
    put(TemplateActions.resetCustomNavbarWidth()),
    put(TemplateActions.showNavbar()),
  ]);
}

export default function* watchDashboard() {
  yield takeEvery(INITIALIZE_DASHBOARD_VIEW, doInitializeDashboardView);
  yield takeEvery(LEAVE_DASHBOARD_VIEW, doLeaveDashboardView);
}
