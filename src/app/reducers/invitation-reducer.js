import * as types from '../actions/action-types';
import initialState from './initialState';

const InvitationReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.GET_INVITATION_SUCCESS:
      return {...state, invitationlist:action.invitelist};  //whatever our current state is, add on "invitelist"
  }
  return state;
}

export default InvitationReducer
