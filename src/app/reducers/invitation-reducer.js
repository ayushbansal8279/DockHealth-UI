import * as types from '../actions/action-types';
import initialState from './initialState';

const InvitationReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.GET_INVITATION_SUCCESS:
      return {...state, invitationlist:action.invitelist};  //whatever our current state is, add on "invitelist"

    case types.ACCEPT_INVITE_TOTASKLIST_SUCCESS:
      var pendingList = {} // Look for tasklist with same id and set as variable
      state.pendingTasklists.map(taskList =>
        taskList.taskListId == action.taskListId ?
        pendingList = taskList : taskList
      )
      return{ // return new state with updated pendingtasklists and tasklist
        ...state,
        pendingTasklists: state.pendingTasklists.filter(tasklist => tasklist.taskListId !== action.taskListId),
        tasklist: state.tasklist.concat(pendingList)
      }

    case types.REJECT_INVITE_TOTASKLIST_SUCCESS:
      return{ // remove tasklist from pending tasklists
        ...state,
        pendingTasklists: state.pendingTasklists.filter(tasklist => tasklist.taskListId !== action.taskListId)
      }
      break
  }
  return state;
}

export default InvitationReducer
