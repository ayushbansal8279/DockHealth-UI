import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as PatientActions from 'actions/patient-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as userApi from 'api/user-api';
import { downloadPDF } from 'api/tasklist-api';
import { onButtonClicked } from 'helpers/ga-event-helper';
import { noop } from 'helpers/utility-functions';
import TaskView from './Task/TaskView';

class Inbox extends PureComponent {
  componentDidMount() {
    const { user, actions } = this.props;

    this.refreshAccessToken(user);
    actions.loading();
    actions
      .getInboxTasks('INCOMPLETE', undefined, undefined)
      .then(() => {
        actions.getInboxTasks('COMPLETE', undefined, undefined);
      })
      .catch(noop);
  }

  componentWillUpdate(nextProps) {
    const { actions, routeParams } = this.props;

    if (nextProps.routeParams.listName !== routeParams.listName) {
      actions.loading();
      actions
        .getInboxTasks('INCOMPLETE', undefined, undefined)
        .then(() => {
          actions.getInboxTasks('COMPLETE', undefined, undefined);
        })
        .catch(noop);
    }
  }

  refresh = () => {
    const { actions, patientActions } = this.props;

    actions.loading();
    actions
      .getInboxTasks('INCOMPLETE', undefined, undefined)
      .then(() => {
        actions.getInboxTasks('COMPLETE', undefined, undefined);
      })
      .catch(noop);
    patientActions.getAllPatients();
  };

  pullCompletedTasks = () => {
    const { showingCompletedTasks, actions } = this.props;

    if (!showingCompletedTasks) {
      actions.loadingCompletedTasks();
      actions.getInboxTasks('COMPLETE', undefined, undefined);
    } else {
      actions.hideCompletedTasks();
    }
  };

  downloadPDF = () => {
    const {
      routeParams: { taskListIdentifier },
    } = this.props;

    if (taskListIdentifier) {
      onButtonClicked('Print');
      downloadPDF(taskListIdentifier);
    }
  };

  filter = (filterBy, sortBy) => {
    const { actions } = this.props;

    actions.loading();
    actions
      .getInboxTasks('INCOMPLETE', sortBy, filterBy)
      .then(() => {
        actions.getInboxTasks('COMPLETE', sortBy, filterBy);
      })
      .catch(noop);
  };

  refreshAccessToken = user => {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

    if (
      sessionStorage.refreshAccessTokenTimeoutId != null ||
      sessionStorage.refreshAccessTokenTimeoutId !== undefined
    ) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      userApi
        .refreshAccessToken(user.username)
        .then(noop)
        .catch(noop);

      this.refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  };

  render() {
    const {
      userIdentifier,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      selectedTaskId,
      actions: {
        markComplete,
        storeAsCurrentTask,
        markAsUnread,
        toggleTaskPriority,
        addTaskComment,
      },
    } = this.props;

    const taskViewProps = {
      userIdentifier,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
      addTaskComment,
      toggleTaskPriority: (task, priority) =>
        toggleTaskPriority(task, userIdentifier, priority),
      pullCompletedTasks: this.pullCompletedTasks,
      onFilter: this.filter,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      title: 'Inbox',
      showToolbar: true,
      showSortingStats: false,
      isInbox: true,
      isSpecificPatient: false,
      taskListIdentifier: '',
    };

    return <TaskView {...taskViewProps} />;
  }
}

const mapStateToProps = store => ({
  members: store.taskListState.tasklistmembers,
  tasks: store.taskState.tasks,
  completedTasks: store.taskState.completedTasks,
  isFetching: store.taskState.isFetching,
  isCompletedTasksFetching: store.taskState.isCompletedTasksFetching,
  showingCompletedTasks: store.taskState.showingCompletedTasks,
  user: store.userState.user,
  userIdentifier: store.userState.userProfile.userIdentifier,
  selectedTaskId: store.taskState.selectedTaskId,
  currentTaskHistory: store.taskState.currentTaskHistory,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
