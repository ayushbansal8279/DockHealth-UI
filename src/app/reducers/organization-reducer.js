import {
  GET_ORGANIZATION_FAILURE,
  GET_ORGANIZATION_SUCCESS,
  REQUEST_GET_ORGANIZATION,
  REQUEST_SELECT_SUBSCRIPTION_PLAN,
  SELECT_SUBSCRIPTION_PLAN_FAILURE,
  SELECT_SUBSCRIPTION_PLAN_SUCCESS,
} from '../actions/action-types';

const initialState = {
  organization: null,
  isFetching: false,
  requestError: null,
};

const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case REQUEST_SELECT_SUBSCRIPTION_PLAN:
    case REQUEST_GET_ORGANIZATION: {
      return {
        ...state,
        organization: null,
        isFetching: true,
        requestError: null,
      };
    }

    case GET_ORGANIZATION_SUCCESS: {
      const { payload } = action;

      return {
        ...state,
        organization: payload,
        isFetching: false,
        requestError: null,
      };
    }

    case SELECT_SUBSCRIPTION_PLAN_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        requestError: null,
        organization: null,
      };
    }

    case SELECT_SUBSCRIPTION_PLAN_FAILURE:
    case GET_ORGANIZATION_FAILURE: {
      const { error } = action;

      return {
        ...state,
        organization: null,
        isFetching: false,
        requestError: error,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
};

export default reducer;
