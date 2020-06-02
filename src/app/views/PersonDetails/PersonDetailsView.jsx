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
import { mobileAnalyticsClient } from 'api/analytics-api';
import GenericHeader from 'components/common/GenericHeader';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import { noop } from 'helpers/utility-functions';
import { closeDrawer } from 'actions/task-drawer-actions';
import TasksView from 'views/Task/NewTasksView/TasksView';
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

    if (tabName === TaskListTabName.COMPLETE)
      taskActions.loadingCompletedTasks();
    else taskActions.loading();

    if (!sessionStorage[`filter-${userIdentifier}`]) {
      if (tabName === TaskListTabName.COMPLETE) {
        this.getTasks(userIdentifier, 'COMPLETE');
      } else {
        this.getTasks(userIdentifier, 'INCOMPLETE');
      }
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
      routeParams: { userIdentifier },
      megaFilter: { selectedFilters },
    } = this.props;

    if (withLoader) taskActions.loading();

    if (!isEmpty(selectedFilters)) {
      return this.getFilteredTasks(selectedFilters, 'INCOMPLETE');
    }

    return this.getTasks(userIdentifier, 'INCOMPLETE');
  };

  refreshCompleteTasks = (cumulativeFlag = false, withLoader = true) => {
    const {
      taskActions,
      routeParams: { userIdentifier },
      megaFilter: { selectedFilters },
    } = this.props;

    if (withLoader) taskActions.loadingCompletedTasks();

    if (!isEmpty(selectedFilters)) {
      return this.getFilteredTasks(selectedFilters, 'COMPLETE');
    }

    return this.getTasks(userIdentifier, 'COMPLETE', cumulativeFlag);
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
    );

    return this.getFilteredTasks(updatedFilters, taskStatus);
  };

  getFilteredTasks = (updatedFilters, taskStatus) => {
    const {
      routeParams: { userIdentifier },
      taskActions,
      megaFilter: { filters },
    } = this.props;

    const taskFilters = {};

    if (!isEmpty(updatedFilters)) {
      Object.keys(updatedFilters).forEach(keyIndex => {
        const { filterKey } = filters[keyIndex];
        taskFilters[filterKey] = updatedFilters[keyIndex];
      });
    }

    return taskActions.getFilteredTasksForPeopleList(
      userIdentifier,
      taskStatus,
      taskFilters,
    );
  };

  render() {
    const { personData, routeParams } = this.props;
    const { fetching } = this.state;

    const viewProps = {
      routeParams,
      navigateToTab: this.navigateToTab,
      refreshTab: this.refreshTab,
      handleFilterChange: this.handleFilterChange,
      listNameVisible: true,
    };

    return (
      !fetching && (
        <>
          {personData && <PersonInfoPanel personData={personData} />}
          <TasksView
            {...viewProps}
            defaultGroupName="All tasks"
            showMembers={false}
            showNotificationAction={false}
          />
        </>
      )
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.taskState.tasks,
    isFetching: state.taskState.isFetching,
    personData: state.peopleState.personData,
    megaFilter: state.megaFilter,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetailsView);
