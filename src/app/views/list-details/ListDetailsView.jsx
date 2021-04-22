/* eslint-disable react/no-did-update-set-state */
/* eslint-disable sonarjs/cognitive-complexity */
import { isEmpty, isNil, move } from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'lodash.debounce';

import ListSelectHeader from 'components/task-view/ListSelectHeader/ListSelectHeader';
import { onSearchChanged } from 'helpers/ga-event-helper';
import { TaskListTabName } from 'helpers/tasklist-helpers';
// import Tour from 'components/tour-wizard/Tour/Tour';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import Toolbar from 'components/tasklist/Toolbar/ToolbarContainer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';

import * as TemplateActions from 'actions/template-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import * as ListDetailsActions from 'actions/list-details-actions';
import { ListDetailsSagaActions } from 'sagas/list-details-saga';

import * as userApi from 'api/user-api';

import { noop } from 'helpers/utility-functions';
import localStorageHelper from 'helpers/local-storage-helper';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { initializePusher } from 'helpers/pusher-instance';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import { TaskStatus } from 'helpers/task-helpers';

import {
  taskListsSelector,
  pendingTaskListsSelector,
  taskListMembersSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
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
  };

  searchWithDebounce = debounce(searchValue => {
    const {
      listDetailsSagaActions: { fetchTasksBySearchedTerm },
    } = this.props;

    const tabName = this.props?.match?.params?.tabName;

    const taskStatus =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    onSearchChanged();
    return fetchTasksBySearchedTerm({
      status: taskStatus,
      searchedTerm: searchValue,
    });
  }, 400);

  async componentDidMount() {
    const { match, currentUser, taskLists, pendingTaskLists = [] } = this.props;
    const { params } = match;

    this.setViewHeader(params.taskListIdentifier, [
      ...taskLists,
      ...pendingTaskLists,
    ]);

    this.refreshAccessToken(currentUser);

    this.listenForRealTimeEvents(params.taskListIdentifier, currentUser);

    this.launchNewFeaturesModal();
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { match, taskLists, currentUser, taskCounters } = this.props;
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
            this.refreshTab();
          }
          actions.refreshAnotherTask(data.task);
        }
      });
    }
  };

  setViewHeader = (taskListIdentifier, taskLists) => {
    const { templateActions } = this.props;

    const loadedTasklist =
      taskLists?.length > 0
        ? taskLists.find(t => t.taskListIdentifier === taskListIdentifier)
        : {};

    if (loadedTasklist?.listName) {
      const headerComponent = <ListSelectHeader taskList={loadedTasklist} />;

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

  refreshTab = (withLoader = false) => {
    const { listDetailsActions, megaFilterActions, match } = this.props;
    const { params } = match || {};
    const { taskListIdentifier, tabName } = params || {};

    const status =
      tabName === TaskListTabName.COMPLETE
        ? TaskStatus.COMPLETE
        : TaskStatus.INCOMPLETE;

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);
    listDetailsActions.getListDetailsTaskCounters(params.taskListIdentifier);
    listDetailsActions.refreshListDetailsGroupedTasks(withLoader);
  };

  refreshFilters = () => {
    const { match, megaFilterActions } = this.props;
    const { params } = match;
    const { taskListIdentifier, tabName } = params;

    const status =
      tabName === TaskListTabName.COMPLETE
        ? TaskStatus.COMPLETE
        : TaskStatus.INCOMPLETE;

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);
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
    const newGroupList = move(oldTaskIndex, newTaskIndex, groupIdsList);
    sortTasksGroups({ taskGroupIdentifiers: newGroupList, taskListIdentifier });
  };

  refreshTabAfterTaskUpdate = updatedTask => {
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

  resetSort = () => {
    const { listDetailsActions } = this.props;
    listDetailsActions.sortListDetailsTasks(null, null);
  };

  invokeToggleCompleteAction = task => {
    const {
      actions,
      listDetailsActions,
      listDetailsSagaActions,
      match,
      currentUser,
    } = this.props;
    const { params } = match;
    const { taskListIdentifier } = params;

    actions
      .toggleCompleteTask(task, currentUser)
      .then(() => {
        setTimeout(() => {
          listDetailsActions.getListDetailsTaskCounters(taskListIdentifier);
          listDetailsSagaActions.getTasksGroupsList({
            shouldSetRequestState: false,
          });
        }, TASK_DISAPPEAR_DELAY);
      })
      .catch(() => this.refreshTab());
  };

  toggleTaskCompletedStatus = task => {
    const { modalActions } = this.props;

    const hasIncompletedSubtasks =
      task.subtasks?.length > 0
        ? task.subtasks.find(subtask => subtask.status === 'INCOMPLETE')
        : task.subTasksCount - task.subTasksCompletedCount > 0;

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

  handleTaskUpdate = (taskIdentifier, dataToUpdate) => {
    const { actions } = this.props;
    actions
      .partialUpdateTask(taskIdentifier, dataToUpdate)
      .then(this.refreshTabAfterTaskUpdate)
      .catch(() => this.refreshTab());
  };

  handleUpdateDueDate = (task, dueDate) => {
    const { actions } = this.props;

    actions
      .updateDueDate(task, dueDate, true)
      .then(this.refreshTabAfterTaskUpdate)
      .catch(() => this.refreshTab());
  };

  handleUpdateWorkflowStatus = (task, workflowStatus) => {
    const { actions } = this.props;

    actions
      .updateWorkflowStatus(task, workflowStatus)
      .then(this.refreshTabAfterTaskUpdate)
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

      if (!appFeaturesReviewed?.includes('MULTI_ASSIGN')) {
        modalActions.openModal('MultiAssignTour', {
          onClose: () => {
            userApi.updateUserDashboardPrefs({
              appFeaturesReviewed: ['MULTI_ASSIGN'],
            });
          },
        });
      }
    }
  };

  render() {
    const {
      listDetailsActions,
      members,
      taskLists,
      match,
      taskCounters,
      modalActions,
      isFetching,
      isCompletedTasksFetching,
      completedGroupedTasks,
      groupedTasks,
      selectedTask,
      selectedFilters,
      sort,
    } = this.props;

    const { isTourOpen, searchValue } = this.state;
    const { params } = match;
    const { taskListIdentifier, tabName } = params;

    const loadedTasklist = taskLists
      ? taskLists.find(t => t.taskListIdentifier === taskListIdentifier)
      : {};

    const selectedTab = tabName || TaskListTabName.OPEN;

    const openedTasks =
      selectedTab === TaskListTabName.OPEN
        ? Object.values(groupedTasks)?.flatMap(({ tasks }) => tasks) || []
        : [];
    const completedTasks =
      selectedTab === TaskListTabName.COMPLETE
        ? completedGroupedTasks?.tasks || []
        : [];

    return (
      <>
        <BulkEditSection
          allTasks={
            selectedTab === TaskListTabName.OPEN ? openedTasks : completedTasks
          }
          refreshTasks={this.refreshTab}
          disabled={selectedTab === TaskListTabName.COMPLETE}
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
                onSelectFilters={listDetailsActions.filterListDetailsTasks}
                pdfTitle={loadedTasklist?.listName}
                tipsContent={
                  loadedTasklist?.listType === 'INBOX' ? InboxHelpPanel : null
                }
                isFetching={isFetching || isCompletedTasksFetching}
                printData={{
                  completedTasks,
                  openedTasks,
                }}
                tasks={openedTasks}
                completedTasks={completedTasks}
                selectedFilters={selectedFilters}
              />
              {selectedTab === TaskListTabName.COMPLETE ? (
                <CompletedTasksView
                  toggleCompleteTask={this.toggleTaskCompletedStatus}
                  onTaskUpdate={this.handleTaskUpdate}
                  updateDueDate={this.handleUpdateDueDate}
                  searchValue={searchValue}
                  selectedTask={selectedTask}
                  listUniqueKey={taskListIdentifier}
                  loadMoreTasksForList={this.loadMoreTasksForList}
                  sort={sort}
                  onSortChange={listDetailsActions.sortListDetailsTasks}
                />
              ) : (
                <OpenedTasksView
                  taskListIdentifier={taskListIdentifier}
                  quickAddTask={this.quickAddTask}
                  createTaskGroupList={this.handleCreateGroup}
                  editGroupName={this.editGroupName}
                  toggleCompleteTask={this.toggleTaskCompletedStatus}
                  deleteGroup={this.deleteGroup}
                  changeGroupsOrder={this.changeGroupsOrder}
                  onTaskUpdate={this.handleTaskUpdate}
                  updateDueDate={this.handleUpdateDueDate}
                  updateWorkflowStatus={this.handleUpdateWorkflowStatus}
                  searchValue={searchValue}
                  sort={sort}
                  onSortChange={listDetailsActions.sortListDetailsTasks}
                  selectedTask={selectedTask}
                  listUniqueKey={taskListIdentifier}
                  taskCounters={taskCounters}
                  loadTasksForTaskGroup={this.loadTasksForTaskGroup}
                  resetSort={this.resetSort}
                />
              )}
            </TaskViewContainer>
            <TaskDrawer
              modalActions={modalActions}
              fromFirstAddTask={taskCounters?.incomplete === 0}
              hideTour={isTourOpen}
              onTaskUpdate={this.refreshTabAfterTaskUpdate}
              onTaskDelete={this.handleTaskDelete}
              onTaskCreation={this.refreshTabAfterTaskUpdate}
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
  taskLists: taskListsSelector(state),
  currentUser: userProfileSelector(state),
  selectedFilters: selectedFiltersInMegaFilterSelector(state),
  members: taskListMembersSelector(state),
  taskCounters: state.listDetails.taskCounters,
  pendingTaskLists: pendingTaskListsSelector(state),
  isFetching: tasksIsFetchingSelector(state),
  isCompletedTasksFetching: completedTasksIsFetchingSelector(state),
  groupedTasks: groupTasksSelector(state),
  completedGroupedTasks: groupCompletedTasksSelector(state),
  selectedTask: state.taskState.selectedTask,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  listDetailsSagaActions: bindActionCreators(ListDetailsSagaActions, dispatch),
  templateActions: bindActionCreators(TemplateActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  megaFilterActions: bindActionCreators(MegaFilterActions, dispatch),
  listDetailsActions: bindActionCreators(ListDetailsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
