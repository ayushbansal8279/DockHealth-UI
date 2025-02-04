import { INITIALIZE_PROFILE_STATE } from 'actions/action-types';
const initialState = {
  currentProfileIdentifier: null,
};

const ProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_PROFILE_STATE: {
      return {
        ...state,
        currentProfileIdentifier: action.profileTypeIdentifier,
      };
    }
    default: {
      return state;
    }
  }
};

export default ProfileReducer;
