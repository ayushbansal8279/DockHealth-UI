/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable sonarjs/no-identical-functions */
import {
  put,
  call,
  takeEvery,
  select,
  delay,
  takeLatest,
  all,
} from 'redux-saga/effects';
import { hashHistory } from 'react-router';
import {
  REQUEST_DASHBOARD_TASKS,
  REQUEST_DASHBOARD_MORE_GROUP_TASKS,
  REQUEST_DASHBOARD_TASKS_SUCCESS,
  REQUEST_DASHBOARD_GROUP_TASKS,
  REQUEST_DASHBOARD_GROUP_TASKS_SUCCESS,
  REQUEST_DASHBOARD_MORE_GROUP_TASKS_SUCCESS,
  REQUEST_DASHBOARD_TASKS_FAILURE,
  REQUEST_DASHBOARD_STATISTICS,
  REQUEST_DASHBOARD_STATISTICS_SUCCESS,
  REQUEST_DASHBOARD_STATISTICS_FAILURE,
  UPDATE_TASK_SUCCESS,
  FETCH_MEGA_FILTERS_SUCCESS,
  FETCH_MEGA_FILTERS_FAILURE,
} from 'actions/action-types';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  reorderTasksInGroup,
  getDashboardMyTasksFilters,
  getDashboardAllTasksFilters,
  getDashboardMyTasksByCriteria,
  getDashboardAllTasksByCriteria,
  getDashboardStatistics,
  getDashboardTaskStasForImplicitGroups,
  getTasksAssignedToUserByImplicitGroup,
  getTasksForOrganizationByImplicitGroup,
  searchTasksByAssignedToUserGroupedByImplicitGroups,
  searchTasksForOrganizationGroupedByImplicitGroups,
} from 'api/dashboard-api';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import AlertMessages from 'alert/AlertMessages';
import {
  toggleTaskCompletedStatus,
  setDueDate as setDueDateHelper,
  TASK_DISAPPEAR_DELAY,
} from 'helpers/task-update-helper';
import { fetchTasklistForUser } from 'sagas/tasklist-saga';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { isEmpty } from 'ramda';

const INITIALIZE_DASHBOARD_VIEW = 'INITIALIZE_DASHBOARD_VIEW';

const RELOAD_DASHBOARD_TASKS = 'RELOAD_DASHBOARD_TASKS';
const TOGGLE_DASHBOARD_TASK_COMPLETE = 'TOGGLE_DASHBOARD_TASK_COMPLETE';
const QUICK_ADD_DASHBOARD_TASK = 'QUICK_ADD_DASHBOARD_TASK';
const REDIRECT_TO_PARENT_TASK = 'REDIRECT_TO_PARENT_TASK';
const SORT_DASHBOARD_TASKS = 'SORT_DASHBOARD_TASKS';
const DO_UPDATE_DASHBOARD_TASK_DUE_DATE = 'DO_UPDATE_DASHBOARD_TASK_DUE_DATE';
const FETCH_DASHBOARD_FILTERS = 'FETCH_DASHBOARD_FILTERS';
const DO_UPDATE_DASHBOARD_SELECTED_FILTERS =
  'DO_UPDATE_DASHBOARD_SELECTED_FILTERS';
const DO_REASSIGN_DASHBOARD_TASK = 'DO_REASSIGN_DASHBOARD_TASK';
const DO_FETCH_IMPLICIT_GROUPS = 'DO_FETCH_IMPLICIT_GROUPS';
const DO_FETCH_IMPLICIT_GROUP = 'DO_FETCH_IMPLICIT_GROUP';
const DO_FETCH_SEARCHED_TERM_FOR_IMPLICIT_GROUPS =
  'DO_FETCH_SEARCHED_TERM_FOR_IMPLICIT_GROUPS';

export const initializeDashboardView = () => ({
  type: INITIALIZE_DASHBOARD_VIEW,
});
export const reloadDashboardTasks = () => ({ type: RELOAD_DASHBOARD_TASKS });
export const redirectToParentTask = (
  taskListIdentifier,
  taskIdentifer,
  taskStatus,
) => ({
  type: REDIRECT_TO_PARENT_TASK,
  taskListIdentifier,
  taskIdentifer,
  taskStatus,
});

export const toggleDashboardTaskComplete = task => ({
  type: TOGGLE_DASHBOARD_TASK_COMPLETE,
  task,
});

