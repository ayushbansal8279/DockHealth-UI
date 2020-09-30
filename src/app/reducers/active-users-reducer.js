/* eslint-disable sonarjs/no-small-switch */
const initialState = {
  activeUsersList: [],
  idleUsersList: [],
};

const ActiveUsers = (state = initialState, action) => {
  switch (action.type) {
    case 'active-users/setActiveUsers': {
      const { activeUsers } = action;
      return { activeUsersList: activeUsers };
    }

    case 'active-users/addActiveUser': {
      const { user } = action;
      return {
        activeUsersList: [...state.activeUsersList, user],
        idleUsersList: [
          ...(state.idleUsersList && state.idleUsersList.length > 0
            ? state.idleUsersList.filter(
                ({ userIdentifier }) => userIdentifier !== user.userIdentifier,
              )
            : []),
        ],
      };
    }

    case 'active-users/addIdleUser': {
      const { user } = action;
      return {
        activeUsersList: [
          ...state.activeUsersList.filter(
            ({ userIdentifier }) => userIdentifier !== user.userIdentifier,
          ),
        ],
        idleUsersList: [...state.idleUsersList, user],
      };
    }

    case 'active-users/removeUser': {
      const { user } = action;
      return {
        activeUsersList: [
          ...(state.activeUsersList && state.activeUsersList.length > 0
            ? state.activeUsersList.filter(
                ({ userIdentifier }) => userIdentifier !== user.userIdentifier,
              )
            : []),
        ],
        idleUsersList: [
          ...(state.idleUsersList && state.idleUsersList.length > 0
            ? state.idleUsersList.filter(
                ({ userIdentifier }) => userIdentifier !== user.userIdentifier,
              )
            : []),
        ],
      };
    }
    default:
      return state;
  }
};

export default ActiveUsers;
