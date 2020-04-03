import { mergeDeepRight } from 'ramda';
import {
  GET_BILLING_DETAILS_FAILURE,
  GET_BILLING_DETAILS_SUCCESS,
  GET_BILLING_ESTIMATE_FAILURE,
  GET_BILLING_ESTIMATE_SUCCESS,
  GET_INVOICE_DETAILS_FAILURE,
  GET_INVOICE_DETAILS_SUCCESS,
  GET_ORGANIZATION_FAILURE,
  GET_ORGANIZATION_SUCCESS,
  GET_REFERRAL_CONFIG_FAILURE,
  GET_REFERRAL_CONFIG_SUCCESS,
  REQUEST_GET_BILLING_DETAILS,
  REQUEST_GET_BILLING_ESTIMATE,
  REQUEST_GET_INVOICE_DETAILS,
  REQUEST_GET_ORGANIZATION,
  REQUEST_SAVE_BILLING_DETAILS,
  SAVE_BILLING_DETAILS_FAILURE,
  SAVE_BILLING_DETAILS_SUCCESS,
  SET_NEW_PAYMENT_PLAN,
  UPDATE_ORGANIZATION,
  SELECT_USERS_FOR_PLAN,
} from '../actions/action-types';

const initialState = {
  organization: null,
  billingData: null,
  billingDetails: null,
  invoiceDetails: null,
  isFetching: false,
  isFetchingBilling: false,
  isFetchingBillingDetails: false,
  isFetchingInvoiceDetails: false,
  requestError: null,
  requestErrorBilling: null,
  requestErrorBillingDetails: null,
  requestErrorInvoiceDetails: null,
  newPaymentPlan: null,
  currentUsers: null,
};

const reducer = (state = initialState, { type, payload, error }) => {
  switch (type) {
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

    case REQUEST_GET_INVOICE_DETAILS: {
      return {
        ...state,
        isFetchingInvoiceDetails: true,
        requestErrorInvoiceDetails: null,
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

    case GET_INVOICE_DETAILS_SUCCESS: {
      return {
        ...state,
        invoiceDetails: payload,
        isFetchingInvoiceDetails: false,
        requestErrorInvoiceDetails: null,
      };
    }

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

    case GET_INVOICE_DETAILS_FAILURE: {
      return {
        ...state,
        invoiceDetails: null,
        isFetchingInvoiceDetails: false,
        requestErrorInvoiceDetails: error,
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

    case SELECT_USERS_FOR_PLAN: {
      return {
        ...state,
        currentUsers: payload,
      };
    }

    case GET_REFERRAL_CONFIG_SUCCESS: {
      return {
        ...state,
        referralConfig: payload,
      };
    }

    case GET_REFERRAL_CONFIG_FAILURE: {
      return {
        ...state,
        referralConfig: null,
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