export const sortDashboardTasks = (taskGroupImplicitType, tasksOrder) => ({
  type: SORT_DASHBOARD_TASKS,
  taskGroupImplicitType,
  tasksOrder,
});

export const quickAddDashboardTask = ({
  description,
  taskListIdentifier,
  assignedToIdentifier,
  patientIdentifier,
}) => ({
  type: QUICK_ADD_DASHBOARD_TASK,
  payload: {
    description,
    taskListIdentifier,
    assignedToIdentifier,
    patientIdentifier,
  },
});

export const updateDashboardTaskDueDate = (task, dueDate) => ({
  type: DO_UPDATE_DASHBOARD_TASK_DUE_DATE,
  payload: {
    task,
    dueDate,
  },
});

export const fetchDashboardFilters = () => ({
  type: FETCH_DASHBOARD_FILTERS,
});

export const updateDashboardSelectedFilters = selectedFilters => ({
  type: DO_UPDATE_DASHBOARD_SELECTED_FILTERS,
  payload: {
    selectedFilters,
  },
});

export const reassignDashboardTask = (taskIdentifier, userId) => ({
  type: DO_REASSIGN_DASHBOARD_TASK,
  taskIdentifier,
  userId,
});

export const fetchImplicitGroup = (group, fetchMore) => ({
  type: DO_FETCH_IMPLICIT_GROUP,
  group,
  fetchMore,
});

export const fetchSearchedTermImplicitGroups = searchTerm => ({
  type: DO_FETCH_SEARCHED_TERM_FOR_IMPLICIT_GROUPS,
  searchTerm,
});

const getTasksType = () => {
  const location = window.location?.hash?.split('/');
  const tab = location.slice(-1)[0];

  switch (tab) {
    case 'all-tasks':
      return 'all-tasks';
    case 'my-tasks':
      return 'my-tasks';
    default:
      return '';
  }
};

function* doReloadDashboardMyTasksStatistics() {
  try {
    const statistics = yield getDashboardStatistics('MyTasks');
    yield put({
      type: REQUEST_DASHBOARD_STATISTICS_SUCCESS,
      statistics,
    });
  } catch (error) {
    yield put({
      type: REQUEST_DASHBOARD_STATISTICS_FAILURE,
    });
  }
}

function* doReloadDashboardAllTasksStatistics() {
  try {
    const statistics = yield getDashboardStatistics('AllTasks');
    yield put({
      type: REQUEST_DASHBOARD_STATISTICS_SUCCESS,
      statistics,
    });
  } catch (error) {
    yield put({
      type: REQUEST_DASHBOARD_STATISTICS_FAILURE,
    });
  }
}

function* doFetchDashboardFilters() {
  const tasksType = getTasksType();
  const isAllTasks = tasksType === 'all-tasks';

  try {
    const filters = isAllTasks
      ? yield call(getDashboardAllTasksFilters)
      : yield call(getDashboardMyTasksFilters);

    yield put(
      MegaFilterActions.selectFiltersFromLocalStorage('dashboard', tasksType),
    );

    yield put({
      type: FETCH_MEGA_FILTERS_SUCCESS,
      filters,
    });
  } catch (error) {
    yield put({
      type: FETCH_MEGA_FILTERS_FAILURE,
    });
  }
}

function* doFetchImplicitGroup({ group, fetchMore }) {
  try {
    if (fetchMore) {
      yield put({
        type: REQUEST_DASHBOARD_MORE_GROUP_TASKS,
        fetchedGroup: group,
      });
    } else {
      yield put({
        type: REQUEST_DASHBOARD_GROUP_TASKS,
        fetchedGroup: group,
      });
    }

    const isAllTasks = getTasksType() === 'all-tasks';
    // eslint-disable-next-line consistent-return
    const fetchedGroup = yield call(function*() {
      try {
        const { taskGroups, ...rest } = yield call(
          isAllTasks
            ? getTasksForOrganizationByImplicitGroup
            : getTasksAssignedToUserByImplicitGroup,
          group?.groupType,
          fetchMore ? group?.pageNumber + 1 : 1,
        );
        const tasks = taskGroups
          ?.map(item => item?.tasks)
          ?.reduce((tasksList, tasksGroupList) => [
            ...tasksList,
            ...tasksGroupList,
          ]);

        return { ...group, ...rest, ...taskGroups[0], tasks };
      } catch (error) {
        console.log(error);
      }
    });

    yield put({
      type: fetchMore
        ? REQUEST_DASHBOARD_MORE_GROUP_TASKS_SUCCESS
        : REQUEST_DASHBOARD_GROUP_TASKS_SUCCESS,
      fetchedGroup,
    });
  } catch (error) {
    console.log(error);
  }
}

