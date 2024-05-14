import * as ActionTypes from 'actions/action-types';

const INITIAL_STATE = {
  selectedTaskIdentifiers: [],
  showCompletedWorkflowIdentifiers: [],
  showIncompleteWorkflowIdentifiers: [],
};

const TaskItemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.TASK_ITEM_SELECT: {
      const { taskIdentifier } = action;

      return {
        ...state,
        selectedTaskIdentifiers: state.selectedTaskIdentifiers.concat([
          taskIdentifier,
        ]),
      };
    }

    case ActionTypes.TASK_ITEM_UNSELECT: {
      const { taskIdentifier } = action;

      return {
        ...state,
        selectedTaskIdentifiers: state.selectedTaskIdentifiers?.filter(
          (id) => id !== taskIdentifier,
        ),
      };
    }

    case ActionTypes.TASK_ITEM_UNSELECT_ALL: {
      return {
        ...state,
        selectedTaskIdentifiers: [],
      };
    }

    case ActionTypes.CHANGE_TASKS_SELECTED_STATE: {
      const { taskIdentifiers, isSelected } = action;
      return isSelected
        ? {
            ...state,
            selectedTaskIdentifiers:
              state.selectedTaskIdentifiers.concat(taskIdentifiers),
          }
        : {
            ...state,
            selectedTaskIdentifiers: state.selectedTaskIdentifiers?.filter(
              (taskId) => !taskIdentifiers?.includes(taskId),
            ),
          };
    }

    case ActionTypes.WORKFLOW_SHOWHIDE_COMPLETED_TASKS: {
      const { workflowIdentifier, showFlag } = action;

      return showFlag
        ? {
            ...state,
            showCompletedWorkflowIdentifiers:
              state.showCompletedWorkflowIdentifiers.concat([
                workflowIdentifier,
              ]),
          }
        : {
            ...state,
            showCompletedWorkflowIdentifiers:
              state.showCompletedWorkflowIdentifiers?.filter(
                (id) => id !== workflowIdentifier,
              ),
          };
    }

    case ActionTypes.WORKFLOW_SHOWHIDE_INCOMPLETE_TASKS: {
      const { workflowIdentifier, showFlag } = action;

      return showFlag
        ? {
            ...state,
            showIncompleteWorkflowIdentifiers:
              state.showIncompleteWorkflowIdentifiers.concat([
                workflowIdentifier,
              ]),
          }
        : {
            ...state,
            showIncompleteWorkflowIdentifiers:
              state.showIncompleteWorkflowIdentifiers?.filter(
                (id) => id !== workflowIdentifier,
              ),
          };
    }

    case ActionTypes.WORKFLOW_SHOWHIDE_RESET: {
      return {
        ...state,
        showCompletedWorkflowIdentifiers: [],
        showIncompleteWorkflowIdentifiers: [],
      };
    }

    default: {
      return state;
    }
  }
};

export default TaskItemReducer;
