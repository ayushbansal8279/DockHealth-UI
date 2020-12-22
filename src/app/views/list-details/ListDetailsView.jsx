/* eslint-disable sonarjs/cognitive-complexity */
import { isEmpty, isNil } from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';
import debounce from 'lodash.debounce';

import Header from 'components/taskView/Header';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import Tour from 'components/tour-wizard/Tour/Tour';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import Toolbar from 'components/taskView/Toolbar/NewToolbarContainer';

import { setHeader } from 'actions/header-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as InvitationActions from 'actions/invitation-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as ModalActions from 'modal/actions';

import { TasksGroupsListActions } from 'sagas/list-details-saga';

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
} from 'selectors/list-details-selectors';

import InboxHelpPanel from './InboxHelpPanel/InboxHelpPanel';
import {
  ListTourWrapper,
  ListTourBackground,
  TaskViewContainer,
} from './styled';

import OpenedTasksView from './ListDetailsOpenedTasksContainer/ListDetailsOpenedTasksContainer';
import CompletedTasksView from './ListDetailsCompletedTasksContainer/ListDetailsCompletedTasksContainer';
import { LIST_TOUR_STEPS } from './list-tour-steps';

const Priority = {
  High: 'HIGH',
  Low: 'LOW',
};

const LIST_DETAILS_FIRST_TIME_KEY = 'LIST_DETAILS_FIRST_TIME_KEY';

class Home extends Component {
  state = { isTourOpen: false, tourConditionChecked: false, searchValue: '' };

  searchWithDebounce = debounce(searchValue => {
    const {
      tasksGroupsListActions: { fetchTasksBySearchedTerm },
      routeParams: { tabName },
    } = this.props;

    const taskStatus =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    return fetchTasksBySearchedTerm({
      status: taskStatus,
      searchedTerm: searchValue,
    });
  }, 400);

  async componentDidMount() {
    const {
      routeParams,
      currentUser,
      taskLists,
      pendingTaskLists = [],
    } = this.props;

    this.initTable();

    this.setViewHeader(routeParams.taskListIdentifier, [
      ...taskLists,
      ...pendingTaskLists,
    ]);

    this.refreshAccessToken(currentUser);

    this.listenForRealTimeEvents(routeParams.taskListIdentifier, currentUser);
  }

