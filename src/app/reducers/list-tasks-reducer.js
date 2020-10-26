import {
  CLEAR_TASKS_SEARCH,
  GET_COMPLETED_TASKS_SUCCESS,
  GET_COMPLETED_TASKS_SUCCESS_CUMULATIVE,
  GET_TASKS_SUCCESS,
  GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS,
  GET_TASKS_BY_GROUPS_SUCCESS,
  GET_TASKS_COUNT_SUCCESS,
  HIDE_COMPLETED_TASKS,
  REQUEST_COMPLETED_TASKS,
  REQUEST_TASKS,
  TASK_NEW_PAGE_DOWNLOADED,
  GET_MORE_TASKS_REQUEST,
  TASK_COUNTERS_SUCCESS,
  RESET_TASK_COUNTERS,
  MARK_COMPLETE_TASK_STATUS_SUCCESS,
  TASK_ARCHIVED,
  UPDATE_TASK_SUCCESS,
  REQUEST_LOAD_SUBTASKS,
  LOAD_SUBTASKS_SUCCESS,
  REFRESH_ANOTHER_TASK_SUCCESS,
  INCREASE_INCOMPLETE_TASK_COUNTERS,
  INCREASE_COMPLETE_TASK_COUNTERS,
  REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
  REQUEST_TASKLIST_GROUP_TASKS,
} from 'actions/action-types';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  completedTasks: [],
  tasks: [],
  groupedTasks: {},
  completedGroupedTasks: {},
  newlyAddedTaskIds: [],
  isFetching: false,
  isCompletedTasksFetching: false,
  showingCompletedTasks: false,
  taskCountStats: null,
  isFetchingMoreTasks: false,
  taskCounters: {},
  // isFetchingSubTasks: false,
};

const mapTasksSuccess = task => ({
  ...task,
  subtasks: task.subtasks?.map(subtask => ({
    ...subtask,
    patient: task.patient,
  })),
});

const updateTaskInList = (taskGroups, updateTaskCallback) =>
  taskGroups.map(group => {
    const updatedTasks = group.tasks ? updateTaskCallback(group.tasks) : [];
    return { ...group, tasks: updatedTasks };
  });

const updateTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    groupedTasks: {
      ...state.groupedTasks,
      taskGroups: updateTaskInList(
        state.groupedTasks?.taskGroups,
        updateTaskFromAction,
      ),
    },
  };
};

const updateCompletedTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    completedGroupedTasks: {
      ...state.completedGroupedTasks,
      taskGroups: updateTaskInList(
        state.completedGroupedTasks?.taskGroups,
        updateTaskFromAction,
      ),
    },
  };
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const TaskReducer = (state = initialState, action) => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case GET_TASKS_SUCCESS: {
      let { tasks } = action;

      tasks = tasks.map(mapTasksSuccess);

      return { ...state, tasks, isFetching: false };
    }

    case GET_COMPLETED_TASKS_SUCCESS: {
      let { tasks } = action;

      tasks = tasks.map(mapTasksSuccess);

      return {
        ...state,
        completedTasks: tasks,
        isCompletedTasksFetching: false,
        showingCompletedTasks: true,
        isFetching: false,
      };
    }

    case GET_COMPLETED_TASKS_SUCCESS_CUMULATIVE: {
      let { tasks } = action;

      tasks = tasks.map(mapTasksSuccess);

      return {
        ...state,
        completedTasks: state.completedTasks.concat(tasks),
        isCompletedTasksFetching: false,
        showingCompletedTasks: true,
        isFetching: false,
        isFetchingMoreTasks: false,
      };
    }

    case GET_TASKS_BY_GROUPS_SUCCESS: {
      const { groupedTasks } = action;
      const updatedTaskGroups = groupedTasks?.taskGroups?.map(taskGroup => {
        return {
          ...taskGroup,
          isLoadingGroup: false,
        };
      });

      return {
        ...state,
        groupedTasks: {
          ...groupedTasks,
          taskGroups: updatedTaskGroups,
        },
        isFetching: false,
      };
    }

    case GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS: {
      const { groupedTasks } = action;
      const group = groupedTasks.taskGroups[0];

      const groupToUpdate = state.completedGroupedTasks.taskGroups?.find(
        ({ groupIdentifier }) => groupIdentifier === group?.groupIdentifier,
      );
      const groupToUpdateIndex =
        state.completedGroupedTasks?.taskGroups?.indexOf(groupToUpdate) || -1;
      const updatedTaskGroups =
        state.completedGroupedTasks?.taskGroups?.map(taskGroup =>
          taskGroup.groupIdentifier === group?.groupIdentifier
            ? {
                ...taskGroup,
                tasks: taskGroup.tasks.concat(group.tasks),
                pageNumber: group.pageNumber,
                hasMore: group.hasMore,
              }
            : taskGroup,
        ) || [];
      if (groupToUpdateIndex === -1) {
        updatedTaskGroups.push(group);
      }
      const updatedGroupedTasks = {
        ...state.completedGroupedTasks,
        taskGroups: updatedTaskGroups,
      };

      return {
        ...state,
        completedGroupedTasks: updatedGroupedTasks,
        isCompletedTasksFetching: false,
        showingCompletedTasks: true,
        isFetching: false,
      };
    }

    case REQUEST_TASKLIST_GROUP_TASKS: {
      const { fetchedGroupIdentifier } = action;

      const groupToUpdate = state.groupedTasks?.taskGroups?.find(
        ({ groupIdentifier }) => groupIdentifier === fetchedGroupIdentifier,
      );
      const groupToUpdateIndex = state.groupedTasks?.taskGroups?.indexOf(
        groupToUpdate,
      );
      const updatedTaskGroups = state.groupedTasks?.taskGroups?.map(taskGroup =>
        taskGroup.groupIdentifier === fetchedGroupIdentifier
          ? {
              ...taskGroup,
              isLoadingGroup: true,
            }
          : taskGroup,
      );
      if (groupToUpdateIndex === -1) {
        updatedTaskGroups.push({
          groupIdentifier: fetchedGroupIdentifier,
          tasks: [],
          hasMore: false,
          pageNumber: 1,
          isLoadingGroup: true,
        });
      }

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: updatedTaskGroups,
        },
      };
    }

    case REQUEST_TASKLIST_GROUP_TASKS_SUCCESS: {
      const { groupOfTasks } = action;
      const group = groupOfTasks.taskGroups[0];

      const groupToUpdate = state.groupedTasks?.taskGroups?.find(
        ({ groupIdentifier }) => groupIdentifier === group?.groupIdentifier,
      );
      const groupToUpdateIndex = state.groupedTasks?.taskGroups?.indexOf(
        groupToUpdate,
      );
      const updatedTaskGroups = state.groupedTasks?.taskGroups?.map(taskGroup =>
        taskGroup.groupIdentifier === group?.groupIdentifier
          ? {
              ...taskGroup,
              tasks: taskGroup.tasks.concat(group.tasks),
              pageNumber: group.pageNumber,
              hasMore: group.hasMore,
              isLoadingGroup: false,
            }
          : taskGroup,
      );
      if (groupToUpdateIndex === -1) {
        // new group
        group.isLoadingGroup = false;
        updatedTaskGroups.push(group);
      }

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: updatedTaskGroups,
        },
      };
    }

    case GET_TASKS_COUNT_SUCCESS: {
      const { stats } = action;
      return { ...state, taskCountStats: stats };
    }

    case REQUEST_TASKS:
      return {
        ...state,
        isFetching: true,
        tasks: [],
        completedTasks: [],
        showingCompletedTasks: false,
      };

    case REQUEST_COMPLETED_TASKS:
      return {
        ...state,
        completedTasks: [],
        isCompletedTasksFetching: true,
      };

    case RESET_TASK_COUNTERS:
      return {
        ...state,
        taskCounters: {},
      };

    case TASK_COUNTERS_SUCCESS:
      return {
        ...state,
        taskCounters: action.payload,
      };

    case CLEAR_TASKS_SEARCH:
      return {
        ...state,
        tasks: [],
        completedTasks: [],
      };

    case INCREASE_INCOMPLETE_TASK_COUNTERS: {
      return {
        ...state,
        taskCounters: state.taskCounters
          ? {
              ...state.taskCounters,
              incomplete: state.taskCounters?.incomplete + 1,
            }
          : {},
      };
    }

    case INCREASE_COMPLETE_TASK_COUNTERS:
      return {
        ...state,
        taskCounters: state.taskCounters
          ? {
              ...state.taskCounters,
              complete: state.taskCounters.complete + 1,
            }
          : {},
      };

    case HIDE_COMPLETED_TASKS:
      return { ...state, showingCompletedTasks: false, completedTasks: [] };

    case TASK_NEW_PAGE_DOWNLOADED: {
      const { tasks: actionTasks, status } = action;

      const stateTasksKey = status === 'COMPLETE' ? 'completedTasks' : 'tasks';

      return {
        ...state,
        [stateTasksKey]: [
          ...(state[stateTasksKey] || []),
          ...(actionTasks || []),
        ],
      };
    }

    case GET_MORE_TASKS_REQUEST: {
      return { ...state, isFetchingMoreTasks: true };
    }

    case MARK_COMPLETE_TASK_STATUS_SUCCESS:
    case TASK_ARCHIVED: {
      return TaskBaseReducer(state, action, updateCompletedTasksStateCallback);
    }

    case REQUEST_LOAD_SUBTASKS: {
      // return { ...state, isFetchingSubTasks: true };
      const { task } = action;

      const groupedTasks =
        task.status === 'COMPLETE'
          ? state.completedGroupedTasks
          : state.groupedTasks;

      const updatedTaskGroups = groupedTasks?.taskGroups?.map(taskGroup => {
        return {
          ...taskGroup,
          tasks: taskGroup?.tasks?.map(t => {
            if (
              t.taskIdentifier !== task.parentTaskIdentifier &&
              t.taskIdentifier !== task.taskIdentifier
            ) {
              return t;
            }

            if (task.taskIdentifier === t.taskIdentifier) {
              return { ...t, ...task, isFetchingSubTasks: true };
            }

            return {
              ...t,
            };
          }),
        };
      });
      const updatedGroupedTasks = {
        ...groupedTasks,
        taskGroups: updatedTaskGroups,
      };

      if (task.status === 'COMPLETE') {
        return {
          ...state,
          completedGroupedTasks: updatedGroupedTasks,
        };
      }

      return {
        ...state,
        groupedTasks: updatedGroupedTasks,
      };
    }

    case UPDATE_TASK_SUCCESS:
    case LOAD_SUBTASKS_SUCCESS:
    case REFRESH_ANOTHER_TASK_SUCCESS: {
      const { task } = action;

      const groupedTasks =
        task.status === 'COMPLETE'
          ? state.completedGroupedTasks
          : state.groupedTasks;

      const updatedTaskGroups = groupedTasks?.taskGroups?.map(taskGroup => {
        return {
          ...taskGroup,
          tasks: taskGroup?.tasks?.map(t => {
            if (
              t.taskIdentifier !== task.parentTaskIdentifier &&
              t.taskIdentifier !== task.taskIdentifier
            ) {
              return t;
            }

            if (task.taskIdentifier === t.taskIdentifier) {
              return { ...t, ...task };
            }

            return {
              ...t,
              subtasks: t.subtasks.map(subtask =>
                subtask.taskIdentifier === task.taskIdentifier
                  ? { ...subtask, ...task }
                  : subtask,
              ),
              isFetchingSubTasks: false,
            };
          }),
        };
      });
      const updatedGroupedTasks = {
        ...groupedTasks,
        taskGroups: updatedTaskGroups,
      };

      if (task.status === 'COMPLETE') {
        return {
          ...state,
          completedGroupedTasks: updatedGroupedTasks,
        };
      }

      return {
        ...state,
        groupedTasks: updatedGroupedTasks,
      };
    }

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
};

export default TaskReducer;