function* doFetchImplicitGroups(props = {}) {
  const { customOpenGroupsByDefault } = props;
  try {
    const tasksType = getTasksType();
    const isAllTasks = tasksType === 'all-tasks';
    const dashboardGroups = yield call(
      getDashboardTaskStasForImplicitGroups,
      tasksType,
    );

    const dashboardTasksGroups = yield all(
      dashboardGroups?.map(dashboardGroup =>
        // eslint-disable-next-line consistent-return
        call(function*(group) {
          const isCustomOpen =
            customOpenGroupsByDefault?.some(
              item => item === group?.groupType,
            ) || false;
          try {
            if (group?.defaultOpen || isCustomOpen) {
              const { taskGroups, ...rest } = yield call(
                isAllTasks
                  ? getTasksForOrganizationByImplicitGroup
                  : getTasksAssignedToUserByImplicitGroup,
                dashboardGroup?.groupType,
              );
              const tasks = taskGroups
                ?.map(item => item?.tasks)
                ?.reduce((tasksList, tasksGroupList) => [
                  ...tasksList,
                  ...tasksGroupList,
                ]);

              return {
                ...group,
                ...rest,
                ...taskGroups[0],
                defaultOpen: true,
                tasks,
              };
            }

            return {
              ...group,
              tasks: [],
            };
          } catch (error) {
            console.log(error);
          }
        }, dashboardGroup),
      ),
    );

    yield put({
      type: REQUEST_DASHBOARD_TASKS_SUCCESS,
      tasksList: dashboardTasksGroups,
    });
  } catch (error) {
    console.log(error);
  }
}

function* doFetchSearchedTermForImplicitGroups({ searchTerm }) {
  try {
    const tasksType = getTasksType();
    const isAllTasks = tasksType === 'all-tasks';
    yield put({ type: REQUEST_DASHBOARD_TASKS });

    const dashboardTasksGroups = yield call(
      isAllTasks
        ? searchTasksForOrganizationGroupedByImplicitGroups
        : searchTasksByAssignedToUserGroupedByImplicitGroups,
      searchTerm,
    );

    yield put({
      type: REQUEST_DASHBOARD_TASKS_SUCCESS,
      tasksList: dashboardTasksGroups?.map(group => ({
        ...group,
        metricValue: group?.tasks?.length || 0,
        defaultOpen: true,
      })),
    });
  } catch (error) {
    console.log(error);
  }
}

function* doReloadDashboardTasks({ customOpenGroupsByDefault }) {
  try {
    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);
    const isAllTasks = getTasksType() === 'all-tasks';

    let tasksList = [];

    const statisticsRequest = isAllTasks
      ? doReloadDashboardAllTasksStatistics
      : doReloadDashboardMyTasksStatistics;

    if (!isEmpty(selectedFilters)) {
      yield put({ type: REQUEST_DASHBOARD_TASKS });

      tasksList = isAllTasks
        ? (yield all([
            getDashboardAllTasksByCriteria(selectedFilters),
            call(statisticsRequest),
          ]))[0]
        : (yield all([
            getDashboardMyTasksByCriteria(selectedFilters),
            call(statisticsRequest),
          ]))[0];

      yield put({
        type: REQUEST_DASHBOARD_TASKS_SUCCESS,
        tasksList: tasksList.map(group => ({
          ...group,
          metricValue: group?.tasks?.length || 0,
          defaultOpen: true,
        })),
      });
    } else {
      yield all([
        call(doFetchImplicitGroups, { customOpenGroupsByDefault }),
        call(statisticsRequest),
      ]);
    }
  } catch (error) {
    yield put({
      type: REQUEST_DASHBOARD_TASKS_FAILURE,
    });
  }
}

function* doToggleDashboardTaskComplete({ task }) {
  try {
    const currentUser = yield select(userProfileSelector);

    const updatedTask = toggleTaskCompletedStatus(task, currentUser);

    yield put({ type: UPDATE_TASK_SUCCESS, task: updatedTask });

    if (task.status === 'COMPLETE') {
      yield call(TaskApi.markIncomplete, task);
    } else {
      yield call(TaskApi.markComplete, task);
    }
    yield delay(TASK_DISAPPEAR_DELAY);
    yield all([call(doReloadDashboardTasks), call(doFetchDashboardFilters)]);

    if (task.status === 'COMPLETE') {
      yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_REACTIVATED));
    } else {
      yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_COMPLETED));
    }
  } catch (error) {
    yield call(doReloadDashboardTasks);
  }
}

