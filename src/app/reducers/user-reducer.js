import * as ActionTypes from '../actions/action-types';

const defaultViewSetup = {
  SHOW_WORKFLOW_DETAILS: true,
  SHOW_WORKFLOW_COMPLETED_TASKS: false,
};

const initialState = {
  userViewSetup: {
    customLists: {},
    mainSetup: { ...defaultViewSetup },
    defaultViewSetup,
  },
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
    // user view setup
    case ActionTypes.UPDATE_LIST_VIEW_SETUP: {
      const { listIdentifier, setup } = action.payload;
      return {
        ...state,
        userViewSetup: {
          ...state.userViewSetup,
          customLists: {
            ...state.userViewSetup.customLists,
            [listIdentifier]: {
              ...defaultViewSetup,
              ...(state.userViewSetup.customLists[listIdentifier] || {}),
              ...setup,
            },
          },
        },
      };
    }
    case ActionTypes.UPDATE_USER_VIEW_SETUP: {
      const { setup } = action.payload;
      return {
        ...state,
        userViewSetup: {
          ...state.userViewSetup,
          mainSetup: {
            ...defaultViewSetup,
            ...state.userViewSetup.mainSetup,
            ...setup,
          },
        },
      };
    }
    case ActionTypes.GET_USER_AUTH_DATA_SUCCESS: {
      const { userAuth } = action;
      return { ...state, userAuth };
    }

    case ActionTypes.INITIALIZE_CURRENT_USER_REQUEST: {
      return { ...state, isFetchingProfile: true };
    }

    case ActionTypes.GET_CURRENT_USER_NOTIFICATION_PREFERENCES: {
      return { ...state, isFetchingNotificationPreferences: true };
    }

    case ActionTypes.GET_CURRENT_USER_NOTIFICATION_PREFERENCES_SUCCESS: {
      const { userNotificationPreferences } = action;
      return {
        ...state,
        userNotificationPreferences,
        isFetchingNotificationPreferences: false,
      };
    }

    case ActionTypes.GET_CURRENT_USER_NOTIFICATION_PREFERENCES_FAILURE: {
      return { ...state, isFetchingNotificationPreferences: false };
    }

    case ActionTypes.UPDATE_CURRENT_USER_PREFERENCES: {
      const { preferences } = action;
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          userPreference: {
            ...state.userProfile?.userPreference,
            ...preferences,
            appFeaturesReviewed: state.userProfile?.userPreference?.appFeaturesReviewed.concat(
              preferences.appFeaturesReviewed,
            ),
          },
        },
      };
    }

    case ActionTypes.GET_CURRENT_USER:
      return {
        ...state,
        isFetchingProfile: true,
      };

    case ActionTypes.GET_CURRENT_USER_SUCCESS: {
      const { user } = action;
      const { displayOptions } = user.userPreference || {};
      const mainSetup = {};
      Object.entries(state.userViewSetup.mainSetup).forEach(([key]) => {
        mainSetup[key] = displayOptions?.includes(key);
      });

      return {
        ...state,
        isFetchingProfile: false,
        userProfile: {
          ...state.userProfile,
          ...user,
          // api is not returning picture hash if it's deleted
          profileThumbnailPictureHash: user.profileThumbnailPictureHash,
          profilePictureHash: user.profilePictureHash,
        },
        userViewSetup: { ...state.userViewSetup, mainSetup },
      };
    }

    case ActionTypes.GET_CURRENT_USER_FAILURE:
      return {
        ...state,
        isFetchingProfile: false,
      };

    case ActionTypes.GET_CURRENT_USER_ORGANIZATIONS_SUCCESS: {
      const { organizations } = action;

      return {
        ...state,
        isFetchingProfile: false,
        userProfile: {
          ...state.userProfile,
          userOrganizations: organizations,
        },
      };
    }

    default:
      return state;
  }
};

export default UserReducer;
