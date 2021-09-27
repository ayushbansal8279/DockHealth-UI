import * as ActionTypes from '../actions/action-types';

const initialState = {
  userAuth: false,
  userProfile: {},
  userNotificationPreferences: '',
  isFetchingProfile: false,
  isFetchingNotificationPreferences: false,
};

export const dummyAccess = {
  // route related
  searchEnabled: true,
  listsEnabled: true,
  patientsEnabled: true,
  peopleEnabled: true,
  userProfileEnabled: true,

  // component related
  attachmentsEnabled: true,
  commentsEnabled: true,
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER_AUTH_DATA: {
      const { userAuth } = action;
      return { ...state, userAuth };
    }
    case ActionTypes.GET_USER_PROFILE: {
      return { ...state, isFetchingProfile: true };
    }
    case ActionTypes.GET_USER_PROFILE_SUCCESS: {
      const { userProfile } = action;
      return {
        ...state,
        userProfile: { ...userProfile, access: dummyAccess },
        isFetchingProfile: false,
      };
    }
    case ActionTypes.GET_USER_PROFILE_FAILURE: {
      return { ...state, isFetchingProfile: false };
    }

    case ActionTypes.GET_USER_NOTIFICATION_PREFERENCES: {
      return { ...state, isFetchingNotificationPreferences: true };
    }
    case ActionTypes.GET_USER_NOTIFICATION_PREFERENCES_SUCCESS: {
      const { userNotificationPreferences } = action;
      return {
        ...state,
        userNotificationPreferences,
        isFetchingNotificationPreferences: false,
      };
    }
    case ActionTypes.GET_USER_NOTIFICATION_PREFERENCES_FAILURE: {
      return { ...state, isFetchingNotificationPreferences: false };
    }

    default:
      return state;
  }
};

export default UserReducer;
