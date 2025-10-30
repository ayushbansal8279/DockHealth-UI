import * as ActionTypes from 'actions/action-types';

const initialState = {
  workspaces: [],
  isFetching: false,
};

export default function workspaceListReducer(state = initialState, action: any) {
  switch (action.type) {
    case ActionTypes.GET_ALL_USER_WORKSPACES_REQUEST:
      return { ...state, isFetching: true };

    case ActionTypes.GET_ALL_USER_WORKSPACES_SUCCESS:
      return {
        ...state,
        workspaces: action.workspaces,
        isFetching: false,
      };

    case ActionTypes.GET_ALL_USER_WORKSPACES_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case ActionTypes.UPDATE_WORKSPACE_SUCCESS:
      return {
        ...state,
        workspaces: state.workspaces.map((ws) =>
          ws.workspaceIdentifier === action.payload.workspaceIdentifier ? { ...ws, ...action.payload } : ws
        ),
      };

    case ActionTypes.DELETE_WORKSPACE_SUCCESS:
      return {
        ...state,
        workspaces: state.workspaces.filter(
          (ws) => ws.workspaceIdentifier !== action.workspaceIdentifier
        ),
      };

    default:
      return state;
  }
}