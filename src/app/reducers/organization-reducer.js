import {
  GET_ORGANIZATION_FAILURE,
  GET_ORGANIZATION_SUCCESS,
  REQUEST_GET_ORGANIZATION,
  REQUEST_SELECT_SUBSCRIPTION_PLAN,
  SELECT_SUBSCRIPTION_PLAN_FAILURE,
  SELECT_SUBSCRIPTION_PLAN_SUCCESS,
  GET_BILLING_ESTIMATE_FAILURE,
  REQUEST_GET_BILLING_ESTIMATE,
  GET_BILLING_ESTIMATE_SUCCESS,
} from '../actions/action-types';

const initialState = {
  organization: null,
  billingData: null,
  isFetching: false,
  isFetchingBilling: false,
  requestError: null,
  requestErrorBilling: null,
};

const reducer = (state = initialState, { type, payload, error }) => {
  switch (type) {
    case REQUEST_SELECT_SUBSCRIPTION_PLAN:
    case REQUEST_GET_ORGANIZATION: {
      return {
        ...state,
        isFetching: true,
        requestError: null,
      };
    }

    case REQUEST_GET_BILLING_ESTIMATE: {
      return {
        ...state,
        isFetchingBilling: true,
        requestErrorBilling: null,
      };
    }

    case GET_ORGANIZATION_SUCCESS: {
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
      };
    }

    case GET_BILLING_ESTIMATE_SUCCESS: {
      return {
        ...state,
        billingData: payload,
        isFetchingBilling: false,
        requestErrorBilling: null,
      };
    }

    case SELECT_SUBSCRIPTION_PLAN_FAILURE:
    case GET_ORGANIZATION_FAILURE: {
      return {
        ...state,
        organization: null,
        isFetching: false,
        requestError: error,
      };
    }

    case GET_BILLING_ESTIMATE_FAILURE: {
      return {
        ...state,
        billingData: null,
        isFetchingBilling: false,
        requestErrorBilling: error,
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
