/* eslint-disable react/no-did-update-set-state */
/* eslint-disable sonarjs/cognitive-complexity */
import { isEmpty, isNil } from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'lodash.debounce';

import ListSelectHeader from 'components/task-view/ListSelectHeader/ListSelectHeader';
import { TaskListTabName } from 'components/task-view/Toolbar/config';
// import Tour from 'components/tour-wizard/Tour/Tour';
import NewTaskDrawer from 'components/task-drawer/NewTaskDrawer';
import Toolbar from 'components/task-view/Toolbar/NewToolbarContainer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';

import { setHeader } from 'actions/header-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as InvitationActions from 'actions/invitation-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as ModalActions from 'modal/actions';

import { ListDetailsSagaActions } from 'sagas/list-details-saga';

import * as userApi from 'api/user-api';

import { noop } from 'helpers/utility-functions';
import sessionStorageHelper from 'helpers/session-storage-helper';
import { arrayMove } from 'helpers/sorting-helper';
import localStorageHelper from 'helpers/local-storage-helper';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { initializePusher } from 'helpers/pusher-instance';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';

import {
  taskListSelector,
  taskListMembersSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  selectedFiltersInMegaFilterSelector,
  availableFiltersInInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';
import {
  completedTasksIsFetchingSelector,
  tasksIsFetchingSelector,
  groupCompletedTasksSelector,
  groupTasksSelector,
  taskDetailsSortSelector,
} from 'selectors/list-details-selectors';

import InboxHelpPanel from './InboxHelpPanel/InboxHelpPanel';
import {
  // ListTourWrapper,
  // ListTourBackground,
  TaskViewContainer,
} from './styled';

import OpenedTasksView from './ListDetailsOpenedTasksContainer/ListDetailsOpenedTasksContainer';
import CompletedTasksView from './ListDetailsCompletedTasksContainer/ListDetailsCompletedTasksContainer';
// import { LIST_TOUR_STEPS } from './list-tour-steps';

const LIST_DETAILS_FIRST_TIME_KEY = 'LIST_DETAILS_FIRST_TIME_KEY';

class Home extends Component {
  state = {
    isTourOpen: false,
    tourConditionChecked: false,
    searchValue: '',
    shouldResetBulkEditTasks: false,
  };

  searchWithDebounce = debounce(searchValue => {
    const {
      listDetailsSagaActions: { fetchTasksBySearchedTerm },
    } = this.props;

    const tabName = this.props?.params?.tabName;

    const taskStatus =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    return fetchTasksBySearchedTerm({
      status: taskStatus,
      searchedTerm: searchValue,
    });
  }, 400);

  async componentDidMount() {
    const { match, currentUser, taskLists, pendingTaskLists = [] } = this.props;
    const { params } = match;

    this.initTable();

    this.setViewHeader(params.taskListIdentifier, [
      ...taskLists,
      ...pendingTaskLists,
    ]);

    this.refreshAccessToken(currentUser);

    this.listenForRealTimeEvents(params.taskListIdentifier, currentUser);

    this.launchNewFeaturesModal();
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { actions, match, taskLists, currentUser, taskCounters } = this.props;
    const { params } = match;

    if (
      nextProps.taskCounters?.complete === 0 &&
      nextProps.match.params.taskListIdentifier === params.taskListIdentifier &&
      nextProps.match.params.tabName === TaskListTabName.COMPLETE
    ) {
      this.navigateToTab(TaskListTabName.OPEN);
    }

    if (
      taskLists !== nextProps.taskLists ||
      nextProps.match.params.taskListIdentifier !== params.taskListIdentifier
    ) {
      this.setViewHeader(nextProps.match.params.taskListIdentifier, [
        ...nextProps?.taskLists,
        ...nextProps?.pendingTaskLists,
      ]);
    }

    if (
      taskCounters !== nextProps.taskCounters &&
      nextProps.taskCounters?.incomplete !== undefined
    ) {
      const { tourConditionChecked } = this.state;

      if (nextProps.taskCounters?.incomplete === 0 && !tourConditionChecked) {
        // eslint-disable-next-line react/no-will-update-set-state
        this.setState({ tourConditionChecked: true });
      }

      if (nextProps.taskCounters?.incomplete > 0 && !tourConditionChecked) {
        this.openTourModal();
      }
    }

    if (
      nextProps.match.params.taskListIdentifier === params.taskListIdentifier &&
      nextProps.match.params.tabName !== params.tabName
    ) {
      actions.getTaskStatsForList(params.taskListIdentifier);
      if (nextProps.match.params.tabName === TaskListTabName.COMPLETE) {
        this.refreshCompleteTasks();
      } else {
        this.refreshIncompleteTasks();
      }
    }

    if (
      nextProps.match.params.taskListIdentifier !== params.taskListIdentifier
    ) {
      const { taskListActions, megaFilterActions } = this.props;

      actions.loading();
      megaFilterActions.clearFiltersForMegaFilter();
      actions.resetTaskCounters();
      actions.getTaskStatsForList(nextProps.match.params.taskListIdentifier);

      if (nextProps.match.params.taskListIdentifier != null) {
        taskListActions.getTaskListById(
          nextProps.match.params.taskListIdentifier,
        );

        const status =
          nextProps.match.params.tabName === TaskListTabName.COMPLETE
            ? 'COMPLETE'
            : 'INCOMPLETE';
        const filters = sessionStorageHelper.getItem(
          `filter-${nextProps.match.params.taskListIdentifier}-${status}`,
        );

        if (!filters) {
          this.getTasksList(nextProps.match.params.taskListIdentifier, status);
        } else {
          this.getFilteredTasks(
            nextProps.match.params.taskListIdentifier,
            filters,
            status,
          );
        }

        // Start with no selected tasks
        actions.storeAsCurrentTask(null);
      }
    }

    if (
      (currentUser &&
        nextProps &&
        nextProps.currentUser &&
        currentUser.userIdentifier !== nextProps.currentUser.userIdentifier) ||
      nextProps.match.params.taskListIdentifier !== params.taskListIdentifier
    ) {
      this.listenForRealTimeEvents(
        nextProps.match.params.taskListIdentifier,
        nextProps.currentUser,
      );
    }
  }

  componentDidUpdate(previousProps, previousState) {
    const { searchValue, shouldResetBulkEditTasks } = this.state;
    const { selectedFilters, sort, match, taskListActions } = this.props;
    const { params } = match;

    if (
      (previousProps.sort?.key !== sort?.key ||
        previousProps.sort?.order !== sort?.order) &&
      previousProps.match.params.taskListIdentifier ===
        params.taskListIdentifier
    ) {
      taskListActions.requestAllTasklistGroupTasks();
      this.refreshTab();
    }

    if (!shouldResetBulkEditTasks) {
      if (previousState?.searchValue !== searchValue) {
        this.setState({ shouldResetBulkEditTasks: true });
      }

      if (
        Object.keys(previousProps?.selectedFilters || []).length !==
        Object.keys(selectedFilters || []).length
      ) {
        this.setState({ shouldResetBulkEditTasks: true });
      }
    }

    if (shouldResetBulkEditTasks) {
      if (searchValue === previousState?.searchValue) {
        this.setState({ shouldResetBulkEditTasks: false });
      }

      if (
        Object.keys(previousProps?.selectedFilters || []).length === 0 &&
        Object.keys(selectedFilters || []).length !== 0
      ) {
        this.setState({ shouldResetBulkEditTasks: false });
      }
    }
  }

  componentWillUnmount() {
    const { actions, taskListActions } = this.props;

    taskListActions.sortListTasks(null, null);

    actions.resetTaskCounters();
  }

  listenForRealTimeEvents = (taskListIdentifier, currentUser) => {
    if (!currentUser || !currentUser.userIdentifier) {
      return;
    }

    const { actions } = this.props;
    const currentUserIdentifier = currentUser.userIdentifier;
    const channelName = `private-dock-user-channel-${currentUserIdentifier}`;

    const pusher = initializePusher();
    let channel = pusher?.channel(channelName);
    if (!channel || !channel.subscribed) {
      channel = pusher?.subscribe(channelName);
    }
    // channel.bind('pusher:subscription_succeeded', function() {
    //   console.log('subscription_succeeded');
    // });
    // channel.bind('pusher:subscription_error', function(status) {
    //   console.log('subscription_error', status);
    // });
    // console.log(channel);
    // Listen to the channel for new entries.
    // The server publishes to this channel whenever a entry is updated
    if (channel) {
      channel.bind('task-update', data => {
        // Since the app is going to be realtime, we don't want the same item to
        // be shown twice. Device A publishes an entry, all other devices including itself
        // receives the entry, so act like a basic filter
        // console.log(data);
        const currentTaskListIdentifier = taskListIdentifier;
        if (
          data.task?.taskList &&
          data.task?.taskList.taskListIdentifier === currentTaskListIdentifier
        ) {
          if (
            (data.eventType?.startsWith('CREATE_TASK') ||
              data.eventType?.startsWith('DUPLICATE_TASK')) &&
            data.task?.taskList &&
            data.task?.creator.userIdentifier !== currentUserIdentifier
          ) {
            const status = 'INCOMPLETE';
            const filters = sessionStorageHelper.getItem(
              `filter-${data.task.taskList.taskListIdentifier}-${status}`,
            );

            if (!filters) {
              this.getTasksList(data.task.taskList.taskListIdentifier, status);
            } else {
              this.getFilteredTasks(
                data.task.taskList.taskListIdentifier,
                filters,
                status,
              );
            }
          }
          // eslint-disable-next-line no-unused-expressions
          actions.refreshAnotherTask(data.task);
        }
      });
    }
  };

  setViewHeader = (taskListIdentifier, taskLists) => {
    const { setHeaderAction } = this.props;

    const loadedTasklist =
      taskLists?.length > 0
        ? taskLists.find(t => t.taskListIdentifier === taskListIdentifier)
        : {};

    if (loadedTasklist?.listName) {
      const headerComponent = (
        <ListSelectHeader
          isFetching={false}
          title={loadedTasklist.listName}
          taskList={loadedTasklist}
          resetHeader={this.setViewHeader}
          hasTitle={loadedTasklist.listName}
        />
      );

      setHeaderAction({
        layout: [
          {
            key: 'header',
            component: headerComponent,
            xs: 12,
          },
        ],
      });
    }
  };

  openTourModal = () => {
    const listDatailsFirstTimeValue = localStorageHelper.getItem(
      LIST_DETAILS_FIRST_TIME_KEY,
    );
    if (isNil(listDatailsFirstTimeValue) || listDatailsFirstTimeValue) {
      this.setState({ isTourOpen: true });
    }
  };

  closeTourModal = () => {
    this.setState({ isTourOpen: false });
    localStorageHelper.setItem(LIST_DETAILS_FIRST_TIME_KEY, false);
  };

  initTable = () => {
    const { actions, match } = this.props;
    const { params } = match;
    const { tabName, taskListIdentifier } = params;

    actions.getTaskStatsForList(taskListIdentifier);

    let status = 'INCOMPLETE';

    if (tabName === TaskListTabName.COMPLETE) {
      actions.loadingCompletedTasks();
      status = 'COMPLETE';
    } else {
      actions.loading();
    }

    const filters = sessionStorageHelper.getItem(
      `filter-${taskListIdentifier}-${status}`,
    );

    if (!filters) {
      return this.getTasksList(taskListIdentifier, status);
    }
    return this.getFilteredTasks(taskListIdentifier, filters, status);
  };

  refreshTab = (withLoader = false) => {
    const { listDetailsSagaActions, actions, match } = this.props;
    const { params } = match;

    actions.getTaskStatsForList(params.taskListIdentifier);
    listDetailsSagaActions.fetchGroupedTasks({ withLoader });
  };

  refreshFilters = () => {
    const { match, megaFilterActions } = this.props;
    const { params } = match;
    const { taskListIdentifier, tabName } = params;

    const status =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);
  };

  // TODO: Move to saga
  refreshIncompleteTasks = (withLoader = true) => {
    const { actions, megaFilterActions, match } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    const status = 'INCOMPLETE';

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);

    const filters = sessionStorageHelper.getItem(
      `filter-${taskListIdentifier}-${status}`,
    );

    if (withLoader) {
      actions.loading();
    }

    if (filters && !isEmpty(filters)) {
      return this.getFilteredTasks(
        taskListIdentifier,
        filters,
        status,
        withLoader,
      );
    }

    return this.getTasksList(taskListIdentifier, status);
  };

  // TODO: Move to saga
  refreshCompleteTasks = (withLoader = true) => {
    const { actions, megaFilterActions, match } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    if (withLoader) {
      actions.loadingCompletedTasks();
    }

    const status = 'COMPLETE';

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);

    const filters = sessionStorageHelper.getItem(
      `filter-${taskListIdentifier}-${status}`,
    );

    if (filters && !isEmpty(filters)) {
      this.getFilteredTasks(taskListIdentifier, filters, status, withLoader);
    } else {
      this.getTasksList(taskListIdentifier, status);
    }
  };

  getTasksList = (
    taskListIdentifier,
    status,
    startPosition = 0,
    endPosition = 0,
  ) => {
    const { actions, sort } = this.props;

    return actions.getListTasksGroupedByTaskGroup(
      taskListIdentifier,
      sort,
      status,
      startPosition,
      endPosition,
    );
  };

  // TODO: Move to saga
  getFilteredTasks = (taskListIdentifier, filters, taskStatus, withLoader) => {
    const { actions, sort } = this.props;

    return actions.getFilteredTasksForList(
      taskListIdentifier,
      taskStatus,
      sort,
      filters,
      withLoader,
    );
  };

  // TODO: Move to saga
  handleFilterChange = updatedFilters => {
    const { match, megaFilterActions, actions } = this.props;
    const { params } = match;
    const { tabName, taskListIdentifier } = params;

    let taskStatus = 'INCOMPLETE';

    if (tabName === TaskListTabName.COMPLETE) {
      actions.loadingCompletedTasks();
      taskStatus = 'COMPLETE';
    } else {
      actions.loading();
    }

    megaFilterActions.selectFiltersForMegaFilter(
      updatedFilters,
      taskListIdentifier,
      taskStatus,
    );

    if (isEmpty(updatedFilters)) {
      this.refreshFilters();
      return this.getTasksList(taskListIdentifier, taskStatus);
    }

    return this.getFilteredTasks(
      taskListIdentifier,
      updatedFilters,
      taskStatus,
    );
  };

  downloadPDF = () => {
    const { match } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    if (taskListIdentifier) {
      window.print();
    }
  };

  handleRetry = (error, callback) => {
    if (error.message === 'Network Error') {
      userApi
        .refreshAccessToken(sessionStorage.getItem('username'))
        .then(callback)
        .catch(noop);
    }
  };

  refreshAccessToken = user => {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

    if (sessionStorage.refreshAccessTokenTimeoutId) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      userApi.refreshAccessToken(user.username);
      this.refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  };

  navigateToTab = tabName => {
    const { match, history } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    this.setState({ shouldResetBulkEditTasks: true });

    history.push(
      `/core/tasks/${taskListIdentifier}${
        tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

  quickAddTask = task => {
    const { listDetailsSagaActions, taskCounters } = this.props;

    if (task?.description) {
      const payload = {
        ...task,
        autoOpenDrawer: taskCounters?.incomplete === 0,
      };

      listDetailsSagaActions.createTask(payload);
    }
  };

  deleteGroup = groupId => {
    const {
      modalActions,
      listDetailsSagaActions: { deleteTasksGroup },
      match,
    } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    const modalProps = {
      confirm: () => {
        modalActions.closeModal();
        deleteTasksGroup({ groupId, taskListIdentifier });
      },
    };
    modalActions.openModal('DeleteGroup', modalProps);
  };

  editGroupName = (newGroupName, groupId) => {
    const {
      listDetailsSagaActions: { editTasksGroupName },
      match,
    } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    if (newGroupName) {
      editTasksGroupName({ taskListIdentifier, groupId, newGroupName });
    }
  };

  changeGroupsOrder = (oldTaskIndex, newTaskIndex, groupList) => {
    const {
      listDetailsSagaActions: { sortTasksGroups },
      match,
    } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    if (newTaskIndex < 0 || newTaskIndex >= groupList.length) {
      return;
    }
    const groupIdsList = groupList.map(group => group.taskGroupIdentifier);
    const newGroupList = arrayMove(groupIdsList, oldTaskIndex, newTaskIndex);
    sortTasksGroups({ taskGroupIdentifiers: newGroupList, taskListIdentifier });
  };

  handleTaskUpdate = updatedTask => {
    const { selectedFilters, sort } = this.props;

    if (!checkIfTaskMatchesFilters(updatedTask, selectedFilters) || sort?.key) {
      this.refreshTab();
    } else {
      this.refreshFilters();
    }
  };

  handleTaskDelete = () => {
    const {
      selectedFilters,
      listDetailsSagaActions: { getTasksGroupsList },
      match,
    } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    getTasksGroupsList({ taskListIdentifier, shouldSetRequestState: false });
    this.refreshFilters();
    if (selectedFilters && !isEmpty(selectedFilters)) {
      this.refreshTab();
    }
  };

  setSearchValue = searchValue => {
    this.setState({
      searchValue,
    });

    if (searchValue) {
      this.searchWithDebounce(searchValue);
    } else {
      this.refreshTab(true);
    }
  };

  sortListTasks = (key, order) => {
    const { taskListActions } = this.props;

    taskListActions.sortListTasks(order ? key : null, order);
  };

  invokeToggleCompleteAction = task => {
    const { actions, listDetailsSagaActions, match, currentUser } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    actions
      .toggleCompleteTask(task, currentUser)
      .then(() => {
        setTimeout(() => {
          actions.getTaskStatsForList(taskListIdentifier);
          listDetailsSagaActions.getTasksGroupsList({
            shouldSetRequestState: false,
          });
        }, TASK_DISAPPEAR_DELAY);
      })
      .catch(() => this.refreshTab());
  };

  toggleTaskCompletedStatus = task => {
    const { modalActions } = this.props;

    const hasIncompletedSubtasks = task.subtasks.find(
      subtask => subtask.status === 'INCOMPLETE',
    );
    if (
      task.status === 'INCOMPLETE' &&
      (hasIncompletedSubtasks ||
        task.subTasksCount - task.subTasksCompletedCount > 0)
    ) {
      const modalProps = {
        confirm: () => {
          modalActions.closeModal();
          this.invokeToggleCompleteAction(task);
        },
      };
      modalActions.openModal('CompleteAllTasks', modalProps);
    } else {
      this.invokeToggleCompleteAction(task);
    }
  };

  handleReassignTask = (task, assignee) => {
    const { actions } = this.props;
    actions
      .assignOrReassignTask(task, assignee?.userIdentifier)
      .then(this.handleTaskUpdate)
      .catch(() => this.refreshTab());
  };

  handleUpdateDueDate = (task, dueDate) => {
    const { actions } = this.props;

    actions
      .updateDueDate(task, dueDate, true)
      .then(this.handleTaskUpdate)
      .catch(() => this.refreshTab());
  };

  handleUpdateWorkflowStatus = (task, workflowStatus) => {
    const { actions } = this.props;

    actions
      .updateWorkflowStatus(task, workflowStatus)
      .then(this.handleTaskUpdate)
      .catch(() => this.refreshTab());
  };

  handleCreateGroup = groupName => {
    const { listDetailsSagaActions } = this.props;

    listDetailsSagaActions.createTaskGroupList({ groupName });
  };

  loadTasksForTaskGroup = ({
    taskGroupIdentifier,
    startPosition,
    sort,
    viewMode,
    refresh,
  }) => {
    const { listDetailsSagaActions } = this.props;
    const payload = {
      taskGroupIdentifier,
      status: 'INCOMPLETE',
      startPosition,
      sort,
      viewMode,
      refresh,
    };
    listDetailsSagaActions.getTasksForTaskGroups(payload);
  };

  loadMoreTasksForList = ({ status, startPosition, sort, viewMode }) => {
    const { actions, match } = this.props;
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
  };

  launchNewFeaturesModal = () => {
    const { currentUser, modalActions } = this.props;
    const isNewUser = currentUser?.usageState?.loginCount <= 5;

    if (currentUser && !isEmpty(currentUser) && !isNewUser) {
      const { userPreference: { appFeaturesReviewed } = {} } = currentUser;

      if (!appFeaturesReviewed?.includes('RIGHT_CLICK')) {
        modalActions.openModal('RightClickTour', {
          onClose: () => {
            userApi.updateUserDashboardPrefs({
              appFeaturesReviewed: ['RIGHT_CLICK'],
            });
          },
        });
      }
    }
  };

  render() {
    const {
      members,
      taskLists,
      match,
      taskCounters,
      modalActions,
      isFetching,
      isCompletedTasksFetching,
      completedGroupedTasks,
      groupedTasks,
      currentUser,
      selectedTask,
      selectedFilters,
      sort,
    } = this.props;

    const { isTourOpen, searchValue, shouldResetBulkEditTasks } = this.state;
    const { params } = match;
    const { taskListIdentifier, tabName } = params;

    const loadedTasklist = taskLists
      ? taskLists.find(t => t.taskListIdentifier === taskListIdentifier)
      : {};

    const selectedTab = tabName || TaskListTabName.OPEN;

    return (
      <>
        <BulkEditSection
          shouldResetBulkEditTasks={shouldResetBulkEditTasks}
          refreshTasksOnBulkAction={this.refreshTab}
          inactiveBulkEdit={selectedTab === TaskListTabName.COMPLETE}
          searchValue={searchValue}
        >
          <div>
            <TaskViewContainer>
              <Toolbar
                members={members}
                onSelectTab={this.navigateToTab}
                selectedTab={selectedTab}
                taskList={loadedTasklist || undefined}
                openTasksAmount={taskCounters.incomplete}
                completedTasksAmount={taskCounters.complete}
                onSearchChange={this.setSearchValue}
                searchValue={searchValue}
                onSelectFilters={this.handleFilterChange}
                pdfTitle={loadedTasklist?.listName}
                tipsContent={
                  loadedTasklist?.listType === 'INBOX' ? InboxHelpPanel : null
                }
                isFetching={isFetching || isCompletedTasksFetching}
                printData={{
                  completedTasks:
                    selectedTab === TaskListTabName.COMPLETE &&
                    completedGroupedTasks
                      ? completedGroupedTasks.tasks
                      : [],
                  openedTasks:
                    selectedTab === TaskListTabName.OPEN && groupedTasks
                      ? Object.values(groupedTasks)?.flatMap(
                          ({ tasks }) => tasks,
                        )
                      : [],
                  taskListMembers: members,
                }}
                tasks={
                  selectedTab === TaskListTabName.OPEN && groupedTasks
                    ? Object.values(groupedTasks)?.flatMap(({ tasks }) => tasks)
                    : []
                }
                completedTasks={
                  selectedTab === TaskListTabName.COMPLETE &&
                  completedGroupedTasks
                    ? completedGroupedTasks.tasks
                    : []
                }
                selectedFilters={selectedFilters}
              />
              {selectedTab === TaskListTabName.COMPLETE ? (
                <CompletedTasksView
                  currentUser={currentUser}
                  toggleCompleteTask={this.toggleTaskCompletedStatus}
                  reassignTask={this.handleReassignTask}
                  updateDueDate={this.handleUpdateDueDate}
                  searchValue={searchValue}
                  selectedTask={selectedTask}
                  listUniqueKey={taskListIdentifier}
                  loadMoreTasksForList={this.loadMoreTasksForList}
                  sort={sort}
                  onSortChange={this.sortListTasks}
                />
              ) : (
                <OpenedTasksView
                  taskListIdentifier={taskListIdentifier}
                  quickAddTask={this.quickAddTask}
                  createTaskGroupList={this.handleCreateGroup}
                  editGroupName={this.editGroupName}
                  currentUser={currentUser}
                  toggleCompleteTask={this.toggleTaskCompletedStatus}
                  deleteGroup={this.deleteGroup}
                  changeGroupsOrder={this.changeGroupsOrder}
                  reassignTask={this.handleReassignTask}
                  updateDueDate={this.handleUpdateDueDate}
                  updateWorkflowStatus={this.handleUpdateWorkflowStatus}
                  searchValue={searchValue}
                  sort={sort}
                  onSortChange={this.sortListTasks}
                  selectedTask={selectedTask}
                  listUniqueKey={taskListIdentifier}
                  taskCounters={taskCounters}
                  loadTasksForTaskGroup={this.loadTasksForTaskGroup}
                />
              )}
            </TaskViewContainer>
            <NewTaskDrawer
              modalActions={modalActions}
              fromFirstAddTask={taskCounters?.incomplete === 0}
              hideTour={isTourOpen}
              onTaskUpdate={this.handleTaskUpdate}
              onTaskDelete={this.handleTaskDelete}
              onTaskCreation={this.handleTaskUpdate}
            />
          </div>
        </BulkEditSection>
        {/* {isTourOpen && (
          <>
            <ListTourWrapper>
              <Tour
                modalName="List tour modal"
                steps={LIST_TOUR_STEPS}
                onClose={this.closeTourModal}
              />
            </ListTourWrapper>
            <ListTourBackground onClick={this.closeTourModal} />
          </>
        )} */}
      </>
    );
  }
}

const mapStateToProps = state => ({
  sort: taskDetailsSortSelector(state),
  taskLists: taskListSelector(state),
  currentUser: userProfileSelector(state),
  selectedFilters: selectedFiltersInMegaFilterSelector(state),
  filters: availableFiltersInInMegaFilterSelector(state),
  members: taskListMembersSelector(state),
  taskCounters: state.listDetails.taskCounters,
  pendingTaskLists: state.invitationState.pendingTasklists,
  isFetching: tasksIsFetchingSelector(state),
  isCompletedTasksFetching: completedTasksIsFetchingSelector(state),
  groupedTasks: groupTasksSelector(state),
  completedGroupedTasks: groupCompletedTasksSelector(state),
  selectedTask: state.taskState.selectedTask,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  listDetailsSagaActions: bindActionCreators(ListDetailsSagaActions, dispatch),
  invitationActions: bindActionCreators(InvitationActions, dispatch),
  setHeaderAction: setHeader(dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  megaFilterActions: bindActionCreators(MegaFilterActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
