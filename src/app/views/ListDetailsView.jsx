import { always, cond, equals, T } from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as InvitationActions from 'actions/invitation-actions';
import * as PatientActions from 'actions/patient-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as TaskLabelActions from 'actions/task-label-actions';
import * as userApi from 'api/user-api';
import { noop } from 'helpers/utility-functions';
import TasksView from './Task/NewTasksView/TasksView';

const ASSIGNED_BY_ME = 'assigned_by_me';
const ASSIGNED_TO_ME = 'assigned_to_me';

class Home extends Component {
  state = {
    preSelectedTask: null,
  };

  async componentDidMount() {
    const {
      user,
      routeParams,
      actions,
      taskListActions,
      invitationActions,
      taskLabelActions: { getTaskListLabels },
    } = this.props;

    await invitationActions.findPendingTaskListsForUser();

    const { pendingTasklists } = this.props;

    await Promise.all(
      pendingTasklists.map(tasklist =>
        invitationActions.acceptInviteToTaskList(tasklist),
      ),
    );

    this.refreshAccessToken(user);
    actions.loading();

    const { filterBy, listName } = routeParams;
    let { taskStatus } = routeParams;
    let sortBy;

    if (!taskStatus) {
      taskStatus = 'INCOMPLETE';
    }

    if (filterBy) {
      sortBy = 'CREATED_DT';
    }

    const taskAction = cond([
      [equals(ASSIGNED_BY_ME), always(actions.getTasksAssignedByMe)],
      [equals(ASSIGNED_TO_ME), always(actions.getTasksAssignedToMe)],
      [T, always(actions.getListTasks)],
    ])(listName);

    const taskCountAction = cond([
      [equals(ASSIGNED_BY_ME), always(actions.getCountOfTasksAssignedByMe)],
      [equals(ASSIGNED_TO_ME), always(actions.getCountOfTasksAssignedToMe)],
      [T, always(actions.getListTasksCount)],
    ])(listName);

    const getAllTasks = async () => {
      await Promise.all([
        taskAction(
          routeParams.taskListIdentifier,
          sortBy,
          filterBy,
          'INCOMPLETE',
        ),
        taskCountAction(
          routeParams.taskListIdentifier,
          'ASSIGNED_TO_ME', // default view
          'COMPLETE',
        ),
      ]);

      const {
        tasks,
        completedTasks,
        routeParams: { taskIdentifier: preSelectedTaskIdentifier },
      } = this.props;

      const incompleteTasksWithSubtasks = [
        ...tasks,
        ...tasks.flatMap(({ subtasks }) => subtasks ?? []),
      ];

      const incompletePreselectedTask = incompleteTasksWithSubtasks.find(
        ({ taskIdentifier }) => preSelectedTaskIdentifier === taskIdentifier,
      );

      if (incompletePreselectedTask) {
        this.setState({
          preSelectedTask: incompletePreselectedTask,
        });
      } else {
        const completeTasksWithSubtasks = [
          ...completedTasks,
          ...completedTasks.flatMap(({ subtasks }) => subtasks ?? []),
        ];

        const completePreselectedTask = completeTasksWithSubtasks.find(
          ({ taskIdentifier }) => preSelectedTaskIdentifier === taskIdentifier,
        );

        this.setState({
          preSelectedTask: completePreselectedTask ?? null,
        });
      }
    };

    getTaskListLabels({ taskListIdentifier: routeParams.taskListIdentifier });

    if (listName !== ASSIGNED_BY_ME && listName !== ASSIGNED_TO_ME) {
      await getAllTasks().then(async () => {
        taskListActions.getTaskListById(routeParams.taskListIdentifier);

        if (routeParams.taskListIdentifier) {
          taskListActions
            .getMembersByTaskListId(routeParams.taskListIdentifier, 'ALL')
            .then(noop);
        }

        taskListActions
          .getOrganizationUsersNotInTaskList(routeParams.taskListIdentifier)
          .then(noop)
          .catch(noop);
      });
    } else {
      await getAllTasks();
    }
  }

