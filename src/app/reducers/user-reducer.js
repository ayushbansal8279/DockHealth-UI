const initialState = {
  user: false,
  userProfile: '',
  userProfilePic: '',
  userNotificationPrefs: '',
  allSpecialties: [],
  allTitles: [],
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
    case 'user/user': {
      const { user } = action;
      return { ...state, user };
    }

    case 'user/userProfile': {
      const { userProfile } = action;
      return { ...state, userProfile: { ...userProfile, access: dummyAccess } };
    }

    case 'user/userProfilePic': {
      const { userProfilePic } = action;
      return { ...state, userProfilePic };
    }

    case 'user/userNotificationPrefs': {
      const { userNotificationPrefs } = action;
      return { ...state, userNotificationPrefs };
    }

    case 'reference/allSpecialties': {
      const { allSpecialties } = action;
      return { ...state, allSpecialties };
    }

    case 'reference/allTitles': {
      const { allTitles } = action;
      return { ...state, allTitles };
    }

    default:
      return state;
  }
};

export default UserReducer;
