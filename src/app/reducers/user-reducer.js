import * as types from '../actions/action-types';
import initialState from './initialState';

const UserReducer = function(state = {user: false}, action) {
  let newState
  switch (action.type) {
    // trigger when user is changed
    case 'user/user':
      // newState = Object.assign({}, state)
      // newState.user = action.user
      // return newState
      newState = Object.assign({}, state, { user: action.user });
      return newState;
  }

  return state;
}

export default UserReducer
