import {
  CLEAR_PATIENT,
  FETCH_PATIENT,
  FETCH_PATIENT_ERROR,
  FETCH_PATIENT_SUCCESS,
} from 'actions/action-types';

const initialState = {
  details: {},
  isLoading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  const { type, ...payload } = action;
  switch (type) {
    case CLEAR_PATIENT: {
      return initialState;
    }

    case FETCH_PATIENT: {
      return { ...state, isLoading: true, error: null };
    }

    case FETCH_PATIENT_ERROR: {
      const { error } = payload;
      return { ...state, isLoading: false, error };
    }

    case FETCH_PATIENT_SUCCESS: {
      const { details } = payload;
      return {
        ...state,
        isLoading: false,
        error: null,
        details,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
