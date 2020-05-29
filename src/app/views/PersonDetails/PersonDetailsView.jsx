import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { setHeader as setHeaderRaw } from 'actions/header-actions';
import * as PeopleActions from 'actions/people-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskGroupActions from 'actions/task-group-list-actions';
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
        this.refreshTab(true);
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
    } = this.props;

    if (withLoader) taskActions.loading();

    taskActions.getTasksAssignedToSpecificUser(
      userIdentifier,
      undefined,
      undefined, // TODO: filters
      undefined, // TODO: filters
      'INCOMPLETE',
    );
  };

  refreshCompleteTasks = (cumulativeFlag = false, withLoader = true) => {
    const {
      taskActions,
      routeParams: { userIdentifier },
    } = this.props;

    if (withLoader) taskActions.loadingCompletedTasks();

    return taskActions.getTasksAssignedToSpecificUser(
      userIdentifier,
      undefined,
      undefined, // TODO: filters
      undefined, // TODO: filters
      'COMPLETE',
      cumulativeFlag,
    );
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

  render() {
    const { personData, routeParams } = this.props;
    const { fetching } = this.state;

    const viewProps = {
      routeParams,
      navigateToTab: this.navigateToTab,
      refreshTab: this.refreshTab,
      dragAndDropDisabled: true,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetailsView);
