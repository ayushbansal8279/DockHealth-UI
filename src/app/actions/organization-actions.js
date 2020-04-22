import * as OrganizationApi from 'api/organization-api';
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
  SELECT_USERS_FOR_PLAN,
  SET_NEW_PAYMENT_PLAN,
  UPDATE_ORGANIZATION,
} from './action-types';

const handleOrganizationResponse = ({ fetchMethod, dispatch }) =>
  fetchMethod()
    .then(data => {
      dispatch({
        type: GET_ORGANIZATION_SUCCESS,
        payload: data,
      });
      return data;
    })
    .catch(error => {
      dispatch({
        type: GET_ORGANIZATION_FAILURE,
        error,
      });
      throw error;
    });

export const getOrganizationById = ({ organizationIdentifier }) => dispatch => {
  if (!organizationIdentifier) {
    return Promise.reject(new Error('No organization identifier provided'));
  }

  dispatch({
    type: REQUEST_GET_ORGANIZATION,
  });

  return handleOrganizationResponse({
    fetchMethod: () => OrganizationApi.get({ organizationIdentifier }),
    dispatch,
  });
};

export const saveBillingDetails = (billingData, cardToken) => dispatch => {
  dispatch({
    type: REQUEST_SAVE_BILLING_DETAILS,
  });

  return OrganizationApi.saveBillingDetails({ billingData, cardToken })
    .then(data => {
      dispatch({
        type: SAVE_BILLING_DETAILS_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: SAVE_BILLING_DETAILS_FAILURE,
        error,
      });
    });
};

export const getBillingEstimate = ({
  subscriptionPlan,
  billingFrequency,
} = {}) => dispatch => {
  dispatch({
    type: REQUEST_GET_BILLING_ESTIMATE,
  });

  return OrganizationApi.getBillingEstimate({
    subscriptionPlan,
    billingFrequency,
  })
    .then(data => {
      dispatch({
        type: GET_BILLING_ESTIMATE_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: GET_BILLING_ESTIMATE_FAILURE,
        error,
      });
    });
};

// eslint-disable-next-line unicorn/consistent-function-scoping
export const getBillingDetails = () => dispatch => {
  dispatch({
    type: REQUEST_GET_BILLING_DETAILS,
  });

  return OrganizationApi.getBillingDetails()
    .then(data => {
      dispatch({
        type: GET_BILLING_DETAILS_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: GET_BILLING_DETAILS_FAILURE,
        error,
      });
    });
};

export const getInvoiceDetails = ({ organizationIdentifier }) => dispatch => {
  dispatch({
    type: REQUEST_GET_INVOICE_DETAILS,
  });

  OrganizationApi.getInvoiceDetails({ organizationIdentifier })
    .then(data => {
      dispatch({
        type: GET_INVOICE_DETAILS_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      dispatch({
        type: GET_INVOICE_DETAILS_FAILURE,
        error,
      });
    });
};

export const setPaymentNewPlan = ({ newPlan }) => dispatch => {
  dispatch({
    type: SET_NEW_PAYMENT_PLAN,
    payload: newPlan,
  });
};

export const updateOrganizationName = ({ organizationName }) => dispatch =>
  OrganizationApi.updateOrganizationName({ organizationName }).then(() => {
    dispatch({
      type: UPDATE_ORGANIZATION,
      payload: {
        organizationName,
      },
    });
  });

export const selectUsersForPlan = ({ users }) => dispatch =>
  dispatch({
    type: SELECT_USERS_FOR_PLAN,
    payload: users,
  });

// eslint-disable-next-line unicorn/consistent-function-scoping
export const checkBAASignedStatus = () => dispatch => {
  dispatch({
    type: REQUEST_GET_ORGANIZATION,
  });

  return handleOrganizationResponse({
    fetchMethod: () => OrganizationApi.checkBAASignedStatus(),
    dispatch,
  });
};

export const getConfigurationForReferral = ({ referralCode }) => dispatch => {
  if (!referralCode) {
    // return Promise.reject(new Error('No referral code'));
    return Promise.resolve('No referral code');
  }

  return OrganizationApi.getConfigurationForReferral(referralCode)
    .then(data => {
      dispatch({
        type: GET_REFERRAL_CONFIG_SUCCESS,
        payload: data,
      });
      return data;
    })
    .catch(error => {
      dispatch({
        type: GET_REFERRAL_CONFIG_FAILURE,
        error,
      });
      throw error;
    });
};