  componentWillUpdate(nextProps) {
    const {
      actions,
      routeParams,
      taskLists,
      currentUser,
      taskCounters,
    } = this.props;

    if (
      nextProps.taskCounters?.complete === 0 &&
      nextProps.routeParams.taskListIdentifier ===
        routeParams.taskListIdentifier &&
      nextProps.routeParams.tabName === TaskListTabName.COMPLETE
    ) {
      this.navigateToTab(TaskListTabName.OPEN);
    }

    if (
      taskLists !== nextProps.taskLists ||
      nextProps.routeParams.taskListIdentifier !==
        routeParams.taskListIdentifier
    ) {
      this.setViewHeader(nextProps.routeParams.taskListIdentifier, [
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
      nextProps.routeParams.taskListIdentifier ===
        routeParams.taskListIdentifier &&
      nextProps.routeParams.tabName !== routeParams.tabName
    ) {
      actions.getTaskStatsForList(routeParams.taskListIdentifier);
      if (nextProps.routeParams.tabName === TaskListTabName.COMPLETE) {
        this.refreshCompleteTasks();
      } else {
        this.refreshIncompleteTasks();
      }
    }

    if (
      nextProps.routeParams.taskListIdentifier !==
      routeParams.taskListIdentifier
    ) {
      const { taskListActions, megaFilterActions } = this.props;

      actions.loading();
      megaFilterActions.clearFiltersForMegaFilter();
      actions.resetTaskCounters();
      actions.getTaskStatsForList(nextProps.routeParams.taskListIdentifier);

      if (nextProps.routeParams.taskListIdentifier != null) {
        taskListActions.getTaskListById(
          nextProps.routeParams.taskListIdentifier,
        );

        const status =
          nextProps.routeParams.tabName === TaskListTabName.COMPLETE
            ? 'COMPLETE'
            : 'INCOMPLETE';
        const filters = sessionStorageHelper.getItem(
          `filter-${nextProps.routeParams.taskListIdentifier}-${status}`,
        );

        if (!filters) {
          this.getTasksList(nextProps.routeParams.taskListIdentifier, status);
        } else {
          this.getFilteredTasks(
            nextProps.routeParams.taskListIdentifier,
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
      nextProps.routeParams.taskListIdentifier !==
        routeParams.taskListIdentifier
    ) {
      this.listenForRealTimeEvents(
        nextProps.routeParams.taskListIdentifier,
        nextProps.currentUser,
      );
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;

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
        <Header
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
    const {
      actions,
      routeParams: { tabName, taskListIdentifier },
    } = this.props;

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

  refreshTab = (withLoader = false, cumulativeFlag = false) => {
    const {
      routeParams: { tabName },
    } = this.props;

    this.refreshTabCounters();

    if (tabName === TaskListTabName.COMPLETE) {
      return this.refreshCompleteTasks(cumulativeFlag, withLoader);
    }

    return this.refreshIncompleteTasks(withLoader);
  };

  refreshFilters = () => {
    const {
      routeParams: { taskListIdentifier, tabName },
      megaFilterActions,
    } = this.props;

    const status =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);
  };

  refreshTabCounters = () => {
    const {
      actions,
      routeParams: { taskListIdentifier },
    } = this.props;

    actions.getTaskStatsForList(taskListIdentifier);
  };

  // TODO: Move to saga
  refreshIncompleteTasks = (withLoader = true) => {
    const {
      actions,
      megaFilterActions,
      routeParams: { taskListIdentifier },
    } = this.props;

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
  refreshCompleteTasks = (cumulativeFlag = false, withLoader = true) => {
    const {
      actions,
      megaFilterActions,
      routeParams: { taskListIdentifier },
    } = this.props;

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
      this.getTasksList(
        taskListIdentifier,
        status,
        cumulativeFlag,
        // queryStartPosition,
      );
    }
  };

  getTasksList = (
    taskListIdentifier,
    status,
    cumulativeFlag = false,
    startPosition = 0,
    endPosition = 0,
  ) => {
    const { actions } = this.props;

    return actions.getListTasksGroupedByTaskGroup(
      taskListIdentifier,
      undefined,
      undefined,
      status,
      cumulativeFlag,
      startPosition,
      endPosition,
    );
  };

  // TODO: Move to saga
  getFilteredTasks = (taskListIdentifier, filters, taskStatus, withLoader) => {
    const { actions } = this.props;

    return actions.getFilteredTasksForList(
      taskListIdentifier,
      taskStatus,
      filters,
      withLoader,
    );
  };

  // TODO: Move to saga
  handleFilterChange = updatedFilters => {
    const {
      routeParams: { tabName, taskListIdentifier },
      megaFilterActions,
      actions,
    } = this.props;

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
      return this.getTasksList(taskListIdentifier, taskStatus);
    }

    return this.getFilteredTasks(
      taskListIdentifier,
      updatedFilters,
      taskStatus,
    );
  };

  downloadPDF = () => {
    const {
      routeParams: { taskListIdentifier },
    } = this.props;

    if (taskListIdentifier) {
      window.print();
    }
  };

  handleRetry = (error, callback) => {
    if (error.message === 'Network Error') {
      console.log('refresh token on Network Error');
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
      console.log('refresh token on timeout');
      userApi.refreshAccessToken(user.username);
      this.refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  };

  navigateToTab = tabName => {
    const {
      routeParams: { taskListIdentifier },
    } = this.props;

    hashHistory.push(
      `/tasks/${taskListIdentifier}${
        tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

  quickAddTask = task => {
    const { tasksGroupsListActions, taskCounters } = this.props;

    if (task?.description) {
      const payload = {
        ...task,
        autoOpenDrawer: taskCounters?.incomplete === 0,
      };

      tasksGroupsListActions.createTask(payload);
    }
  };

  deleteGroup = groupId => {
    const {
      modalActions,
      tasksGroupsListActions: { deleteTasksGroup },
      routeParams: { taskListIdentifier },
    } = this.props;

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
      tasksGroupsListActions: { editTasksGroupName },
      routeParams: { taskListIdentifier },
    } = this.props;

    if (newGroupName) {
      editTasksGroupName({ taskListIdentifier, groupId, newGroupName });
    }
  };

  changeGroupsOrder = (oldTaskIndex, newTaskIndex, groupList) => {
    const {
      tasksGroupsListActions: { sortTasksGroups },
      routeParams: { taskListIdentifier },
    } = this.props;
    if (newTaskIndex < 0 || newTaskIndex >= groupList.length) {
      return;
    }
    const groupIdsList = groupList.map(group => group.taskGroupIdentifier);
    const newGroupList = arrayMove(groupIdsList, oldTaskIndex, newTaskIndex);
    sortTasksGroups({ taskGroupIdentifiers: newGroupList, taskListIdentifier });
  };

  handleTaskUpdate = updatedTask => {
    const { selectedFilters } = this.props;

    if (!checkIfTaskMatchesFilters(updatedTask, selectedFilters)) {
      this.refreshTab();
    } else {
      this.refreshFilters();
    }
  };

  handleTaskDelete = () => {
    const {
      selectedFilters,
      tasksGroupsListActions: { getTasksGroupsList },
      routeParams: { taskListIdentifier },
    } = this.props;

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

  toggleSingleTaskPriority = task => {
    const { actions } = this.props;
    actions
      .toggleTaskPriority(
        task,
        task.priority === Priority.High ? Priority.Low : Priority.High,
      )
      .then(this.handleTaskUpdate)
      .catch(() => this.refreshTab());
  };

  invokeToggleCompleteAction = task => {
    const {
      actions,
      tasksGroupsListActions,
      routeParams,
      currentUser,
    } = this.props;

    actions
      .toggleCompleteTask(task, currentUser)
      .then(() => {
        setTimeout(() => {
          actions.getTaskStatsForList(routeParams.taskListIdentifier);
          tasksGroupsListActions.getTasksGroupsList({
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
    if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
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
    const { tasksGroupsListActions } = this.props;

    tasksGroupsListActions.createTaskGroupList({ groupName });
  };

  loadTasksForTaskGroup = ({ taskGroupIdentifier, startPosition }) => {
    const { tasksGroupsListActions } = this.props;
    const payload = {
      taskGroupIdentifier,
      status: 'INCOMPLETE',
      startPosition,
    };
    tasksGroupsListActions.getTasksForTaskGroups(payload);
  };

  loadMoreTasksForList = ({ status, startPosition }) => {
    const { actions, routeParams } = this.props;
    const loadingMore = true;
    const endPosition = 0;
    actions.getListTasksGroupedByTaskGroup(
      routeParams.taskListIdentifier,
      undefined,
      undefined,
      status,
      false,
      startPosition,
      endPosition,
      loadingMore,
    );
  };

  render() {
    const {
      members,
      taskLists,
      routeParams,
      routeParams: { taskListIdentifier },
      taskCounters,
      modalActions,
      isFetching,
      isCompletedTasksFetching,
      completedGroupedTasks,
      groupedTasks,
      currentUser,
      selectedTask,
    } = this.props;

    const { isTourOpen, searchValue } = this.state;

    const loadedTasklist = taskLists
      ? taskLists.find(t => t.taskListIdentifier === taskListIdentifier)
      : {};

    const selectedTab = routeParams.tabName || TaskListTabName.OPEN;

    return (
      <>
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
                  ? Object.values(groupedTasks)?.flatMap(({ tasks }) => tasks)
                  : [],
              taskListMembers: members,
            }}
          />
          {selectedTab === TaskListTabName.COMPLETE ? (
            <CompletedTasksView
              currentUser={currentUser}
              toggleSingleTaskPriority={this.toggleSingleTaskPriority}
              toggleCompleteTask={this.toggleTaskCompletedStatus}
              reassignTask={this.handleReassignTask}
              updateDueDate={this.handleUpdateDueDate}
              searchValue={searchValue}
              selectedTask={selectedTask}
              listUniqueKey={taskListIdentifier}
              loadMoreTasksForList={this.loadMoreTasksForList}
            />
          ) : (
            <OpenedTasksView
              taskListIdentifier={taskListIdentifier}
              quickAddTask={this.quickAddTask}
              createTaskGroupList={this.handleCreateGroup}
              editGroupName={this.editGroupName}
              currentUser={currentUser}
              toggleCompleteTask={this.toggleTaskCompletedStatus}
              toggleSingleTaskPriority={this.toggleSingleTaskPriority}
              deleteGroup={this.deleteGroup}
              changeGroupsOrder={this.changeGroupsOrder}
              reassignTask={this.handleReassignTask}
              updateDueDate={this.handleUpdateDueDate}
              updateWorkflowStatus={this.handleUpdateWorkflowStatus}
              searchValue={searchValue}
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
        {isTourOpen && (
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
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
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
  tasksGroupsListActions: bindActionCreators(TasksGroupsListActions, dispatch),
  invitationActions: bindActionCreators(InvitationActions, dispatch),
  setHeaderAction: setHeader(dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  megaFilterActions: bindActionCreators(MegaFilterActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
