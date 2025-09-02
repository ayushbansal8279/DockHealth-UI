/* eslint-disable no-console */
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
  getDashboardTaskStasForImplicitGroups,
  getTasksAssignedToUserByImplicitGroup,
  getTasksForOrganizationByImplicitGroup,
  // searchTasksByAssignedToUserGroupedByImplicitGroups,
  // searchTasksForOrganizationGroupedByImplicitGroups,
  getCalendarTasks,
} from 'api/dashboard-api';
import {
  DashboardTasksTab,
  getGroupByDueDate,
} from 'helpers/dashboard-helpers';
import * as calendarTasksSelectors from 'selectors/calendar-tasks-selectors';
import {
  dashboardTasksSelector,
  dashboardGroupTasksCountSelector,
  dashboardTabNameSelector,
  dashboardTaskViewFilterSelector,
  dashboardSortTasksSelector,
  dashboardSearchValueSelector,
} from 'selectors/dashboard-selectors';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import { showGlobalErrorAlert } from 'alert/actions';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import {
  getFiltersStorageKey,
  getQuickFilterStorageKey,
  getMultipleSelectedQuickFilterStorageKey,
  getSortStorageKey,
} from 'helpers/mega-filter-helper';
import { log } from 'helpers/log';
import localStorageHelper from '../helpers/local-storage-helper';
import sessionStorageHelper from '../helpers/session-storage-helper';
import {
  extractAllTasksFromGroupsDetail,
  filterDataForCalender,
} from '../helpers/list-details-helper';

function* initializeDashboardView() {
  try {
    const tabName = yield select(dashboardTabNameSelector);

    let filters = localStorageHelper.getItem(
      getFiltersStorageKey('dashboard', tabName),
    );
    if (!filters) {
      filters = sessionStorageHelper.getItem(
        getFiltersStorageKey('dashboard', tabName),
      );
    }
    let selectedQuickFilter = localStorageHelper.getItem(
      getQuickFilterStorageKey('dashboard', tabName),
    );
    if (!selectedQuickFilter) {
      selectedQuickFilter = sessionStorageHelper.getItem(
        getQuickFilterStorageKey('dashboard', tabName),
      );
    }

    let sort = localStorageHelper.getItem(
      getSortStorageKey('dashboard', tabName),
    );

    if (sort && sort.key && sort.order) {
      yield put({
        type: ActionTypes.SORT_DASHBOARD_TASKS,
        key: sort.key,
        order: sort.order,
      });
    }

    yield put(
      MegaFilterActions.selectFiltersForMegaFilter(
        filters,
        'dashboard',
        tabName,
        selectedQuickFilter,
      ),
    );

    yield put(DashboardActions.getDashboardGroups());
  } catch (error) {
    log(error);
  }
}

function* getDashboardFilters() {
  const tabName = yield select(dashboardTabNameSelector);
  const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);

  try {
    const filters =
      tabName === DashboardTasksTab.ALL_TASKS
        ? yield call(getDashboardAllTasksFilters, selectedFilters)
        : yield call(getDashboardMyTasksFilters, selectedFilters);

    yield put({
      type: ActionTypes.GET_DASHBOARD_FILTERS_SUCCESS,
      filters,
    });
  } catch (error) {
    log('error', error);
    yield put({
      type: ActionTypes.GET_DASHBOARD_FILTERS_FAILURE,
    });
  }
}