  componentWillUpdate(nextProps) {
    const { routeParams } = this.props;

    if (
      nextProps.routeParams.taskListIdentifier !==
      routeParams.taskListIdentifier
    ) {
      const { actions, taskListActions } = this.props;

      actions.loading();

      if (nextProps.routeParams.taskListIdentifier != null) {
        taskListActions.getTaskListById(
          nextProps.routeParams.taskListIdentifier,
        );
        actions.getListTasks(
          nextProps.routeParams.taskListIdentifier,
          undefined,
          undefined,
          'INCOMPLETE',
        );
        actions.getListTasksCount(
          nextProps.routeParams.taskListIdentifier,
          undefined,
          'COMPLETE',
        );
        if (nextProps.routeParams.taskListIdentifier) {
          taskListActions.getMembersByTaskListId(
            nextProps.routeParams.taskListIdentifier,
            'ALL',
          );
        }
        taskListActions.getOrganizationUsersNotInTaskList(
          nextProps.routeParams.taskListIdentifier,
        );

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
    actions.getListTasks(
      routeParams.taskListIdentifier,
      undefined,
      undefined,
      'INCOMPLETE',
    );
    actions.getListTasksCount(
      routeParams.taskListIdentifier,
      undefined,
      'COMPLETE',
    );

    if (routeParams.taskListIdentifier) {
      taskListActions.getMembersByTaskListId(
        routeParams.taskListIdentifier,
        'ALL',
      );
    }

    taskListActions.getOrganizationUsersNotInTaskList(
      routeParams.taskListIdentifier,
    );
    patientActions.getAllPatients();
  };

  downloadPDF = () => {
    const {
      routeParams: { taskListIdentifier },
    } = this.props;

    if (taskListIdentifier) {
      window.print();
    }
  };

  handleFilterChange = (filterBy, sortBy) => {
    const {
      actions,
      routeParams: { listName, taskListIdentifier },
    } = this.props;

    actions.loading();

    if (listName === ASSIGNED_BY_ME) {
      actions
        .getTasksAssignedByMe(undefined, sortBy, filterBy, 'INCOMPLETE')
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getTasksAssignedByMe(
              undefined,
              sortBy,
              filterBy,
              'INCOMPLETE',
            );
          });
        });
      actions.getCountOfTasksAssignedByMe(
        taskListIdentifier,
        filterBy,
        'COMPLETE',
      );
    } else if (listName === ASSIGNED_TO_ME) {
      actions
        .getTasksAssignedToMe(undefined, sortBy, filterBy, 'INCOMPLETE')
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getTasksAssignedToMe(
              undefined,
              sortBy,
              filterBy,
              'INCOMPLETE',
            );
          });
        });
      actions.getCountOfTasksAssignedToMe(
        taskListIdentifier,
        filterBy,
        'COMPLETE',
      );
    } else {
      actions
        .getListTasks(taskListIdentifier, sortBy, filterBy, 'INCOMPLETE')
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getListTasks(
              taskListIdentifier,
              sortBy,
              filterBy,
              'INCOMPLETE',
            );
          });
        });
      actions.getListTasksCount(taskListIdentifier, filterBy, 'COMPLETE');
    }
  };

  handleCompletedTasksRequest = (
    selectedTaskListIdentifier,
    filterBy,
    sortBy,
  ) => {
    const {
      actions,
      routeParams: { listName, taskListIdentifier },
    } = this.props;

    if (listName === ASSIGNED_BY_ME) {
      return actions
        .getTasksAssignedByMe(
          selectedTaskListIdentifier,
          sortBy,
          filterBy,
          'COMPLETE',
          true,
        )
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getTasksAssignedByMe(
              selectedTaskListIdentifier,
              sortBy,
              filterBy,
              'COMPLETE',
              true,
            );
          });
        });
    }

    if (listName === ASSIGNED_TO_ME) {
      return actions
        .getTasksAssignedToMe(
          selectedTaskListIdentifier,
          sortBy,
          filterBy,
          'COMPLETE',
          true,
        )
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getTasksAssignedToMe(
              selectedTaskListIdentifier,
              sortBy,
              filterBy,
              'COMPLETE',
              true,
            );
          });
        });
    }

    return actions
      .getListTasks(taskListIdentifier, sortBy, filterBy, 'COMPLETE', true)
      .then(noop)
      .catch(error => {
        this.handleRetry(error, () => {
          actions.getListTasks(
            taskListIdentifier,
            sortBy,
            filterBy,
            'COMPLETE',
            true,
          );
        });
      });
  };

  handleRetry = (error, callback) => {
    if (error.message === 'Network Error') {
      userApi
        .refreshAccessToken(sessionStorage.getItem('username'))
        .then(callback)
        .catch(noop);
    }
  };

  handleSearch = () => {};

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

  render() {
    const {
      userIdentifier,
      members,
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
        refreshTask,
        toggleTaskPriority,
        addTaskComment,
      },
      tasklists,
      taskListMembers,
      pendingTasklists,
      membersNotInTaskList,
      routeParams: { listName, taskListIdentifier },
    } = this.props;

    const { preSelectedTask } = this.state;

    const allTaskLists = [...(pendingTasklists ?? []), ...(tasklists ?? [])];

    const loadedTasklist = allTaskLists.find(
      t => t.taskListIdentifier === taskListIdentifier,
    );

    let isMultiList = false;
    let title = loadedTasklist?.listName ?? 'Loading...';

    const hasTitle = Boolean(loadedTasklist?.listName);

    if (listName === ASSIGNED_BY_ME) {
      title = 'Assigned by me';
      isMultiList = true;
    } else if (listName === ASSIGNED_TO_ME) {
      title = 'Assigned to me';
      isMultiList = true;
    }

    const isSpecialList = [ASSIGNED_BY_ME, ASSIGNED_TO_ME].includes(listName);

    const taskViewProps = {
      userIdentifier,
      members,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
      refreshTask,
      addTaskComment,
      toggleTaskPriority: (task, priority) =>
        toggleTaskPriority(task, userIdentifier, priority),
      onFilter: this.handleFilterChange,
      onCompletedTasksRequest: this.handleCompletedTasksRequest,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      hasTitle,
      title,
      isSpecialList,
      showToolbar: true,
      taskList: loadedTasklist || undefined,
      isMultiList,
      taskListIdentifier,
      listName,
      preSelectedTask,
      taskListMembers,
      membersNotInTaskList,
    };

    return <TasksView {...taskViewProps} />;
  }
}

const mapStateToProps = store => ({
  tasklists: store.taskListState.tasklist,
  pendingTasklists: store.invitationState.pendingTasklists,
  members: store.taskListState.tasklistmembers,
  membersNotInTaskList: store.taskListState.orgusersnotintasklist,
  tasks: store.taskState.tasks,
  completedTasks: store.taskState.completedTasks,
  isFetching: store.taskState.isFetching,
  isCompletedTasksFetching: store.taskState.isCompletedTasksFetching,
  showingCompletedTasks: store.taskState.showingCompletedTasks,
  user: store.userState.user,
  userIdentifier: store.userState.userProfile.userIdentifier,
  selectedTaskId: store.taskState.selectedTaskId,
  currentTaskHistory: store.taskState.currentTaskHistory,
  taskListMembers: store.taskListState.tasklistmembers,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  taskLabelActions: bindActionCreators(TaskLabelActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
  invitationActions: bindActionCreators(InvitationActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
