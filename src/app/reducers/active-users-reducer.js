/* eslint-disable sonarjs/no-small-switch */
const initialState = {
  activeUsersList: [],
};

const ActiveUsers = (state = initialState, action) => {
  switch (action.type) {
    case 'active-users/setActiveUsers': {
      const { activeUsers } = action;
      return { activeUsersList: activeUsers };
    }

    case 'active-users/addActiveUser': {
      const { user } = action;
      return { activeUsersList: [...state.activeUsersList, user] };
    }

    case 'active-users/removeActiveUser': {
      const { user } = action;
      return {
        activeUsersList: [
          ...state.activeUsersList.filter(
            ({ userIdentifier }) => userIdentifier !== user.userIdentifier,
          ),
        ],
      };
    }
    default:
      return state;
  }
};

export default ActiveUsers;