function* getDashboardTasksForGroup({
  groupType,
  taskGroupIdentifier,
  sortBy,
  sortDirection,
}) {
  try {
    const tabName = yield select(dashboardTabNameSelector);
    const isAllTasks = tabName === DashboardTasksTab.ALL_TASKS;
    const taskViewFilter = yield select(dashboardTaskViewFilterSelector);
    const includeWorkflows = taskViewFilter?.includeWorkflows ?? true;
    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);
    const searchTerm = yield select(dashboardSearchValueSelector);

    const { taskGroups } = yield call(
      isAllTasks
        ? getTasksForOrganizationByImplicitGroup
        : getTasksAssignedToUserByImplicitGroup,
      groupType,
      taskGroupIdentifier,
      sortBy,
      sortDirection,
      0,
      0,
      includeWorkflows,
      selectedFilters,
      searchTerm,
    );
    const group = taskGroups.find((g) =>
      g.groupType === 'QUICK_FILTER'
        ? g.groupIdentifier === taskGroupIdentifier
        : g.groupType === groupType,
    );

    yield put({
      type: ActionTypes.GET_DASHBOARD_TASKS_FOR_GROUP_SUCCESS,
      groupType,
      group,
    });
  } catch (error) {
    log(error);
    yield put({
      type: ActionTypes.GET_DASHBOARD_TASKS_FOR_GROUP_FAILURE,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* loadMoreDashboardTasksForGroup({
  groupType,
  taskGroupIdentifier,
  sortBy,
  sortDirection,
}) {
  try {
    const tabName = yield select(dashboardTabNameSelector);
    const isAllTasks = tabName === DashboardTasksTab.ALL_TASKS;
    const taskViewFilter = yield select(dashboardTaskViewFilterSelector);
    const includeWorkflows = taskViewFilter?.includeWorkflows ?? true;
    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);
    const customStartPosition = yield select(
      dashboardGroupTasksCountSelector,
      groupType,
    );

    const { taskGroups } = yield call(
      isAllTasks
        ? getTasksForOrganizationByImplicitGroup
        : getTasksAssignedToUserByImplicitGroup,
      groupType,
      taskGroupIdentifier,
      sortBy,
      sortDirection,
      customStartPosition,
      0,
      includeWorkflows,
      selectedFilters,
    );
    const group = taskGroups.find((g) =>
      g.groupType === 'QUICK_FILTER'
        ? g.groupIdentifier === taskGroupIdentifier
        : g.groupType === groupType,
    );

    yield put({
      type: ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP_SUCCESS,
      groupType,
      group,
    });
  } catch (error) {
    log(error);
    yield put({
      type: ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP_FAILURE,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* getDashboardGroups() {
  try {
    const tabName = yield select(dashboardTabNameSelector);
    const savedDashboardSelectedQuickFilters = localStorageHelper.getItem(
      getMultipleSelectedQuickFilterStorageKey('dashboard', tabName),
    );

    const dashboardGroups = yield call(
      getDashboardTaskStasForImplicitGroups,
      tabName,
      savedDashboardSelectedQuickFilters
        ? JSON.parse(savedDashboardSelectedQuickFilters)
        : [],
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
  const tabName = yield select(dashboardTabNameSelector);
  
  let sort = localStorageHelper.getItem(
    getSortStorageKey('dashboard', tabName),
  );
  
  const { key, order } = sort || { key: null, order: null };
  
  yield all(
    tasksList
      .filter(({ defaultOpen }) => defaultOpen)
      .map(({ groupType, taskGroupIdentifier }) =>
        put(
          DashboardActions.getDashboardTasksForGroup(
            groupType,
            taskGroupIdentifier,
            key,
            order,
          ),
        ),
      ),
  );
}

function* searchDashboardTasks({ searchTerm }) {
  try {
    const groups = yield select(dashboardTasksSelector);
    const { key, order } = yield select(dashboardSortTasksSelector);
    yield all([
      put(DashboardActions.getDashboardGroupTasks(groups, key, order)),
    ]);
  } catch (error) {
    log(error);
    yield put({
      type: ActionTypes.GET_DASHBOARD_TASKS_FAILURE,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* getDashboardTasks() {
  try {
    const groups = yield select(dashboardTasksSelector);
    const { key, order } = yield select(dashboardSortTasksSelector);
    yield all([
      put(DashboardActions.getDashboardGroupTasks(groups, key, order)),
    ]);
  } catch (error) {
    log(error);
    yield put({
      type: ActionTypes.GET_DASHBOARD_TASKS_FAILURE,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* reorderDashboardTasks({
  taskGroupImplicitType,
  taskGroupIdentifier,
  tasksOrder,
}) {
  try {
    yield reorderTasksInGroup({
      tasksOrder,
      taskGroupImplicitType,
      taskGroupIdentifier,
    });
    yield put(
      DashboardActions.getDashboardTasksForGroup(
        taskGroupImplicitType,
        taskGroupIdentifier,
      ),
    );
  } catch {
    yield put(
      DashboardActions.getDashboardTasksForGroup(
        taskGroupImplicitType,
        taskGroupIdentifier,
      ),
    );
    yield put(showGlobalErrorAlert());
  }
}

function* updateTaskDueDateSuccess({ task: taskToChange, dueDate }) {
  const tabName = yield select(dashboardTabNameSelector);
  const savedDashboardSelectedQuickFilters = localStorageHelper.getItem(
    getMultipleSelectedQuickFilterStorageKey('dashboard', tabName),
  );

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
        .map(({ groupType, taskGroupIdentifier }) =>
          put(
            DashboardActions.getDashboardTasksForGroup(
              groupType,
              taskGroupIdentifier,
            ),
          ),
        ),
    );
    const dashboardGroups = yield call(
      getDashboardTaskStasForImplicitGroups,
      tabName,
      savedDashboardSelectedQuickFilters
        ? JSON.parse(savedDashboardSelectedQuickFilters)
        : [],
    );
    yield put({
      type: ActionTypes.GET_DASHBOARD_GROUP_STATS_SUCCESS,
      tasksList: dashboardGroups,
    });
  }
}

function* selectDashboardFilters({ selectedFilters, selectedQuickFilter }) {
  const tabName = yield select(dashboardTabNameSelector);

  if (tabName) {
    yield put(
      MegaFilterActions.selectFiltersForMegaFilter(
        selectedFilters,
        'dashboard',
        tabName,
        selectedQuickFilter,
      ),
    );

    yield put(DashboardActions.getDashboardTasks());
  }
}

function* updateTasksSuccess({ fields }) {
  if (fields.dueDate !== undefined) {
    yield put(DashboardActions.getDashboardTasks());
  }
}

function* getDashboardCalendarTasks() {
  try {
    const tabName = yield select(dashboardTabNameSelector);
    const { startDate, endDate } = yield select(
      calendarTasksSelectors.calendarDateRangeSelector,
    );
    if (!tabName) return;

    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);

    const appliedFilter = filterDataForCalender(
      selectedFilters,
      startDate,
      endDate,
    );

    const isAllTasks = tabName === DashboardTasksTab.ALL_TASKS;
    const includeWorkflows = true;
    const searchTerm = '';
    const sortBy = null;
    const sortDirection = null;
    const taskGroupIdentifier = null;
    const groupType = 'UPCOMING';

    const { taskGroups } = yield call(
      isAllTasks
        ? getTasksForOrganizationByImplicitGroup
        : getTasksAssignedToUserByImplicitGroup,
      groupType,
      taskGroupIdentifier,
      sortBy,
      sortDirection,
      0,
      0,
      includeWorkflows,
      appliedFilter,
      searchTerm,
    );

    const tasks = extractAllTasksFromGroupsDetail(taskGroups);

    yield put(DashboardActions.getDashboardCalendarTasksSuccess(tasks));
  } catch {
    yield all([
      put(DashboardActions.getDashboardCalendarTasksFailure()),
      put(showGlobalErrorAlert()),
    ]);
  }
}

function* sortDashboardTasks({ key, order }) {
  try {
    const tabName = yield select(dashboardTabNameSelector);

    if (order) {
      localStorageHelper.setItem(
        getSortStorageKey('dashboard', tabName),
        { key, order },
      );
    } else if (order === null) {
      localStorageHelper.removeItem(getSortStorageKey('dashboard', tabName));
    }
  } catch (error) {
    log(error);
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
  yield takeEvery(ActionTypes.SELECT_DASHBOARD_FILTERS, selectDashboardFilters);
  yield takeEvery(
    ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP,
    loadMoreDashboardTasksForGroup,
  );
  yield takeEvery(
    ActionTypes.UPDATE_TASK_DUE_DATE_SUCCESS,
    updateTaskDueDateSuccess,
  );
  yield takeEvery(ActionTypes.UPDATE_TASKS_SUCCESS, updateTasksSuccess);
  yield takeLatest(
    ActionTypes.GET_DASHBOARD_CALENDAR_TASKS,
    getDashboardCalendarTasks,
  );
  yield takeLatest(ActionTypes.REFRESH_ORIGIN, getDashboardTasks);
  yield takeEvery(ActionTypes.SORT_DASHBOARD_TASKS, sortDashboardTasks);
}
