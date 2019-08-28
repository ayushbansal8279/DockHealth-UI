const initialState = {
  user: false,
  userProfile: '',
  userProfilePic: '',
  userNotificationPrefs: '',
  allSpecialties: [],
  allTitles: [],
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    // trigger when user is changed
    case 'user/user': {
      const { user } = action;
      return ({ ...state, user });
    }

    case 'user/userProfile': {
      const { userProfile } = action;
      return ({ ...state, userProfile });
    }

    case 'user/userProfilePic': {
      const { userProfilePic } = action;
      return ({ ...state, userProfilePic });
    }

    case 'user/userNotificationPrefs': {
      const { userNotificationPrefs } = action;
      return ({ ...state, userNotificationPrefs });
    }

    case 'reference/allSpecialties': {
      const { allSpecialties } = action;
      return ({ ...state, allSpecialties });
    }

    case 'reference/allTitles': {
      const { allTitles } = action;
      return ({ ...state, allTitles });
    }

    default:
      return state;
  }
};

export default UserReducer;
