import * as types from 'actions/action-types';

const initialState = {
  defaultPatientsLists: [],
  isFetching: false,
};

const PatientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PATIENTS_LISTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case types.GET_PATIENTS_LISTS_SUCCESS: {
      return {
        ...state,
        defaultPatientsLists: action.defaultPatientsLists,
        isFetching: false,
      };
    }

    default:
      return state;
  }
};

export default PatientsReducer;
