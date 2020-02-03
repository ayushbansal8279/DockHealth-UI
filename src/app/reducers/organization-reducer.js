import { mergeDeepRight } from 'ramda';
import {
  GET_BILLING_DETAILS_FAILURE,
  GET_BILLING_DETAILS_SUCCESS,
  GET_BILLING_ESTIMATE_FAILURE,
  GET_BILLING_ESTIMATE_SUCCESS,
  GET_ORGANIZATION_FAILURE,
  GET_ORGANIZATION_SUCCESS,
  REQUEST_GET_BILLING_DETAILS,
  REQUEST_GET_BILLING_ESTIMATE,
  REQUEST_GET_ORGANIZATION,
  REQUEST_SAVE_BILLING_DETAILS,
  REQUEST_SELECT_SUBSCRIPTION_PLAN,
  SAVE_BILLING_DETAILS_FAILURE,
  SAVE_BILLING_DETAILS_SUCCESS,
  SELECT_SUBSCRIPTION_PLAN_FAILURE,
  SELECT_SUBSCRIPTION_PLAN_SUCCESS,
  SET_NEW_PAYMENT_PLAN,
  UPDATE_ORGANIZATION,
} from '../actions/action-types';

const initialState = {
  organization: null,
  billingData: null,
  billingDetails: null,
  isFetching: false,
  isFetchingBilling: false,
  isFetchingBillingDetails: false,
  requestError: null,
  requestErrorBilling: null,
  requestErrorBillingDetais: null,
  newPaymentPlan: null,
};

const reducer = (state = initialState, { type, payload, error }) => {
  switch (type) {
    case REQUEST_SELECT_SUBSCRIPTION_PLAN:
    case REQUEST_SAVE_BILLING_DETAILS:
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

    case REQUEST_GET_BILLING_DETAILS: {
      return {
        ...state,
        isFetchingBillingDetails: true,
        requestErrorBillingDetails: null,
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

    case SELECT_SUBSCRIPTION_PLAN_SUCCESS:
    case SAVE_BILLING_DETAILS_SUCCESS: {
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

    case GET_BILLING_DETAILS_SUCCESS: {
      return {
        ...state,
        billingDetails: payload,
        isFetchingBillingDetails: false,
        requestErrorBillingDetails: null,
      };
    }

    case SELECT_SUBSCRIPTION_PLAN_FAILURE:
    case SAVE_BILLING_DETAILS_FAILURE:
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

    case GET_BILLING_DETAILS_FAILURE: {
      return {
        ...state,
        billingDetails: null,
        isFetchingBillingDetails: false,
        requestErrorBillingDetails: error,
      };
    }

    case SET_NEW_PAYMENT_PLAN: {
      return {
        ...state,
        newPaymentPlan: payload,
      };
    }

    case UPDATE_ORGANIZATION: {
      return {
        ...state,
        organization: mergeDeepRight(state.organization, payload),
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
