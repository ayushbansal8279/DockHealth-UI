import * as ActionTypes from 'actions/action-types';
import { omit } from 'ramda';

const initialState = {
  taskTemplates: [],
  isFetching: false,
  isError: false,
  taskTemplateDetails: {},
};

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

    case ActionTypes.TASK_TEMPLATE_FETCHING: {
      const { taskTemplateIdentifier } = action;

      return {
        ...state,
        taskTemplateDetails: updateTaskTemplateDetailsState(
          taskTemplateIdentifier,
          state.taskTemplateDetails,
          {
            isFetching: !state.taskTemplateDetails[taskTemplateIdentifier]
              ?.tasks?.length,
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

    default:
      return { ...state };
  }
};

export default TaskTemplateReducer;
