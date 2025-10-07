import * as ActionTypes from '../actions/action-types';

const initialState = {
  status: 'INCOMPLETE',
  selectedFilters: null,
  selectedQuickfilter: null,
};

const UserPreferenceReducer = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.GET_USER_PREFERENCES_SUCCESS: {
      const { preferences } = action;
      const { details } = preferences;
      return {
        ...details,
      };
    }

    case ActionTypes.UPDATE_TASK_LIST_STATUS: {
      const { status } = action;
      return {
        ...state,
        status,
      };
    }

    case ActionTypes.UPDATE_USER_PREFERENCES_SUCCESS: {
      const { preferences } = action;
      const { details } = preferences;
      
      return {
        ...details,
      };
    }

    default: {
      return state;
    }
  }
};

export default UserPreferenceReducer;
