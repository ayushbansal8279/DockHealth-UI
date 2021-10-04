import {
  GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS,
  GET_TASKS_BY_GROUPS_SUCCESS,
  REQUEST_COMPLETED_TASKS,
  REQUEST_TASKS,
  GET_MORE_TASKS_REQUEST,
  LIST_DETAILS_TASK_COUNTERS_SUCCESS,
  RESET_LIST_DETAILS_TASK_COUNTERS,
  INCREASE_INCOMPLETE_TASK_COUNTERS,
  INCREASE_COMPLETE_TASK_COUNTERS,
  REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
  REQUEST_TASKLIST_GROUP_TASKS,
  TASK_GROUP_LIST_REQUEST,
  TASK_GROUP_LIST_SUCCESS,
  TASK_GROUP_LIST_FAILURE,
  SET_LIST_DETAILS_TASKS_SORT,
  REQUEST_ALL_LIST_DETAILS_GROUPS,
  ADD_TASK,
  UPDATE_TEMPLATE_BUNDLE,
  ADD_TEMPLATE_BUNDLE,
  DELETE_TEMPLATE_BUNDLE,
  COMPLETE_TEMPLATE_BUNDLE,
} from 'actions/action-types';
import { mapWithRemove } from 'helpers/utility-functions';
import { TaskGroupType, TaskItemType } from 'helpers/task-helpers';
import { updateBundleInList } from 'helpers/tasklist-helpers';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  taskListIdentifier: null,
  groupedTasks: {},
  completedGroupedTasks: {},
  newlyAddedTaskIds: [],
  isFetching: false,
  isCompletedTasksFetching: false,
  showingCompletedTasks: false,
  taskCountStats: null,
  isFetchingMoreTasks: false,
  taskCounters: {},
  listGroups: [],
  isFetchingGroups: false,
  listGroupsError: '',
  groupsInitialized: false,
  sort: {
    key: null,
    order: null,
  },
};

function updateGroupInState(updateCallback, taskGroupIdentifier, state) {
  return {
    ...state,
    groupedTasks: {
      ...state.groupedTasks,
      taskGroups: state.groupedTasks?.taskGroups?.map(g =>
        g.groupIdentifier === taskGroupIdentifier ||
        (!taskGroupIdentifier && g.groupName === 'DEFAULT')
          ? updateCallback(g)
          : g,
      ),
    },
  };
}

function updateBundleInState(updateCallback, bundleIdentifier, state) {
  return {
    ...state,
    groupedTasks: {
      ...state.groupedTasks,
      taskGroups: state.groupedTasks?.taskGroups?.map(g => ({
        ...g,
        tasks: g.tasks.map(t =>
          t.identifier === bundleIdentifier ? updateCallback(t) : t,
        ),
      })),
    },
  };
}

