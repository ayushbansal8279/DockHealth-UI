import {
  GET_INVITATION_SUCCESS,
  GET_PENDING_TASKLIST_SUCCESS,
  ACCEPT_INVITE_TOTASKLIST_SUCCESS,
  REJECT_INVITE_TOTASKLIST_SUCCESS,
} from '../actions/action-types';

const initialState = {
  invitationlist: [],
  pendingTasklists: [],
};

const InvitationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INVITATION_SUCCESS:
      return {
        ...state,
        invitationlist: action.invitelist,
      };

    case GET_PENDING_TASKLIST_SUCCESS:
      return {
        ...state,
        pendingTasklists: action.tasklist,
      };

    case ACCEPT_INVITE_TOTASKLIST_SUCCESS:
      return {
        ...state,
        pendingTasklists: state.pendingTasklists.filter(tasklist => tasklist !== action.tasklist),
      };

    case REJECT_INVITE_TOTASKLIST_SUCCESS:
      return {
        ...state,
        pendingTasklists: state.pendingTasklists.filter(tasklist => tasklist !== action.tasklist),
      };

    default:
      return state;
  }
};

export default InvitationReducer;
