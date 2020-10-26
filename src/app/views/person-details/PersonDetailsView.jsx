import React, { PureComponent } from 'react';
import { isEmpty } from 'ramda';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import { setHeader as setHeaderRaw } from 'actions/header-actions';
import * as PeopleActions from 'actions/people-actions';
import * as TaskActions from 'actions/task-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import { closeDrawer } from 'actions/task-drawer-actions';
import * as ModalActions from 'modal/actions';

import { userProfileSelector } from 'selectors/user-selectors';
import {
  tasksIsFetchingSelector,
  completedTasksIsFetchingSelector,
  completedTasksSelector,
  tasksSelector,
} from 'selectors/task-selectors';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';

import { mobileAnalyticsClient } from 'api/analytics-api';

import GenericHeader from 'components/common/GenericHeader';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import { noop } from 'helpers/utility-functions';
import sessionStorageHelper from 'helpers/session-storage-helper';
import { getSharedTaskListsWithCurrentUser } from 'api/tasklist-api';
import Toolbar from 'components/taskView/Toolbar/NewToolbarContainer';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';

import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';

import OpenedTasksView from './PersonDetailsOpenedTasksContainer/PersonDetailsOpenedTasks';
import CompletedTasksView from './PersonDetailsCompletedTasksContainer/PersonDetailsCompletedTasks';
import PersonInfoPanel from './PersonInfoPanel/PersonInfoPanel';
import { TaskViewContainer } from './styled';

const Priority = {
  High: 'HIGH',
  Low: 'LOW',
};

class PersonDetailsView extends PureComponent {
  state = {
    isLoadingView: true,
    searchValue: '',
  };