const updateTaskInList = (taskGroups, updateTaskCallback) =>
  taskGroups?.map(group => ({
    ...group,
    tasks: mapWithRemove(t => {
      if (t.itemType === TaskItemType.BUNDLE) {
        return {
          ...t,
          tasks: mapWithRemove(updateTaskCallback, t.tasks),
        };
      }
      return updateTaskCallback(t);
    }, group.tasks),
  }));

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
const ListDetailsReducer = (state = initialState, action) => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case TASK_GROUP_LIST_REQUEST:
      return {
        ...state,
        groupsInitialized: true,
      };

    case TASK_GROUP_LIST_SUCCESS:
      return {
        ...state,
        listGroups: action.listGroups,
        isFetchingGroups: false,
        groupsInitialized: true,
      };

    case TASK_GROUP_LIST_FAILURE:
      return {
        ...state,
        listGroupsError: 'Something went wrong',
        isFetchingGroups: false,
      };

    case GET_TASKS_BY_GROUPS_SUCCESS: {
      const { groupedTasks, taskListIdentifier } = action;
      const updatedTaskGroups = groupedTasks?.taskGroups?.map(taskGroup => {
        return {
          ...taskGroup,
          isLoadingGroup: false,
        };
      });

      return {
        ...state,
        taskListIdentifier,
        groupedTasks: {
          ...groupedTasks,
          taskGroups: updatedTaskGroups,
        },
        isFetching: false,
      };
    }

    case GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS: {
      const { groupedTasks, loadingMore, taskListIdentifier } = action;
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
                tasks: loadingMore
                  ? taskGroup.tasks.concat(group.tasks)
                  : group.tasks,
                hasMore: group.hasMore,
                moreTasksIndex: group.moreTasksIndex,
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
        taskListIdentifier,
        completedGroupedTasks: updatedGroupedTasks,
        isCompletedTasksFetching: false,
        isFetchingMoreTasks: false,
        showingCompletedTasks: true,
        isFetching: false,
      };
    }

    case REQUEST_ALL_LIST_DETAILS_GROUPS: {
      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.map(taskGroup => ({
            ...taskGroup,
            isLoadingGroup: true,
          })),
        },
      };
    }

    case REQUEST_TASKLIST_GROUP_TASKS: {
      const { fetchedGroupIdentifier, refresh } = action;

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
              isLoadingGroup: !!refresh,
              isFetchingMoreTasks: !refresh,
            }
          : taskGroup,
      );
      if (groupToUpdateIndex === -1) {
        updatedTaskGroups.push({
          groupIdentifier: fetchedGroupIdentifier,
          tasks: [],
          hasMore: false,
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
      const { groupOfTasks, refresh } = action;

      const groupsToUpdate = groupOfTasks.taskGroups;

      let updatedTaskGroups = state.groupedTasks?.taskGroups;

      groupsToUpdate.forEach(group => {
        let groupExists = false;
        updatedTaskGroups = updatedTaskGroups?.map(taskGroup => {
          if (taskGroup.groupIdentifier === group?.groupIdentifier) {
            groupExists = true;
            return {
              ...taskGroup,
              tasks: refresh
                ? group.tasks
                : taskGroup.tasks.concat(group.tasks),
              hasMore: group.hasMore,
              moreTasksIndex: group.moreTasksIndex,
              isLoadingGroup: false,
              isFetchingMoreTasks: false,
            };
          }

          return taskGroup;
        });

        if (!groupExists) {
          const groupToAdd = { ...group };
          groupToAdd.isLoadingGroup = false;
          updatedTaskGroups.push(groupToAdd);
        }
      });

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: updatedTaskGroups,
        },
      };
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

    case RESET_LIST_DETAILS_TASK_COUNTERS:
      return {
        ...state,
        taskCounters: {},
      };

    case LIST_DETAILS_TASK_COUNTERS_SUCCESS:
      return {
        ...state,
        taskCounters: action.payload,
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

    case GET_MORE_TASKS_REQUEST: {
      return { ...state, isFetchingMoreTasks: true };
    }

    case SET_LIST_DETAILS_TASKS_SORT: {
      const { key, order } = action.payload || {};

      return {
        ...state,
        sort: {
          key,
          order,
        },
      };
    }

    case UPDATE_TEMPLATE_BUNDLE: {
      const { bundleIdentifier, dataToUpdate } = action;

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.map(g => ({
            ...g,
            tasks: updateBundleInList(dataToUpdate, bundleIdentifier, g.tasks),
          })),
        },
      };
    }

    case ADD_TASK: {
      const { task: addedTask } = action;

      const taskListIdentifier = addedTask.taskList?.taskListIdentifier;

      if (taskListIdentifier !== state.taskListIdentifier) {
        return state;
      }

      const bundleIdentifier = addedTask.taskGroups?.find(
        ({ groupType }) => groupType === TaskGroupType.BUNDLE,
      )?.taskGroupIdentifier;

      if (bundleIdentifier) {
        return updateBundleInState(
          bundle => ({
            ...bundle,
            tasks: [...(bundle.tasks || []), addedTask],
          }),
          bundleIdentifier,
          state,
        );
      }

      const taskGroupIdentifier = addedTask.taskGroups?.find(
        ({ groupType }) => groupType === TaskGroupType.TASKLIST,
      )?.taskGroupIdentifier;

      return updateGroupInState(
        group => ({
          ...group,
          tasks: [addedTask, ...(group.tasks || [])],
        }),
        taskGroupIdentifier,
        state,
      );
    }

    case ADD_TEMPLATE_BUNDLE: {
      const { bundle: addedBundle } = action;

      const {
        taskListIdentifier,
        parentTaskGroupIdentifier: taskGroupIdentifier,
      } = addedBundle;

      if (taskListIdentifier !== state.taskListIdentifier) {
        return state;
      }

      return updateGroupInState(
        group => ({
          ...group,
          tasks: [addedBundle, ...(group.tasks || [])],
        }),
        taskGroupIdentifier,
        state,
      );
    }

    case DELETE_TEMPLATE_BUNDLE:
    case COMPLETE_TEMPLATE_BUNDLE: {
      const { bundleIdentifier } = action;

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.map(g => ({
            ...g,
            tasks: g.tasks?.filter(t => t.identifier !== bundleIdentifier),
          })),
        },
      };
    }

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
};

export default ListDetailsReducer;
