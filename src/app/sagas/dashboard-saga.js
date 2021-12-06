/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable sonarjs/no-identical-functions */
import {
  put,
  call,
  takeEvery,
  select,
  takeLatest,
  all,
} from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';
import * as DashboardActions from 'actions/dashboard-actions';
import {
  reorderTasksInGroup,
  getDashboardMyTasksFilters,
  getDashboardAllTasksFilters,
  getDashboardMyTasksByCriteria,
  getDashboardAllTasksByCriteria,
  getDashboardTaskStasForImplicitGroups,
  getTasksAssignedToUserByImplicitGroup,
  getTasksForOrganizationByImplicitGroup,
  searchTasksByAssignedToUserGroupedByImplicitGroups,
  searchTasksForOrganizationGroupedByImplicitGroups,
} from 'api/dashboard-api';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import {
  DashboardTasksTab,
  getGroupByDueDate,
} from 'helpers/dashboard-helpers';
import {
  dashboardGroupTasksCountSelector,
  dashboardTabNameSelector,
  dashboardTasksSelector,
} from 'selectors/dashboard-tasks-selectors';
import { getFiltersFromLocalStorage } from 'helpers/mega-filter-helper';
import { showGlobalErrorAlert } from 'alert/actions';

function* initializeDashboardView() {
  try {
    const tabName = yield select(dashboardTabNameSelector);
    const filters = getFiltersFromLocalStorage('dashboard', tabName);

    if (!filters) {
      yield put(MegaFilterActions.clearFiltersForMegaFilter());
      yield put(DashboardActions.getDashboardGroups());
    } else {
      yield put(MegaFilterActions.selectFiltersForMegaFilter(filters));
    }
  } catch (error) {
    console.log(error);
  }
}

function* getDashboardFilters() {
  const tabName = yield select(dashboardTabNameSelector);

  try {
    const filters =
      tabName === DashboardTasksTab.ALL_TASKS
        ? yield call(getDashboardAllTasksFilters)
        : yield call(getDashboardMyTasksFilters);

    yield put({
      type: ActionTypes.GET_DASHBOARD_FILTERS_SUCCESS,
      filters,
    });
  } catch (error) {
    yield put({
      type: ActionTypes.GET_DASHBOARD_FILTERS_FAILURE,
    });
  }
}

