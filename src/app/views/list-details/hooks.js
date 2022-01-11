/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isNil } from 'ramda';
import { initializePusher } from 'helpers/pusher-instance';
import useActions from 'hooks/use-actions';
import usePrevious from 'hooks/use-previous';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import localStorageHelper from 'helpers/local-storage-helper';
import { TaskItemColumn, TaskStatus } from 'helpers/task-helpers';
import {
  initializeTaskListState,
  updateUserListViewSetup,
  updateColumnOnListPreferences,
  getCurrentTaskListFilterOptions,
  clearTaskListState,
} from 'actions/task-list-actions';
import { updateOrganizationCustomFields } from 'actions/organization-actions';

import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import {
  completedTasksIsFetchingSelector,
  tasksIsFetchingSelector,
  groupCompletedTasksSelector,
  groupTasksSelector,
  taskDetailsSortSelector,
  taskCountersSelector,
  searchTermSelector,
} from 'selectors/list-details-selectors';
import {
  currentTaskListSelector,
  pendingTaskListsSelector,
  taskListMembersSelector,
  archivedTaskListsSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';

import { useColumnsConfig } from 'context-api/ColumnsConfigContext';
import * as TaskActions from 'actions/task-actions';
import * as ListDetailsActions from 'actions/list-details-actions';
import { ListDetailsSagaActions } from 'sagas/list-details-saga';
import * as ModalActions from 'modal/actions';
import { getListCustomFields } from 'actions/list-details-actions';
import * as UserAuthApi from 'api/user-auth-api';
import { getViewTypeFromQueryString } from 'helpers/view-type-helper';

const LIST_DETAILS_FIRST_TIME_KEY = 'LIST_DETAILS_FIRST_TIME_KEY';

const initializeListDetailsViewHooks = (match, history) => {
  const { search } = useLocation();
  const viewType = getViewTypeFromQueryString(search);
  const sort = useSelector(taskDetailsSortSelector);
  const taskList = useSelector(currentTaskListSelector);
  const { columnsConfig, setColumnsConfig } = useColumnsConfig();
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  const members = useSelector(taskListMembersSelector);
  const pendingTaskLists = useSelector(pendingTaskListsSelector);
  const archivedTaskLists = useSelector(archivedTaskListsSelector);
  const isFetching = useSelector(tasksIsFetchingSelector);
  const isCompletedTasksFetching = useSelector(
    completedTasksIsFetchingSelector,
  );
  const groupedTasks = useSelector(groupTasksSelector);
  const completedGroupedTasks = useSelector(groupCompletedTasksSelector);
  const taskCounters = useSelector(taskCountersSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);

  const actions = useActions(TaskActions);
  const listDetailsSagaActions = useActions(ListDetailsSagaActions);
  const modalActions = useActions(ModalActions);
  const listDetailsActions = useActions(ListDetailsActions);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourConditionChecked, setTourConditionChecked] = useState(false);
  // const [searchValue, setSearchValue] = useState('');
  const searchValue = useSelector(searchTermSelector);

  const prevCurrentUser = usePrevious(currentUser);
  const prevTaskCounters = usePrevious(taskCounters);
  const prevMatch = usePrevious(match);

  const pusher = useRef(initializePusher());
  const [channel, setChannel] = useState(null);

  const dispatch = useDispatch();
  const {
    params: { taskListIdentifier: taskListIdentifierParam, tabName },
  } = match;

  useEffect(() => {
    dispatch(
      initializeTaskListState(
        taskListIdentifierParam,
        tabName?.toUpperCase() || TaskStatus.INCOMPLETE,
      ),
    );
  }, [dispatch, tabName, taskListIdentifierParam]);

  useEffect(() => {
    return () => {
      dispatch(clearTaskListState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (taskListIdentifierParam) {
      dispatch(getListCustomFields(taskListIdentifierParam));
    }
  }, [dispatch, taskListIdentifierParam]);

  const refreshTab = useCallback(
    (withLoader = false) => {
      dispatch(getCurrentTaskListFilterOptions());
      listDetailsActions.getListDetailsTaskCounters(taskListIdentifierParam);
      listDetailsActions.refreshListDetailsGroupedTasks(withLoader);
    },
    [dispatch, listDetailsActions, taskListIdentifierParam],
  );

  const openTourModal = useCallback(() => {
    const listDatailsFirstTimeValue = localStorageHelper.getItem(
      LIST_DETAILS_FIRST_TIME_KEY,
    );
    if (isNil(listDatailsFirstTimeValue) || listDatailsFirstTimeValue) {
      setIsTourOpen(true);
    }
  }, []);

  const refreshFilters = useCallback(() => {
    dispatch(getCurrentTaskListFilterOptions());
  }, [dispatch]);

  const refreshAccessToken = useCallback(user => {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

    if (sessionStorage.refreshAccessTokenTimeoutId) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      UserAuthApi.refreshAccessToken(user.username);
      refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  }, []);

  const navigateToTab = useCallback(
    tab => {
      history.push(
        `/core/tasks/${taskListIdentifierParam}${
          tab === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
        }`,
      );
    },
    [history, taskListIdentifierParam],
  );

  const quickAddTask = useCallback(
    task => {
      if (task?.description) {
        const payload = {
          ...task,
          autoOpenDrawer: taskCounters?.incomplete === 0,
        };

        listDetailsSagaActions.createTask(payload);
      }
    },
    [listDetailsSagaActions, taskCounters],
  );

  const refreshTabAfterTaskUpdate = useCallback(
    updatedTask => {
      if (
        !checkIfTaskMatchesFilters(updatedTask, selectedFilters) ||
        sort?.key
      ) {
        refreshTab();
      } else {
        refreshFilters();
      }
    },
    [refreshFilters, refreshTab, selectedFilters, sort],
  );

  const handleTaskDelete = useCallback(() => {
    const { params } = match;
    const { taskListIdentifier } = params;

    listDetailsActions.getListDetailsTaskCounters(taskListIdentifier);
    listDetailsSagaActions.getTasksGroupsList({
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    refreshFilters();
    if (selectedFilters && !isEmpty(selectedFilters)) {
      refreshTab();
    }
  }, [
    listDetailsActions,
    listDetailsSagaActions,
    match,
    refreshFilters,
    refreshTab,
    selectedFilters,
  ]);

  const changeSearchValue = useCallback(
    searchQuery =>
      dispatch(ListDetailsActions.searchCurrentListTasks(searchQuery)),
    [dispatch],
  );

  const resetSort = useCallback(() => {
    listDetailsActions.sortListDetailsTasks(null, null);
  }, [listDetailsActions]);

  const invokeToggleCompleteAction = useCallback(
    task => {
      const { params } = match;
      const { taskListIdentifier } = params;

      actions
        .toggleCompleteTask(task, currentUser)
        .then(() => {
          setTimeout(() => {
            listDetailsActions.getListDetailsTaskCounters(taskListIdentifier);
            listDetailsSagaActions.getTasksGroupsList({
              taskListIdentifier,
              shouldSetRequestState: false,
            });
          }, TASK_DISAPPEAR_DELAY);
        })
        .catch(() => refreshTab());
    },
    [
      actions,
      currentUser,
      listDetailsActions,
      listDetailsSagaActions,
      match,
      refreshTab,
    ],
  );

  const handleTaskUpdate = useCallback(
    (taskIdentifier, dataToUpdate) => {
      actions
        .partialUpdateTask(taskIdentifier, dataToUpdate)
        .then(refreshTabAfterTaskUpdate)
        .catch(() => refreshTab());
    },
    [actions, refreshTab, refreshTabAfterTaskUpdate],
  );

  const handleUpdateWorkflowStatus = useCallback(
    (task, workflowStatus) => {
      actions
        .updateWorkflowStatus(task, workflowStatus)
        .then(refreshTabAfterTaskUpdate)
        .catch(() => refreshTab());
    },
    [actions, refreshTab, refreshTabAfterTaskUpdate],
  );

  const handleCreateGroup = useCallback(
    groupName => {
      listDetailsSagaActions.createTaskGroupList({ groupName });
    },
    [listDetailsSagaActions],
  );

  const loadTasksForTaskGroup = useCallback(
    ({ taskGroupIdentifier, startPosition, viewMode, refresh }) => {
      const payload = {
        taskGroupIdentifier,
        status: 'INCOMPLETE',
        startPosition,
        sort,
        viewMode,
        refresh,
      };
      listDetailsSagaActions.getTasksForTaskGroups(payload);
    },
    [listDetailsSagaActions, sort],
  );

  const loadMoreTasksForList = useCallback(
    ({ status, startPosition, viewMode }) => {
      const { params } = match;
      const { taskListIdentifier } = params;

      actions.getListTasksGroupedByTaskGroup(
        taskListIdentifier,
        sort,
        status,
        startPosition,
        0,
        true,
        viewMode,
      );
    },
    [actions, match, sort],
  );

  const toggleTaskCompletedStatus = useCallback(
    task => {
      const hasIncompletedSubtasks =
        task.subtasks?.length > 0
          ? task.subtasks.find(subtask => subtask.status === 'INCOMPLETE')
          : task.subTasksCount - task.subTasksCompletedCount > 0;

      if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
        const modalProps = {
          confirm: () => {
            modalActions.closeModal();
            invokeToggleCompleteAction(task);
          },
        };
        modalActions.openModal('CompleteAllTasks', modalProps);
      } else {
        invokeToggleCompleteAction(task);
      }
    },
    [invokeToggleCompleteAction, modalActions],
  );

  useEffect(() => {
    refreshAccessToken(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      taskCounters?.complete === 0 &&
      match.params.taskListIdentifier ===
        prevMatch?.params?.taskListIdentifier &&
      match.params.tabName === TaskListTabName.COMPLETE
    ) {
      navigateToTab(TaskListTabName.OPEN);
    }

    if (
      prevTaskCounters !== taskCounters &&
      taskCounters?.incomplete !== undefined
    ) {
      if (taskCounters?.incomplete === 0 && !tourConditionChecked) {
        // eslint-disable-next-line react/no-will-update-set-state
        setTourConditionChecked(true);
      }

      if (taskCounters?.incomplete > 0 && !tourConditionChecked) {
        openTourModal();
      }
    }
  }, [
    archivedTaskLists,
    currentUser,
    match.params.tabName,
    match.params.taskListIdentifier,
    navigateToTab,
    openTourModal,
    pendingTaskLists,
    prevCurrentUser,
    prevMatch,
    prevTaskCounters,
    taskCounters,
    tourConditionChecked,
  ]);

  const selectedTab = tabName || TaskListTabName.OPEN;

  const openedTasks = useMemo(
    () =>
      selectedTab === TaskListTabName.OPEN
        ? Object.values(groupedTasks)?.flatMap(({ tasks }) => tasks) || []
        : [],
    [groupedTasks, selectedTab],
  );

  const completedTasks = useMemo(
    () =>
      selectedTab === TaskListTabName.COMPLETE
        ? completedGroupedTasks?.tasks || []
        : [],
    [completedGroupedTasks, selectedTab],
  );

  const bulkEditTasks = useMemo(
    () => (selectedTab === TaskListTabName.OPEN ? openedTasks : completedTasks),
    [completedTasks, openedTasks, selectedTab],
  );

  const bulkEditIsDisabled = useMemo(
    () => selectedTab === TaskListTabName.COMPLETE,
    [selectedTab],
  );

  useEffect(() => {
    const callback = data => {
      if (
        data.task?.taskList &&
        data.task?.taskList.taskListIdentifier === taskListIdentifierParam
      ) {
        if (
          (data.eventType?.startsWith('CREATE_TASK') ||
            data.eventType?.startsWith('DUPLICATE_TASK')) &&
          data.task?.creator.userIdentifier !== currentUserIdentifier
        ) {
          refreshTab();
        } else if (data.task.taskIdentifier) {
          actions.refreshTask(data.task.identifier);
        }
      }
    };

    if (channel && taskListIdentifierParam) {
      channel.bind('task-update', callback);
    }

    return () => {
      if (channel && taskListIdentifierParam) {
        channel.unbind('task-update', callback);
      }
    };
  }, [
    channel,
    refreshTab,
    taskListIdentifierParam,
    currentUserIdentifier,
    actions,
  ]);

  useEffect(() => {
    if (currentUserIdentifier) {
      const channelName = `private-dock-user-channel-${currentUserIdentifier}`;
      const ch = pusher.current.subscribe(channelName);
      setChannel(ch);

      return () => {
        if (ch) ch.unsubscribe(channelName);
      };
    }

    return () => {};
  }, [currentUserIdentifier]);

  const VIEW_LIST_OPTIONS_CONFIG = {
    SHOW_WORKFLOW_DETAILS: false,
    SHOW_WORKFLOW_COMPLETED_TASKS: false,
  };

  const displayListPreferences = useMemo(() => {
    const { displayOptions = [] } =
      taskList?.listUsers?.find(
        user => user.identifier === currentUserIdentifier,
      ) || {};

    return displayOptions.reduce(
      (accumulator, value) => ({ ...accumulator, [value]: true }),
      VIEW_LIST_OPTIONS_CONFIG,
    );
  }, [VIEW_LIST_OPTIONS_CONFIG, currentUserIdentifier, taskList]);

  const setDisplayColumnPreferences = useCallback(
    (newConfig, options) => {
      if (options?.isCustomColumn) {
        dispatch(
          updateOrganizationCustomFields(
            newConfig.filter(f => f.isChecked).map(f => f.identifier),
          ),
        );
      } else {
        const parsedConfig = Object.entries(newConfig).reduce(
          (accumulator, [key, value]) =>
            value ? [...accumulator, key] : accumulator,
          [],
        );
        dispatch(
          updateColumnOnListPreferences(
            parsedConfig,
            taskList.taskListIdentifier,
            currentUserIdentifier,
          ),
        );
      }
    },
    [currentUserIdentifier, dispatch, taskList],
  );

  const CONFIGURABLE_COLUMNS_CONFIG = {
    [TaskItemColumn.WORKFLOW_STATUS]: false,
    [TaskItemColumn.ASSIGNED]: false,
    [TaskItemColumn.ACTIVITY]: false,
    [TaskItemColumn.DUE_DATE]: false,
    [TaskItemColumn.PATIENT]: false,
  };

  useEffect(() => {
    const { displayColumns = [] } =
      taskList?.listUsers?.find(
        user => user.identifier === currentUserIdentifier,
      ) || {};

    const transformedColumnsPreference = displayColumns.reduce(
      (accumulator, value) => ({ ...accumulator, [value]: true }),
      { ...columnsConfig, ...CONFIGURABLE_COLUMNS_CONFIG },
    );
    setColumnsConfig(transformedColumnsPreference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserIdentifier, setColumnsConfig, taskList]);

  const setDisplayListPreferences = useCallback(
    columnKey => {
      const newConfig = {
        ...displayListPreferences,
        [columnKey]: !displayListPreferences[columnKey],
      };
      const parsedConfig = Object.entries(newConfig).reduce(
        (accumulator, [key, value]) =>
          value ? [...accumulator, key] : accumulator,
        [],
      );
      dispatch(
        updateUserListViewSetup(
          taskListIdentifierParam,
          parsedConfig,
          currentUserIdentifier,
        ),
      );
    },
    [
      displayListPreferences,
      dispatch,
      taskListIdentifierParam,
      currentUserIdentifier,
    ],
  );

  return {
    taskList,
    bulkEditIsDisabled,
    bulkEditTasks,
    changeSearchValue,
    completedTasks,
    handleCreateGroup,
    handleTaskDelete,
    handleTaskUpdate,
    handleUpdateWorkflowStatus,
    isCompletedTasksFetching,
    isFetching,
    isTourOpen,
    listDetailsActions,
    loadMoreTasksForList,
    loadTasksForTaskGroup,
    members,
    openedTasks,
    quickAddTask,
    refreshTab,
    refreshTabAfterTaskUpdate,
    resetSort,
    searchValue,
    selectedFilters,
    selectedTab,
    sort,
    taskCounters,
    taskListIdentifier: taskListIdentifierParam,
    toggleTaskCompletedStatus,
    displayListPreferences,
    setDisplayListPreferences,
    setDisplayColumnPreferences,
    viewType,
    refreshFilters,
  };
};

export default initializeListDetailsViewHooks;
