import React, { PureComponent } from 'react';
import { isEmpty } from 'ramda';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { setHeader as setHeaderRaw } from 'actions/header-actions';
import * as PeopleActions from 'actions/people-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskGroupActions from 'actions/task-group-list-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import * as ModalActions from 'modal/actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import GenericHeader from 'components/common/GenericHeader';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import { noop } from 'helpers/utility-functions';
import sessionStorageHelper from 'helpers/session-storage-helper';
import { closeDrawer } from 'actions/task-drawer-actions';
import TasksView from 'views/Task/NewTasksView/TasksView';
import { getSharedTaskListsWithCurrentUser } from 'api/tasklist-api';
import PersonInfoPanel from './PersonDetailsView.PersonInfoPanel';

class PersonDetailsView extends PureComponent {
  state = {
    fetching: true,
  };

  async componentDidMount() {
    const {
      peopleActions,
      taskGroupActions,
      routeParams: { userIdentifier },
      setHeader,
    } = this.props;

    taskGroupActions.initializeGroups([
      {
        groupType: 'TASKLIST_DEFAULT',
      },
    ]);

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
        fetching: false,
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
      taskActions,
      routeParams: { tabName, userIdentifier },
    } = this.props;
    taskActions.getTaskStatsForUser(userIdentifier);

    if (tabName === TaskListTabName.COMPLETE) {
      this.refreshCompleteTasks(cumulativeFlag, withLoader);
    } else {
      this.refreshIncompleteTasks(withLoader);
    }
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

  render() {
    const { personData, routeParams, modalActions } = this.props;
    const { fetching } = this.state;
    const { openModal } = modalActions;

    const viewProps = {
      routeParams,
      navigateToTab: this.navigateToTab,
      refreshTab: this.refreshTab,
      handleFilterChange: this.handleFilterChange,
      listNameVisible: true,
      quickAddTask: this.handleQuickAddTask,
      listUniqueKey: routeParams.userIdentifier,
      pdfTitle: personData
        ? `${personData.firstName} ${personData.lastName}`
        : null,
    };

    return (
      !fetching && (
        <>
          {personData && (
            <PersonInfoPanel
              personData={personData}
              archivePerson={props => openModal('ArchivePerson', { ...props })}
            />
          )}
          <TasksView
            {...viewProps}
            defaultGroupName="All tasks"
            showMembers={false}
            showNotificationAction={false}
            members={[personData]}
            dragAndDropDisabled
          />
        </>
      )
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.listTasks.tasks,
    isFetching: state.listTasks.isFetching,
    personData: state.peopleState.personData,
    megaFilter: state.megaFilter,
    currentUser: userProfileSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch),
    taskGroupActions: bindActionCreators(TaskGroupActions, dispatch),
    peopleActions: bindActionCreators(PeopleActions, dispatch),
    setHeader: setHeaderRaw(dispatch),
    closeTaskDrawer: () => closeDrawer()(dispatch),
    clearTask: () => TaskActions.storeAsCurrentTask(null)(dispatch),
    megaFilterActions: bindActionCreators(MegaFilterActions, dispatch),
    modalActions: bindActionCreators(ModalActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetailsView);
