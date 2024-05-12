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
  getDashboardMyTasksByCriteria,
  getDashboardAllTasksByCriteria,
  getDashboardTaskStasForImplicitGroups,
  getTasksAssignedToUserByImplicitGroup,
  getTasksForOrganizationByImplicitGroup,
  searchTasksByAssignedToUserGroupedByImplicitGroups,
  searchTasksForOrganizationGroupedByImplicitGroups,
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
  dashboardSelectedFiltersSelector,
} from 'selectors/dashboard-selectors';
import { showGlobalErrorAlert } from 'alert/actions';
import { log } from 'helpers/log';

function* initializeDashboardView() {
  try {
    const selectedFilters = yield select(dashboardSelectedFiltersSelector);
    yield selectedFilters
      ? put(DashboardActions.getDashboardTasks())
      : put(DashboardActions.getDashboardGroups());
  } catch (error) {
    log(error);
  }
}

function* getDashboardFilters() {
  const tabName = yield select(dashboardTabNameSelector);
  const selectedFilters = yield select(dashboardSelectedFiltersSelector);

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

function* getDashboardTasksForGroup({ groupType, sortBy, sortDirection }) {
  try {
    const tabName = yield select(dashboardTabNameSelector);
    const isAllTasks = tabName === DashboardTasksTab.ALL_TASKS;
    // const { tasks } = yield select(dashboardGroupTasksCountSelector, groupType);
    const { taskGroups } = yield call(
      isAllTasks
        ? getTasksForOrganizationByImplicitGroup
        : getTasksAssignedToUserByImplicitGroup,
      groupType,
      sortBy,
      sortDirection,
      0,
      0,
    );
    const group = taskGroups.find((g) => g.groupType === groupType);

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

function* loadMoreDashboardTasksForGroup({ groupType, sortBy, sortDirection }) {
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
      sortBy,
      sortDirection,
      customStartPosition,
      0,
    );
    const group = taskGroups.find((g) => g.groupType === groupType);

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

    // if (
    //   tabName === DashboardTasksTab.UPCOMING ||
    //   tabName === DashboardTasksTab.OVERDUE ||
    //   tabName === DashboardTasksTab.COMPLETED
    // ) {
    //   tabName = DashboardTasksTab.MY_TASKS;
    // }
    // if (tabName === DashboardTasksTab.SHARED_TASKS) {
    //   const dashboardGroups = [
    //     {
    //       groupName: 'Shared',
    //       groupType: 'SHARED',
    //       metricName: 'INCOMPLETE_TASKS_COUNT',
    //       metricValue: 0,
    //       defaultOpen: true,
    //     },
    //   ];

    //   yield put({
    //     type: ActionTypes.GET_DASHBOARD_GROUPS_SUCCESS,
    //     tasksList: dashboardGroups,
    //   });
    // } else {
    const dashboardGroups = yield call(
      getDashboardTaskStasForImplicitGroups,
      tabName,
    );

    yield put({
      type: ActionTypes.GET_DASHBOARD_GROUPS_SUCCESS,
      tasksList: dashboardGroups,
    });
    // }
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
      tasksList: dashboardTasksGroups?.map((group) => ({
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
    const selectedFilters = yield select(dashboardSelectedFiltersSelector);

    const tabName = yield select(dashboardTabNameSelector);
    const isAllTasks = tabName === DashboardTasksTab.ALL_TASKS;

    if (selectedFilters && Object.keys(selectedFilters).length > 0) {
      const taskGroups = yield call(
        isAllTasks
          ? getDashboardAllTasksByCriteria
          : getDashboardMyTasksByCriteria,
        selectedFilters,
      );

      yield put({
        type: ActionTypes.GET_DASHBOARD_TASKS_SUCCESS,
        tasksList: taskGroups?.map((group) => ({
          ...group,
          metricValue: group?.tasks?.length || 0,
          defaultOpen: true,
        })),
      });
    } else {
      yield all([
        put(DashboardActions.getDashboardGroups()),
        put(DashboardActions.getDashboardFilters()),
      ]);
    }
  } catch (error) {
    log(error);
    yield put({
      type: ActionTypes.GET_DASHBOARD_TASKS_FAILURE,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* reorderDashboardTasks({ taskGroupImplicitType, tasksOrder }) {
  try {
    yield reorderTasksInGroup({ tasksOrder, taskGroupImplicitType });
    yield put(
      DashboardActions.getDashboardTasksForGroup(taskGroupImplicitType),
    );
  } catch {
    yield put(
      DashboardActions.getDashboardTasksForGroup(taskGroupImplicitType),
    );
    yield put(showGlobalErrorAlert());
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* updateTaskStartDateSuccess({ task: taskToChange, startDate }) {
  // const tabName = yield select(dashboardTabNameSelector);
  // const task = { ...taskToChange, startDate };
  // if (tabName) {
  //   const groups = yield select(dashboardTasksSelector);
  //   yield all(
  //     groups
  //       .filter(
  //         ({ groupType }) =>
  //           groupType === getGroupByDueDate(task.startDate, tabName) ||
  //           groupType === getGroupByDueDate(taskToChange.startDate, tabName),
  //       )
  //       .map(({ groupType }) =>
  //         put(DashboardActions.getDashboardTasksForGroup(groupType)),
  //       ),
  //   );
  //   const dashboardGroups = yield call(
  //     getDashboardTaskStasForImplicitGroups,
  //     tabName,
  //   );
  // yield put({
  //   type: ActionTypes.GET_DASHBOARD_GROUP_STATS_SUCCESS,
  //   tasksList: dashboardGroups,
  // });
  // }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const dashboardGroups = yield call(
      getDashboardTaskStasForImplicitGroups,
      tabName,
    );
    yield put({
      type: ActionTypes.GET_DASHBOARD_GROUP_STATS_SUCCESS,
      tasksList: dashboardGroups,
    });
  }
}

function* selectDashboardFilters() {
  const tabName = yield select(dashboardTabNameSelector);

  if (tabName) {
    yield all([
      put(DashboardActions.getDashboardTasks()),
      // put(DashboardActions.getDashboardFilters()),
    ]);
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

    const tasks = yield call(getCalendarTasks, tabName, startDate, endDate);

    yield put(DashboardActions.getDashboardCalendarTasksSuccess(tasks));
  } catch {
    yield all([
      put(DashboardActions.getDashboardCalendarTasksFailure()),
      put(showGlobalErrorAlert()),
    ]);
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
    ActionTypes.UPDATE_TASK_START_DATE_SUCCESS,
    updateTaskStartDateSuccess,
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
}
