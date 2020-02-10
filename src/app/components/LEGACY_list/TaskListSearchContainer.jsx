import Grid from '@material-ui/core/Grid';
import React from 'react';
import { connect, useSelector } from 'react-redux';
import { useMount, useUnmount } from 'react-use';
import { bindActionCreators } from 'redux';

import * as TaskActions from '../../actions/task-actions';
import * as TaskListActions from '../../actions/tasklist-actions';
import { groupTasksAndCompletedTasksByList } from '../../helpers/group-tasks-by-list';
import TaskView from '../../views/TaskView';
import CubesLoader from '../common/CubesLoader';

const TaskListLayout = ({
  searchedTasks,
  isFetching,
  isCompletedTasksFetching,
  userIdentifier,
  taskActions,
  showingCompletedTasks,
  searchPerformed,
  onFilter,
}) => {
  const selectedTaskId = useSelector(
    store => store.taskState.selectedTask?.taskIdentifier,
  );

  const lists = groupTasksAndCompletedTasksByList(
    searchedTasks.tasks,
    searchedTasks.completedTasks,
  );

  const taskViewProps = {
    userIdentifier,
    tasks: searchedTasks.tasks,
    completedTasks: searchedTasks.completedTasks,
    isFetching,
    isCompletedTasksFetching,
    showingCompletedTasks,
    markComplete: taskActions.markComplete,
    selectedTaskId,
    storeAsCurrentTask: taskActions.storeAsCurrentTask,
    markAsUnread: taskActions.markAsUnread,
    addTaskComment: taskActions.addTaskComment,
    toggleTaskPriority: (task, priority) =>
      taskActions.toggleTaskPriority(task, userIdentifier, priority),
    showToolbar: true,
    showAddTaskButton: false,
    isMultiList: true,
    isSpecificPatient: false,
    globalSearch: true,
    onFilter,
  };

  if (searchPerformed) {
    // return !isFetching && (!lists || lists.length === 0) ? (
    return !isFetching && !lists ? (
      <Grid container justify="center">
        <b>No matching tasks</b>
      </Grid>
    ) : (
      <TaskView {...taskViewProps} />
    );
  }
  return '';
};

const TaskListSearchContainer = ({
  userIdentifier,
  tasks,
  completedTasks,
  isFetching,
  isCompletedTasksFetching,
  taskActions,
  showingCompletedTasks,
  taskListActions,
  searchPerformed,
  onFilter,
}) => {
  useMount(() => {
    taskListActions.getPersonTasklistAccumulatedStats();
  });

  useUnmount(() => {
    taskActions.resetTaskSearch();
    taskListActions.resetTasklistStats();
  });

  const searchedTasks = {
    tasks,
    completedTasks,
  };

  const taskListProps = {
    searchedTasks,
    isFetching,
    isCompletedTasksFetching,
    userIdentifier,
    taskActions,
    showingCompletedTasks,
    searchPerformed,
    onFilter,
  };

  if (isFetching) {
    return <CubesLoader size={40} />;
  }

  return !isFetching && tasks && <TaskListLayout {...taskListProps} />;
};

function mapStateToProps(state) {
  return {
    tasklists: state.taskListState.tasklist,
    tasks: state.taskState.tasks,
    completedTasks: state.taskState.completedTasks,
    isFetching: state.taskState.isFetching,
    isCompletedTasksFetching: state.taskState.isCompletedTasksFetching,
    showingCompletedTasks: state.taskState.showingCompletedTasks,
    user: state.userState.user,
    userIdentifier: state.userState.userProfile.userIdentifier,
    selectedTaskId: state.taskState.selectedTaskId,
    selectedTask: state.taskState.selectedTask,
    currentTaskHistory: state.taskState.currentTaskHistory,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListSearchContainer);