function* getDashboardTasksForGroup({ groupType }) {
  try {
    const tabName = yield select(dashboardTabNameSelector);
    const isAllTasks = tabName === DashboardTasksTab.ALL_TASKS;

    const { tasks } = yield select(dashboardGroupTasksCountSelector, groupType);

    const { taskGroups } = yield call(
      isAllTasks
        ? getTasksForOrganizationByImplicitGroup
        : getTasksAssignedToUserByImplicitGroup,
      groupType,
      0,
      tasks?.length || 0,
    );

    const group = taskGroups.find(g => g.groupType === groupType);

    yield put({
      type: ActionTypes.GET_DASHBOARD_TASKS_FOR_GROUP_SUCCESS,
      groupType,
      group,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: ActionTypes.GET_DASHBOARD_TASKS_FOR_GROUP_FAILURE,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* loadMoreDashboardTasksForGroup({ groupType }) {
  try {
    const tabName = yield select(dashboardTabNameSelector);
    const isAllTasks = tabName === DashboardTasksTab.ALL_TASKS;
    const customStartPosition = yield select(
      dashboardGroupTasksCountSelector,
      groupType,
    );

    const { taskGroups } = yield call(
      isAllTasks
        ? getTasksForOrganizationByImplicitGroup
        : getTasksAssignedToUserByImplicitGroup,
      groupType,
      customStartPosition,
    );
    const group = taskGroups.find(g => g.groupType === groupType);

    yield put({
      type: ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP_SUCCESS,
      groupType,
      group,
    });
  } catch {
    yield put({
      type: ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP_FAILURE,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* getDashboardGroups() {
  try {
    const tabName = yield select(dashboardTabNameSelector);

    const dashboardGroups = yield call(
      getDashboardTaskStasForImplicitGroups,
      tabName,
    );

    yield put({
      type: ActionTypes.GET_DASHBOARD_GROUPS_SUCCESS,
      tasksList: dashboardGroups,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_DASHBOARD_GROUPS_FAILURE });
  }
}

function* getDashboardGroupsSuccess({ tasksList }) {
  yield all(
    tasksList
      .filter(({ defaultOpen }) => defaultOpen)
      .map(({ groupType }) =>
        put(DashboardActions.getDashboardTasksForGroup(groupType)),
      ),
  );
}

function* searchDashboardTasks({ searchTerm }) {
  try {
    const tabName = yield select(dashboardTabNameSelector);
    const isAllTasks = tabName === DashboardTasksTab.ALL_TASKS;

    const dashboardTasksGroups = yield call(
      isAllTasks
        ? searchTasksForOrganizationGroupedByImplicitGroups
        : searchTasksByAssignedToUserGroupedByImplicitGroups,
      searchTerm,
    );

    yield put({
      type: ActionTypes.SEARCH_DASHBOARD_TASKS_SUCCESS,
      tasksList: dashboardTasksGroups?.map(group => ({
        ...group,
        metricValue: group?.tasks?.length || 0,
        defaultOpen: true,
      })),
    });
  } catch {
    yield put({ type: ActionTypes.SEARCH_DASHBOARD_TASKS_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

function* getDashboardTasks() {
  try {
    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);

    const tabName = yield select(dashboardTabNameSelector);
    const isAllTasks = tabName === DashboardTasksTab.ALL_TASKS;

    let tasksList = [];

    if (selectedFilters) {
      tasksList = yield call(
        isAllTasks
          ? getDashboardAllTasksByCriteria
          : getDashboardMyTasksByCriteria,
        selectedFilters,
      );

      yield put({
        type: ActionTypes.GET_DASHBOARD_TASKS_SUCCESS,
        tasksList: tasksList?.taskGroups?.map(group => ({
          ...group,
          metricValue: group?.tasks?.length || 0,
          defaultOpen: true,
        })),
      });
      yield put({
        type: ActionTypes.GET_DASHBOARD_FILTERS_SUCCESS,
        filters: tasksList?.taskFilterOptions,
      });
    } else {
      yield all([
        put(DashboardActions.getDashboardGroups()),
        put(DashboardActions.getDashboardFilters()),
      ]);
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: ActionTypes.GET_DASHBOARD_TASKS_FAILURE,
    });
  }
}

function* reorderDashboardTasks({ taskGroupImplicitType, tasksOrder }) {
  try {
    yield reorderTasksInGroup({ tasksOrder, taskGroupImplicitType });
    yield put(
      DashboardActions.getDashboardTasksForGroup(taskGroupImplicitType),
    );
  } catch (error) {
    yield put(
      DashboardActions.getDashboardTasksForGroup(taskGroupImplicitType),
    );
    yield put(showGlobalErrorAlert());
  }
}

function* updateTaskDueDateSuccess({ task: taskToChange, dueDate }) {
  const tabName = yield select(dashboardTabNameSelector);
  const task = { ...taskToChange, dueDate };
  if (tabName) {
    const groups = yield select(dashboardTasksSelector);
    yield all(
      groups
        .filter(
          ({ groupType }) =>
            groupType === getGroupByDueDate(task.dueDate, tabName) ||
            groupType === getGroupByDueDate(taskToChange.dueDate, tabName),
        )
        .map(({ groupType }) =>
          put(DashboardActions.getDashboardTasksForGroup(groupType)),
        ),
    );
  }
}

function* addTaskSuccess({ task }) {
  const tabName = yield select(dashboardTabNameSelector);
  if (tabName) {
    const groups = yield select(dashboardTasksSelector);
    yield all(
      groups
        .filter(
          ({ groupType }) =>
            groupType === getGroupByDueDate(task.dueDate, tabName),
        )
        .map(({ groupType }) =>
          put(DashboardActions.getDashboardTasksForGroup(groupType)),
        ),
    );
  }
}

function* selectFiltersForMegaFilter() {
  const tabName = yield select(dashboardTabNameSelector);

  if (tabName) {
    yield put(DashboardActions.getDashboardTasks());
  }
}

export default function* watchDashboard() {
  yield takeEvery(
    ActionTypes.INITIALIZE_DASHBOARD_STATE,
    initializeDashboardView,
  );
  yield takeLatest(ActionTypes.GET_DASHBOARD_TASKS, getDashboardTasks);
  yield takeLatest(ActionTypes.GET_DASHBOARD_GROUPS, getDashboardGroups);
  yield takeLatest(
    ActionTypes.GET_DASHBOARD_GROUPS_SUCCESS,
    getDashboardGroupsSuccess,
  );
  yield takeEvery(
    ActionTypes.GET_DASHBOARD_TASKS_FOR_GROUP,
    getDashboardTasksForGroup,
  );
  yield takeLatest(ActionTypes.SEARCH_DASHBOARD_TASKS, searchDashboardTasks);
  yield takeEvery(ActionTypes.REORDER_DASHBOARD_TASKS, reorderDashboardTasks);
  yield takeLatest(ActionTypes.GET_DASHBOARD_FILTERS, getDashboardFilters);
  yield takeEvery(
    ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
    selectFiltersForMegaFilter,
  );
  yield takeEvery(
    ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP,
    loadMoreDashboardTasksForGroup,
  );
  yield takeEvery(ActionTypes.ADD_TASK_SUCCESS, addTaskSuccess);
  yield takeEvery(
    ActionTypes.UPDATE_TASK_DUE_DATE_SUCCESS,
    updateTaskDueDateSuccess,
  );
}
