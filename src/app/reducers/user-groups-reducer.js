/* eslint-disable sonarjs/cognitive-complexity */
import * as ActionTypes from 'actions/action-types';

const initialState = {
  groups: null,
  isFetchingGroups: false,
  groupsDetails: {},
  currentGroup: null,
  isCreatingGroup: false,
  creatingError: false,
  error: false,
};

const UserGroupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_USER_GROUPS: {
      return {
        ...state,
        isFetchingGroups: true,
        error: false,
      };
    }

    case ActionTypes.GET_USER_GROUPS_SUCCESS: {
      return {
        ...state,
        groups: action.groups,
        isFetchingGroups: false,
      };
    }

    case ActionTypes.GET_USER_GROUPS_FAILURE: {
      return {
        ...state,
        isFetchingGroups: false,
        error: true,
      };
    }

    case ActionTypes.SET_CURRENT_USER_GROUP: {
      const { groupIdentifier } = action;
      return {
        ...state,
        currentGroup: groupIdentifier,
      };
    }

    case ActionTypes.UNSET_CURRENT_USER_GROUP: {
      return {
        ...state,
        currentGroup: null,
      };
    }

    case ActionTypes.GET_USER_GROUP_DETAILS: {
      const { groupIdentifier } = action;

      return {
        ...state,
        groupsDetails: {
          ...state.groupsDetails,
          [groupIdentifier]: {
            ...state.groupsDetails[groupIdentifier],
            isFetching: true,
            error: false,
          },
        },
      };
    }

    case ActionTypes.GET_USER_GROUP_DETAILS_SUCCESS: {
      const { groupIdentifier, userGroupDetails } = action;

      return {
        ...state,
        groupsDetails: {
          ...state.groupsDetails,
          [groupIdentifier]: {
            ...userGroupDetails,
            isFetching: false,
            error: false,
          },
        },
      };
    }

    case ActionTypes.GET_USER_GROUP_DETAILS_FAILURE: {
      const { groupIdentifier } = action;

      return {
        ...state,
        groupsDetails: {
          ...state.groupsDetails,
          [groupIdentifier]: {
            isFetching: false,
            error: true,
          },
        },
      };
    }

    case ActionTypes.CREATE_USER_GROUP: {
      return {
        ...state,
        isCreatingGroup: true,
        creatingError: false,
      };
    }

    case ActionTypes.CREATE_USER_GROUP_SUCCESS: {
      const { userGroup } = action;
      return {
        ...state,
        groups: [userGroup, ...(state.groups ?? [])],
        isCreatingGroup: false,
        creatingError: false,
      };
    }

    case ActionTypes.CREATE_USER_GROUP_FAILURE: {
      return {
        ...state,
        isCreatingGroup: false,
        creatingError: true,
      };
    }

    case ActionTypes.UPDATE_USERS_IN_GROUP:
    case ActionTypes.UPDATE_USER_GROUP: {
      const { userGroupIdentifier } = action;

      return {
        ...state,
        groupsDetails: {
          ...state.groupsDetails,
          [userGroupIdentifier]: {
            ...state.groupsDetails?.[userGroupIdentifier],
            isSaving: true,
            error: false,
          },
        },
      };
    }

    case ActionTypes.UPDATE_USER_GROUP_SUCCESS: {
      const { userGroupIdentifier, userGroupData } = action;

      return {
        ...state,
        groups: state.groups.map((g) =>
          g.identifier === userGroupIdentifier ? { ...g, ...userGroupData } : g,
        ),
        groupsDetails: {
          ...state.groupsDetails,
          [userGroupIdentifier]: {
            ...state.groupsDetails?.[userGroupIdentifier],
            ...userGroupData,
            isSaving: false,
            error: false,
          },
        },
      };
    }

    case ActionTypes.UPDATE_USERS_IN_GROUP_FAILURE:
    case ActionTypes.UPDATE_USER_GROUP_FAILURE: {
      const { userGroupIdentifier } = action;

      return {
        ...state,
        groupsDetails: {
          ...state.groupsDetails,
          [userGroupIdentifier]: {
            ...state.groupsDetails?.[userGroupIdentifier],
            isSaving: false,
            error: true,
          },
        },
      };
    }

    case ActionTypes.UPDATE_USERS_IN_GROUP_SUCCESS: {
      const { userGroupIdentifier, users } = action;
      const usersCount = users?.length ?? 0;

      return {
        ...state,
        groups: state.groups.map((g) =>
          g.identifier === userGroupIdentifier ? { ...g, usersCount } : g,
        ),
        groupsDetails: {
          ...state.groupsDetails,
          [userGroupIdentifier]: {
            ...state.groupsDetails?.[userGroupIdentifier],
            users,
            usersCount,
            isSaving: false,
            error: false,
          },
        },
      };
    }

    case ActionTypes.DELETE_USER_GROUP: {
      const { userGroupIdentifier } = action;

      return {
        ...state,
        groups: state.groups.filter(
          ({ identifier }) => identifier !== userGroupIdentifier,
        ),
        error: false,
      };
    }

    case ActionTypes.DELETE_USER_GROUP_FAILURE: {
      return {
        ...state,
        error: true,
      };
    }

    default: {
      return state;
    }
  }
};

export default UserGroupsReducer;
