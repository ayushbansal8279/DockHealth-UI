/* eslint-disable sonarjs/cognitive-complexity */
import * as ActionTypes from 'actions/action-types';

const initialState = {
  open: false,
  workflowIdentifier: null,
  workflow: null,
  isFetchingDetails: false,
  error: false,
  history: null,
  isFetchingHistory: false,
  autoFocusFieldName: null,
  labels: [],
};

const WorkflowDrawerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.OPEN_WORKFLOW_DRAWER:
      return {
        ...state,
        open: true,
        workflowIdentifier: action.identifier,
        workflow: { ...action.workflow },
        autoFocusFieldName: action.autoFocusFieldName,
      };

    case ActionTypes.CLOSE_WORKFLOW_DRAWER:
      return {
        ...state,
        ...initialState,
      };

    case ActionTypes.GET_WORKFLOW_DRAWER_DETAILS:
      return {
        ...state,
        isFetchingDetails: true,
      };

    case ActionTypes.GET_WORKFLOW_DRAWER_DETAILS_SUCCESS:
      return {
        ...state,
        isFetchingDetails: false,
        workflow: { ...state.workflow, ...action.workflow },
        error: false,
      };

    case ActionTypes.GET_WORKFLOW_DRAWER_DETAILS_FAILURE:
      return {
        ...state,
        isFetchingDetails: false,
        error: true,
      };

    case ActionTypes.GET_WORKFLOW_DRAWER_HISTORY:
      return {
        ...state,
        isFetchingHistory: true,
      };

    case ActionTypes.GET_WORKFLOW_DRAWER_HISTORY_SUCCESS:
      return {
        ...state,
        isFetchingHistory: false,
        history: action.history,
      };

    case ActionTypes.GET_WORKFLOW_DRAWER_HISTORY_FAILURE:
      return {
        ...state,
        isFetchingHistory: false,
      };

    case ActionTypes.UPDATE_PARTIAL_WORKFLOW_SUCCESS: {
      if (action.taskWorkflowIdentifier === state.workflowIdentifier) {
        return {
          ...state,
          workflow: {
            ...state.workflow,
            ...action.newData,
          },
        };
      }
      return state;
    }

    case ActionTypes.ADD_WORKFLOW_COMMENT_SUCCESS: {
      const { workflowIdentifier, comment } = action;

      if (workflowIdentifier !== state.workflowIdentifier) return state;

      if (state.workflowIdentifier === workflowIdentifier) {
        return {
          ...state,
          workflow: {
            ...state.workflow,
            comments: [comment, ...(state.workflow.comments || [])],
          },
        };
      }

      return state;
    }

    case ActionTypes.UPDATE_WORKFLOW_COMMENT_SUCCESS: {
      const { workflowIdentifier, commentIdentifier, comment } = action;

      if (workflowIdentifier !== state.workflowIdentifier) return state;

      return {
        ...state,
        workflow: {
          ...state.workflow,
          comments:
            state.workflow.comments?.map(c =>
              c.commentIdentifier === commentIdentifier
                ? { ...c, ...comment }
                : c,
            ) || null,
        },
      };
    }

    case ActionTypes.DELETE_WORKFLOW_COMMENT_SUCCESS: {
      const { workflowIdentifier, commentIdentifier } = action;

      if (workflowIdentifier !== state.workflowIdentifier) return state;

      return {
        ...state,
        workflow: {
          ...state.workflow,
          comments:
            state.workflow.comments?.filter(
              c => c.commentIdentifier !== commentIdentifier,
            ) || null,
        },
      };
    }

    case ActionTypes.ADD_WORKFLOW_ATTACHMENT_SUCCESS: {
      const { workflowIdentifier, attachment } = action;

      if (workflowIdentifier !== state.workflowIdentifier) return state;

      if (state.workflowIdentifier === workflowIdentifier) {
        return {
          ...state,
          workflow: {
            ...state.workflow,
            attachments: [attachment, ...(state.workflow.attachments || [])],
          },
        };
      }

      return state;
    }

    case ActionTypes.DELETE_WORKFLOW_ATTACHMENT_SUCCESS: {
      const { workflowIdentifier, attachmentIdentifier } = action;

      if (workflowIdentifier !== state.workflowIdentifier) return state;

      return {
        ...state,
        workflow: {
          ...state.workflow,
          attachments:
            state.workflow.attachments?.filter(
              a => a.attachmentIdentifier !== attachmentIdentifier,
            ) || null,
        },
      };
    }

    case ActionTypes.GET_WORKFLOW_DRAWER_LABELS_SUCCESS: {
      const { labels } = action;
      return {
        ...state,
        labels,
      };
    }

    default:
      return state;
  }
};

export default WorkflowDrawerReducer;
