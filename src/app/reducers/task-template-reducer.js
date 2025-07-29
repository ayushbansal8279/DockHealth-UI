/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/max-switch-cases */
import * as ActionTypes from 'actions/action-types';
import omit from 'ramda/src/omit';
import {
  createDecisionTaskNodes,
  createTemporaryTaskNode,
  createLinkElement,
  LinkType,
  NodeType,
  createNewAutomationTaskNode,
  createEmailNode,
  createWebhookNode,
  createAIAnalyzerNode,
  createAIAssistantNode,
} from 'helpers/smart-flow-builder-helpers';
import TaskBaseReducer from './task-base-reducer';
import { updateTasksStateCallback } from './reducer-helper';

const initialWorkflowLibraryState = {
  folderIdentifier: null,
  taskTemplates: null,
  tasksMap: {},
  isFetching: false,
  isError: false,
  breadcrumbs: null,
  parent: null,
};

const initialState = {
  ...initialWorkflowLibraryState,
  taskTemplateDetails: {},
  taskTemplateHistoryDetails: {},
  currentTaskTemplateIdentifier: null,
  currentTaskTemplate: null,
};

const templateDetailsInitialState = {
  isFetching: false,
  isError: false,
  tasks: [],
  isOpen: false,
};

function updateTaskTemplateDetailsStateCallback(state, newTask) {
  // if (typeof newTask === 'function') return state;
  let taskItem = newTask;
  if (typeof newTask === 'function') {
    const tasksMap = {};
    // add tasks and subtasks in the bundle
    for (const templateId of Object.keys(state.taskTemplateDetails)) {
      for (const task of state.taskTemplateDetails[templateId]?.tasks) {
        tasksMap[task.identifier] = {
          ...tasksMap[task.identifier],
          ...task,
        };
      }
    }
    taskItem = newTask(tasksMap);
  }

  if (!taskItem) {
    return state;
  }

  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const newState = {
    ...state,
    taskTemplateDetails: Object.fromEntries(
      Object.entries(state.taskTemplateDetails).map(([key, value]) => [
        key,
        {
          ...value,
          tasks: value.tasks.map((t) =>
            t.identifier === taskItem.identifier ? { ...t, ...taskItem } : t,
          ),
        },
      ]),
    ),
  };
  return newState;
}

function updateTaskTemplateDetailsState(identifier, currentState, newState) {
  return {
    ...currentState,
    [identifier]: {
      ...currentState[identifier],
      ...newState,
    },
  };
}

const TaskTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_PARTIAL_WORKFLOW_SUCCESS: {
      if (state.taskTemplates) {
        return {
          ...state,
          taskTemplates: state.taskTemplates?.map((taskTemplate) =>
            taskTemplate.identifier === action.taskWorkflowIdentifier
              ? { ...taskTemplate, ...action.newData }
              : taskTemplate,
          ),
        };
      }
      return state;
    }

    case ActionTypes.INITIALIZE_WORKFLOW_LIBRARY_STATE: {
      return {
        ...state,
        ...initialWorkflowLibraryState,
        folderIdentifier: action.folderIdentifier,
      };
    }

    case ActionTypes.CLEAR_WORKFLOW_LIBRARY_STATE: {
      return {
        ...state,
        ...initialWorkflowLibraryState,
      };
    }

    case ActionTypes.GET_WORKFLOW_DETAILS_SUCCESS: {
      if (state.taskTemplates) {
        return {
          ...state,
          taskTemplates: state.taskTemplates.map((taskTemplate) =>
            taskTemplate.identifier === action.workflow.identifier
              ? { ...taskTemplate, ...action.workflow }
              : taskTemplate,
          ),
        };
      }
      return state;
    }

    case ActionTypes.GET_WORKFLOW_DETAILS_FAILURE: {
      return {
        ...state,
        isError: true,
      };
    }

    case ActionTypes.ADD_TASK_TEMPLATE_SUCCESS: {
      if (state.taskTemplates) {
        return {
          ...state,
          taskTemplates: [action.template, ...state.taskTemplates],
        };
      }
      return state;
    }

    case ActionTypes.DUPLICATE_WORKFLOW_SUCCESS: {
      if (state.taskTemplates) {
        return {
          ...state,
          taskTemplates: [action.workflow, ...state.taskTemplates],
        };
      }
      return state;
    }

    case ActionTypes.GET_WORKFLOW_FOLDER: {
      return {
        ...state,
        isFetching: true,
        isError: false,
      };
    }

    case ActionTypes.GET_WORKFLOW_FOLDER_SUCCESS: {
      return {
        ...state,
        taskTemplates: action.workflows || [],
        parent: null,
        isFetching: false,
        taskTemplateDetails: {},
      };
    }

    case ActionTypes.GET_WORKFLOW_FOLDER_FAILURE: {
      return {
        ...state,
        isFetching: false,
        isError: true,
      };
    }

    case ActionTypes.GET_FOLDER_BREADCRUMBS: {
      return {
        ...state,
        breadcrumbs: null,
      };
    }

    case ActionTypes.GET_FOLDER_BREADCRUMBS_SUCCESS: {
      return {
        ...state,
        breadcrumbs: action.breadcrumbs,
      };
    }

    case ActionTypes.GET_TASK_TEMPLATE_TASKS: {
      const { taskTemplateIdentifier, withLoader } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            isFetching: withLoader,
            isError: false,
          },
        ),
      };
    }

    case ActionTypes.LOAD_TASKS_FOR_TASK_TEMPLATE: {
      const { taskTemplateIdentifier, tasks } = action;

      const newTasks = {};
      for (const task of tasks) {
        newTasks[task.identifier] = task;
        for (const subtask of task?.subtasks) {
          newTasks[subtask.identifier] = {
            ...newTasks[subtask.identifier],
            ...subtask,
          };
        }
      }

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            isFetching: false,
            tasks,
            // taskIdentifiers: tasks.map((task) => task.identifier),
          },
        ),
        tasksMap: {
          ...state.tasksMap,
          ...newTasks,
        },
      };
    }

    case ActionTypes.TASK_TEMPLATE_ERROR: {
      const { taskTemplateIdentifier } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            isFetching: false,
            isError: true,
            tasks: [],
          },
        ),
      };
    }

    case ActionTypes.TOGGLE_TASK_TEMPLATE_OPEN: {
      const { taskTemplateIdentifier } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            isOpen: !state.taskTemplateDetails[taskTemplateIdentifier]?.isOpen,
          },
        ),
      };
    }

    case ActionTypes.MOVE_WORKFLOW_TO_FOLDER_SUCCESS:
    case ActionTypes.DELETE_WORKFLOW: {
      const { identifier } = action;
      if (state.taskTemplates) {
        return {
          ...state,
          taskTemplates: state.taskTemplates.filter(
            (t) => t.identifier !== identifier,
          ),
          taskTemplateDetails: omit([identifier], state.taskTemplateDetails),
        };
      }
      return state;
    }

    case ActionTypes.UPDATE_TASK_TEMPLATE_FAILURE:
    case ActionTypes.UPDATE_TASK_TEMPLATE_SUCCESS: {
      const { taskTemplateIdentifier, dataToUpdate } = action;
      if (state.taskTemplates) {
        return {
          ...state,
          taskTemplates: state.taskTemplates.map((template) =>
            template.identifier === taskTemplateIdentifier
              ? {
                  ...template,
                  ...omit(['taskTemplateIdentifier'], dataToUpdate),
                }
              : template,
          ),
        };
      }
      return state;
    }

    case ActionTypes.ADD_TASK_TO_TEMPLATE_SUCCESS: {
      const { taskTemplateIdentifier } = action.task;

      const updatedState = {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            tasks: [
              ...(state.taskTemplateDetails[taskTemplateIdentifier]?.tasks ||
                []),
              action.task,
            ],
          },
        ),
      };

      return updateTasksStateCallback(updatedState, action.task);
    }

    case ActionTypes.CLOSE_ALL_TASK_TEMPLATES: {
      return {
        ...state,
        taskTemplateDetails: Object.fromEntries(
          Object.entries(state.taskTemplateDetails).map(([key, value]) => [
            key,
            { ...value, isOpen: false },
          ]),
        ),
      };
    }

    case ActionTypes.INITIALIZE_TASK_TEMPLATE_DETAILS: {
      const { taskTemplateIdentifier } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
          state.taskTemplateDetails,
          templateDetailsInitialState,
        ),
      };
    }

    case ActionTypes.GET_CURRENT_TASK_TEMPLATE_SUCCESS: {
      const { template } = action;

      return {
        ...state,
        currentTaskTemplate: template,
      };
    }

    case ActionTypes.SELECT_TASK_TEMPLATE: {
      const { identifier } = action;

      return {
        ...state,
        currentTaskTemplateIdentifier: identifier,
      };
    }

    case ActionTypes.UNSELECT_TASK_TEMPLATE: {
      return {
        ...state,
        currentTaskTemplateIdentifier: null,
        currentTaskTemplate: null,
      };
    }

    case ActionTypes.GET_TASK_TEMPLATE_LAYOUT: {
      const { identifier } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          identifier,
          state.taskTemplateDetails,
          {
            isFetchingLayout: true,
          },
        ),
      };
    }

    case ActionTypes.GET_TASK_TEMPLATE_LAYOUT_SUCCESS: {
      const { identifier, layout } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          identifier,
          state.taskTemplateDetails,
          {
            isFetchingLayout: false,
            layout,
          },
        ),
      };
    }

    case ActionTypes.SAVE_TASK_TEMPLATE_LAYOUT: {
      const { layout } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          state.currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            isSavingLayout: true,
            layout,
          },
        ),
      };
    }

    case ActionTypes.SAVE_HISTORY_TASK_TEMPLATE_LAYOUT: {
      return {
        ...state,
        taskTemplateHistoryDetails: { ...state.taskTemplateDetails },
      };
    }

    case ActionTypes.SAVE_TASK_TEMPLATE_LAYOUT_SUCCESS: {
      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          state.currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            isSavingLayout: false,
          },
        ),
      };
    }

    case ActionTypes.RECOVER_HISTORY_TASK_TEMPLATE_LAYOUT: {
      return {
        ...state,
        taskTemplateDetails: { ...state.taskTemplateHistoryDetails },
      };
    }

    case ActionTypes.ADD_NEW_TASK_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [
              ...(temporaryElements || []),
              createTemporaryTaskNode(temporaryElements, position),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_NEW_AUTOMATION_TASK_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];
        
      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [
              ...(temporaryElements || []),
              createNewAutomationTaskNode(temporaryElements, position),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_NEW_WORKFLOW_LINK_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [
              ...(temporaryElements || []),
              createTemporaryTaskNode(
                temporaryElements,
                position,
                NodeType.NEW_WORKFLOW_LINK,
              ),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_NEW_EMAIL_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      const aa = {
        id: 'fbfd2sdc6c-0d66-4d7c-b39a-0bc71a51c',
        type: NodeType.EMAIL,
        data: {
          draggedEdgeSourceId: null,
          taskTemplateIdentifier: 'ce6f3dcc-426f-4bff-ab14-227d88ef8139',
        },
        position: {
          x: 1461.2980025578743,
          y: 329.8232009925558,
        },
        isConnectable: true,
        width: 230,
        height: 232,
      };

      const email = {
        identifier: '123',
        description: '123',
        taskTemplateIdentifier: currentTaskTemplateIdentifier,
        intentType: NodeType.EMAIL,
      };

      // return {
      //   ...state,
      //   taskTemplateDetails: updateTaskTemplateDetailsState(
      //     currentTaskTemplateIdentifier,
      //     state.taskTemplateDetails,
      //     {
      //       emails: [aa],
      //     },
      //   ),
      // };

      // const updatedState = {
      //   ...state,
      //   taskTemplateDetails: updateTaskTemplateDetailsState(
      //     currentTaskTemplateIdentifier,
      //     state.taskTemplateDetails,
      //     {
      //       emails: [
      //         ...(state.taskTemplateDetails[currentTaskTemplateIdentifier]
      //           ?.emails || []),
      //         email,
      //       ],
      //     },
      //   ),
      // };

      // return updateTasksStateCallback(updatedState, action.task);

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            emails: [
              ...(temporaryElements || []),
              createEmailNode(temporaryElements, position),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_NEW_WEBHOOK_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [
              ...(temporaryElements || []),
              createWebhookNode(temporaryElements, position),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_NEW_AI_ANALYZER_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [
              ...(temporaryElements || []),
              createAIAnalyzerNode(temporaryElements, position),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_NEW_AI_ASSISTANT_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [
              ...(temporaryElements || []),
              createAIAssistantNode(temporaryElements, position),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_DECISION_BRANCH: {
      const { currentTaskTemplateIdentifier } = state;
      const { sourceTaskIdentifier } = action;

      const { temporaryElements, layout } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      const { position } =
        layout?.find(({ id }) => id === sourceTaskIdentifier) || {};

      const newPosition = { ...position, y: position.y + 300 };
      const newNode = createTemporaryTaskNode(temporaryElements, newPosition);

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [
              ...(temporaryElements || []),
              createLinkElement(
                LinkType.TEMPORARY_DECISION,
                sourceTaskIdentifier,
                newNode.id,
              ),
              newNode,
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_TEMPORARY_LINK: {
      const { currentTaskTemplateIdentifier } = state;
      const {
        linkType,
        sourceId,
        targetId,
        sourceHandle,
        targetHandle,
        indicatorType,
      } = action;
      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [
              ...(temporaryElements || []).filter(
                ({ source, target }) =>
                  !(source === sourceId && target === targetId),
              ),
              createLinkElement(
                linkType,
                sourceId,
                targetId,
                sourceHandle,
                targetHandle,
                indicatorType,
              ),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_NEW_DECISION_TASK_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [
              ...(temporaryElements || []),
              ...createDecisionTaskNodes(temporaryElements, position),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_TEMPORARY_ELEMENTS: {
      const { currentTaskTemplateIdentifier } = state;
      const { elements } = action;

      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: [...(temporaryElements || []), ...elements],
          },
        ),
      };
    }

    case ActionTypes.DELETE_TEMPORARY_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { elementId } = action;
      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: temporaryElements.filter(
              ({ id, source, target }) =>
                id !== elementId &&
                source !== elementId &&
                target !== elementId,
            ),
          },
        ),
      };
    }

    case ActionTypes.UPDATE_TASK_SUCCESS: {
      const { task } = action;
      if (state.taskTemplates && state.taskTemplates !== '') {
        return TaskBaseReducer(state, action, updateTasksStateCallback);
      }

      const updatedTaskState = {
        ...state,
        taskTemplateDetails: Object.fromEntries(
          Object.entries(state.taskTemplateDetails).map(([key, value]) => [
            key,
            {
              ...value,
              tasks: value.tasks.map((t) =>
                t.identifier === task.taskIdentifier
                  ? {
                      ...t,
                      ...task,
                    }
                  : t,
              ),
            },
          ]),
        ),
      };

      return state.taskTemplateDetails &&
        state.taskTemplateDetails !== undefined
        ? TaskBaseReducer(
            updatedTaskState,
            action,
            updateTaskTemplateDetailsStateCallback,
          )
        : state;
    }

    case ActionTypes.EDIT_TEMPORARY_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { elementId, data } = action;
      const { temporaryElements } =
        state.taskTemplateDetails[currentTaskTemplateIdentifier];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: temporaryElements.map((te) =>
              te.id === elementId ? { ...te, ...data } : te,
            ),
          },
        ),
      };
    }

    case ActionTypes.LINK_TASKS: {
      return state;
    }

    case ActionTypes.DELETE_TASK: {
      const { taskIdentifier } = action;

      if (state.taskTemplates && state.taskTemplates !== '') {
        return TaskBaseReducer(state, action, updateTasksStateCallback);
      }

      const updatedStateAfterRemovingTaskItem = {
        ...state,
        taskTemplateDetails: Object.fromEntries(
          Object.entries(state.taskTemplateDetails).map(([key, value]) => [
            key,
            {
              ...value,
              tasks: value.tasks.filter((t) => t.identifier !== taskIdentifier),
            },
          ]),
        ),
      };

      return state.taskTemplateDetails &&
        state.taskTemplateDetails !== undefined
        ? TaskBaseReducer(
            updatedStateAfterRemovingTaskItem,
            action,
            updateTaskTemplateDetailsStateCallback,
          )
        : state;
    }

    default: {
      if (state.taskTemplates && state.taskTemplates !== '') {
        return TaskBaseReducer(state, action, updateTasksStateCallback);
      }
      if (
        state.taskTemplateDetails &&
        state.taskTemplateDetails !== undefined &&
        Object.keys(state.taskTemplateDetails).length > 0
      ) {
        return TaskBaseReducer(
          state,
          action,
          updateTaskTemplateDetailsStateCallback,
        );
      }
      return state;
    }
  }
};

export default TaskTemplateReducer;
