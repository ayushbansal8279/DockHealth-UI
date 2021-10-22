/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isNil, move } from 'ramda';
import { initializePusher } from 'helpers/pusher-instance';
import useActions from 'hooks/use-actions';
import usePrevious from 'hooks/use-previous';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import localStorageHelper from 'helpers/local-storage-helper';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import {
  initializeTaskListState,
  updateUserListViewSetup,
  updateColumnOnListPreferences,
} from 'actions/task-list-actions';
import {
  TaskStatus,
  TaskItemColumn,
  TASK_ITEM_BASE_COLUMN_CONFIG,
} from 'helpers/task-helpers';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';

import {
  currentTaskListSelector,
  pendingTaskListsSelector,
  taskListMembersSelector,
  archivedTaskListsSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import {
  completedTasksIsFetchingSelector,
  tasksIsFetchingSelector,
  groupCompletedTasksSelector,
  groupTasksSelector,
  taskDetailsSortSelector,
  taskCountersSelector,
} from 'selectors/list-details-selectors';

import * as TemplateActions from 'actions/template-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as TaskActions from 'actions/task-actions';
import * as ListDetailsActions from 'actions/list-details-actions';
import { ListDetailsSagaActions } from 'sagas/list-details-saga';
import * as ModalActions from 'modal/actions';
import * as UserAuthApi from 'api/user-auth-api';

import ListSelectHeader from 'components/task-view/ListSelectHeader/ListSelectHeader';

const LIST_DETAILS_FIRST_TIME_KEY = 'LIST_DETAILS_FIRST_TIME_KEY';

const initializeListDetailsViewHooks = (match, history) => {
  const sort = useSelector(taskDetailsSortSelector);
  const taskList = useSelector(currentTaskListSelector);
  const { listName, listDescription } = taskList || {};

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
  const templateActions = useActions(TemplateActions);
  const modalActions = useActions(ModalActions);
  const megaFilterActions = useActions(MegaFilterActions);
  const listDetailsActions = useActions(ListDetailsActions);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourConditionChecked, setTourConditionChecked] = useState(false);
  const [searchValue, setSearchValue] = useState(null);

  const prevCurrentUser = usePrevious(currentUser);
  const prevTaskCounters = usePrevious(taskCounters);
  const prevMatch = usePrevious(match);

  const pusher = useRef(initializePusher());
  const [channel, setChannel] = useState(null);

  const dispatch = useDispatch();

  const {
    params: { taskListIdentifier: taskListIdentifierParam },
  } = match;

  useEffect(() => {
    dispatch(initializeTaskListState(taskListIdentifierParam));
  }, [dispatch, taskListIdentifierParam]);

  useEffect(() => {
    if (listName) {
      const headerComponent = (
        <ListSelectHeader
          listName={listName}
          listDescription={listDescription}
        />
      );

      templateActions.setHeader({
        layout: [
          {
            key: 'header',
            component: headerComponent,
            xs: 12,
          },
        ],
      });
    }
  }, [listName, listDescription, templateActions]);

  const searchTasks = useCallback(
    searchQuery => {
      const tabName = match?.params?.tabName;

      const taskStatus =
        tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

      listDetailsSagaActions.fetchTasksBySearchedTerm({
        status: taskStatus,
        searchedTerm: searchQuery,
      });
    },
    [listDetailsSagaActions, match],
  );

  const refreshTab = useCallback(
    (withLoader = false) => {
      const { params } = match || {};
      const { taskListIdentifier, tabName } = params || {};

      const status =
        tabName === TaskListTabName.COMPLETE
          ? TaskStatus.COMPLETE
          : TaskStatus.INCOMPLETE;

      megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);
      listDetailsActions.getListDetailsTaskCounters(params.taskListIdentifier);
      listDetailsActions.refreshListDetailsGroupedTasks(withLoader);
    },
    [listDetailsActions, match, megaFilterActions],
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
    const { params } = match;
    const { taskListIdentifier, tabName } = params;

    const status =
      tabName === TaskListTabName.COMPLETE
        ? TaskStatus.COMPLETE
        : TaskStatus.INCOMPLETE;

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);
  }, [match, megaFilterActions]);

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
    tabName => {
      const { params } = match;
      const { taskListIdentifier } = params;

      history.push(
        `/core/tasks/${taskListIdentifier}${
          tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
        }`,
      );
    },
    [history, match],
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

  const deleteGroup = useCallback(
    groupId => {
      const { params } = match;
      const { taskListIdentifier } = params;

      const modalProps = {
        title: 'Delete group',
        description:
          'Are you sure you want to delete this group? If you delete this group and there are tasks within the group, the tasks will not be deleted',
        confirm: () => {
          modalActions.closeModal();
          listDetailsSagaActions.deleteTasksGroup({
            groupId,
            taskListIdentifier,
          });
        },
      };
      modalActions.openModal('DeleteConfirmation', modalProps);
    },
    [listDetailsSagaActions, match, modalActions],
  );

  const editGroupName = useCallback(
    (newGroupName, groupId) => {
      const { params } = match;
      const { taskListIdentifier } = params;

      if (newGroupName) {
        listDetailsSagaActions.editTasksGroupName({
          taskListIdentifier,
          groupId,
          newGroupName,
        });
      }
    },
    [listDetailsSagaActions, match],
  );

  const changeGroupsOrder = useCallback(
    (oldTaskIndex, newTaskIndex, groupList) => {
      const { params } = match;
      const { taskListIdentifier } = params;

      if (newTaskIndex < 0 || newTaskIndex >= groupList.length) {
        return;
      }
      const groupIdsList = groupList.map(group => group.taskGroupIdentifier);
      const newGroupList = move(oldTaskIndex, newTaskIndex, groupIdsList);
      listDetailsSagaActions.sortTasksGroups({
        taskGroupIdentifiers: newGroupList,
        taskListIdentifier,
      });
    },
    [listDetailsSagaActions, match],
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
    searchQuery => {
      setSearchValue(searchQuery);

      if (searchQuery) {
        searchTasks(searchQuery);
      } else {
        refreshTab(true);
      }
    },
    [refreshTab, searchTasks],
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

  const handleUpdateDueDate = useCallback(
    (task, dueDate) => {
      actions
        .updateDueDate(task, dueDate, true)
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

  const launchNewFeaturesModal = useCallback(() => {
    const isNewUser = currentUser?.usageState?.loginCount <= 5;

    if (currentUser && !isEmpty(currentUser) && !isNewUser) {
      const { userPreference: { appFeaturesReviewed } = {} } = currentUser;

      if (!appFeaturesReviewed?.includes('MULTI_MENTION_ASSIGN')) {
        modalActions.openModal('MultiMentionAssignTour', {
          onClose: () => {
            dispatch(
              updateCurrentUserPreferences({
                appFeaturesReviewed: ['MULTI_MENTION_ASSIGN'],
              }),
            );
          },
        });
      }
    }
  }, [currentUser, dispatch, modalActions]);

  useEffect(() => {
    refreshAccessToken(currentUser);
    launchNewFeaturesModal();
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

  const { params } = match;
  const { taskListIdentifier, tabName } = params;

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
        data.task?.taskList.taskListIdentifier === taskListIdentifier
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

    if (channel && taskListIdentifier) {
      channel.bind('task-update', callback);
    }

    return () => {
      if (channel && taskListIdentifier) {
        channel.unbind('task-update', callback);
      }
    };
  }, [channel, refreshTab, taskListIdentifier, currentUserIdentifier, actions]);

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

  const DASHBOARD_CONFIGURABLE_COLUMNS_CONFIG = {
    [TaskItemColumn.WORKFLOW_STATUS]: false,
    [TaskItemColumn.ASSIGNED]: false,
    [TaskItemColumn.ACTIVITY]: false,
    [TaskItemColumn.DUE_DATE]: false,
    [TaskItemColumn.PATIENT]: false,
  };

  const VIEW_LIST_OPTIONS_CONFIG = {
    SHOW_WORKFLOW_DETAILS: false,
    SHOW_WORKFLOW_COMPLETED_TASKS: false,
  };

  const displayColumnPreferences = useMemo(() => {
    const { displayColumns = [] } =
      taskList?.listUsers?.find(
        user => user.identifier === currentUserIdentifier,
      ) || {};

    return displayColumns.reduce(
      (accumulator, value) => ({ ...accumulator, [value]: true }),
      DASHBOARD_CONFIGURABLE_COLUMNS_CONFIG,
    );
  }, [DASHBOARD_CONFIGURABLE_COLUMNS_CONFIG, currentUserIdentifier, taskList]);

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
    columnKey => {
      const newConfig = {
        ...displayColumnPreferences,
        [columnKey]: !displayColumnPreferences[columnKey],
      };
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
    },
    [currentUserIdentifier, dispatch, displayColumnPreferences, taskList],
  );

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
          taskListIdentifier,
          parsedConfig,
          currentUserIdentifier,
        ),
      );
    },
    [
      displayListPreferences,
      dispatch,
      taskListIdentifier,
      currentUserIdentifier,
    ],
  );

  const DASHBOARD_BASE_COLUMNS_CONFIG = {
    ...TASK_ITEM_BASE_COLUMN_CONFIG,
    [TaskItemColumn.LIST_NAME]: true,
  };

  const mergedColumnsConfig = useMemo(
    () => ({ ...DASHBOARD_BASE_COLUMNS_CONFIG, ...displayColumnPreferences }),
    [DASHBOARD_BASE_COLUMNS_CONFIG, displayColumnPreferences],
  );

  return {
    taskList,
    bulkEditIsDisabled,
    bulkEditTasks,
    changeGroupsOrder,
    changeSearchValue,
    completedTasks,
    deleteGroup,
    editGroupName,
    handleCreateGroup,
    handleTaskDelete,
    handleTaskUpdate,
    handleUpdateDueDate,
    handleUpdateWorkflowStatus,
    isCompletedTasksFetching,
    isFetching,
    isTourOpen,
    listDetailsActions,
    loadMoreTasksForList,
    loadTasksForTaskGroup,
    members,
    navigateToTab,
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
    taskListIdentifier,
    toggleTaskCompletedStatus,
    displayListPreferences,
    displayColumnPreferences,
    setDisplayColumnPreferences,
    setDisplayListPreferences,
    mergedColumnsConfig,
  };
};

export default initializeListDetailsViewHooks;
