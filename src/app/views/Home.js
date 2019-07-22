import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TaskView from './TaskView';
import * as TaskActions from '../actions/task-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import * as PatientActions from '../actions/patient-actions';
import * as userApi from '../api/user-api';
import { downloadPDF } from '../api/tasklist-api';

class Home extends React.Component {
  componentDidMount() {
    const {
      user, routeParams, actions, taskListActions,
    } = this.props;

    this.refreshAccessToken(user);
    actions.loading();
    taskListActions.getTaskListById(routeParams.taskListId);
    actions.getListTasks(routeParams.taskListId, undefined, undefined, 'INCOMPLETE');
    if (routeParams.taskListId) {
      taskListActions.getMembersByTaskListId(routeParams.taskListId, 'ALL');
    }
    taskListActions.getOrganizationUsersNotInTaskList(routeParams.taskListId);
  }

  componentWillUpdate(nextProps) {
    const { routeParams } = this.props;

    if (nextProps.routeParams.listName !== routeParams.listName) {
      const { actions, taskListActions } = this.props;
      const { listName } = nextProps.routeParams;

      actions.loading();
      if (listName != null && nextProps.routeParams.taskListId != null) {
        taskListActions.getTaskListById(nextProps.routeParams.taskListId);
        actions.getListTasks(nextProps.routeParams.taskListId, undefined, undefined, 'INCOMPLETE');
        if (nextProps.routeParams.taskListId) {
          taskListActions.getMembersByTaskListId(nextProps.routeParams.taskListId, 'ALL');
        }
        taskListActions.getOrganizationUsersNotInTaskList(nextProps.routeParams.taskListId);

        // Start with no selected tasks
        actions.storeAsCurrentTask(null);
      }
    }
  }

  refresh = () => {
    const {
      actions,
      routeParams,
      taskListActions,
      patientActions,
    } = this.props;

    actions.loading();
    actions.getListTasks(routeParams.taskListId, undefined, undefined, 'INCOMPLETE');
    if (routeParams.taskListId) {
      taskListActions.getMembersByTaskListId(routeParams.taskListId, 'ALL');
    }
    taskListActions.getOrganizationUsersNotInTaskList(routeParams.taskListId);
    patientActions.getAllPatients();
  }

  pullCompletedTasks = () => {
    const { showingCompletedTasks, actions, routeParams } = this.props;

    if (!showingCompletedTasks) {
      actions.loadingCompletedTasks();
      actions.getListTasks(routeParams.taskListId, undefined, undefined, 'COMPLETE');
    } else {
      actions.hideCompletedTasks();
    }
  }

  downloadPDF = () => {
    const { routeParams: { taskListId } } = this.props;

    if (taskListId) {
      downloadPDF(taskListId);
    }
  }

  handleFilterChange = (filterBy, sortBy) => {
    const { actions, routeParams: { taskListId } } = this.props;

    actions.loading();
    actions.getListTasks(taskListId, sortBy, filterBy, 'INCOMPLETE');
    actions.getListTasks(taskListId, sortBy, filterBy, 'COMPLETE');
  }

  handleSearch = () => {

  }

  refreshAccessToken(user) {
    const systemTimeout = 5 * 60 * 1000;

    if (sessionStorage.refreshAccessTokenTimeoutId != null
      || sessionStorage.refreshAccessTokenTimeoutId !== undefined) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }
    const comp = this;
    const refreshAccessTokenTimeoutId = setTimeout(() => {
      userApi.refreshAccessToken(user.username)
        .then(() => {
          console.log('refreshed tokens');
        })
        .catch((e) => {
          console.log(e);
        });
      // set again
      comp.refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem('refreshAccessTokenTimeoutId', refreshAccessTokenTimeoutId);
  }

  render() {
    const {
      userId,
      members,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      selectedTaskId,
      actions: { markComplete, storeAsCurrentTask, toggleTaskPriority, addTaskComment },
      tasklists,
      routeParams: { taskListId },
    } = this.props;

    const loadedTasklist = tasklists.find(t => `${t.taskListId}` === taskListId);
    const title = loadedTasklist ? loadedTasklist.listName : 'Loading...';

    const taskViewProps = {
      userId,
      members,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      addTaskComment,
      toggleTaskPriority: (task, priority) => toggleTaskPriority(task, userId, priority),
      pullCompletedTasks: this.pullCompletedTasks,
      onFilter: this.handleFilterChange,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      title,
      showToolbar: true,
    };

    return <TaskView {...taskViewProps} />;
  }
}

const mapStateToProps = store => ({
  tasklists: store.taskListState.tasklist,
  members: store.taskListState.tasklistmembers,
  tasks: store.taskState.tasks,
  completedTasks: store.taskState.completedTasks,
  isFetching: store.taskState.isFetching,
  isCompletedTasksFetching: store.taskState.isCompletedTasksFetching,
  showingCompletedTasks: store.taskState.showingCompletedTasks,
  user: store.userState.user,
  userId: store.userState.userProfile.userId,
  selectedTaskId: store.taskState.selectedTaskId,
  currentTaskHistory: store.taskState.currentTaskHistory,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Home);
