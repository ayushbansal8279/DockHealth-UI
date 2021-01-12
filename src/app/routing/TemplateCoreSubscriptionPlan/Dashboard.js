import {
  initializeDashboardView,
  reloadDashboardTasks,
} from 'sagas/dashboard-saga';
import * as TemplateActions from 'actions/template-actions';
import { clearFiltersForMegaFilter } from 'actions/mega-filter-actions';
import {
  REQUEST_DASHBOARD_TASKS,
  REQUEST_DASHBOARD_STATISTICS,
} from 'actions/action-types';
import { closeDrawer } from 'actions/task-drawer-actions';

export const onEnterDashboard = ({ dispatch }) => {
  dispatch(TemplateActions.hideHeader());
  dispatch(initializeDashboardView());
};

export const onUpdateDashboard = ({ dispatch }) => {
  dispatch({ type: REQUEST_DASHBOARD_TASKS });
  dispatch({ type: REQUEST_DASHBOARD_STATISTICS });
  dispatch(reloadDashboardTasks());
};

export const onLeaveDashboard = ({ dispatch }) => {
  dispatch(TemplateActions.showHeader());
  dispatch(clearFiltersForMegaFilter());
  dispatch(closeDrawer());
};
