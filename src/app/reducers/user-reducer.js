import PERMISSION_MAP from 'helpers/permission-mapper';
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
        userPreference: {
          ...state.userPreference,
          ...preferences,
          appFeaturesReviewed:
            state.userPreference?.appFeaturesReviewed?.concat(
              preferences.appFeaturesReviewed,
            ),
        },
      };
    }

    case ActionTypes.GET_CURRENT_USER: {
      return {
        ...state,
        isFetchingProfile: true,
      };
    }

    case ActionTypes.GET_CURRENT_USER_SUCCESS: {
      const { user } = action;
      const { displayOptions } = user.userPreference || {};
      const mainSetup = {};
      for (const [key] of Object.entries(state.userViewSetup.mainSetup)) {
        mainSetup[key] = displayOptions?.includes(key);
      }

      const { userPreference } = user;
      delete user.userPreference;

      return {
        ...state,
        isFetchingProfile: false,
        userProfile: {
          ...state.userProfile,
          ...user,
          orgUserPermissions: PERMISSION_MAP[user.orgUserRole],
          // api is not returning picture hash if it's deleted
          profileThumbnailPictureHash: user.profileThumbnailPictureHash,
          profilePictureHash: user.profilePictureHash,
        },
        userPreference: userPreference || state.userPreference,
        userViewSetup: { ...state.userViewSetup, mainSetup },
      };
    }

    case ActionTypes.GET_CURRENT_USER_FAILURE: {
      return {
        ...state,
        isFetchingProfile: false,
      };
    }

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

    case ActionTypes.REMOVE_ORGANIZATION_FROM_ORGANIZATIONS: {
      const { orgId } = action.payload;

      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          userOrganizations: state.userProfile.userOrganizations?.filter(
            ({ organizationIdentifier }) => organizationIdentifier !== orgId,
          ),
        },
      };
    }

    default: {
      return state;
    }
  }
};

export default UserReducer;
