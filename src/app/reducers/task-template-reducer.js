import * as ActionTypes from 'actions/action-types';
import { omit } from 'ramda';
import { mapWithRemove } from 'helpers/utility-functions';
import {
  createDecisionTaskNode,
  createTaskNode,
} from 'helpers/task-template-builder-helpers';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  taskTemplates: [],
  isFetching: false,
  isError: false,
  taskTemplateDetails: {},
  currentTaskTemplateIdentifier: null,
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

function updateTaskTemplateDetailsState(
  taskTemplateIdentifier,
  currentState,
  newState,
) {
  return {
    ...currentState,
    [taskTemplateIdentifier]: {
      ...(currentState[taskTemplateIdentifier] || {}),
      ...newState,
    },
  };
}

const TaskTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TASK_TEMPLATE:
      return {
        ...state,
        taskTemplates: [action.template, ...state.taskTemplates],
      };

    case ActionTypes.TASK_TEMPLATES_FETCHING:
      return {
        ...state,
        isFetching: true,
        isError: false,
      };

    case ActionTypes.LOAD_TASK_TEMPLATES:
      return {
        ...state,
        taskTemplates: action.templates || [],

        isFetching: false,
      };

    case ActionTypes.TASK_TEMPLATES_ERROR:
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

    case ActionTypes.DELETE_TASK_TEMPLATE: {
      const { taskTemplateIdentifier: identifierToDelete } = action;

      return {
        ...state,
        taskTemplates: state.taskTemplates.filter(
          ({ taskTemplateIdentifier }) =>
            taskTemplateIdentifier !== identifierToDelete,
        ),
        taskTemplateDetails: omit(
          [identifierToDelete],
          state.taskTemplateDetails,
        ),
      };
    }

    case ActionTypes.UPDATE_TASK_TEMPLATE: {
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

    case ActionTypes.SELECT_TASK_TEMPLATE: {
      const { taskTemplateIdentifier } = action;

      return {
        ...state,
        currentTaskTemplateIdentifier: taskTemplateIdentifier,
      };
    }

    case ActionTypes.UNSELECT_TASK_TEMPLATE: {
      return {
        ...state,
        currentTaskTemplateIdentifier: null,
      };
    }

    case ActionTypes.GET_TASK_TEMPLATE_LAYOUT: {
      const { taskTemplateIdentifier } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            isFetchingLayout: true,
          },
        ),
      };
    }

    case ActionTypes.GET_TASK_TEMPLATE_LAYOUT_SUCCESS: {
      const { taskTemplateIdentifier, layout } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
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
              createTaskNode(temporaryElements),
            ],
          },
        ),
      };
    }

    case ActionTypes.ADD_NEW_DECISION_TASK_ELEMENT: {
      const { currentTaskTemplateIdentifier } = state;

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
              createDecisionTaskNode(temporaryElements),
            ],
          },
        ),
      };
    }

    case ActionTypes.DELETE_NEW_TASK_ELEMENT: {
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
              ({ id }) => id !== elementId,
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