function* doRedirectToParentTask({
  taskListIdentifier,
  taskIdentifer,
  taskStatus,
}) {
  try {
    yield call(
      hashHistory.push,
      `tasks/${taskListIdentifier}/${taskStatus}/${taskIdentifer}`,
    );
  } catch (error) {
    console.error(error);
  }
}

function* doSortDashboardTasks({ taskGroupImplicitType, tasksOrder }) {
  try {
    yield reorderTasksInGroup({ tasksOrder, taskGroupImplicitType });
    yield call(doReloadDashboardTasks, {
      customOpenGroupsByDefault: [taskGroupImplicitType],
    });
  } catch (error) {
    console.error(error);
  }
}

function* doInitializeDashboardView() {
  yield put(MegaFilterActions.clearFiltersForMegaFilter());
  yield put({ type: REQUEST_DASHBOARD_TASKS });
  yield put({ type: REQUEST_DASHBOARD_STATISTICS });
  yield doFetchDashboardFilters();
  yield put(reloadDashboardTasks());
}

function* doQuickAddDahboardTask({ payload }) {
  const {
    description,
    taskListIdentifier,
    assignedToIdentifier,
    patientIdentifier,
  } = payload;

  try {
    yield call(TaskApi.addTask, {
      description,
      taskListIdentifier,
      assignedToIdentifier,
      patientIdentifier,
    });
    yield all([call(doReloadDashboardTasks), call(doFetchDashboardFilters)]);
    yield put(fetchTasklistForUser());
    yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
  } catch (error) {
    yield call(doReloadDashboardTasks);
  }
}

function* doUpdateDashboardTaskDueDate({ payload }) {
  const { task, dueDate } = payload;

  try {
    const updatedTask = setDueDateHelper(task, dueDate);
    yield put({ type: UPDATE_TASK_SUCCESS, task: updatedTask });
    yield call(TaskApi.updateDueDate, task?.taskIdentifier, dueDate);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield put(reloadDashboardTasks());
  } catch (error) {
    yield put(reloadDashboardTasks());
  }
}

function* doUpdateDashboardSelectedFilters({ payload }) {
  const { selectedFilters } = payload;
  const taskType = getTasksType();

  yield put(
    MegaFilterActions.selectFiltersForMegaFilter(
      selectedFilters,
      'dashboard',
      taskType,
    ),
  );
  yield put(reloadDashboardTasks());
}

function* doReassignDashboardTask({ taskIdentifier, userId }) {
  try {
    yield call(TaskApi.assignOrReassignTask, { taskIdentifier }, userId);
    yield call(doReloadDashboardTasks);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    console.log(error);
  }
}

export default function* watchDashboard() {
  yield takeEvery(INITIALIZE_DASHBOARD_VIEW, doInitializeDashboardView);
  yield takeEvery(RELOAD_DASHBOARD_TASKS, doReloadDashboardTasks);
  yield takeEvery(QUICK_ADD_DASHBOARD_TASK, doQuickAddDahboardTask);
  yield takeEvery(
    TOGGLE_DASHBOARD_TASK_COMPLETE,
    doToggleDashboardTaskComplete,
  );
  yield takeEvery(REDIRECT_TO_PARENT_TASK, doRedirectToParentTask);
  yield takeEvery(SORT_DASHBOARD_TASKS, doSortDashboardTasks);
  yield takeEvery(
    DO_UPDATE_DASHBOARD_TASK_DUE_DATE,
    doUpdateDashboardTaskDueDate,
  );
  yield takeLatest(FETCH_DASHBOARD_FILTERS, doFetchDashboardFilters);
  yield takeEvery(
    DO_UPDATE_DASHBOARD_SELECTED_FILTERS,
    doUpdateDashboardSelectedFilters,
  );
  yield takeEvery(DO_REASSIGN_DASHBOARD_TASK, doReassignDashboardTask);
  yield takeLatest(DO_FETCH_IMPLICIT_GROUPS, doFetchImplicitGroups);
  yield takeLatest(DO_FETCH_IMPLICIT_GROUP, doFetchImplicitGroup);
  yield takeLatest(
    DO_FETCH_SEARCHED_TERM_FOR_IMPLICIT_GROUPS,
    doFetchSearchedTermForImplicitGroups,
  );
}
