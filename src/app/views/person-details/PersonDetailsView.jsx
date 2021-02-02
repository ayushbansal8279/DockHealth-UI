import React, { PureComponent } from 'react';
import { isEmpty } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setHeader as setHeaderRaw } from 'actions/header-actions';
import * as PersonDetailsActions from 'actions/person-details-actions';
import * as TaskActions from 'actions/task-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import { closeDrawer } from 'actions/task-drawer-actions';
import * as ModalActions from 'modal/actions';

import { userProfileSelector } from 'selectors/user-selectors';
import {
  tasksIsFetchingSelector,
  completedTasksIsFetchingSelector,
  tasksSelector,
  completedTasksSelector,
  personTaskCountersSelector,
  personDataSelector,
  personDetailsSortSelector,
} from 'selectors/person-details-selectors';
import {
  hasFiltersAppliedSelector,
  selectedFiltersInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';

import { mobileAnalyticsClient } from 'api/analytics-api';

import GenericHeader from 'components/common/GenericHeader';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import { noop } from 'helpers/utility-functions';
import sessionStorageHelper from 'helpers/session-storage-helper';
import { getSharedTaskListsWithCurrentUser } from 'api/tasklist-api';
import Toolbar from 'components/taskView/Toolbar/NewToolbarContainer';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';

import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';

import OpenedTasksView from './PersonDetailsOpenedTasksContainer/PersonDetailsOpenedTasks';
import CompletedTasksView from './PersonDetailsCompletedTasksContainer/PersonDetailsCompletedTasks';
import PersonInfoPanel from './PersonInfoPanel/PersonInfoPanel';
import { TaskViewContainer } from './styled';

class PersonDetailsView extends PureComponent {
  state = {
    isLoadingView: true,
    searchValue: '',
    shouldResetBulkEditTasks: false,
  };

  async componentDidMount() {
    const { personDetailsActions, history, match, setHeader } = this.props;
    const { params } = match;
    const { userIdentifier } = params;

    setHeader({
      layout: [
        {
          key: 'generic-header',
          component: <GenericHeader>People</GenericHeader>,
        },
      ],
    });

    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PersonTaskList',
    });

    let personData = {};

    try {
      personData = await personDetailsActions.getUserById(userIdentifier);

      if (personData?.userIdentifier) {
        this.initTable();
      }
    } catch {
      noop();
    }

    if (personData?.firstName || personData?.lastName) {
      this.setState({
        isLoadingView: false,
      });
    } else {
      history.push('/core/people');
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { personDetailsActions, match } = this.props;
    const { params } = match;

    if (nextProps.match.params.userIdentifier !== params.userIdentifier) {
      personDetailsActions.resetTaskCounters();
      personDetailsActions.getTaskStatsForUser(
        nextProps.match.params.userIdentifier,
      );
    }

    if (
      nextProps.match.params.userIdentifier === params.userIdentifier &&
      nextProps.match.params.tabName !== params.tabName
    ) {
      personDetailsActions.getTaskStatsForUser(params.userIdentifier);

      if (nextProps.match.params.tabName === TaskListTabName.COMPLETE) {
        this.refreshCompleteTasks();
      } else {
        this.refreshIncompleteTasks();
      }
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  componentDidUpdate(previousProps, previousState) {
    const { searchValue, shouldResetBulkEditTasks } = this.state;
    const { selectedFilters, match } = this.props;

    const { params } = match;
    const { tabName } = params;

    if (
      previousState?.searchValue !== searchValue ||
      Object.keys(previousProps?.selectedFilters || []).length !==
        Object.keys(selectedFilters || []).length ||
      (tabName === TaskListTabName.COMPLETE && !shouldResetBulkEditTasks)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ shouldResetBulkEditTasks: true });
    }

    if (
      (searchValue === previousState?.searchValue ||
        (Object.keys(previousProps?.selectedFilters || []).length === 0 &&
          Object.keys(selectedFilters || []).length !== 0) ||
        tabName === TaskListTabName.OPEN) &&
      shouldResetBulkEditTasks
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ shouldResetBulkEditTasks: false });
    }
  }

  componentWillUnmount() {
    const { personDetailsActions } = this.props;

    personDetailsActions.resetTaskCounters();
  }

  getTasks(userIdentifier, status) {
    const { personDetailsActions } = this.props;

    return personDetailsActions.getTasksAssignedToSpecificUser(
      userIdentifier,
      status,
    );
  }

  initTable = () => {
    const { personDetailsActions, match } = this.props;
    const { params } = match;
    const { tabName, userIdentifier } = params;

    personDetailsActions.getTaskStatsForUser(userIdentifier);

    let status = 'INCOMPLETE';
    if (tabName === TaskListTabName.COMPLETE) {
      personDetailsActions.loadingCompletedTasks();
      status = 'COMPLETE';
    } else {
      personDetailsActions.loading();
    }

    const filters = sessionStorageHelper.getItem(
      `filter-${userIdentifier}-${status}`,
    );

    if (!filters) {
      this.getTasks(userIdentifier, status);
    } else {
      this.getFilteredTasks(filters, status);
    }
  };

  refreshTab = (withLoader = false) => {
    const { match } = this.props;
    const { params } = match;
    const { tabName } = params;

    this.refreshTabCounters();

    if (tabName === TaskListTabName.COMPLETE) {
      this.refreshCompleteTasks(withLoader);
    } else {
      this.refreshIncompleteTasks(withLoader);
    }
  };

  refreshFilters = () => {
    const { megaFilterActions, match } = this.props;
    const { params } = match;
    const { tabName, userIdentifier } = params;

    const status =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    megaFilterActions.getFiltersForPeopleListMegaFilter(userIdentifier, status);
  };

  refreshTabCounters = () => {
    const { personDetailsActions, match } = this.props;
    const { params } = match;
    const { userIdentifier } = params;

    personDetailsActions.getTaskStatsForUser(userIdentifier);
  };

  refreshIncompleteTasks = (withLoader = true) => {
    const { personDetailsActions, megaFilterActions, match } = this.props;
    const { params } = match;
    const { userIdentifier } = params;

    const status = 'INCOMPLETE';

    megaFilterActions.getFiltersForPeopleListMegaFilter(userIdentifier, status);

    const filters = sessionStorageHelper.getItem(
      `filter-${userIdentifier}-${status}`,
    );

    if (withLoader) personDetailsActions.loading();

    if (filters && !isEmpty(filters)) {
      return this.getFilteredTasks(filters, status);
    }

    return this.getTasks(userIdentifier, status);
  };

  refreshCompleteTasks = (withLoader = true) => {
    const { personDetailsActions, megaFilterActions, match } = this.props;
    const { params } = match;
    const { userIdentifier } = params;

    const status = 'COMPLETE';

    megaFilterActions.getFiltersForPeopleListMegaFilter(userIdentifier, status);

    const filters = sessionStorageHelper.getItem(
      `filter-${userIdentifier}-${status}`,
    );

    if (withLoader) personDetailsActions.loadingCompletedTasks();

    if (filters && !isEmpty(filters)) {
      return this.getFilteredTasks(filters, status);
    }

    return this.getTasks(userIdentifier, status);
  };

  onSideClick = () => {
    const { clearTask, closeTaskDrawer } = this.props;

    closeTaskDrawer();
    clearTask();
  };

  navigateToTab = tabName => {
    const { match, history } = this.props;
    const { params } = match;
    const { userIdentifier } = params;

    history.push(
      `/core/assignedToPerson/${userIdentifier}${
        tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

  handleFilterChange = updatedFilters => {
    const { match, megaFilterActions } = this.props;
    const { params } = match;
    const { tabName, userIdentifier } = params;

    const taskStatus =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    megaFilterActions.selectFiltersForMegaFilter(
      updatedFilters,
      userIdentifier,
      taskStatus,
    );

    return this.getFilteredTasks(updatedFilters, taskStatus);
  };

  getFilteredTasks = (filters, taskStatus) => {
    const { match, personDetailsActions } = this.props;
    const { params } = match;
    const { userIdentifier } = params;

    return personDetailsActions.getFilteredTasksForPeopleList(
      userIdentifier,
      taskStatus,
      filters,
    );
  };

  handleQuickAddTask = task => {
    const {
      modalActions,
      personDetailsActions,
      currentUser,
      match,
    } = this.props;
    const { params } = match;
    const { userIdentifier } = params;

    modalActions.openModal('ListPicker', {
      fetchMethod: () => getSharedTaskListsWithCurrentUser(userIdentifier),
      listCreationPayload: {
        adminIdentifiers:
          currentUser.userIdentifier !== userIdentifier ? [userIdentifier] : [],
      },
      confirm: taskListIdentifier => {
        const payload = {
          ...task,
          taskListIdentifier,
          assignedToIdentifier: userIdentifier,
          taskGroupIdentifier: null,
        };

        personDetailsActions.quickAddTask(payload).then(() => {
          personDetailsActions.getTaskStatsForUser(userIdentifier);
        });
      },
    });
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
    const { selectedFilters } = this.props;

    this.refreshFilters();
    if (selectedFilters && !isEmpty(selectedFilters)) {
      this.refreshTab();
    }
  };

  setSearchValue = searchValue => {
    this.setState({
      searchValue,
    });
  };

  invokeToggleCompleteAction = task => {
    const {
      taskActions,
      personDetailsActions,
      match,
      currentUser,
    } = this.props;
    const { params } = match;
    const { userIdentifier } = params;

    taskActions
      .toggleCompleteTask(task, currentUser)
      .then(() => {
        setTimeout(() => {
          personDetailsActions.getTaskStatsForUser(userIdentifier);
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
    const { taskActions } = this.props;
    taskActions
      .assignOrReassignTask(task, assignee?.userIdentifier)
      .then(this.handleTaskUpdate)
      .catch(() => this.refreshTab());
  };

  handleUpdateDueDate = (task, dueDate) => {
    const { taskActions } = this.props;

    taskActions
      .updateDueDate(task, dueDate, true)
      .then(this.handleTaskUpdate)
      .catch(() => this.refreshTab());
  };

  handleUpdateWorkflowStatus = (task, workflowStatus) => {
    const { taskActions } = this.props;

    taskActions
      .updateWorkflowStatus(task, workflowStatus)
      .then(this.handleTaskUpdate)
      .catch(() => this.refreshTab());
  };

  sortPersonTasks = (key, order) => {
    const { personDetailsActions } = this.props;
    personDetailsActions.sortPersonTasks(key, order);
  };

  render() {
    const {
      personData,
      match,
      modalActions,
      taskCounters,
      isFetching,
      isCompletedTasksFetching,
      currentUser,
      selectedTask,
      tasks,
      completedTasks,
      areFiltersApplied,
      sort,
    } = this.props;
    const { isLoadingView, searchValue, shouldResetBulkEditTasks } = this.state;
    const { openModal } = modalActions;
    const { params } = match;
    const { tabName, userIdentifier } = params;

    const selectedTab = tabName || TaskListTabName.OPEN;

    return (
      !isLoadingView && (
        <>
          <BulkEditSection
            shouldResetBulkEditTasks={shouldResetBulkEditTasks}
            refreshTasksOnBulkAction={this.refreshTab}
            inactiveBulkEdit={selectedTab === TaskListTabName.COMPLETE}
            searchValue={searchValue}
          >
            <div>
              <PersonInfoPanel
                personData={personData}
                archivePerson={props =>
                  openModal('ArchivePerson', { ...props })
                }
              />
              <TaskViewContainer>
                <Toolbar
                  showNotifications={false}
                  members={[personData]}
                  showMembers={false}
                  onSelectTab={this.navigateToTab}
                  selectedTab={selectedTab}
                  openTasksAmount={taskCounters.incomplete}
                  completedTasksAmount={taskCounters.complete}
                  onSearchChange={this.setSearchValue}
                  searchValue={searchValue}
                  onSelectFilters={this.handleFilterChange}
                  listNameColumnVisible
                  pdfTitle={
                    personData
                      ? `${personData.firstName} ${personData.lastName}`
                      : null
                  }
                  isFetching={isFetching || isCompletedTasksFetching}
                  tasks={tasks}
                  completedTasks={completedTasks}
                />
                {selectedTab === TaskListTabName.COMPLETE ? (
                  <CompletedTasksView
                    isFetchingTasks={isCompletedTasksFetching}
                    tasks={completedTasks}
                    currentUser={currentUser}
                    toggleCompleteTask={this.toggleTaskCompletedStatus}
                    summaryTasksCount={taskCounters.complete}
                    reassignTask={this.handleReassignTask}
                    updateDueDate={this.handleUpdateDueDate}
                    searchValue={searchValue}
                    selectedTask={selectedTask}
                    listUniqueKey={userIdentifier}
                    areFiltersApplied={areFiltersApplied}
                    sort={sort}
                    onSortChange={this.sortPersonTasks}
                  />
                ) : (
                  <OpenedTasksView
                    isFetchingTasks={isFetching}
                    tasks={tasks}
                    currentUser={currentUser}
                    toggleCompleteTask={this.toggleTaskCompletedStatus}
                    quickAddTask={this.handleQuickAddTask}
                    reassignTask={this.handleReassignTask}
                    updateDueDate={this.handleUpdateDueDate}
                    updateWorkflowStatus={this.handleUpdateWorkflowStatus}
                    searchValue={searchValue}
                    selectedTask={selectedTask}
                    listUniqueKey={userIdentifier}
                    areFiltersApplied={areFiltersApplied}
                    sort={sort}
                    onSortChange={this.sortPersonTasks}
                  />
                )}
              </TaskViewContainer>
            </div>
          </BulkEditSection>
          <NewTaskDrawer
            modalActions={modalActions}
            onTaskUpdate={this.handleTaskUpdate}
            onTaskDelete={this.handleTaskDelete}
            onTaskCreation={this.handleTaskUpdate}
          />
        </>
      )
    );
  }
}

function mapStateToProps(state) {
  return {
    sort: personDetailsSortSelector(state),
    tasks: tasksSelector(state),
    completedTasks: completedTasksSelector(state),
    isFetching: tasksIsFetchingSelector(state),
    isCompletedTasksFetching: completedTasksIsFetchingSelector(state),
    personData: personDataSelector(state),
    megaFilter: state.megaFilter,
    currentUser: userProfileSelector(state),
    taskCounters: personTaskCountersSelector(state),
    selectedTask: state.taskState.selectedTask,
    areFiltersApplied: hasFiltersAppliedSelector(state),
    selectedFilters: selectedFiltersInMegaFilterSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch),
    personDetailsActions: bindActionCreators(PersonDetailsActions, dispatch),
    setHeader: setHeaderRaw(dispatch),
    closeTaskDrawer: () => closeDrawer()(dispatch),
    clearTask: () => TaskActions.storeAsCurrentTask(null)(dispatch),
    megaFilterActions: bindActionCreators(MegaFilterActions, dispatch),
    modalActions: bindActionCreators(ModalActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetailsView);
