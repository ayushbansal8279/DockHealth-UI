import * as types from '../actions/action-types';
import initialState from './initialState';

const UserReducer = function(state = {user: false, userProfile: "",userProfilePic :"",userNotificationPrefs :""},  action) {
  let newState
  switch (action.type) {
    // trigger when user is changed
    case 'user/user':
      // newState = Object.assign({}, state)
      // newState.user = action.user
      // return newState
      newState = Object.assign({}, state, { user: action.user });
      return newState;
    case 'user/userProfile':
      newState = Object.assign({}, state, { userProfile: action.userProfile });
      return newState;
    case 'user/userProfilePic':
      newState = Object.assign({}, state, { userProfilePic: action.userProfilePic });
      return newState;
    case 'user/userNotificationPrefs':
      newState = Object.assign({}, state, { userNotificationPrefs: action.userNotificationPrefs });
      return newState;
  }

  return state;
}

export default UserReducer
