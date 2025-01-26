import * as ActionTypes from 'actions/action-types';
import move from 'ramda/src/move';
import { reorderTasksForWorkflow } from 'helpers/workflow-helpers';
import { TaskGroupType, TaskItemType } from 'helpers/task-helpers';
import { updateBundleInList } from 'helpers/tasklist-helpers';
import { updateTasksStateCallback, updateTasksMap } from './reducer-helper';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  taskListIdentifier: null,
  groupedTasks: {},
  tasksIdentifiers: [],
  tasksMap: {},
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
  sort: {
    key: null,
    order: null,
  },
  listCustomFields: [],
  searchTerm: '',
  organizationIdentifier: '',
  displayOptions: [],
};

function updateGroupInState(
  updateCallback,
  taskGroupIdentifier,
  taskItem,
  state,
) {
  const updatedMap = updateTasksMap(state, taskItem);

  return {
    ...state,
    groupedTasks: {
      ...state.groupedTasks,
      taskGroups: state.groupedTasks?.taskGroups?.map((g) =>
        g.groupIdentifier === taskGroupIdentifier ||
        (!taskGroupIdentifier && g.groupName === 'DEFAULT')
          ? updateCallback(g)
          : g,
      ),
    },
    tasksMap: {
      ...state.tasksMap,
      ...updatedMap,
    },
  };
}

function updateBundleTasksInState(bundleIdentifier, updatedData, state) {
  const updatedMap = {
    [bundleIdentifier]: {
      ...state.tasksMap[bundleIdentifier],
      ...updatedData,
      tasks: [
        ...new Set([
          ...(state.tasksMap[bundleIdentifier]?.tasks || []),
          ...updatedData?.tasks.map((task) => task.identifier),
        ]),
      ],
    },
  };

  // add tasks and subtasks in the bundle
  for (const task of updatedData?.tasks) {
    updatedMap[task.identifier] = {
      ...updatedMap[task.identifier],
      ...task,
    };
    for (const subtask of task?.subtasks) {
      updatedMap[subtask.identifier] = {
        ...updatedMap[subtask.identifier],
        ...subtask,
      };
    }
  }

  return {
    ...state,
    tasksMap: {
      ...state.tasksMap,
      ...updatedMap,
    },
  };
}

function updateBundleInState(bundleIdentifier, updatedData, state) {
  return {
    ...state,
    tasksMap: {
      ...state.tasksMap,
      [bundleIdentifier]: {
        ...updatedData,
        tasks: [
          ...new Set([
            ...(state.tasksMap[bundleIdentifier]?.tasks || []),
            ...updatedData?.tasks.map((task) => task.identifier),
          ]),
        ],
      },
    },
  };
}

const ListDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS: {
      const { groupedTasks, loadingMore, taskListIdentifier } = action;
      const group = groupedTasks[0];

      const groupToUpdate = state.completedGroupedTasks.taskGroups?.find(
        ({ groupIdentifier }) => groupIdentifier === group?.groupIdentifier,
      );
      const groupToUpdateIndex =
        state.completedGroupedTasks?.taskGroups?.indexOf(groupToUpdate) || -1;
      const updatedTaskGroups =
        state.completedGroupedTasks?.taskGroups?.map((taskGroup) =>
          taskGroup.groupIdentifier === group?.groupIdentifier
            ? {
                ...taskGroup,
                tasks: loadingMore
                  ? taskGroup.tasks.concat(group.tasks) // TODO - review
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
    case ActionTypes.INITIALIZE_TASK_LIST_STATE: {
      return {
        ...state,
        ...initialState,
        taskListIdentifier: action.taskListIdentifier,
      };
    }
    case ActionTypes.CLEAR_TASK_LIST_STATE: {
      return {
        ...state,
        taskListIdentifier: null,
      };
    }

    case ActionTypes.ADD_LIST_CUSTOM_FIELD: {
      const { listCustomFields } = state;
      const { addedCustomField } = action;
      return {
        ...state,
        listCustomFields: [...(listCustomFields || []), addedCustomField],
      };
    }

    case ActionTypes.UPDATE_LIST_CUSTOM_FIELD: {
      const { listCustomFields } = state;
      const { updatedCustomField } = action;
      return {
        ...state,
        listCustomFields: listCustomFields.map((field) =>
          updatedCustomField.identifier === field.identifier
            ? { ...field, ...updatedCustomField }
            : field,
        ),
      };
    }

    case ActionTypes.DELETE_LIST_CUSTOM_FIELD: {
      const { listCustomFields } = state;
      const { deletedCustomFieldIdentifier } = action;
      return {
        ...state,
        listCustomFields: listCustomFields.filter(
          ({ identifier }) => deletedCustomFieldIdentifier !== identifier,
        ),
      };
    }

    case ActionTypes.GET_LIST_CUSTOM_FIELDS_SUCCESS: {
      const { listCustomFields } = action;
      return {
        ...state,
        listCustomFields,
      };
    }
    case ActionTypes.GET_LIST_CUSTOM_FIELDS_FAILURE: {
      return {
        ...state,
        listCustomFields: [],
      };
    }
    case ActionTypes.GET_TASKS_GROUPS_LIST_SUCCESS: {
      return {
        ...state,
        listGroups: action.groups,
        isFetchingGroups: false,
        groupsInitialized: true,
      };
    }

    case ActionTypes.GET_TASKS_GROUPS_LIST_FAILURE: {
      return {
        ...state,
        listGroupsError: 'Something went wrong',
        isFetchingGroups: false,
      };
    }

    case ActionTypes.GET_CURRENT_LIST_TASKS_SUCCESS: {
      const { groupedTasks } = action;

      let newMap = {};
      if (groupedTasks) {
        for (const taskGroup of groupedTasks) {
          const taskItems = taskGroup?.tasks;
          for (const taskItem of taskItems) {
            newMap = {
              ...newMap,
              ...updateTasksMap(state, taskItem),
            };
          }
        }
      }

      const updatedGroups = groupedTasks?.map((g) => ({
        ...g,
        tasks: [...new Set(g?.tasks.map((task) => task?.identifier || task))],
        isLoadingGroup: false,
        isFetchingMoreTasks: false,
      }));

      return {
        ...state,
        groupedTasks: {
          taskGroups: updatedGroups,
        },
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
        isFetching: false,
      };
    }

    case ActionTypes.REQUEST_ALL_LIST_DETAILS_GROUPS: {
      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.map((taskGroup) => ({
            ...taskGroup,
            isLoadingGroup: true,
          })),
        },
      };
    }

    case ActionTypes.REQUEST_TASKLIST_GROUP_TASKS: {
      const { fetchedGroupIdentifier, refresh } = action;

      const groupToUpdate = state.groupedTasks?.taskGroups?.find(
        ({ groupIdentifier }) => groupIdentifier === fetchedGroupIdentifier,
      );
      const updatedTaskGroups =
        state.groupedTasks?.taskGroups?.map((taskGroup) =>
          taskGroup.groupIdentifier === fetchedGroupIdentifier
            ? {
                ...taskGroup,
                isLoadingGroup: !!refresh,
                isFetchingMoreTasks: !refresh,
                tasks: refresh ? [] : taskGroup.tasks,
              }
            : taskGroup,
        ) || [];

      if (!groupToUpdate) {
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

    case ActionTypes.REQUEST_TASKLIST_GROUP_TASKS_SUCCESS: {
      const { groupOfTasks, startPosition = 0 } = action;

      const taskItems = groupOfTasks?.taskGroups[0]?.tasks;
      let newMap = {};
      for (const taskItem of taskItems) {
        newMap = {
          ...newMap,
          ...updateTasksMap(state, taskItem),
        };
      }

      return {
        ...state,
        groupedTasks: {
          taskGroups: state.groupedTasks.taskGroups?.map((g) => {
            const matchedGroup = groupOfTasks.taskGroups.find(
              (updatedGroup) =>
                g.groupIdentifier === updatedGroup.groupIdentifier,
            );
            if (matchedGroup) {
              const grpState = {
                ...g,
                ...matchedGroup,
                tasks:
                  // initial loading of group, refresh, tasks are moved between groups
                  startPosition === 0
                    ? [
                        ...new Set(
                          matchedGroup?.tasks.map(
                            (task) => task?.identifier || task,
                          ),
                        ),
                      ]
                    : [
                        // when loading more tasks
                        ...new Set([
                          ...(g.tasks || []),
                          ...matchedGroup?.tasks.map(
                            (task) => task?.identifier || task,
                          ),
                        ]),
                      ],
                isLoadingGroup: false,
                isFetchingMoreTasks: false,
              };
              return grpState;
            }
            return g;
          }),
        },
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
      };
    }

    case ActionTypes.SEARCH_CURRENT_LIST_TASKS: {
      return {
        ...state,
        searchTerm: action.searchTerm,
      };
    }

    case ActionTypes.GET_CURRENT_LIST_TASKS: {
      return {
        ...state,
        isFetching: true,
        tasks: [],
        completedTasks: [],
      };
    }

    case ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS_FAILURE:
    case ActionTypes.RESET_LIST_DETAILS_TASK_COUNTERS: {
      return {
        ...state,
        taskCounters: {},
      };
    }

    case ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS_SUCCESS: {
      return {
        ...state,
        taskCounters: action.payload,
      };
    }

    case ActionTypes.INCREASE_INCOMPLETE_TASK_COUNTERS: {
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

    case ActionTypes.INCREASE_COMPLETE_TASK_COUNTERS: {
      return {
        ...state,
        taskCounters: state.taskCounters
          ? {
              ...state.taskCounters,
              complete: state.taskCounters.complete + 1,
            }
          : {},
      };
    }

    case ActionTypes.GET_MORE_TASKS_REQUEST: {
      return { ...state, isFetchingMoreTasks: true };
    }

    case ActionTypes.SET_LIST_DETAILS_TASKS_SORT: {
      const { key, order } = action.payload || {};

      return {
        ...state,
        sort: {
          key,
          order,
        },
      };
    }

    case ActionTypes.UPDATE_TEMPLATE_BUNDLE_FAILURE:
    case ActionTypes.UPDATE_TEMPLATE_BUNDLE_SUCCESS: {
      const { bundleIdentifier, dataToUpdate } = action;

      const groupWithTasks = state.groupedTasks?.taskGroups?.find(
        ({ groupIdentifier }) =>
          groupIdentifier === dataToUpdate.parentTaskWorkflowIdentifier,
      );

      if (groupWithTasks) {
        return updateGroupInState(
          (group) => ({
            ...group,
            tasks: group.tasks?.find(
              (taskId) => taskId === dataToUpdate?.identifier,
            )
              ? group.tasks
              : [dataToUpdate?.identifier, ...(group.tasks || [])],
          }),
          dataToUpdate.parentTaskWorkflowIdentifier,
          dataToUpdate,
          state,
        );
      }

      const updatedMap = updateTasksMap(state, {
        itemType: TaskItemType.BUNDLE,
        identifier: bundleIdentifier,
        ...dataToUpdate,
      });

      const newMap = {
        ...state.tasksMap,
        ...updatedMap,
      };

      const updatedState = {
        ...state,
        tasksMap: newMap,
      };

      return updatedState;
    }

    case ActionTypes.REORDER_WORKFLOW_TASKS: {
      const {
        source: { index: sourceIndex },
        destination: { index: destinationIndex },
        workflow,
        completedTasksShown,
        incompleteTasksShown,
      } = action;

      const reorderedTasks = reorderTasksForWorkflow(
        sourceIndex,
        destinationIndex,
        incompleteTasksShown,
        completedTasksShown,
        workflow.tasks,
      );

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.map((g) => ({
            ...g,
            tasks: updateBundleInList(
              { tasks: reorderedTasks },
              workflow.identifier,
              g.tasks,
            ),
          })),
        },
      };
    }

    case ActionTypes.REORDER_WORKFLOW_TASKS_FAILURE: {
      const { workflow } = action;

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.map((g) => ({
            ...g,
            tasks: updateBundleInList(
              { tasks: workflow.tasks },
              workflow.identifier,
              g.tasks,
            ),
          })),
        },
      };
    }

    case ActionTypes.GET_TASKS_FOR_WORKFLOW: {
      const { workflowIdentifier } = action;

      return {
        ...state,
        tasksMap: {
          ...state.tasksMap,
          [workflowIdentifier]: {
            ...state.tasksMap[workflowIdentifier],
            isFetchingTasks: true,
          },
        },
      };
    }

    case ActionTypes.GET_TASKS_FOR_WORKFLOW_SUCCESS: {
      const { workflowIdentifier, tasks } = action;

      const updatedMap = updateTasksMap(state, {
        identifier: workflowIdentifier,
        itemType: TaskItemType.BUNDLE,
        tasks,
      });

      return {
        ...state,
        tasksMap: {
          ...state.tasksMap,
          ...updatedMap,
          [workflowIdentifier]: {
            ...state.tasksMap[workflowIdentifier],
            isFetchingTasks: false,
            tasks: tasks.map((task) => task.identifier),
          },
        },
      };
    }

    case ActionTypes.UPDATE_PATIENT_DETAILS: {
      const {
        payload: { patientIdentifier, details },
      } = action;

      if (!state.tasksMap) {
        return state;
      }

      const newMap = { ...state.tasksMap };
      for (const [key, task] of Object.entries(newMap)) {
        if (task.patient?.patientIdentifier === patientIdentifier) {
          newMap[key] = {
            ...task,
            patient: { ...task.patient, ...details },
          };
        }
      }

      return {
        ...state,
        tasksMap: newMap,
      };
    }

    case ActionTypes.UPDATE_PARTIAL_WORKFLOW_SUCCESS: {
      return updateBundleInState(
        action.taskWorkflowIdentifier,
        action.newData,
        state,
      );
    }

    case ActionTypes.ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;

      const taskListIdentifier = addedTask.taskList?.taskListIdentifier;

      if (taskListIdentifier !== state.taskListIdentifier) {
        return state;
      }

      const bundle =
        addedTask.taskGroups?.find(
          ({ groupType }) => groupType === TaskGroupType.BUNDLE,
        ) || {};

      const bundleIdentifier = bundle?.taskGroupIdentifier;

      if (bundleIdentifier) {
        return updateBundleTasksInState(
          bundleIdentifier,
          {
            ...bundle,
            tasks: [addedTask],
          },
          state,
        );
      }

      const { taskGroupIdentifier } =
        addedTask.taskGroups?.find(
          ({ groupType }) =>
            groupType === TaskGroupType.TASKLIST ||
            groupType === TaskGroupType.TASKLIST_DEFAULT,
        ) || {};

      const updatedState = updateGroupInState(
        (group) => ({
          ...group,
          tasks: [addedTask?.identifier, ...(group.tasks || [])],
        }),
        taskGroupIdentifier,
        addedTask,
        state,
      );

      return updateTasksStateCallback(updatedState, addedTask);
    }

    case ActionTypes.DELETE_TASK: {
      const { taskIdentifier, intent } = action;
      const taskItem = state.tasksMap[taskIdentifier];
      const bundle =
        taskItem?.taskGroups?.find(
          ({ groupType }) => groupType === TaskGroupType.BUNDLE,
        ) || {};
      const bundleIdentifier = bundle?.taskGroupIdentifier;

      const updatedStateAfterRemovingTaskItem =
        taskItem?.itemType === TaskItemType.BUNDLE
          ? { ...state }
          : {
              ...state,
              tasksMap:
                intent === 'TASK_DELETED' &&
                bundleIdentifier &&
                !taskItem?.parentTaskIdentifier
                  ? {
                      ...state.tasksMap,
                      [bundleIdentifier]: {
                        ...state.tasksMap[bundleIdentifier],
                        tasks: state.tasksMap[bundleIdentifier]?.tasks?.filter(
                          (taskId) => taskId !== taskIdentifier,
                        ),
                      },
                    }
                  : state.tasksMap,
              groupedTasks: {
                ...state.groupedTasks,
                taskGroups: state.groupedTasks?.taskGroups?.map((group) =>
                  bundleIdentifier && !taskItem?.parentTaskIdentifier
                    ? group.groupIdentifier ===
                      bundle?.parentTaskGroupIdentifier
                      ? {
                          ...group,
                          tasks:
                            state.tasksMap[bundleIdentifier]?.tasks.length === 1
                              ? group.tasks?.filter(
                                  (taskId) => taskId !== bundleIdentifier,
                                )
                              : group.tasks,
                        }
                      : group
                    : {
                        ...group,
                        tasks: group.tasks?.filter(
                          (itemId) => itemId !== taskIdentifier,
                        ),
                      },
                ),
              },
              completedGroupedTasks: {
                ...state.completedGroupedTasks,
                taskGroups: state.completedGroupedTasks?.taskGroups?.map(
                  (g) => ({
                    ...g,
                    tasks: g.tasks?.filter(
                      (taskId) => taskId !== taskIdentifier,
                    ),
                  }),
                ),
              },
            };

      return state.taskListIdentifier && state.taskListIdentifier !== ''
        ? TaskBaseReducer(
            updatedStateAfterRemovingTaskItem,
            action,
            updateTasksStateCallback,
          )
        : state;
    }

    case ActionTypes.ADD_TEMPLATE_BUNDLE: {
      const { bundle: addedBundle } = action;

      const {
        taskListIdentifier,
        parentTaskWorkflowIdentifier: taskGroupIdentifier,
      } = addedBundle;

      if (taskListIdentifier !== state.taskListIdentifier) {
        return state;
      }

      return updateGroupInState(
        (group) => ({
          ...group,
          tasks: [addedBundle?.identifier, ...(group.tasks || [])],
        }),
        taskGroupIdentifier,
        addedBundle,
        state,
      );
    }

    case ActionTypes.DUPLICATE_WORKFLOW_SUCCESS: {
      const { workflow } = action;

      const {
        taskListIdentifier,
        parentTaskWorkflowIdentifier: taskGroupIdentifier,
      } = workflow;

      if (taskListIdentifier !== state.taskListIdentifier) {
        return state;
      }

      return updateGroupInState(
        (group) => ({
          ...group,
          tasks: [workflow?.identifier, ...(group.tasks || [])],
        }),
        taskGroupIdentifier,
        workflow,
        state,
      );
    }

    case ActionTypes.COMPLETE_TEMPLATE_BUNDLE: {
      const { bundleIdentifier } = action;

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.map((g) => ({
            ...g,
            tasks: g.tasks?.filter((taskId) => taskId !== bundleIdentifier),
          })),
        },
      };
    }

    case ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_LIST_SUCCESS:
    case ActionTypes.DELETE_WORKFLOW: {
      const { identifier } = action;
      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.map((g) => ({
            ...g,
            tasks: g.tasks?.filter((taskId) => taskId !== identifier),
          })),
        },
      };
    }

    case ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_GROUP_SUCCESS: {
      const { identifier, taskGroupIdentifier } = action;

      const newTaskGroups = state.groupedTasks?.taskGroups?.map((g) => {
        const workflow = g.tasks?.filter((taskId) => taskId === identifier);
        const tasks = g.tasks?.filter((taskId) => taskId !== identifier);
        if (g.taskGroupIdentifier === taskGroupIdentifier) {
          tasks.push(workflow);
        }
        return {
          ...g,
          tasks,
        };
      });
      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: newTaskGroups,
        },
      };
    }

    case ActionTypes.ADD_WORKFLOW_LABEL_SUCCESS: {
      return {
        ...state,
        tasksMap: {
          ...state.tasksMap,
          [action?.newLabel?.taskWorkflowIdentifier]: {
            ...state.tasksMap[action?.newLabel?.taskWorkflowIdentifier],
            labels: [
              ...state.tasksMap[action?.newLabel?.taskWorkflowIdentifier]
                ?.labels,
              action?.newLabel,
            ],
          },
        },
      };
    }

    case ActionTypes.REMOVE_WORKFLOW_LABEL_FROM_TASK_SUCCESS: {
      return {
        ...state,
        tasksMap: {
          ...state.tasksMap,
          [action?.payload?.taskWorkflowIdentifier]: {
            ...state.tasksMap[action?.payload?.taskWorkflowIdentifier],
            labels: state.tasksMap[
              action?.payload?.taskWorkflowIdentifier
            ]?.labels.filter(
              (l) => l.labelIdentifier !== action?.payload?.labelIdentifier,
            ),
          },
        },
      };
    }

    case ActionTypes.REORDER_TASK_LIST_GROUPS: {
      const { newIndex, oldIndex } = action;
      const newListGroupsOrder = move(oldIndex, newIndex, state.listGroups);

      return { ...state, listGroups: newListGroupsOrder };
    }

    case ActionTypes.REORDER_TASK_LIST_GROUPS_FAILURE: {
      const { newIndex, oldIndex } = action;
      const oldListGroupsOrder = move(newIndex, oldIndex, state.listGroups);

      return { ...state, listGroups: oldListGroupsOrder };
    }

    case ActionTypes.APPLY_TASK_TEMPLATE_SUCCESS: {
      const { template, taskGroupIdentifier } = action;

      // check if task group is empty
      const existingGroup = state.listGroups?.find(
        (g) => g.taskGroupIdentifier === taskGroupIdentifier,
      );
      const groupWithTasks = state.groupedTasks?.taskGroups?.find(
        ({ groupIdentifier }) => groupIdentifier === taskGroupIdentifier,
      );

      const addedBundle = template;

      if (groupWithTasks) {
        return updateGroupInState(
          (group) => ({
            ...group,
            tasks: group.tasks?.find(
              (taskId) => taskId === addedBundle?.identifier,
            )
              ? group.tasks
              : [addedBundle?.identifier, ...(group.tasks || [])],
          }),
          taskGroupIdentifier,
          addedBundle,
          state,
        );
      }

      // add the group
      const existingGroupedTasks = state.groupedTasks?.taskGroups || [];
      const newGroupedTasks = [
        {
          groupIdentifier: existingGroup.taskGroupIdentifier,
          groupName: existingGroup.groupName,
          tasks: [],
        },
      ];

      const allGroupedTasks = existingGroupedTasks?.concat(newGroupedTasks);

      const updatedState = {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: allGroupedTasks,
        },
      };

      return updateGroupInState(
        (group) => ({
          ...group,
          tasks: [addedBundle?.identifier, ...(group.tasks || [])],
        }),
        taskGroupIdentifier,
        addedBundle,
        updatedState,
      );
    }

    case ActionTypes.CREATE_TASK_LIST_GROUP_SUCCESS: {
      const { group } = action;

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.concat([
            {
              groupIdentifier: group.taskGroupIdentifier,
              groupName: group.groupName,
              tasks: [],
            },
          ]),
        },
      };
    }

    case ActionTypes.ADD_WORKFLOW_COMMENT_SUCCESS: {
      const { workflowIdentifier, comment } = action;

      if (state.tasksMap?.[workflowIdentifier]) {
        return {
          ...state,
          tasksMap: {
            ...state.tasksMap,
            [workflowIdentifier]: {
              ...state.tasksMap[workflowIdentifier],
              comments: [
                comment,
                ...state.tasksMap[workflowIdentifier].comments,
              ],
            },
          },
        };
      }
      return state;
    }

    default: {
      return state.taskListIdentifier && state.taskListIdentifier !== ''
        ? TaskBaseReducer(state, action, updateTasksStateCallback)
        : state;
    }
  }
};

export default ListDetailsReducer;