  async componentDidMount() {
    const {
      peopleActions,
      routeParams: { userIdentifier },
      setHeader,
    } = this.props;

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
      personData = await peopleActions.getUserById(userIdentifier);

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
      hashHistory.push('people');
    }
  }

  componentWillUpdate(nextProps) {
    const { taskActions, routeParams } = this.props;

    if (nextProps.routeParams.userIdentifier !== routeParams.userIdentifier) {
      taskActions.resetTaskCounters();
      taskActions.getTaskStatsForUser(nextProps.routeParams.userIdentifier);
    }

    if (
      nextProps.routeParams.userIdentifier === routeParams.userIdentifier &&
      nextProps.routeParams.tabName !== routeParams.tabName
    ) {
      taskActions.getTaskStatsForUser(routeParams.userIdentifier);

      if (nextProps.routeParams.tabName === TaskListTabName.COMPLETE) {
        this.refreshCompleteTasks(false);
      } else {
        this.refreshIncompleteTasks();
      }
    }
  }

  componentWillUnmount() {
    const { taskActions } = this.props;

    taskActions.resetTaskCounters();
  }

  getTasks(userIdentifier, status, cumulativeFlag = false) {
    const { taskActions } = this.props;

    return taskActions.getTasksAssignedToSpecificUser(
      userIdentifier,
      undefined,
      undefined,
      undefined,
      status,
      cumulativeFlag,
    );
  }

  initTable = () => {
    const {
      taskActions,
      routeParams: { tabName, userIdentifier },
    } = this.props;

    taskActions.getTaskStatsForUser(userIdentifier);

    let status = 'INCOMPLETE';
    if (tabName === TaskListTabName.COMPLETE) {
      taskActions.loadingCompletedTasks();
      status = 'COMPLETE';
    } else {
      taskActions.loading();
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

  refreshTab = (withLoader = false, cumulativeFlag = false) => {
    const {
      routeParams: { tabName },
    } = this.props;

    this.refreshTabCounters();

    if (tabName === TaskListTabName.COMPLETE) {
      this.refreshCompleteTasks(cumulativeFlag, withLoader);
    } else {
      this.refreshIncompleteTasks(withLoader);
    }
  };

  refreshFilters = () => {
    const {
      megaFilterActions,
      routeParams: { userIdentifier, tabName },
    } = this.props;

    const status =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    megaFilterActions.getFiltersForPeopleListMegaFilter(userIdentifier, status);
  };

  refreshTabCounters = () => {
    const {
      taskActions,
      routeParams: { userIdentifier },
    } = this.props;

    taskActions.getTaskStatsForUser(userIdentifier);
  };

  refreshIncompleteTasks = (withLoader = true) => {
    const {
      taskActions,
      megaFilterActions,
      routeParams: { userIdentifier },
    } = this.props;

    const status = 'INCOMPLETE';

    megaFilterActions.getFiltersForPeopleListMegaFilter(userIdentifier, status);

    const filters = sessionStorageHelper.getItem(
      `filter-${userIdentifier}-${status}`,
    );

    if (withLoader) taskActions.loading();

    if (filters && !isEmpty(filters)) {
      return this.getFilteredTasks(filters, status);
    }

    return this.getTasks(userIdentifier, status);
  };

  refreshCompleteTasks = (cumulativeFlag = false, withLoader = true) => {
    const {
      taskActions,
      megaFilterActions,
      routeParams: { userIdentifier },
    } = this.props;

    const status = 'COMPLETE';

    megaFilterActions.getFiltersForPeopleListMegaFilter(userIdentifier, status);

    const filters = sessionStorageHelper.getItem(
      `filter-${userIdentifier}-${status}`,
    );

    if (withLoader) taskActions.loadingCompletedTasks();

    if (filters && !isEmpty(filters)) {
      return this.getFilteredTasks(filters, status);
    }

    return this.getTasks(userIdentifier, status, cumulativeFlag);
  };

  onSideClick = () => {
    const { clearTask, closeTaskDrawer } = this.props;

    closeTaskDrawer();
    clearTask();
  };

  navigateToTab = tabName => {
    const {
      routeParams: { userIdentifier },
    } = this.props;

    hashHistory.push(
      `/assignedToPerson/${userIdentifier}${
        tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

  handleFilterChange = updatedFilters => {
    const {
      routeParams: { tabName, userIdentifier },
      megaFilterActions,
    } = this.props;

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
    const {
      routeParams: { userIdentifier },
      taskActions,
    } = this.props;

    return taskActions.getFilteredTasksForPeopleList(
      userIdentifier,
      taskStatus,
      filters,
    );
  };

  handleQuickAddTask = task => {
    const {
      modalActions,
      taskActions,
      routeParams: { userIdentifier },
      currentUser,
    } = this.props;

    modalActions.openModal('ListPicker', {
      fetchMethod: () => getSharedTaskListsWithCurrentUser(userIdentifier),
      listCreationPayload: {
        memberIdentifiers:
          currentUser.userIdentifier !== userIdentifier ? [userIdentifier] : [],
      },
      confirm: taskListIdentifier => {
        const payload = {
          ...task,
          taskListIdentifier,
          assignedToIdentifier: userIdentifier,
        };

        taskActions.saveTask(payload).then(() => {
          taskActions.getTaskStatsForUser(userIdentifier);
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

  toggleSingleTaskPriority = task => {
    const { taskActions } = this.props;
    taskActions
      .toggleTaskPriority(
        task,
        task.priority === Priority.High ? Priority.Low : Priority.High,
      )
      .then(this.handleTaskUpdate)
      .catch(() => this.refreshTab());
  };

  invokeToggleCompleteAction = task => {
    const { taskActions, routeParams, currentUser } = this.props;
    const selectedTab = routeParams.tabName || TaskListTabName.OPEN;

    taskActions
      .toggleCompleteTask(task, selectedTab, currentUser)
      .then(() => {
        setTimeout(this.refreshTab, TASK_DISAPPEAR_DELAY);
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

  render() {
    const {
      personData,
      routeParams,
      modalActions,
      taskCounters,
      isFetching,
      isCompletedTasksFetching,
      currentUser,
      selectedTask,
      tasks,
      completedTasks,
      areFiltersApplied,
    } = this.props;
    const { isLoadingView, searchValue } = this.state;
    const { openModal } = modalActions;

    const selectedTab = routeParams.tabName || TaskListTabName.OPEN;

    return (
      !isLoadingView && (
        <>
          <PersonInfoPanel
            personData={personData}
            archivePerson={props => openModal('ArchivePerson', { ...props })}
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
                toggleSingleTaskPriority={this.toggleSingleTaskPriority}
                toggleCompleteTask={this.toggleTaskCompletedStatus}
                summaryTasksCount={taskCounters.complete}
                reassignTask={this.handleReassignTask}
                updateDueDate={this.handleUpdateDueDate}
                searchValue={searchValue}
                selectedTask={selectedTask}
                listUniqueKey={routeParams.userIdentifier}
                areFiltersApplied={areFiltersApplied}
              />
            ) : (
              <OpenedTasksView
                isFetchingTasks={isFetching}
                tasks={tasks}
                currentUser={currentUser}
                toggleSingleTaskPriority={this.toggleSingleTaskPriority}
                toggleCompleteTask={this.toggleTaskCompletedStatus}
                quickAddTask={this.handleQuickAddTask}
                reassignTask={this.handleReassignTask}
                updateDueDate={this.handleUpdateDueDate}
                updateWorkflowStatus={this.handleUpdateWorkflowStatus}
                searchValue={searchValue}
                selectedTask={selectedTask}
                listUniqueKey={routeParams.userIdentifier}
                areFiltersApplied={areFiltersApplied}
              />
            )}
          </TaskViewContainer>
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
    tasks: tasksSelector(state),
    completedTasks: completedTasksSelector(state),
    isFetching: tasksIsFetchingSelector(state),
    isCompletedTasksFetching: completedTasksIsFetchingSelector(state),
    personData: state.peopleState.personData,
    megaFilter: state.megaFilter,
    currentUser: userProfileSelector(state),
    taskCounters: state.listTasks.taskCounters,
    selectedTask: state.taskState.selectedTask,
    areFiltersApplied: hasFiltersAppliedSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch),
    peopleActions: bindActionCreators(PeopleActions, dispatch),
    setHeader: setHeaderRaw(dispatch),
    closeTaskDrawer: () => closeDrawer()(dispatch),
    clearTask: () => TaskActions.storeAsCurrentTask(null)(dispatch),
    megaFilterActions: bindActionCreators(MegaFilterActions, dispatch),
    modalActions: bindActionCreators(ModalActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetailsView);
