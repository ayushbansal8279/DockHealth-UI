/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/max-switch-cases */
import * as ActionTypes from 'actions/action-types';
import { omit } from 'ramda';
import { mapWithRemove } from 'helpers/utility-functions';
import {
  createDecisionTaskNodes,
  createTemporaryTaskNode,
  createLinkElement,
  LinkType,
} from 'helpers/task-template-builder-helpers';
import TaskBaseReducer from './task-base-reducer';

const initialWorkflowLibraryState = {
  folderIdentifier: null,
  taskTemplates: null,
  isFetching: false,
  isError: false,
  breadcrumbs: null,
  parent: null,
};

const initialState = {
  ...initialWorkflowLibraryState,
  taskTemplateDetails: {},
  currentTaskTemplateIdentifier: null,
  currentTaskTemplate: null,
};

const templateDetailsInitialState = {
  isFetching: false,
  isError: false,
  tasks: [],
  isOpen: false,
};

function updateTasksStateCallback(state, updateTaskFromAction) {
  return {
    ...state,
    taskTemplateDetails: Object.entries(state.taskTemplateDetails).reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key]: {
          ...value,
          tasks: mapWithRemove(updateTaskFromAction, value.tasks),
        },
      }),
      {},
    ),
  };
}

function updateTaskTemplateDetailsState(identifier, currentState, newState) {
  return {
    ...currentState,
    [identifier]: {
      ...(currentState[identifier] || {}),
      ...newState,
    },
  };
}

const TaskTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
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

    case ActionTypes.UPDATE_PARTIAL_WORKFLOW: {
      return {
        ...state,
        taskTemplates: state.taskTemplates.map(taskTemplate =>
          taskTemplate.identifier === action.taskWorkflowIdentifier
            ? { ...taskTemplate, ...action.dataToUpdate }
            : taskTemplate,
        ),
      };
    }

    case ActionTypes.ADD_TASK_TEMPLATE_SUCCESS:
      return {
        ...state,
        taskTemplates: [action.template, ...state.taskTemplates],
      };

    case ActionTypes.DUPLICATE_WORKFLOW_SUCCESS:
      return {
        ...state,
        taskTemplates: [action.workflow, ...state.taskTemplates],
      };

    case ActionTypes.GET_WORKFLOW_FOLDER:
      return {
        ...state,
        isFetching: true,
        isError: false,
      };

    case ActionTypes.GET_WORKFLOW_FOLDER_SUCCESS:
      return {
        ...state,
        taskTemplates: action.workflows || [],
        parent: null,
        isFetching: false,
      };

    case ActionTypes.GET_WORKFLOW_FOLDER_FAILURE:
      return {
        ...state,
        isFetching: false,
        isError: true,
      };

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

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            isFetching: false,
            tasks,
          },
        ),
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

      return {
        ...state,
        taskTemplates: state.taskTemplates.filter(
          t => t.identifier !== identifier,
        ),
        taskTemplateDetails: omit([identifier], state.taskTemplateDetails),
      };
    }

    case ActionTypes.UPDATE_TASK_TEMPLATE_FAILURE:
    case ActionTypes.UPDATE_TASK_TEMPLATE_SUCCESS: {
      const { taskTemplateIdentifier, dataToUpdate } = action;

      return {
        ...state,
        taskTemplates: state.taskTemplates.map(template =>
          template.taskTemplateIdentifier === taskTemplateIdentifier
            ? {
                ...template,
                ...omit(['taskTemplateIdentifier'], dataToUpdate),
              }
            : template,
        ),
      };
    }

    case ActionTypes.ADD_TASK_TO_TEMPLATE_SUCCESS: {
      const { taskTemplateIdentifier } = action.task;

      return {
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
    }

    case ActionTypes.CLOSE_ALL_TASK_TEMPLATES: {
      return {
        ...state,
        taskTemplateDetails: Object.entries(state.taskTemplateDetails).reduce(
          (accumulator, [key, value]) => ({
            ...accumulator,
            [key]: { ...value, isOpen: false },
          }),
          {},
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

    case ActionTypes.ADD_NEW_TASK_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } = state.taskTemplateDetails[
        currentTaskTemplateIdentifier
      ];

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

    case ActionTypes.ADD_DECISION_BRANCH: {
      const { currentTaskTemplateIdentifier } = state;
      const { sourceTaskIdentifier } = action;

      const { temporaryElements, layout } = state.taskTemplateDetails[
        currentTaskTemplateIdentifier
      ];

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
      } = action;
      const { temporaryElements } = state.taskTemplateDetails[
        currentTaskTemplateIdentifier
      ];

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
              ),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_NEW_DECISION_TASK_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { position } = action;

      const { temporaryElements } = state.taskTemplateDetails[
        currentTaskTemplateIdentifier
      ];

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

      const { temporaryElements } = state.taskTemplateDetails[
        currentTaskTemplateIdentifier
      ];

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
      const { temporaryElements } = state.taskTemplateDetails[
        currentTaskTemplateIdentifier
      ];

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

    case ActionTypes.EDIT_TEMPORARY_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;
      const { elementId, data } = action;
      const { temporaryElements } = state.taskTemplateDetails[
        currentTaskTemplateIdentifier
      ];

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          currentTaskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            temporaryElements: temporaryElements.map(te =>
              te.id === elementId ? { ...te, ...data } : te,
            ),
          },
        ),
      };
    }

    case ActionTypes.LINK_TASKS: {
      return state;
    }

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
};

export default TaskTemplateReducer;
