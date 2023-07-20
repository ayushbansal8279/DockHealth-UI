import mergeDeepRight from 'ramda/src/mergeDeepRight';
import omit from 'ramda/src/omit';
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
  SET_FETCHING_ORGANIZATION_STATUSES,
  SET_ORGANIZATION_STATUSES,
  SET_ORGANIZATION_STATUSES_ERROR,
  DELETE_ORGANIZATION_STATUS,
  ADD_ORGANIZATION_STATUS,
  UPDATE_ORGANIZATION_STATUS,
  GET_ORGANIZATION_CUSTOM_FIELDS_SUCCESS,
  GET_ORGANIZATION_CUSTOM_FIELDS_FAILURE,
  UPDATE_SUBSCRIPTION_PLAN_SUCCESS,
  UPDATE_SUBSCRIPTION_PLAN,
  UPDATE_SUBSCRIPTION_PLAN_FAILURE,
} from 'actions/action-types';

const initialState = {
  statuses: null,
  isFetchingStatuses: false,
  statusesError: false,
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
  isFetchingOrganizationUsers: false,
  organizationUsers: null,
  organizationCustomFields: [],
  organizationCustomFieldsSetup: [],
  isSavingNewPlan: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORGANIZATION_CUSTOM_FIELDS_SUCCESS: {
      const { organizationCustomFields } = action;
      return {
        ...state,
        organizationCustomFields,
      };
    }
    case GET_ORGANIZATION_CUSTOM_FIELDS_FAILURE: {
      return {
        ...state,
        organizationCustomFields: [],
      };
    }
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
        organization: action.payload,
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
        billingData: action.payload,
        isFetchingBilling: false,
        requestErrorBilling: null,
      };
    }

    case GET_BILLING_DETAILS_SUCCESS: {
      return {
        ...state,
        billingDetails: action.payload,
        isFetchingBillingDetails: false,
        requestErrorBillingDetails: null,
      };
    }

    case UPDATE_SUBSCRIPTION_PLAN: {
      return {
        ...state,
        isSavingNewPlan: true,
      };
    }

    case UPDATE_SUBSCRIPTION_PLAN_FAILURE: {
      return {
        ...state,
        isSavingNewPlan: false,
      };
    }

    case UPDATE_SUBSCRIPTION_PLAN_SUCCESS: {
      return {
        ...state,
        isSavingNewPlan: false,
        billingData: {
          ...state.billingData,
          subscriptionDetails: {
            ...state.billingData.subscriptionDetails,
            ...action.newPlan,
          },
        },
      };
    }

    case GET_INVOICE_DETAILS_SUCCESS: {
      return {
        ...state,
        invoiceDetails: action.payload,
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
        requestError: action.error,
      };
    }

    case GET_BILLING_ESTIMATE_FAILURE: {
      return {
        ...state,
        billingData: null,
        isFetchingBilling: false,
        requestErrorBilling: action.error,
      };
    }

    case GET_BILLING_DETAILS_FAILURE: {
      return {
        ...state,
        billingDetails: null,
        isFetchingBillingDetails: false,
        requestErrorBillingDetails: action.error,
      };
    }

    case GET_INVOICE_DETAILS_FAILURE: {
      return {
        ...state,
        invoiceDetails: null,
        isFetchingInvoiceDetails: false,
        requestErrorInvoiceDetails: action.error,
      };
    }

    case SET_NEW_PAYMENT_PLAN: {
      return {
        ...state,
        newPaymentPlan: action.payload,
      };
    }

    case UPDATE_ORGANIZATION: {
      return {
        ...state,
        organization: mergeDeepRight(state.organization, action.payload),
      };
    }

    case GET_REFERRAL_CONFIG_SUCCESS: {
      return {
        ...state,
        referralConfig: action.payload,
      };
    }

    case GET_REFERRAL_CONFIG_FAILURE: {
      return {
        ...state,
        referralConfig: null,
      };
    }

    case SET_FETCHING_ORGANIZATION_STATUSES: {
      return {
        ...state,
        isFetchingStatuses: true,
        statusesError: false,
      };
    }

    case SET_ORGANIZATION_STATUSES_ERROR: {
      return {
        ...state,
        isFetchingStatuses: false,
        statusesError: true,
      };
    }

    case SET_ORGANIZATION_STATUSES: {
      const { statuses } = action;

      return {
        ...state,
        statuses,
        isFetchingStatuses: false,
        statusesError: false,
      };
    }

    case DELETE_ORGANIZATION_STATUS: {
      const { identifier: identifierToDelete } = action;
      return {
        ...state,
        statuses: state.statuses?.filter(
          ({ identifier }) => identifier !== identifierToDelete,
        ),
      };
    }

    case ADD_ORGANIZATION_STATUS: {
      const { status } = action;

      return {
        ...state,
        statuses: [...(state.statuses || []), status],
      };
    }

    case UPDATE_ORGANIZATION_STATUS: {
      const { identifier, dataToUpdate } = action;

      return {
        ...state,
        statuses: state.statuses?.map((status) =>
          status.identifier === identifier
            ? { ...status, ...omit('identifier', dataToUpdate) }
            : status,
        ),
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
